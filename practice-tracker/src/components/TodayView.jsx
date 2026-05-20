import { useState } from 'react'
import { format } from 'date-fns'
import { getSkillStatus, getWeekSummary, computeStreak } from '../utils/stats.js'
import { COLOR_CLASSES } from '../data/defaultSkills.js'
import LogModal from './LogModal.jsx'

export default function TodayView({ skills, sessions, settings, onSessionsChange }) {
  const [logSkill, setLogSkill] = useState(null)

  const weekStartsMonday = settings?.weekStartsMonday ?? true
  const activeSkills = skills.filter(s => s.active)
  const summary = getWeekSummary(skills, sessions, weekStartsMonday)

  const pending = activeSkills.filter(s => {
    const st = getSkillStatus(s, sessions, weekStartsMonday)
    return !st.done
  })
  const completed = activeSkills.filter(s => {
    const st = getSkillStatus(s, sessions, weekStartsMonday)
    return st.done
  })

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 safe-top">
        <p className="text-slate-400 text-sm">{format(new Date(), 'EEEE, MMMM d')}</p>
        <h1 className="text-2xl font-bold text-white mt-0.5">Today's Practice</h1>

        {/* Weekly progress bar */}
        <div className="mt-4 bg-slate-800 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-300 font-medium">This week</span>
            <span className="text-sm text-slate-400">{summary.completed}/{summary.total} skills done</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: summary.total > 0 ? `${(summary.completed / summary.total) * 100}%` : '0%' }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1.5">
            {summary.completed === summary.total && summary.total > 0
              ? '🎉 All skills practiced this week!'
              : `${summary.total - summary.completed} skill${summary.total - summary.completed !== 1 ? 's' : ''} remaining`}
          </p>
        </div>
      </div>

      {/* Skill list */}
      <div className="flex-1 overflow-y-auto scroll-area px-5 pb-4">
        {pending.length > 0 && (
          <>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Still needed
            </h2>
            <div className="space-y-3 mb-6">
              {pending.map(skill => (
                <SkillRow
                  key={skill.id}
                  skill={skill}
                  sessions={sessions}
                  weekStartsMonday={weekStartsMonday}
                  onLog={() => setLogSkill(skill)}
                />
              ))}
            </div>
          </>
        )}

        {completed.length > 0 && (
          <>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Completed
            </h2>
            <div className="space-y-3">
              {completed.map(skill => (
                <SkillRow
                  key={skill.id}
                  skill={skill}
                  sessions={sessions}
                  weekStartsMonday={weekStartsMonday}
                  onLog={() => setLogSkill(skill)}
                  done
                />
              ))}
            </div>
          </>
        )}

        {activeSkills.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <p className="text-4xl mb-3">🎯</p>
            <p className="font-medium">No active skills</p>
            <p className="text-sm mt-1">Add skills in the Skills tab</p>
          </div>
        )}
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

function SkillRow({ skill, sessions, weekStartsMonday, onLog, done }) {
  const status = getSkillStatus(skill, sessions, weekStartsMonday)
  const streak = computeStreak(sessions, skill, weekStartsMonday)
  const colors = COLOR_CLASSES[skill.color] || COLOR_CLASSES.violet

  return (
    <div
      className={`flex items-center gap-3 bg-slate-800 rounded-xl p-4 border transition-all ${
        done
          ? 'border-slate-700/40 opacity-60'
          : status.urgent
          ? 'border-rose-500/40'
          : 'border-slate-700/40'
      }`}
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${colors.bg} flex-shrink-0`}>
        {done ? '✅' : skill.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-white text-sm">{skill.name}</p>
          {status.urgent && !done && (
            <span className="text-[10px] bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded-full font-medium">urgent</span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <p className={`text-xs ${done ? 'text-emerald-400' : 'text-slate-400'}`}>{status.label}</p>
          {streak > 0 && (
            <p className="text-xs text-amber-400">🔥 {streak} {skill.frequency === 'daily' ? 'day' : 'week'}{streak !== 1 ? 's' : ''}</p>
          )}
        </div>
        {!done && (
          <div className="mt-1.5 h-1 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${done ? 'bg-emerald-500' : colors.dot.replace('bg-', 'bg-')}`}
              style={{ width: `${Math.min(100, (status.sessionsCompleted / status.sessionsTarget) * 100)}%` }}
            />
          </div>
        )}
      </div>

      <button
        onClick={onLog}
        className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
          done
            ? 'bg-slate-700 text-slate-400'
            : 'bg-violet-600 hover:bg-violet-500 text-white'
        }`}
      >
        {done ? 'Log more' : 'Log'}
      </button>
    </div>
  )
}
