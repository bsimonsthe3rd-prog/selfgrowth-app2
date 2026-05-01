// All localStorage keys and helpers in one place

export function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export function dateKey(date) {
  return date.toISOString().slice(0, 10)
}

// Checklist data for a given day
export function loadChecklist(dateStr) {
  try {
    const raw = localStorage.getItem('checklist-' + dateStr)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

export function saveChecklist(dateStr, data) {
  localStorage.setItem('checklist-' + dateStr, JSON.stringify(data))
}

// Custom tasks
export const DEFAULT_WORK_TASKS = [
  { id: 'w1', title: 'Spanish: 1 Duolingo lesson', detail: 'Daily reps beat long study sessions. One lesson is all you need.', badge: '~10 min', cat: 'learn' },
  { id: 'w2', title: 'Read 10 pages', detail: 'Any book — fiction, non-fiction. Just 10 pages.', badge: '~15 min', cat: 'learn' },
  { id: 'w3', title: 'One finance or AI tidbit', detail: 'Short article, newsletter, or YouTube clip.', badge: '~10 min', cat: 'money' },
  { id: 'w4', title: 'AI hands-on time', detail: 'Try a new AI tool, follow a short tutorial, or experiment with Claude/ChatGPT.', badge: '~20 min', cat: 'learn' },
  { id: 'w5', title: 'Explore one new thing', detail: 'Cooking video, music theory, coding tutorial — whatever has your attention.', badge: 'bonus', cat: 'create' },
]

export const DEFAULT_HOME_TASKS = [
  { id: 'h1', title: 'Workout', detail: "You're already consistent — protect the streak. Log it as a win.", badge: 'habit', cat: 'body' },
  { id: 'h2', title: 'Cook one intentional meal', detail: 'Pick a recipe slightly above your comfort zone.', badge: '3×/week', cat: 'cook' },
  { id: 'h3', title: '30 min creative or project time', detail: 'Music, side project, woodworking, coding. Rotate freely.', badge: '~30 min', cat: 'create' },
  { id: 'h4', title: 'Read before TV or gaming', detail: 'Earn your fun. 10 pages first — then enjoy guilt-free.', badge: 'trigger', cat: 'learn' },
  { id: 'h5', title: 'One social touchpoint', detail: 'Text a friend, make a plan, or join a community.', badge: '3×/week', cat: 'social' },
]

export function loadTasks() {
  try {
    const raw = localStorage.getItem('custom-tasks')
    if (!raw) return { work: DEFAULT_WORK_TASKS, home: DEFAULT_HOME_TASKS, workWin: 3, homeWin: 3 }
    return JSON.parse(raw)
  } catch { return { work: DEFAULT_WORK_TASKS, home: DEFAULT_HOME_TASKS, workWin: 3, homeWin: 3 } }
}

export function saveTasks(data) {
  localStorage.setItem('custom-tasks', JSON.stringify(data))
}

// Weekly review
export function getWeekKey(date = new Date()) {
  const startOfYear = new Date(date.getFullYear(), 0, 1)
  const week = Math.ceil(((date - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7)
  return `${date.getFullYear()}-W${week}`
}

export function loadWeeklyReview(weekKey) {
  try {
    const raw = localStorage.getItem('weekly-review-' + weekKey)
    return raw ? JSON.parse(raw) : { ratings: {}, prompts: {} }
  } catch { return { ratings: {}, prompts: {} } }
}

export function saveWeeklyReview(weekKey, data) {
  localStorage.setItem('weekly-review-' + weekKey, JSON.stringify(data))
}

// History — get all past days that have checklist data
export function loadHistory() {
  const days = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith('checklist-')) {
      const dateStr = key.replace('checklist-', '')
      if (dateStr !== todayKey()) {
        try {
          const data = JSON.parse(localStorage.getItem(key))
          days.push({ dateStr, data })
        } catch {}
      }
    }
  }
  return days.sort((a, b) => b.dateStr.localeCompare(a.dateStr))
}

// Streak — count consecutive days with a win
export function loadStreak(tasks) {
  let streak = 0
  const today = new Date()
  for (let i = 1; i <= 365; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = dateKey(d)
    const checked = loadChecklist(key)
    const allTasks = [...tasks.work, ...tasks.home]
    const done = allTasks.filter(t => checked[t.id]).length
    const win = done >= Math.min(tasks.workWin, tasks.homeWin)
    if (win) streak++
    else break
  }
  return streak
}
