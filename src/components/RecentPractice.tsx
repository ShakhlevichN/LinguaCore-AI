import { CircleAlert, MessageSquareText } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fetchRecentPracticeSessions, type PracticeSessionRow } from '../lib/practiceSessions'

const RECENT_LIMIT = 5

type LoadState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; rows: PracticeSessionRow[]; total: number }

export default function RecentPractice() {
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    fetchRecentPracticeSessions(RECENT_LIMIT)
      .then(({ rows, total }) => {
        if (!cancelled) setState({ status: 'ready', rows, total })
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error' })
      })
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const retry = () => {
    setState({ status: 'loading' })
    setReloadKey((key) => key + 1)
  }

  return (
    <section className="rounded-3xl border border-ink-700 bg-ink-900/70 p-6 sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-ink-100">Recent practice</h2>
        {state.status === 'ready' && (
          <span className="text-xs font-medium text-ink-400">{state.total} saved sessions</span>
        )}
      </div>

      <div className="mt-6">
        {state.status === 'loading' && (
          <div className="flex flex-col gap-3" role="status" aria-live="polite">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-16 rounded-xl bg-[linear-gradient(90deg,var(--color-ink-800)_25%,var(--color-ink-700)_50%,var(--color-ink-800)_75%)] bg-[length:200%_100%] animate-shimmer"
              />
            ))}
          </div>
        )}

        {state.status === 'error' && (
          <div className="flex flex-col items-start gap-3 rounded-xl border border-rose-400/40 bg-rose-400/10 p-4">
            <p className="flex items-center gap-2 text-sm text-rose-300">
              <CircleAlert className="size-4" aria-hidden="true" />
              Couldn't load your recent sessions.
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

        {state.status === 'ready' && state.rows.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-ink-600 p-8 text-center">
            <MessageSquareText className="size-6 text-lilac-300" aria-hidden="true" />
            <p className="text-sm text-ink-300">No sessions yet. Your practice from the AI Voice Arena will show up here.</p>
          </div>
        )}

        {state.status === 'ready' && state.rows.length > 0 && (
          <ul className="flex flex-col gap-3">
            {state.rows.map((row) => (
              <li
                key={row.id}
                className="rounded-xl border border-ink-700 bg-ink-800/50 p-4 transition duration-200 hover:border-pink-500/40"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-ink-100">{row.topic}</span>
                  <span className="rounded-md bg-pink-500 px-2 py-0.5 text-xs font-bold text-ink-950">
                    {row.cefr_level}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-ink-300">{row.transcript}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-ink-400">
                  <span>
                    {row.grammar_corrections.length} correction{row.grammar_corrections.length === 1 ? '' : 's'}
                  </span>
                  <span>
                    {new Date(row.created_at).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
