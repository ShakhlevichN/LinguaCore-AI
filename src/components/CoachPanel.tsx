import { ArrowRight, CircleAlert, CircleCheck, Sparkles } from 'lucide-react'
import { CEFR_LEVELS, type SpeechFeedback } from '../lib/speechFeedback'
import type { SaveStatus } from '../lib/practiceSessions'

interface CoachPanelProps {
  speakerLabel?: string
  feedback: SpeechFeedback | null
  isAnalyzing: boolean
  saveStatus: SaveStatus
}

export default function CoachPanel({ feedback, isAnalyzing, saveStatus, speakerLabel }: CoachPanelProps) {
  return (
    <section
      aria-label="AI coach feedback"
      className="flex flex-col rounded-3xl border border-ink-700 bg-ink-900/70 p-6 backdrop-blur sm:p-8"
    >
      <div className="flex items-center gap-2 text-lilac-300">
        <Sparkles className="size-5" aria-hidden="true" />
        <h2 className="text-base font-semibold text-ink-100">Coach feedback</h2>
        {speakerLabel && <span className="text-xs font-medium text-ink-400">for {speakerLabel}</span>}
      </div>

      <div className="mt-6 flex-1">
        {isAnalyzing ? <AnalyzingState /> : feedback ? <FeedbackContent feedback={feedback} /> : <EmptyState />}
      </div>

      {!isAnalyzing && saveStatus !== 'idle' && <SaveNotice status={saveStatus} />}
    </section>
  )
}

function EmptyState() {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-ink-600 p-8 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-lilac-400/10 text-lilac-300">
        <Sparkles className="size-6" aria-hidden="true" />
      </span>
      <p className="max-w-xs text-sm text-ink-300">
        After you answer, your CEFR level, grammar fixes, a polished version and power vocabulary appear here.
      </p>
    </div>
  )
}

function AnalyzingState() {
  return (
    <div className="flex flex-col gap-4" role="status" aria-live="polite">
      <p className="text-sm text-ink-300">Coaching your answer...</p>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-12 rounded-xl bg-[linear-gradient(90deg,var(--color-ink-800)_25%,var(--color-ink-700)_50%,var(--color-ink-800)_75%)] bg-[length:200%_100%] animate-shimmer"
        />
      ))}
    </div>
  )
}

function FeedbackContent({ feedback }: { feedback: SpeechFeedback }) {
  return (
    <div className="flex flex-col gap-7 animate-fade-up">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <span className="grid size-16 place-items-center rounded-2xl bg-pink-500 text-2xl font-bold text-ink-950 shadow-[0_0_28px_rgba(255,46,147,0.4)]">
            {feedback.cefrLevel}
          </span>
          <div>
            <p className="text-sm text-ink-400">Estimated CEFR level</p>
            <p className="text-sm text-ink-100">{feedback.encouragement}</p>
          </div>
        </div>
        <div className="grid grid-cols-6 gap-1.5" aria-label="CEFR scale">
          {CEFR_LEVELS.map((level) => (
            <span
              key={level}
              className={`rounded-lg py-1 text-center text-xs font-semibold transition-colors duration-300 ${
                level === feedback.cefrLevel ? 'bg-pink-500/20 text-pink-300 ring-1 ring-pink-500' : 'bg-ink-800 text-ink-400'
              }`}
            >
              {level}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-ink-100">
          Grammar corrections{feedback.corrections.length > 0 ? ` (${feedback.corrections.length})` : ''}
        </h3>
        {feedback.corrections.length === 0 ? (
          <p className="mt-2 text-sm text-ink-300">No grammar issues found in this answer.</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-3">
            {feedback.corrections.map((correction, index) => (
              <li
                key={`${correction.original}-${index}`}
                className="rounded-xl border border-pink-500/30 bg-pink-500/10 p-4 transition hover:border-pink-500/60"
              >
                <p className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-ink-400 line-through">{correction.original}</span>
                  <ArrowRight className="size-4 text-ink-400" aria-hidden="true" />
                  <span className="font-semibold text-pink-300">{correction.corrected}</span>
                </p>
                <p className="mt-1.5 text-xs text-ink-300">{correction.note}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-ink-100">Polished version</h3>
        <p className="mt-2 rounded-xl bg-ink-800 p-4 text-sm leading-relaxed text-ink-100">{feedback.polishedVersion}</p>
      </div>

      {feedback.powerVocabulary.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-ink-100">Power vocabulary</h3>
          <ul className="mt-3 flex flex-col gap-2">
            {feedback.powerVocabulary.map((item) => (
              <li key={item.term} className="rounded-xl border border-ink-700 bg-ink-800/60 p-3">
                <p className="text-sm font-semibold text-lilac-300">{item.term}</p>
                <p className="mt-1 text-xs text-ink-300">{item.meaning}</p>
                <p className="mt-1.5 text-xs italic text-ink-400">"{item.example}"</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function SaveNotice({ status }: { status: SaveStatus }) {
  if (status === 'saving') {
    return <p className="mt-6 text-xs text-ink-400">Saving to your progress...</p>
  }
  if (status === 'saved') {
    return (
      <p className="mt-6 flex items-center gap-1.5 text-xs text-emerald-400">
        <CircleCheck className="size-3.5" aria-hidden="true" />
        Saved to your progress
      </p>
    )
  }
  if (status === 'error') {
    return (
      <p className="mt-6 flex items-center gap-1.5 text-xs text-rose-400">
        <CircleAlert className="size-3.5" aria-hidden="true" />
        Couldn't save this answer. Your feedback is still shown above.
      </p>
    )
  }
  return null
}
