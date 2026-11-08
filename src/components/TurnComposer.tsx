import { ArrowLeftRight, Eraser, Send } from 'lucide-react'
import MicButton from './MicButton'
import { SPEAKER_STYLES, type SpeakerId } from '../lib/speakers'

interface SpeakerControl {
  active: SpeakerId
  disabled: boolean
  onSwitch: () => void
}

interface TurnComposerProps {
  transcript: string
  onTranscriptChange: (text: string) => void
  isListening: boolean
  isSupported: boolean
  isBusy: boolean
  speechError: string | null
  onMicToggle: () => void
  onSend: () => void
  onClear: () => void
  speakerControl?: SpeakerControl
}

export default function TurnComposer({
  transcript,
  onTranscriptChange,
  isListening,
  isSupported,
  isBusy,
  speechError,
  onMicToggle,
  onSend,
  onClear,
  speakerControl,
}: TurnComposerProps) {
  const hasText = transcript.trim().length > 0
  const canSend = hasText && !isBusy && !isListening
  const otherId: SpeakerId | null = speakerControl ? (speakerControl.active === 1 ? 2 : 1) : null
  const active = speakerControl ? SPEAKER_STYLES[speakerControl.active] : null
  const other = otherId ? SPEAKER_STYLES[otherId] : null

  return (
    <div className="flex flex-col gap-5 border-t border-ink-700 pt-6">
      <div className="flex flex-col items-center gap-4">
        {speakerControl && active && other && otherId && (
          <div className="flex flex-wrap items-center justify-center gap-3">
            <p className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${active.bubble} ${active.nameText}`}>
              Active Speaker: {active.label} ({active.role})
            </p>
            <button
              type="button"
              onClick={speakerControl.onSwitch}
              disabled={speakerControl.disabled || isListening || isBusy}
              className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${other.switchButton}`}
            >
              <ArrowLeftRight className="size-4" aria-hidden="true" />
              Switch to {other.label} ({other.role})
            </button>
          </div>
        )}
        <MicButton
          isListening={isListening}
          disabled={!isSupported || isBusy}
          onToggle={onMicToggle}
          accent={speakerControl?.active ?? 1}
        />
      </div>

      {!isSupported && (
        <p className="rounded-xl border border-ink-600 bg-ink-800 px-4 py-3 text-sm text-ink-300">
          Live speech is not supported in this browser. You can type your answer below.
        </p>
      )}

      {speechError && (
        <p role="alert" className="rounded-xl border border-rose-400/40 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
          {speechError}
        </p>
      )}

      <div>
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="transcript" className="text-sm font-medium text-ink-300">
            Your answer
          </label>
          {isListening && (
            <span className="flex items-center gap-2 text-xs font-medium text-pink-300">
              <span className="size-2 animate-pulse rounded-full bg-pink-500" aria-hidden="true" />
              Live
            </span>
          )}
        </div>
        <textarea
          id="transcript"
          value={transcript}
          onChange={(e) => onTranscriptChange(e.target.value)}
          rows={3}
          disabled={isBusy}
          placeholder="Your words appear here as you speak. You can also type them."
          className="mt-2 w-full resize-none rounded-2xl border border-ink-600 bg-ink-950 p-4 text-base leading-relaxed text-ink-100 transition placeholder:text-ink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 focus:outline-none disabled:opacity-60"
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onSend}
            disabled={!canSend}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-pink-500 px-5 py-3 text-sm font-semibold text-ink-950 shadow-[0_0_24px_rgba(255,46,147,0.3)] transition hover:bg-pink-400 active:scale-95 disabled:cursor-not-allowed disabled:bg-ink-700 disabled:text-ink-400 disabled:shadow-none"
          >
            <Send className="size-4" aria-hidden="true" />
            Send answer
          </button>
          <button
            type="button"
            onClick={onClear}
            disabled={!hasText || isListening || isBusy}
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-ink-600 px-5 py-3 text-sm font-medium text-ink-200 transition hover:border-ink-400 hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Eraser className="size-4" aria-hidden="true" />
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}
