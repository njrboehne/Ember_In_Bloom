import { useState, useEffect, useRef } from 'react'
import { addSession } from '../utils/storage.js'

export default function LogModal({ skill, onClose, onLogged }) {
  const [duration, setDuration] = useState(skill?.targetMinutes ?? 15)
  const [notes, setNotes] = useState('')
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  function formatTime(secs) {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  function handleLog() {
    const mins = running ? Math.max(1, Math.round(elapsed / 60)) : duration
    const session = {
      id: crypto.randomUUID(),
      skillId: skill.id,
      skillName: skill.name,
      date: new Date().toISOString(),
      duration: mins,
      notes: notes.trim(),
    }
    const updated = addSession(session)
    onLogged(updated)
    onClose()
  }

  function toggleTimer() {
    if (!running && elapsed === 0) setElapsed(0)
    setRunning(r => !r)
  }

  function resetTimer() {
    setRunning(false)
    setElapsed(0)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-slate-800 rounded-t-2xl p-6 pb-8"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{skill.icon}</span>
            <div>
              <h2 className="text-lg font-semibold text-white">{skill.name}</h2>
              <p className="text-xs text-slate-400">Log a session</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Timer section */}
        <div className="bg-slate-900 rounded-xl p-4 mb-4 text-center">
          <p className="text-xs text-slate-400 mb-1 uppercase tracking-wide">Live Timer</p>
          <p className="text-4xl font-mono font-bold text-white mb-3">{formatTime(elapsed)}</p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={toggleTimer}
              className={`px-5 py-2 rounded-lg font-medium text-sm transition-colors ${
                running
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-violet-500/20 text-violet-400 border border-violet-500/40'
              }`}
            >
              {running ? 'Pause' : elapsed > 0 ? 'Resume' : 'Start Timer'}
            </button>
            {elapsed > 0 && !running && (
              <button
                onClick={resetTimer}
                className="px-4 py-2 rounded-lg font-medium text-sm text-slate-400 border border-slate-600"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Manual duration */}
        <div className="mb-4">
          <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">
            {elapsed > 0 ? 'Or enter duration manually (min)' : 'Duration (minutes)'}
          </label>
          <div className="flex gap-2 items-center">
            {[5, 10, 15, 20, 30, 45, 60].map(m => (
              <button
                key={m}
                onClick={() => setDuration(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  duration === m && elapsed === 0
                    ? 'bg-violet-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {m >= 60 ? '1h' : m}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="mb-5">
          <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder={skill.notes || 'What did you work on?'}
            className="w-full bg-slate-900 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 border border-slate-700 focus:border-violet-500 focus:outline-none resize-none"
            rows={2}
          />
        </div>

        <button
          onClick={handleLog}
          className="w-full bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold py-3.5 rounded-xl transition-colors"
        >
          Log {running ? formatTime(elapsed) : `${duration} min`} Session
        </button>
      </div>
    </div>
  )
}
