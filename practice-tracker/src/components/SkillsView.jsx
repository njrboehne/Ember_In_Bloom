import { useState } from 'react'
import { getSkillStatus, computeStreak, getWeeklyGrid } from '../utils/stats.js'
import { COLOR_CLASSES, CATEGORY_LABELS } from '../data/defaultSkills.js'
import LogModal from './LogModal.jsx'

export default function SkillsView({ skills, sessions, settings, onSkillsChange, onSessionsChange }) {
  const [logSkill, setLogSkill] = useState(null)
  const [expanded, setExpanded] = useState(null)
  const weekStartsMonday = settings?.weekStartsMonday ?? true

  function toggleSkill(skillId) {
    const updated = skills.map(s => s.id === skillId ? { ...s, active: !s.active } : s)
    onSkillsChange(updated)
  }

  function toggleExpand(id) {
    setExpanded(prev => prev === id ? null : id)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-12 pb-4 safe-top">
        <h1 className="text-2xl font-bold text-white">Skills</h1>
        <p className="text-slate-400 text-sm mt-0.5">Tap a skill for details and history</p>
      </div>

      <div className="flex-1 overflow-y-auto scroll-area px-5 pb-6 space-y-3">
        {skills.map(skill => (
          <SkillCard
            key={skill.id}
            skill={skill}
            sessions={sessions}
            weekStartsMonday={weekStartsMonday}
            expanded={expanded === skill.id}
            onToggleExpand={() => toggleExpand(skill.id)}
            onLog={() => setLogSkill(skill)}
            onToggleActive={() => toggleSkill(skill.id)}
          />
        ))}
      </div>

      {logSkill && (
        <LogModal
          skill={logSkill}
          onClose={() => setLogSkill(null)}
          onLogged={onSessionsChange}
        />
      )}
    </div>
  )
}

function SkillCard({ skill, sessions, weekStartsMonday, expanded, onToggleExpand, onLog, onToggleActive }) {
  const status = getSkillStatus(skill, sessions, weekStartsMonday)
  const streak = computeStreak(sessions, skill, weekStartsMonday)
  const grid = getWeeklyGrid(sessions, skill.id, 8, weekStartsMonday)
  const colors = COLOR_CLASSES[skill.color] || COLOR_CLASSES.violet

  const recentSessions = sessions
    .filter(s => s.skillId === skill.id)
    .slice(0, 5)

  return (
    <div className={`bg-slate-800 rounded-xl border ${colors.border} overflow-hidden`}>
      <button
        className="w-full flex items-center gap-3 p-4 text-left"
        onClick={onToggleExpand}
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${colors.bg} flex-shrink-0`}>
          {skill.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className={`font-semibold text-sm ${skill.active ? 'text-white' : 'text-slate-500'}`}>{skill.name}</p>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
              {CATEGORY_LABELS[skill.category] || skill.category}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <p className={`text-xs ${status.done ? 'text-emerald-400' : 'text-slate-400'}`}>{status.label}</p>
            {streak > 0 && (
              <p className="text-xs text-amber-400">🔥 {streak}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className={`text-right text-xs ${colors.text} font-bold`}>
            {status.sessionsCompleted}/{status.sessionsTarget}
          </div>
          <svg
            width="16" height="16"
            className={`text-slate-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-700/50 pt-3 space-y-4">
          {/* Stat row */}
          <div className="grid grid-cols-3 gap-2">
            <StatBox label={skill.frequency === 'daily' ? 'Day streak' : 'Week streak'} value={`${streak} 🔥`} />
            <StatBox label="Target" value={`${skill.targetMinutes}m`} />
            <StatBox label="Freq" value={`${skill.targetSessions}x/${skill.frequency === 'daily' ? 'day' : 'wk'}`} />
          </div>

          {/* 8-week consistency grid */}
          <div>
            <p className="text-xs text-slate-400 mb-2 uppercase tracking-wide">8-week consistency</p>
            <div className="flex gap-1.5">
              {grid.map((week, i) => {
                const pct = Math.min(1, week.count / skill.targetSessions)
                const opacity = pct === 0 ? 'opacity-10' : pct < 1 ? 'opacity-50' : 'opacity-100'
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className={`w-full aspect-square rounded-sm ${colors.dot} ${opacity}`} />
                    <p className="text-[8px] text-slate-500">{week.label.split(' ')[1]}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Notes */}
          {skill.notes && (
            <p className="text-xs text-slate-400 italic">{skill.notes}</p>
          )}

          {/* Recent sessions */}
          {recentSessions.length > 0 && (
            <div>
              <p className="text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Recent sessions</p>
              <div className="space-y-1.5">
                {recentSessions.map(s => (
                  <div key={s.id} className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">
                      {new Date(s.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    <span className={`${colors.text} font-medium`}>{s.duration} min</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={onLog}
              className="flex-1 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
            >
              Log Session
            </button>
            <button
              onClick={onToggleActive}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                skill.active
                  ? 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}
            >
              {skill.active ? 'Pause' : 'Activate'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function StatBox({ label, value }) {
  return (
    <div className="bg-slate-900 rounded-lg p-2.5 text-center">
      <p className="text-white font-bold text-sm">{value}</p>
      <p className="text-slate-500 text-[10px] mt-0.5">{label}</p>
    </div>
  )
}
