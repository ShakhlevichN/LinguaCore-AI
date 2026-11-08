import type { PracticeSessionRow } from './practiceSessions'

const WORDS_PER_MINUTE = 130
const MIN_WORD_LENGTH = 3
const WEEK_LENGTH = 7
const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

export interface DayActivity {
  key: string
  label: string
  minutes: number
  sessions: number
}

export interface SkillStats {
  fluency: number | null
  grammar: number | null
  vocabularyCount: number
  totalSessions: number
  week: DayActivity[]
  weekMinutes: number
  streak: number
}

function dayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

function wordsIn(text: string): string[] {
  return text.toLowerCase().match(/[a-z][a-z'-]*/g) ?? []
}

function average(values: number[]): number | null {
  if (values.length === 0) return null
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
}

export function computeSkillStats(rows: PracticeSessionRow[], now: Date = new Date()): SkillStats {
  const vocabulary = new Set<string>()
  const practicedDays = new Map<string, { minutes: number; sessions: number }>()

  for (const row of rows) {
    const words = wordsIn(row.transcript)
    for (const word of words) {
      if (word.length >= MIN_WORD_LENGTH) vocabulary.add(word)
    }
    const key = dayKey(new Date(row.created_at))
    const entry = practicedDays.get(key) ?? { minutes: 0, sessions: 0 }
    entry.minutes += Math.max(1, Math.round(words.length / WORDS_PER_MINUTE))
    entry.sessions += 1
    practicedDays.set(key, entry)
  }

  const week: DayActivity[] = []
  for (let offset = WEEK_LENGTH - 1; offset >= 0; offset--) {
    const date = new Date(now)
    date.setDate(now.getDate() - offset)
    const key = dayKey(date)
    const entry = practicedDays.get(key) ?? { minutes: 0, sessions: 0 }
    week.push({ key, label: WEEKDAY_LABELS[date.getDay()], ...entry })
  }

  const cursor = new Date(now)
  if (!practicedDays.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1)
  let streak = 0
  while (practicedDays.has(dayKey(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return {
    fluency: average(rows.flatMap((row) => (row.fluency_score === null ? [] : [row.fluency_score]))),
    grammar: average(rows.flatMap((row) => (row.grammar_accuracy === null ? [] : [row.grammar_accuracy]))),
    vocabularyCount: vocabulary.size,
    totalSessions: rows.length,
    week,
    weekMinutes: week.reduce((sum, day) => sum + day.minutes, 0),
    streak,
  }
}
