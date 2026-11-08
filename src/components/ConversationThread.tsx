import { Eye, Headphones, Volume2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { ChatEntry } from '../hooks/useRoleplay'
import { speakText } from '../lib/voiceOutput'
import TargetWordText from './TargetWordText'
import UserMessageBubble from './UserMessageBubble'

interface ConversationThreadProps {
  messages: ChatEntry[]
  isBusy: boolean
  speakerName: string
  targetVocabulary: string[]
  canEditMessages: boolean
  showSpeakers: boolean
  onEditMessage: (id: string, text: string) => void
}

export default function ConversationThread({
  messages,
  isBusy,
  speakerName,
  targetVocabulary,
  canEditMessages,
  showSpeakers,
  onEditMessage,
}: ConversationThreadProps) {
  const [blindMode, setBlindMode] = useState(false)
  const [revealedIds, setRevealedIds] = useState<Set<string>>(() => new Set())
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages.length, isBusy])

  const reveal = (id: string) => {
    setRevealedIds((prev) => new Set(prev).add(id))
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink-700 bg-ink-950/60 p-3 pl-4">
        <div className="flex items-center gap-2 text-sm font-medium text-ink-200">
          <Headphones className="size-4 text-lilac-300" aria-hidden="true" />
          Blind Mode / Hide AI Text
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={blindMode}
          onClick={() => setBlindMode((value) => !value)}
          className={`relative inline-flex h-7 w-12 cursor-pointer items-center rounded-full transition duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-300 ${
            blindMode ? 'bg-pink-500' : 'bg-ink-600'
          }`}
        >
          <span
            className={`inline-block size-5 rounded-full bg-ink-100 shadow transition duration-300 ${
              blindMode ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
          <span className="sr-only">{blindMode ? 'Blind mode on' : 'Blind mode off'}</span>
        </button>
      </div>

      <ol className="flex max-h-[28rem] min-h-72 flex-col gap-4 overflow-y-auto pr-1" aria-label="Conversation">
        {messages.length === 0 && isBusy && (
          <li className="self-start text-sm text-ink-400" role="status">
            Connecting to your {speakerName.toLowerCase()}...
          </li>
        )}

        {messages.map((message) => {
          if (message.role === 'user') {
            return (
              <li key={message.id} className="flex justify-end">
                <UserMessageBubble
                  text={message.text}
                  speaker={message.speaker ?? 1}
                  showSpeaker={showSpeakers}
                  canEdit={canEditMessages}
                  onSave={(text) => onEditMessage(message.id, text)}
                />
              </li>
            )
          }

          const isHidden = blindMode && !revealedIds.has(message.id)
          return (
            <li key={message.id} className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl rounded-tl-md border border-ink-700 bg-ink-800 p-4">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <p className="text-xs font-semibold text-lilac-300">{speakerName}</p>
                  <button
                    type="button"
                    onClick={() => speakText(message.text)}
                    aria-label="Replay audio"
                    className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-ink-300 transition hover:bg-ink-700 hover:text-ink-100"
                  >
                    <Volume2 className="size-3.5" aria-hidden="true" />
                    Replay audio
                  </button>
                </div>
                {isHidden ? (
                  <div className="flex flex-col items-start gap-3">
                    <p className="text-sm text-ink-300">Listen closely. The text is hidden.</p>
                    <button
                      type="button"
                      onClick={() => reveal(message.id)}
                      className="flex cursor-pointer items-center gap-2 rounded-lg border border-ink-600 px-3 py-1.5 text-xs font-medium text-ink-200 transition hover:border-pink-500 hover:text-pink-300"
                    >
                      <Eye className="size-3.5" aria-hidden="true" />
                      Click to reveal text
                    </button>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed text-ink-100">
                    <TargetWordText text={message.text} words={targetVocabulary} />
                  </p>
                )}
              </div>
            </li>
          )
        })}

        {messages.length > 0 && isBusy && (
          <li className="flex justify-start" role="status" aria-live="polite">
            <span className="flex items-center gap-1.5 rounded-2xl bg-ink-800 px-4 py-3 text-xs text-ink-400">
              <span className="size-1.5 animate-pulse rounded-full bg-lilac-300" aria-hidden="true" />
              <span className="size-1.5 animate-pulse rounded-full bg-lilac-300 [animation-delay:150ms]" aria-hidden="true" />
              <span className="size-1.5 animate-pulse rounded-full bg-lilac-300 [animation-delay:300ms]" aria-hidden="true" />
              {speakerName} is responding
            </span>
          </li>
        )}
        <div ref={endRef} />
      </ol>
    </div>
  )
}
