import { CircleCheck, RotateCcw } from 'lucide-react'
import { useRef, useState } from 'react'
import { useRoleplay } from '../hooks/useRoleplay'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { CASUAL_CATEGORY_ID, type Scenario } from '../lib/scenarios'
import { heroThemeForCategory, type HeroTheme } from '../lib/heroCopy'
import type { SessionSettings } from '../lib/sessionSettings'
import { SPEAKER_STYLES, type SpeakerId } from '../lib/speakers'
import { stopSpeaking } from '../lib/voiceOutput'
import ConversationThread from './ConversationThread'
import CoachPanel from './CoachPanel'
import HeroHeading from './HeroHeading'
import PronunciationCard from './PronunciationCard'
import ScenarioPicker from './ScenarioPicker'
import TurnComposer from './TurnComposer'

export default function VoiceArena() {
  const roleplay = useRoleplay()
  const [transcript, setTranscript] = useState('')
  const transcriptRef = useRef('')
  const speechStartRef = useRef<number | null>(null)
  const [wordsPerMinute, setWordsPerMinute] = useState<number | null>(null)
  const [setupTheme, setSetupTheme] = useState<HeroTheme>('technical')
  const [activeSpeaker, setActiveSpeaker] = useState<SpeakerId>(1)

  const updateTranscript = (text: string) => {
    transcriptRef.current = text
    setTranscript(text)
  }

  const recordPace = (text: string) => {
    const words = text.trim().split(/\s+/).filter(Boolean).length
    const startedAt = speechStartRef.current
    speechStartRef.current = null
    if (startedAt === null || words === 0) return
    const minutes = (Date.now() - startedAt) / 60000
    if (minutes > 0) setWordsPerMinute(Math.round(words / minutes))
  }

  const submitAnswer = (text: string, speaker: SpeakerId) => {
    const trimmed = text.trim()
    if (!trimmed || roleplay.isAnalyzing) return
    updateTranscript('')
    roleplay.sendTurn(trimmed, speaker)
  }

  const speech = useSpeechRecognition({
    onTranscript: updateTranscript,
    onEnd: () => {
      recordPace(transcriptRef.current)
      submitAnswer(transcriptRef.current, activeSpeaker)
    },
  })

  const handleStart = (scenario: Scenario, settings: SessionSettings) => {
    updateTranscript('')
    setWordsPerMinute(null)
    setActiveSpeaker(1)
    roleplay.startConversation(scenario, settings)
  }

  const handleMicToggle = () => {
    if (speech.isListening) {
      speech.stop()
    } else {
      stopSpeaking()
      speechStartRef.current = Date.now()
      speech.start(transcriptRef.current)
    }
  }

  const handleNewConversation = () => {
    updateTranscript('')
    setWordsPerMinute(null)
    setActiveSpeaker(1)
    setSetupTheme('technical')
    roleplay.resetConversation()
  }

  const isBusy = roleplay.isAnalyzing
  const { maxTurns, mode, targetVocabulary, participants } = roleplay.settings
  const isCasual = roleplay.scenario?.category.id === CASUAL_CATEGORY_ID
  const isDuo = participants === 'duo'
  const learnerTurns = roleplay.messages.filter((message) => message.role === 'user').length
  const isComplete = maxTurns !== null && learnerTurns >= maxTurns && !isBusy
  const currentTurn = maxTurns === null ? learnerTurns + 1 : Math.min(learnerTurns + 1, maxTurns)
  const turnLabel = maxTurns === null ? `Turn ${currentTurn}` : `Turn ${currentTurn} of ${maxTurns}`
  const speakerName = mode === 'interviewer' ? 'Candidate' : (roleplay.scenario?.role.speaker ?? 'Partner')
  const heroTheme = roleplay.scenario ? heroThemeForCategory(roleplay.scenario.category.id) : setupTheme
  const lastLearnerSpeaker = roleplay.messages.filter((message) => message.role === 'user').at(-1)?.speaker

  return (
    <div className="flex flex-col gap-8">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-pink-400">AI Voice Roleplay</p>
        <HeroHeading theme={heroTheme} />
      </div>

      {roleplay.scenario ? (
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <section className="flex min-w-0 flex-col gap-6 rounded-3xl border border-ink-700 bg-ink-900/70 p-6 backdrop-blur sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-lilac-300">
                  {roleplay.scenario.category.label}
                </p>
                <h2 className="mt-1 text-base font-semibold text-ink-100">{roleplay.scenario.role.label}</h2>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {!isCasual && (
                    <span className="rounded-full border border-lilac-400/40 bg-lilac-400/10 px-3 py-1 text-xs font-semibold text-lilac-300">
                      {mode === 'interviewer' ? 'You are the interviewer' : 'You are the candidate'}
                    </span>
                  )}
                  {isDuo && (
                    <span className="rounded-full border border-cyan-400/50 bg-cyan-400/15 px-3 py-1 text-xs font-semibold text-cyan-200">
                      Duo mode
                    </span>
                  )}
                  <span className="rounded-full border border-pink-500/50 bg-pink-500/15 px-3 py-1 text-xs font-semibold text-pink-200">
                    {turnLabel}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleNewConversation}
                disabled={speech.isListening}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-ink-600 px-4 py-2 text-sm font-medium text-ink-200 transition hover:border-ink-400 hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                New interview
              </button>
            </div>

            {roleplay.scenario.goal && (
              <p className="rounded-xl border border-ink-700 bg-ink-950/60 px-4 py-3 text-sm text-ink-300">
                <span className="font-semibold text-ink-100">Your goal:</span> {roleplay.scenario.goal}
              </p>
            )}

            <ConversationThread
              messages={roleplay.messages}
              isBusy={isBusy}
              speakerName={speakerName}
              targetVocabulary={targetVocabulary}
              canEditMessages={!isBusy && !speech.isListening}
              showSpeakers={isDuo}
              onEditMessage={roleplay.editTurn}
            />

            {roleplay.error && (
              <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-400/40 bg-rose-400/10 px-4 py-3">
                <p className="text-sm text-rose-300">{roleplay.error}</p>
                <button
                  type="button"
                  onClick={roleplay.retry}
                  className="cursor-pointer rounded-lg border border-rose-400/50 px-3 py-1.5 text-xs font-medium text-rose-200 transition hover:bg-rose-400/10"
                >
                  Try again
                </button>
              </div>
            )}

            {isComplete && (
              <p className="flex items-center gap-2 rounded-xl border border-lilac-400/30 bg-lilac-400/10 px-4 py-3 text-sm text-lilac-300">
                <CircleCheck className="size-4 shrink-0" aria-hidden="true" />
                Conversation complete. Start a new one to practice again.
              </p>
            )}

            <TurnComposer
              transcript={transcript}
              onTranscriptChange={updateTranscript}
              isListening={speech.isListening}
              isSupported={speech.isSupported}
              isBusy={isBusy || isComplete}
              speechError={speech.error}
              onMicToggle={handleMicToggle}
              onSend={() => submitAnswer(transcriptRef.current, activeSpeaker)}
              onClear={() => updateTranscript('')}
              speakerControl={
                isDuo
                  ? {
                      active: activeSpeaker,
                      disabled: isBusy || isComplete,
                      onSwitch: () => setActiveSpeaker((current) => (current === 1 ? 2 : 1)),
                    }
                  : undefined
              }
            />
          </section>

          <div className="flex flex-col gap-6 lg:sticky lg:top-28">
            <PronunciationCard
              clarityScore={roleplay.feedback?.clarityScore ?? null}
              wordsPerMinute={wordsPerMinute}
              phoneticTips={roleplay.feedback?.phoneticTips ?? []}
              flaggedWords={roleplay.feedback?.flaggedWords ?? []}
            />
            <CoachPanel
              feedback={roleplay.feedback}
              isAnalyzing={isBusy}
              saveStatus={roleplay.saveStatus}
              speakerLabel={isDuo && lastLearnerSpeaker ? SPEAKER_STYLES[lastLearnerSpeaker].label : undefined}
            />
          </div>
        </div>
      ) : (
        <ScenarioPicker onStart={handleStart} onThemeChange={setSetupTheme} />
      )}
    </div>
  )
}
