import { BookOpen, Flame } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import type { DayActivity } from '../lib/skillsStats'

export function useCountUp(target: number, duration = 1400) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])

  return value
}

interface StatCardShellProps {
  icon: ReactNode
  label: string
  children: ReactNode
}

function StatCardShell({ icon, label, children }: StatCardShellProps) {
  return (
    <article className="group flex min-w-0 flex-col rounded-3xl border border-ink-700 bg-ink-900/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-pink-500/50 hover:shadow-[0_12px_40px_-12px_rgba(255,46,147,0.35)]">
      <div className="flex items-center gap-2 text-sm font-medium text-ink-300">
        <span className="grid size-8 place-items-center rounded-lg bg-lilac-400/10 text-lilac-300">{icon}</span>
        {label}
      </div>
      {children}
    </article>
  )
}

export function RingStatCard({
  icon,
  label,
  value,
  caption,
}: {
  icon: ReactNode
  label: string
  value: number | null
  caption: string
}) {
  const percent = useCountUp(value ?? 0)
  const radius = 46
  const circumference = 2 * Math.PI * radius

  return (
    <StatCardShell icon={icon} label={label}>
      <div className="mt-5 flex items-center gap-5">
        <div className="relative size-28 shrink-0">
          <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden="true">
            <circle cx="60" cy="60" r={radius} fill="none" strokeWidth="10" className="stroke-ink-700" />
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              className="stroke-pink-500 drop-shadow-[0_0_8px_rgba(255,46,147,0.6)]"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - percent / 100)}
            />
          </svg>
          <span className="absolute inset-0 grid place-items-center text-2xl font-bold text-ink-100">
            {value === null ? '--' : `${percent}%`}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-ink-400">{caption}</p>
      </div>
    </StatCardShell>
  )
}

export function VocabularyStatCard({ count }: { count: number }) {
  const animated = useCountUp(count, 1800)

  return (
    <StatCardShell icon={<BookOpen className="size-5" aria-hidden="true" />} label="Active vocabulary">
      <div className="mt-5">
        <p className="text-4xl font-bold tracking-tight text-ink-100">
          {animated.toLocaleString()}
          <span className="ml-2 text-base font-medium text-ink-400">words</span>
        </p>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-ink-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-lilac-400 to-pink-500 transition-all duration-1000"
            style={{ width: `${Math.min((count / 500) * 100, 100)}%` }}
          />
        </div>
        <p className="mt-3 text-sm text-ink-400">Distinct words you have spoken in practice</p>
      </div>
    </StatCardShell>
  )
}

export function StreakStatCard({ streak, week }: { streak: number; week: DayActivity[] }) {
  const animated = useCountUp(streak, 900)

  return (
    <StatCardShell icon={<Flame className="size-5" aria-hidden="true" />} label="Practice streak">
      <div className="mt-5">
        <p className="text-4xl font-bold tracking-tight text-ink-100">
          {animated}
          <span className="ml-2 text-base font-medium text-ink-400">days</span>
        </p>
        <div className="mt-5 grid w-full grid-cols-7 gap-1.5">
          {week.map((day) => {
            const practiced = day.sessions > 0
            return (
              <div key={day.key} className="group/day relative flex min-w-0 flex-col items-center gap-1.5">
                <span
                  className={`grid size-6 place-items-center rounded-full transition duration-200 group-hover/day:scale-110 ${
                    practiced
                      ? 'bg-pink-500/20 text-pink-300 ring-1 ring-pink-500/50 group-hover/day:bg-pink-500 group-hover/day:text-ink-950'
                      : 'bg-ink-800 text-ink-500 ring-1 ring-ink-700'
                  }`}
                >
                  <Flame className="size-3.5" aria-hidden="true" />
                </span>
                <span className="text-[11px] font-medium text-ink-400">{day.label}</span>
                <span className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 rounded-lg bg-ink-100 px-2 py-1 text-xs font-medium whitespace-nowrap text-ink-950 opacity-0 transition duration-200 group-hover/day:opacity-100">
                  {practiced ? `${day.minutes} min` : 'No practice'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </StatCardShell>
  )
}
