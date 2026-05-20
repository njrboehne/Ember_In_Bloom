export async function requestNotificationPermission() {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  const result = await Notification.requestPermission()
  return result === 'granted'
}

export function notificationSupported() {
  return 'Notification' in window
}

export function notificationGranted() {
  return 'Notification' in window && Notification.permission === 'granted'
}

export function scheduleReminders(skills, sessions) {
  if (!notificationGranted()) return []

  const now = new Date()
  const timers = []

  skills.filter(s => s.active && s.reminderTime).forEach(skill => {
    const [hours, minutes] = skill.reminderTime.split(':').map(Number)
    const fireAt = new Date()
    fireAt.setHours(hours, minutes, 0, 0)

    // if the time already passed today, skip
    if (fireAt <= now) return

    const delay = fireAt.getTime() - now.getTime()
    const timerId = setTimeout(() => {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SHOW_NOTIFICATION',
          title: `Time to practice ${skill.name}`,
          body: skill.notes || `${skill.targetMinutes} min session`,
          tag: skill.id,
        })
      } else {
        new Notification(`Time to practice ${skill.name}`, {
          body: skill.notes || `${skill.targetMinutes} min session`,
          tag: skill.id,
          icon: '/icon-192.png',
        })
      }
    }, delay)

    timers.push(timerId)
  })

  return timers
}

export function clearReminders(timers) {
  timers.forEach(id => clearTimeout(id))
}
