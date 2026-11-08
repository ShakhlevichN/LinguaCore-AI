import { X } from 'lucide-react'
import { useState, type KeyboardEvent } from 'react'
import {
  MAX_TARGET_VOCABULARY,
  SESSION_LENGTH_OPTIONS,
  type ConversationMode,
  type ParticipantMode,
  type SessionSettings,
} from '../lib/sessionSettings'

interface SessionSettingsFormProps {
  settings: SessionSettings
  isCasual: boolean
  isCustom: boolean
  onChange: (next: SessionSettings) => void
}

const MODE_OPTIONS: { value: ConversationMode; label: string; hint: string }[] = [
  { value: 'candidate', label: 'I am the Candidate', hint: 'The AI asks, you answer.' },
  { value: 'interviewer', label: 'I am the Interviewer', hint: 'You ask, the AI answers as the candidate.' },
]

const PARTICIPANT_OPTIONS: { value: ParticipantMode; label: string; hint: string }[] = [
  { value: 'solo', label: 'Solo with AI', hint: 'You chat with the AI on your own.' },
  { value: 'duo', label: 'Duo (2 People, 1 Device)', hint: 'Two people take turns; only Speaker 1 is saved to your dashboard.' },
]

export default function SessionSettingsForm({ settings, isCasual, isCustom, onChange }: SessionSettingsFormProps) {
  return (
    <div className="flex flex-col gap-8">
      {isCasual ? (
        <div>
          <h3 className="text-sm font-semibold text-ink-100">Participants</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {PARTICIPANT_OPTIONS.map((option) => {
              const isSelected = option.value === settings.participants
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onChange({ ...settings, participants: option.value })}
                  className={`flex cursor-pointer flex-col items-start gap-1 rounded-2xl border p-4 text-left transition duration-200 ${
                    isSelected
                      ? 'border-pink-500 bg-pink-500/10'
                      : 'border-ink-600 bg-ink-800/50 hover:border-ink-400 hover:bg-ink-800'
                  }`}
                >
                  <span className={`text-sm font-semibold ${isSelected ? 'text-pink-300' : 'text-ink-100'}`}>
                    {option.label}
                  </span>
                  <span className="text-xs leading-relaxed text-ink-400">{option.hint}</span>
                </button>
              )
            })}
          </div>
        </div>
      ) : isCustom ? null : (
      <div>
        <h3 className="text-sm font-semibold text-ink-100">Your role</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {MODE_OPTIONS.map((option) => {
            const isSelected = option.value === settings.mode
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onChange({ ...settings, mode: option.value })}
                className={`flex cursor-pointer flex-col items-start gap-1 rounded-2xl border p-4 text-left transition duration-200 ${
                  isSelected
                    ? 'border-lilac-300 bg-lilac-400/15'
                    : 'border-ink-600 bg-ink-800/50 hover:border-ink-400 hover:bg-ink-800'
                }`}
              >
                <span className={`text-sm font-semibold ${isSelected ? 'text-lilac-300' : 'text-ink-100'}`}>
                  {option.label}
                </span>
                <span className="text-xs leading-relaxed text-ink-400">{option.hint}</span>
              </button>
            )
          })}
        </div>
      </div>
      )}

      <div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {SESSION_LENGTH_OPTIONS.map((option) => {
            const isSelected = option.turns === settings.maxTurns
            return (
              <button
                key={option.label}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onChange({ ...settings, maxTurns: option.turns })}
                className={`flex cursor-pointer flex-col items-center gap-0.5 rounded-xl border px-3 py-3 transition duration-200 ${
                  isSelected
                    ? 'border-pink-500 bg-pink-500/10 text-pink-300'
                    : 'border-ink-600 text-ink-300 hover:border-ink-400 hover:text-ink-100'
                }`}
              >
                <span className="text-sm font-semibold">{option.label}</span>
                <span className="text-xs text-ink-400">
                  {option.turns === null ? 'No limit' : `${option.turns} turns`}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <TargetVocabularyInput
        words={settings.targetVocabulary}
        onChange={(targetVocabulary) => onChange({ ...settings, targetVocabulary })}
      />
    </div>
  )
}

function TargetVocabularyInput({ words, onChange }: { words: string[]; onChange: (words: string[]) => void }) {
  const [draft, setDraft] = useState('')
  const isFull = words.length >= MAX_TARGET_VOCABULARY

  const addWords = () => {
    const incoming = draft
      .split(',')
      .map((word) => word.trim())
      .filter(Boolean)
    if (incoming.length === 0) return
    const merged = [...words]
    for (const word of incoming) {
      if (merged.length >= MAX_TARGET_VOCABULARY) break
      if (!merged.some((existing) => existing.toLowerCase() === word.toLowerCase())) merged.push(word)
    }
    onChange(merged)
    setDraft('')
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      addWords()
    }
  }

  return (
    <div>
      <label htmlFor="target-vocabulary" className="text-sm font-semibold text-ink-100">
        Target vocabulary
      </label>
      <p className="mt-1 text-xs text-ink-400">
        Words you want the AI to use naturally. Press Enter or add a comma after each one.
      </p>
      <input
        id="target-vocabulary"
        type="text"
        value={draft}
        disabled={isFull}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addWords}
        placeholder={isFull ? `Limit of ${MAX_TARGET_VOCABULARY} words reached` : 'e.g. idempotent, runway, trade-off'}
        className="mt-3 w-full rounded-xl border border-ink-600 bg-ink-950 px-4 py-3 text-sm text-ink-100 transition placeholder:text-ink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 focus:outline-none disabled:opacity-60"
      />
      {words.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Target vocabulary words">
          {words.map((word) => (
            <li
              key={word}
              className="flex items-center gap-1.5 rounded-full border border-pink-500/50 bg-pink-500/15 py-1 pr-1 pl-3 text-xs font-medium text-pink-200"
            >
              {word}
              <button
                type="button"
                aria-label={`Remove ${word}`}
                onClick={() => onChange(words.filter((existing) => existing !== word))}
                className="grid size-5 cursor-pointer place-items-center rounded-full text-pink-200 transition hover:bg-pink-500/30 hover:text-ink-100"
              >
                <X className="size-3" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
