import { useState } from 'react'
import {
  requestNotificationPermission,
  notificationSupported,
  notificationGranted,
} from '../utils/notifications.js'
import { saveSettings } from '../utils/storage.js'

export default function SettingsView({ skills, settings, onSkillsChange, onSettingsChange }) {
  const [notifStatus, setNotifStatus] = useState(
    notificationGranted() ? 'granted' : notificationSupported() ? 'supported' : 'unsupported'
  )

  async function handleEnableNotifications() {
    const granted = await requestNotificationPermission()
    setNotifStatus(granted ? 'granted' : 'denied')
    const updated = { ...settings, notificationsEnabled: granted }
    onSettingsChange(updated)
    saveSettings(updated)
  }

  function handleToggleNotifications(enabled) {
    const updated = { ...settings, notificationsEnabled: enabled }
    onSettingsChange(updated)
    saveSettings(updated)
  }

  function handleWeekStart(monday) {
    const updated = { ...settings, weekStartsMonday: monday }
    onSettingsChange(updated)
    saveSettings(updated)
  }

  function updateSkillReminder(skillId, time) {
    const updated = skills.map(s => s.id === skillId ? { ...s, reminderTime: time } : s)
    onSkillsChange(updated)
  }

  const notifEnabled = settings.notificationsEnabled && notifStatus === 'granted'

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-12 pb-4 safe-top">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto scroll-area px-5 pb-8 space-y-5">

        {/* Notifications section */}
        <Section title="Notifications">
          {notifStatus === 'unsupported' ? (
            <p className="text-sm text-slate-400 px-4 pb-3">
              Notifications aren't supported in this browser. Try adding the app to your home screen first.
            </p>
          ) : notifStatus === 'denied' ? (
            <p className="text-sm text-slate-400 px-4 pb-3">
              Notification permission was denied. Please enable it in your browser or phone settings, then reload the app.
            </p>
          ) : notifStatus === 'granted' ? (
            <SettingRow
              label="Daily reminders"
              description="Remind me at each skill's scheduled time"
            >
              <Toggle value={notifEnabled} onChange={handleToggleNotifications} />
            </SettingRow>
          ) : (
            <div className="px-4 pb-3">
              <button
                onClick={handleEnableNotifications}
                className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                Enable Notifications
              </button>
              <p className="text-xs text-slate-500 mt-2 text-center">
                You'll be asked for permission — tap Allow
              </p>
            </div>
          )}
        </Section>

        {/* Week start */}
        <Section title="Week">
          <SettingRow label="Week starts on" description="Affects weekly targets and streaks">
            <div className="flex bg-slate-900 rounded-lg overflow-hidden text-xs font-medium">
              <button
                onClick={() => handleWeekStart(true)}
                className={`px-3 py-1.5 transition-colors ${settings.weekStartsMonday ? 'bg-violet-600 text-white' : 'text-slate-400'}`}
              >
                Mon
              </button>
              <button
                onClick={() => handleWeekStart(false)}
                className={`px-3 py-1.5 transition-colors ${!settings.weekStartsMonday ? 'bg-violet-600 text-white' : 'text-slate-400'}`}
              >
                Sun
              </button>
            </div>
          </SettingRow>
        </Section>

        {/* Reminder times */}
        {notifEnabled && (
          <Section title="Reminder times">
            {skills.filter(s => s.active).map(skill => (
              <SettingRow key={skill.id} label={`${skill.icon} ${skill.name}`}>
                <input
                  type="time"
                  value={skill.reminderTime || '08:00'}
                  onChange={e => updateSkillReminder(skill.id, e.target.value)}
                  className="bg-slate-900 text-white rounded-lg px-3 py-1.5 text-sm border border-slate-700 focus:border-violet-500 focus:outline-none"
                />
              </SettingRow>
            ))}
          </Section>
        )}

        {/* Install prompt */}
        <Section title="Install App">
          <div className="px-4 pb-3 space-y-2">
            <p className="text-sm text-slate-300 font-medium">Add to home screen for the best experience</p>
            <div className="text-sm text-slate-400 space-y-1.5">
              <p><span className="text-slate-300">iOS Safari:</span> Tap Share → "Add to Home Screen"</p>
              <p><span className="text-slate-300">Android Chrome:</span> Tap ⋮ menu → "Add to Home Screen"</p>
              <p><span className="text-slate-300">Desktop:</span> Click the install icon in the address bar</p>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Once installed, the app works offline and notifications fire in the background.
            </p>
          </div>
        </Section>

        {/* About */}
        <Section title="About">
          <div className="px-4 pb-3 text-sm text-slate-400 space-y-1">
            <p>Practice Tracker v1.0</p>
            <p>All data stored locally on your device.</p>
          </div>
        </Section>

      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 pt-3.5 pb-1">{title}</p>
      {children}
    </div>
  )
}

function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-slate-700/50">
      <div className="min-w-0">
        <p className="text-sm text-white font-medium truncate">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
}

function Toggle({ value, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${value ? 'bg-violet-600' : 'bg-slate-600'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-6' : 'translate-x-0'}`}
      />
    </button>
  )
}
