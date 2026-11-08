import { Check, Pencil, X } from 'lucide-react'
import { useState, type KeyboardEvent } from 'react'
import { SPEAKER_STYLES, type SpeakerId } from '../lib/speakers'

interface UserMessageBubbleProps {
  text: string
  speaker: SpeakerId
  showSpeaker: boolean
  canEdit: boolean
  onSave: (text: string) => void
}

export default function UserMessageBubble({ text, speaker, showSpeaker, canEdit, onSave }: UserMessageBubbleProps) {
  const style = SPEAKER_STYLES[speaker]
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(text)
  const trimmedDraft = draft.trim()

  const startEditing = () => {
    setDraft(text)
    setIsEditing(true)
  }

  const save = () => {
    if (!trimmedDraft) return
    setIsEditing(false)
    if (trimmedDraft !== text) onSave(trimmedDraft)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Escape') setIsEditing(false)
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) save()
  }

  return (
    <div className={`max-w-[85%] rounded-2xl rounded-tr-md border p-4 ${style.bubble}`}>
      <div className="mb-1.5 flex items-center justify-between gap-4">
        <p className={`text-xs font-semibold ${style.nameText}`}>{showSpeaker ? `${style.label} (${style.role})` : 'You'}</p>
        {canEdit && !isEditing && (
          <button
            type="button"
            onClick={startEditing}
            aria-label="Edit message"
            className="flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-pink-200 transition hover:bg-pink-500/20 hover:text-ink-100"
          >
            <Pencil className="size-3.5" aria-hidden="true" />
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="flex flex-col gap-3">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            aria-label="Edit your message"
            className="w-full resize-y rounded-xl border border-pink-500/50 bg-ink-950 p-3 text-sm leading-relaxed text-ink-100 focus:ring-2 focus:ring-pink-500/30 focus:outline-none"
          />
          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-ink-600 px-3 py-1.5 text-xs font-medium text-ink-200 transition hover:bg-ink-800"
            >
              <X className="size-3.5" aria-hidden="true" />
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              disabled={!trimmedDraft}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-pink-500 px-3 py-1.5 text-xs font-semibold text-ink-950 transition hover:bg-pink-400 disabled:cursor-not-allowed disabled:bg-ink-700 disabled:text-ink-400"
            >
              <Check className="size-3.5" aria-hidden="true" />
              Resend
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm leading-relaxed text-ink-100">{text}</p>
      )}
    </div>
  )
}
