import { useState } from 'react'
import {
  requestNotificationPermission,
  notificationSupported,
  notificationGranted,
} from '../utils/notifications.js'
import { saveSettings, saveSkills } from '../utils/storage.js'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

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

  function updateSkill(skillId, patch) {
    const updated = skills.map(s => s.id === skillId ? { ...s, ...patch } : s)
    onSkillsChange(updated)
    saveSkills(updated)
  }

  function toggleReminderDay(skillId, dow) {
    const skill = skills.find(s => s.id === skillId)
    const days = skill.reminderDays ?? [0, 1, 2, 3, 4, 5, 6]
    const updated = days.includes(dow)
      ? days.filter(d => d !== dow)
      : [...days, dow].sort()
    updateSkill(skillId, { reminderDays: updated })
  }

  const notifEnabled = settings.notificationsEnabled && notifStatus === 'granted'
  const activeSkills = skills.filter(s => s.active)

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-12 pb-4 safe-top">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto scroll-area px-5 pb-8 space-y-5">

        {/* Notifications master toggle */}
        <Section title="Notifications">
          {notifStatus === 'unsupported' && (
            <p className="text-sm text-slate-400 px-4 pb-3">
              Notifications aren't supported in this browser. Try adding the app to your home screen first.
            </p>
          )}
          {notifStatus === 'denied' && (
            <p className="text-sm text-slate-400 px-4 pb-3">
              Permission was denied. Enable notifications for this site in your device settings, then reload.
            </p>
          )}
          {notifStatus === 'granted' && (
            <SettingRow label="Reminders on" description="Fire notifications at each skill's scheduled time">
              <Toggle value={notifEnabled} onChange={handleToggleNotifications} />
            </SettingRow>
          )}
          {notifStatus === 'supported' && (
            <div className="px-4 pb-3">
              <button
                onClick={handleEnableNotifications}
                className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                Enable Notifications
              </button>
              <p className="text-xs text-slate-500 mt-2 text-center">Tap Allow when prompted</p>
            </div>
          )}
        </Section>

        {/* Per-skill reminders — always visible */}
        <Section title="Reminders per skill">
          {!notifEnabled && (
            <p className="text-xs text-slate-500 px-4 pt-1 pb-2">
              Enable notifications above to activate these reminders.
            </p>
          )}
          {activeSkills.map((skill, i) => {
            const days = skill.reminderDays ?? [0, 1, 2, 3, 4, 5, 6]
            const enabled = skill.reminderEnabled !== false
            return (
              <div
                key={skill.id}
                className={`px-4 py-3 border-t border-slate-700/50 ${!notifEnabled ? 'opacity-50' : ''}`}
              >
                {/* Skill label + master toggle */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{skill.icon} {skill.name}</span>
                  <Toggle
                    value={enabled}
                    onChange={val => updateSkill(skill.id, { reminderEnabled: val })}
                    disabled={!notifEnabled}
                  />
                </div>

                {enabled && (
                  <div className="space-y-2.5">
                    {/* Time picker */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Time</span>
                      <input
                        type="time"
                        value={skill.reminderTime || '08:00'}
                        onChange={e => updateSkill(skill.id, { reminderTime: e.target.value })}
                        disabled={!notifEnabled}
                        className="bg-slate-900 text-white rounded-lg px-3 py-1.5 text-sm border border-slate-700 focus:border-violet-500 focus:outline-none disabled:opacity-40"
                      />
                    </div>

                    {/* Day-of-week picker */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Days</span>
                      <div className="flex gap-1">
                        {DAYS.map((label, dow) => {
                          const active = days.includes(dow)
                          return (
                            <button
                              key={dow}
                              onClick={() => !(!notifEnabled) && toggleReminderDay(skill.id, dow)}
                              disabled={!notifEnabled}
                              className={`w-8 h-8 rounded-full text-[11px] font-semibold transition-colors disabled:opacity-40 ${
                                active
                                  ? 'bg-violet-600 text-white'
                                  : 'bg-slate-700 text-slate-400'
                              }`}
                            >
                              {label[0]}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
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

        {/* Install prompt */}
        <Section title="Install App">
          <div className="px-4 pb-3 space-y-2">
            <p className="text-sm text-slate-300 font-medium">Add to home screen for the best experience</p>
            <div className="text-sm text-slate-400 space-y-1.5">
              <p><span className="text-slate-300">iOS Safari:</span> Tap Share → "Add to Home Screen"</p>
              <p><span className="text-slate-300">Android Chrome:</span> Tap ⋮ → "Add to Home Screen"</p>
              <p><span className="text-slate-300">Desktop:</span> Click the install icon in the address bar</p>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Once installed, the app works offline and notifications fire in the background.
            </p>
          </div>
        </Section>

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

function Toggle({ value, onChange, disabled = false }) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => !disabled && onChange(!value)}
      disabled={disabled}
      className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 disabled:opacity-40 ${value ? 'bg-violet-600' : 'bg-slate-600'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-6' : 'translate-x-0'}`}
      />
    </button>
  )
}
