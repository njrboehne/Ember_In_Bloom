import { useState, useEffect, useRef } from 'react'
import { getSkills, getSessions, saveSkills, getSettings } from './utils/storage.js'
import { scheduleReminders, clearReminders } from './utils/notifications.js'
import TodayView from './components/TodayView.jsx'
import SkillsView from './components/SkillsView.jsx'
import HistoryView from './components/HistoryView.jsx'
import SettingsView from './components/SettingsView.jsx'
import NavBar from './components/NavBar.jsx'

export default function App() {
  const [tab, setTab] = useState('today')
  const [skills, setSkills] = useState(() => getSkills())
  const [sessions, setSessions] = useState(() => getSessions())
  const [settings, setSettings] = useState(() => getSettings())
  const timerRefs = useRef([])

  useEffect(() => {
    if (settings.notificationsEnabled) {
      clearReminders(timerRefs.current)
      timerRefs.current = scheduleReminders(skills, sessions)
    }
    return () => clearReminders(timerRefs.current)
  }, [skills, sessions, settings.notificationsEnabled])

  function handleSkillsChange(updated) {
    setSkills(updated)
    saveSkills(updated)
  }

  function handleSessionsChange(updated) {
    setSessions(updated)
  }

  function handleSettingsChange(updated) {
    setSettings(updated)
  }

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <main className="flex-1 overflow-hidden">
        {tab === 'today' && (
          <TodayView
            skills={skills}
            sessions={sessions}
            settings={settings}
            onSessionsChange={handleSessionsChange}
          />
        )}
        {tab === 'skills' && (
          <SkillsView
            skills={skills}
            sessions={sessions}
            settings={settings}
            onSkillsChange={handleSkillsChange}
            onSessionsChange={handleSessionsChange}
          />
        )}
        {tab === 'history' && (
          <HistoryView
            skills={skills}
            sessions={sessions}
            settings={settings}
            onSessionsChange={handleSessionsChange}
          />
        )}
        {tab === 'settings' && (
          <SettingsView
            skills={skills}
            settings={settings}
            onSkillsChange={handleSkillsChange}
            onSettingsChange={handleSettingsChange}
          />
        )}
      </main>
      <NavBar active={tab} onChange={setTab} />
    </div>
  )
}
