import { CircleAlert, Gauge, SpellCheck } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { fetchAllPracticeSessions, type PracticeSessionRow } from '../lib/practiceSessions'
import { computeSkillStats, type DayActivity, type SkillStats } from '../lib/skillsStats'
import RecentPractice from './RecentPractice'
import { RingStatCard, StreakStatCard, VocabularyStatCard } from './SkillsStatCards'

type LoadState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; rows: PracticeSessionRow[] }

export default function SkillsDashboard() {
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    fetchAllPracticeSessions()
      .then((rows) => {
        if (!cancelled) setState({ status: 'ready', rows })
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error' })
      })
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const stats = useMemo(
    () => (state.status === 'ready' ? computeSkillStats(state.rows) : null),
    [state],
  )

  const retry = () => {
    setState({ status: 'loading' })
    setReloadKey((key) => key + 1)
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-pink-400">Skills Dashboard</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-ink-100 sm:text-4xl">
          Your English skills at a glance
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ink-300">
          Track how fluent you sound, how accurate your grammar is and how your practice habit is growing.
        </p>
      </div>

      {state.status === 'loading' && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4" role="status" aria-live="polite">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-56 rounded-3xl bg-[linear-gradient(90deg,var(--color-ink-800)_25%,var(--color-ink-700)_50%,var(--color-ink-800)_75%)] bg-[length:200%_100%] animate-shimmer"
            />
          ))}
        </div>
      )}

      {state.status === 'error' && (
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-rose-400/40 bg-rose-400/10 p-5">
          <p className="flex items-center gap-2 text-sm text-rose-300">
            <CircleAlert className="size-4" aria-hidden="true" />
            Couldn't load your practice history, so your stats can't be calculated.
          </p>
          <button
            type="button"
            onClick={retry}
            className="cursor-pointer rounded-lg border border-rose-400/50 px-3 py-1.5 text-xs font-medium text-rose-200 transition hover:bg-rose-400/10"
          >
            Try again
          </button>
        </div>
      )}

      {stats && <DashboardStats stats={stats} />}

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <WeeklyActivityCard days={stats?.week ?? null} />
        <RecentPractice />
      </div>
    </div>
  )
}

function DashboardStats({ stats }: { stats: SkillStats }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <RingStatCard
        icon={<Gauge className="size-5" aria-hidden="true" />}
        label="Fluency score"
        value={stats.fluency}
        caption={
          stats.fluency === null
            ? 'Practice a few answers to see your fluency.'
            : 'Average clarity of your spoken answers.'
        }
      />
      <RingStatCard
        icon={<SpellCheck className="size-5" aria-hidden="true" />}
        label="Grammar accuracy"
        value={stats.grammar}
        caption={
          stats.grammar === null
            ? 'Practice a few answers to see your accuracy.'
            : 'Average across your saved sessions.'
        }
      />
      <VocabularyStatCard count={stats.vocabularyCount} />
      <StreakStatCard streak={stats.streak} week={stats.week} />
    </div>
  )
}

function WeeklyActivityCard({ days }: { days: DayActivity[] | null }) {
  const maxMinutes = Math.max(1, ...(days ?? []).map((day) => day.minutes))
  const totalMinutes = (days ?? []).reduce((sum, day) => sum + day.minutes, 0)

  return (
    <section className="rounded-3xl border border-ink-700 bg-ink-900/70 p-6 sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-ink-100">Weekly practice</h2>
          <p className="mt-1 text-sm text-ink-400">Minutes spoken each day, from your saved sessions</p>
        </div>
        <span className="rounded-full bg-pink-500/15 px-3 py-1 text-xs font-semibold whitespace-nowrap text-pink-300">
          {totalMinutes} min this week
        </span>
      </div>

      {days === null ? (
        <div className="mt-8 h-56 animate-pulse rounded-2xl bg-ink-800" aria-hidden="true" />
      ) : (
        <div className="mt-8 flex h-56 items-end justify-between gap-3 sm:gap-5">
          {days.map((day) => {
            const height = (day.minutes / maxMinutes) * 100
            return (
              <div key={day.key} className="group relative flex h-full flex-1 flex-col justify-end gap-3">
                <span className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 rounded-md bg-ink-100 px-2 py-0.5 text-xs font-semibold whitespace-nowrap text-ink-950 opacity-0 transition duration-200 group-hover:opacity-100">
                  {day.minutes} min, {day.sessions} {day.sessions === 1 ? 'session' : 'sessions'}
                </span>
                <div
                  className="w-full origin-bottom animate-grow-up rounded-t-xl bg-gradient-to-t from-pink-600 to-pink-400 transition duration-200 group-hover:from-pink-500 group-hover:to-lilac-300"
                  style={{ height: `${height}%`, minHeight: day.minutes > 0 ? '4px' : '0px' }}
                />
                <span className="text-center text-xs font-medium text-ink-400">{day.label}</span>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
