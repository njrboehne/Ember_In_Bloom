import { DEFAULT_SKILLS } from '../data/defaultSkills.js'

const KEYS = {
  skills: 'pt_skills',
  sessions: 'pt_sessions',
  settings: 'pt_settings',
}

export function getSkills() {
  try {
    const raw = localStorage.getItem(KEYS.skills)
    return raw ? JSON.parse(raw) : DEFAULT_SKILLS
  } catch {
    return DEFAULT_SKILLS
  }
}

export function saveSkills(skills) {
  localStorage.setItem(KEYS.skills, JSON.stringify(skills))
}

export function getSessions() {
  try {
    const raw = localStorage.getItem(KEYS.sessions)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveSessions(sessions) {
  localStorage.setItem(KEYS.sessions, JSON.stringify(sessions))
}

export function addSession(session) {
  const sessions = getSessions()
  const updated = [session, ...sessions]
  saveSessions(updated)
  return updated
}

export function deleteSession(id) {
  const sessions = getSessions()
  const updated = sessions.filter(s => s.id !== id)
  saveSessions(updated)
  return updated
}

export function getSettings() {
  try {
    const raw = localStorage.getItem(KEYS.settings)
    return raw ? JSON.parse(raw) : { notificationsEnabled: false, weekStartsMonday: true }
  } catch {
    return { notificationsEnabled: false, weekStartsMonday: true }
  }
}

export function saveSettings(settings) {
  localStorage.setItem(KEYS.settings, JSON.stringify(settings))
}
