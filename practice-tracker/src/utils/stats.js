import {
  startOfDay, startOfWeek, endOfWeek, isWithinInterval,
  subDays, subWeeks, format, parseISO, differenceInCalendarDays, isSameDay
} from 'date-fns'

export function getWeekRange(date = new Date(), weekStartsMonday = true) {
  const weekStart = startOfWeek(date, { weekStartsOn: weekStartsMonday ? 1 : 0 })
  const weekEnd = endOfWeek(date, { weekStartsOn: weekStartsMonday ? 1 : 0 })
  return { weekStart, weekEnd }
}

export function sessionsThisWeek(sessions, skillId, weekStartsMonday = true) {
  const { weekStart, weekEnd } = getWeekRange(new Date(), weekStartsMonday)
  return sessions.filter(s =>
    s.skillId === skillId &&
    isWithinInterval(parseISO(s.date), { start: weekStart, end: weekEnd })
  )
}

export function sessionsToday(sessions, skillId) {
  const today = startOfDay(new Date())
  return sessions.filter(s =>
    s.skillId === skillId &&
    isSameDay(parseISO(s.date), today)
  )
}

export function computeStreak(sessions, skill, weekStartsMonday = true) {
  if (skill.frequency === 'daily') {
    return computeDailyStreak(sessions, skill.id)
  }
  return computeWeeklyStreak(sessions, skill, weekStartsMonday)
}

function computeDailyStreak(sessions, skillId) {
  let streak = 0
  let cursor = new Date()

  const hasSessionOn = (date) =>
    sessions.some(s => s.skillId === skillId && isSameDay(parseISO(s.date), date))

  // if not done today yet, start checking from yesterday
  if (!hasSessionOn(cursor)) {
    cursor = subDays(cursor, 1)
  }

  while (hasSessionOn(cursor)) {
    streak++
    cursor = subDays(cursor, 1)
  }
  return streak
}

function computeWeeklyStreak(sessions, skill, weekStartsMonday) {
  let streak = 0
  let weekOffset = 0
  const { weekStart, weekEnd } = getWeekRange(new Date(), weekStartsMonday)

  // check current week first — if not met target, start from last week
  const currentWeekCount = sessions.filter(s =>
    s.skillId === skill.id &&
    isWithinInterval(parseISO(s.date), { start: weekStart, end: weekEnd })
  ).length

  if (currentWeekCount < skill.targetSessions) {
    weekOffset = 1
  }

  while (true) {
    const refDate = subWeeks(new Date(), weekOffset)
    const { weekStart: ws, weekEnd: we } = getWeekRange(refDate, weekStartsMonday)
    const count = sessions.filter(s =>
      s.skillId === skill.id &&
      isWithinInterval(parseISO(s.date), { start: ws, end: we })
    ).length

    if (count >= skill.targetSessions) {
      streak++
      weekOffset++
    } else {
      break
    }
    if (weekOffset > 52) break
  }
  return streak
}

export function getSkillStatus(skill, sessions, weekStartsMonday = true) {
  if (skill.frequency === 'daily') {
    const todayCount = sessionsToday(sessions, skill.id).length
    const done = todayCount >= skill.targetSessions
    return {
      done,
      sessionsCompleted: todayCount,
      sessionsTarget: skill.targetSessions,
      label: done ? 'Done today' : 'Due today',
      urgent: !done,
    }
  }

  const weekSessions = sessionsThisWeek(sessions, skill.id, weekStartsMonday)
  const done = weekSessions.length >= skill.targetSessions
  const remaining = Math.max(0, skill.targetSessions - weekSessions.length)
  const { weekEnd } = getWeekRange(new Date(), weekStartsMonday)
  const daysLeft = differenceInCalendarDays(weekEnd, new Date())

  return {
    done,
    sessionsCompleted: weekSessions.length,
    sessionsTarget: skill.targetSessions,
    remaining,
    daysLeft,
    label: done ? 'Done this week' : `${remaining} left this week`,
    urgent: !done && daysLeft <= 1,
  }
}

export function getWeeklyGrid(sessions, skillId, numWeeks = 8, weekStartsMonday = true) {
  const weeks = []
  for (let i = numWeeks - 1; i >= 0; i--) {
    const refDate = subWeeks(new Date(), i)
    const { weekStart, weekEnd } = getWeekRange(refDate, weekStartsMonday)
    const count = sessions.filter(s =>
      s.skillId === skillId &&
      isWithinInterval(parseISO(s.date), { start: weekStart, end: weekEnd })
    ).length
    weeks.push({ weekStart, weekEnd, count, label: format(weekStart, 'MMM d') })
  }
  return weeks
}

export function getTodaysDuelist(skills, sessions, weekStartsMonday = true) {
  return skills
    .filter(s => s.active)
    .map(skill => ({ skill, status: getSkillStatus(skill, sessions, weekStartsMonday) }))
    .filter(({ status }) => !status.done)
    .sort((a, b) => {
      const aUrgent = a.status.urgent ? -1 : 0
      const bUrgent = b.status.urgent ? -1 : 0
      return aUrgent - bUrgent
    })
}

export function getWeekSummary(skills, sessions, weekStartsMonday = true) {
  const activeSkills = skills.filter(s => s.active)
  const completed = activeSkills.filter(s => {
    const status = getSkillStatus(s, sessions, weekStartsMonday)
    return status.done
  }).length
  return { completed, total: activeSkills.length }
}
