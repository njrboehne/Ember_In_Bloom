import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { deleteSession } from '../utils/storage.js'
import { COLOR_CLASSES } from '../data/defaultSkills.js'

export default function HistoryView({ skills, sessions, settings, onSessionsChange }) {
  const [filter, setFilter] = useState('all')
  const [confirmDelete, setConfirmDelete] = useState(null)

  const skillMap = Object.fromEntries(skills.map(s => [s.id, s]))

  const filtered = sessions
    .filter(s => filter === 'all' || s.skillId === filter)
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  function handleDelete(id) {
    const updated = deleteSession(id)
    onSessionsChange(updated)
    setConfirmDelete(null)
  }

  const totalMinutes = filtered.reduce((sum, s) => sum + (s.duration || 0), 0)
  const hours = Math.floor(totalMinutes / 60)
  const mins = totalMinutes % 60

  // Group by date
  const grouped = filtered.reduce((acc, s) => {
    const key = format(parseISO(s.date), 'yyyy-MM-dd')
    if (!acc[key]) acc[key] = { label: format(parseISO(s.date), 'EEEE, MMMM d'), sessions: [] }
    acc[key].sessions.push(s)
    return acc
  }, {})

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-12 pb-3 safe-top">
        <h1 className="text-2xl font-bold text-white">History</h1>

        {/* Summary */}
        <div className="flex gap-3 mt-3">
          <div className="flex-1 bg-slate-800 rounded-xl p-3 text-center">
            <p className="text-white font-bold text-lg">{sessions.length}</p>
            <p className="text-slate-400 text-xs">Total sessions</p>
          </div>
          <div className="flex-1 bg-slate-800 rounded-xl p-3 text-center">
            <p className="text-white font-bold text-lg">{hours > 0 ? `${hours}h ${mins}m` : `${mins}m`}</p>
            <p className="text-slate-400 text-xs">Total time</p>
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          <FilterPill id="all" label="All" active={filter === 'all'} onClick={() => setFilter('all')} />
          {skills.map(s => (
            <FilterPill
              key={s.id}
              id={s.id}
              label={`${s.icon} ${s.name}`}
              active={filter === s.id}
              onClick={() => setFilter(s.id)}
              color={s.color}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scroll-area px-5 pb-6">
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <p className="text-4xl mb-3">📋</p>
            <p className="font-medium">No sessions yet</p>
            <p className="text-sm mt-1">Log your first session from Today or Skills</p>
          </div>
        ) : (
          Object.entries(grouped).map(([key, { label, sessions: daySessions }]) => (
            <div key={key} className="mb-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{label}</p>
              <div className="space-y-2">
                {daySessions.map(session => {
                  const skill = skillMap[session.skillId]
                  const colors = skill ? COLOR_CLASSES[skill.color] || COLOR_CLASSES.violet : COLOR_CLASSES.violet
                  return (
                    <div
                      key={session.id}
                      className="flex items-center gap-3 bg-slate-800 rounded-xl p-3.5"
                    >
                      <span className="text-xl flex-shrink-0">{skill?.icon || '📝'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{session.skillName || skill?.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-xs font-semibold ${colors.text}`}>{session.duration} min</span>
                          {session.notes && (
                            <span className="text-xs text-slate-500 truncate">{session.notes}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-xs text-slate-500">
                          {format(parseISO(session.date), 'h:mm a')}
                        </span>
                        {confirmDelete === session.id ? (
                          <div className="flex gap-1 ml-1">
                            <button
                              onClick={() => handleDelete(session.id)}
                              className="text-xs text-rose-400 font-medium px-2 py-1 rounded"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="text-xs text-slate-400 px-2 py-1 rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(session.id)}
                            className="ml-2 text-slate-600 hover:text-rose-400 transition-colors p-1"
                          >
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function FilterPill({ id, label, active, onClick, color }) {
  const colors = color ? COLOR_CLASSES[color] : null
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap ${
        active
          ? colors
            ? `${colors.bg} ${colors.text} border ${colors.border}`
            : 'bg-violet-500/20 text-violet-400 border border-violet-500/40'
          : 'bg-slate-800 text-slate-400 border border-slate-700'
      }`}
    >
      {label}
    </button>
  )
}
