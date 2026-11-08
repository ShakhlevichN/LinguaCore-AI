import { AudioWaveform, Gauge, Volume2 } from 'lucide-react'
import { speakText } from '../lib/voiceOutput'

interface PronunciationCardProps {
  clarityScore: number | null
  wordsPerMinute: number | null
  phoneticTips: string[]
  flaggedWords: string[]
}

const RADIUS = 46
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function paceLabel(wpm: number): string {
  if (wpm < 100) return 'Hesitant'
  if (wpm > 170) return 'Too Fast'
  return 'Optimal'
}

export default function PronunciationCard({ clarityScore, wordsPerMinute, phoneticTips, flaggedWords }: PronunciationCardProps) {
  const score = clarityScore ?? 0

  return (
    <section
      aria-label="Pronunciation and speech clarity"
      className="flex flex-col gap-6 rounded-3xl border border-ink-700 bg-ink-900/70 p-6 backdrop-blur sm:p-8"
    >
      <div className="flex items-center gap-2 text-lilac-300">
        <AudioWaveform className="size-5" aria-hidden="true" />
        <h2 className="text-base font-semibold text-ink-100">Pronunciation and speech clarity</h2>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative size-28 shrink-0">
          <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden="true">
            <circle cx="60" cy="60" r={RADIUS} fill="none" strokeWidth="10" className="stroke-ink-700" />
            <circle
              cx="60"
              cy="60"
              r={RADIUS}
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              className="stroke-pink-500 transition-all duration-700 drop-shadow-[0_0_8px_rgba(255,46,147,0.6)]"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - score / 100)}
            />
          </svg>
          <span className="absolute inset-0 grid place-items-center text-2xl font-bold text-ink-100">
            {clarityScore === null ? '--' : `${score}%`}
          </span>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink-100">
            {clarityScore === null ? 'Waiting for your first answer' : `${score}% Native Match`}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-400">
            <Gauge className="size-4" aria-hidden="true" />
            Pace:{' '}
            <span className="font-semibold text-pink-300">
              {wordsPerMinute === null ? 'Not measured yet' : `${wordsPerMinute} wpm, ${paceLabel(wordsPerMinute)}`}
            </span>
          </p>
        </div>
      </div>

      {flaggedWords.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-ink-100">Words to practice</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {flaggedWords.map((word) => (
              <li key={word}>
                <button
                  type="button"
                  onClick={() => speakText(word)}
                  aria-label={`Hear the word ${word}`}
                  className="flex cursor-pointer items-center gap-2 rounded-full border border-lilac-400/40 bg-lilac-400/10 py-1.5 pr-3 pl-2.5 text-sm font-medium text-lilac-200 transition hover:border-pink-500/60 hover:bg-pink-500/10 hover:text-pink-200"
                >
                  <Volume2 className="size-4" aria-hidden="true" />
                  {word}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-ink-100">Articulation tips</h3>
        {phoneticTips.length === 0 ? (
          <p className="mt-2 text-sm text-ink-300">Tips for crisp articulation appear after your first answer.</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {phoneticTips.map((tip) => (
              <li key={tip} className="rounded-xl border border-ink-700 bg-ink-800/60 p-3 text-sm text-ink-200">
                {tip}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
