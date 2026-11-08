import { Mic, Square } from 'lucide-react'
import { SPEAKER_STYLES, type SpeakerId } from '../lib/speakers'

interface MicButtonProps {
  isListening: boolean
  disabled: boolean
  onToggle: () => void
  accent?: SpeakerId
}

const WAVE_DELAYS = ['0s', '0.8s', '1.6s']

export default function MicButton({ isListening, disabled, onToggle, accent = 1 }: MicButtonProps) {
  const style = SPEAKER_STYLES[accent]
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative grid size-44 place-items-center sm:size-52">
        {isListening &&
          WAVE_DELAYS.map((delay) => (
            <span
              key={delay}
              aria-hidden="true"
              className={`absolute inset-0 rounded-full border-2 animate-wave ${style.micRing}`}
              style={{ animationDelay: delay }}
            />
          ))}
        <span
          aria-hidden="true"
          className={`absolute inset-6 rounded-full blur-2xl transition-opacity duration-500 ${style.micGlow} ${
            isListening ? 'opacity-100' : 'opacity-30'
          }`}
        />
        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          aria-pressed={isListening}
          aria-label={isListening ? 'Stop listening' : 'Start speaking'}
          className={`relative grid size-28 cursor-pointer place-items-center rounded-full transition duration-300 hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lilac-300 disabled:cursor-not-allowed disabled:bg-ink-700 disabled:text-ink-400 disabled:shadow-none disabled:hover:scale-100 sm:size-32 ${style.micButton}`}
        >
          {isListening ? <Square className="size-9 fill-current" aria-hidden="true" /> : <Mic className="size-10" aria-hidden="true" />}
        </button>
      </div>
      <p className="text-sm font-medium text-ink-300">
        {isListening ? 'Listening... tap to stop' : 'Tap the mic and speak English'}
      </p>
    </div>
  )
}
