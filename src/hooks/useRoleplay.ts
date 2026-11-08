import { useRef, useState } from 'react'
import { savePracticeSession, type SaveStatus } from '../lib/practiceSessions'
import type { Scenario } from '../lib/scenarios'
import { DEFAULT_SESSION_SETTINGS, type SessionSettings } from '../lib/sessionSettings'
import {
  grammarAccuracyFromCorrections,
  type SpeechFeedback,
} from '../lib/speechFeedback'
import { requestRoleplayTurn, type ConversationEntry } from '../lib/roleplayTurn'
import type { SpeakerId } from '../lib/speakers'
import { speakText, stopSpeaking } from '../lib/voiceOutput'

export interface ChatEntry extends ConversationEntry {
  id: string
}

export function useRoleplay() {
  const [scenario, setScenario] = useState<Scenario | null>(null)
  const [settings, setSettings] = useState<SessionSettings>(DEFAULT_SESSION_SETTINGS)
  const [messages, setMessages] = useState<ChatEntry[]>([])
  const [feedback, setFeedback] = useState<SpeechFeedback | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const requestIdRef = useRef(0)
  const idCounterRef = useRef(0)

  const nextId = () => {
    idCounterRef.current += 1
    return `msg-${idCounterRef.current}`
  }

  const runTurn = async (active: Scenario, activeSettings: SessionSettings, history: ChatEntry[]) => {
    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId
    const isCurrent = () => requestId === requestIdRef.current
    setIsAnalyzing(true)
    setError(null)
    setSaveStatus('idle')

    try {
      const result = await requestRoleplayTurn(active, activeSettings, history)
      if (!isCurrent()) return

      setMessages([...history, { id: nextId(), role: 'ai', text: result.reply }])
      setFeedback(result.feedback)
      setIsAnalyzing(false)
      speakText(result.reply)

      const learnerEntry = history.at(-1)
      const isPrimarySpeaker = (learnerEntry?.speaker ?? 1) === 1
      if (result.feedback && learnerEntry?.role === 'user' && isPrimarySpeaker) {
        setSaveStatus('saving')
        try {
          await savePracticeSession({
            topic: `${active.category.label}: ${active.role.label}`,
            transcript: learnerEntry.text,
            cefrLevel: result.feedback.cefrLevel,
            corrections: result.feedback.corrections,
            vocabulary: result.feedback.powerVocabulary,
            fluencyScore: result.feedback.clarityScore,
            grammarAccuracy: grammarAccuracyFromCorrections(result.feedback.corrections.length),
          })
          if (isCurrent()) setSaveStatus('saved')
        } catch {
          if (isCurrent()) setSaveStatus('error')
        }
      }
    } catch (err) {
      if (!isCurrent()) return
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      if (isCurrent()) setIsAnalyzing(false)
    }
  }

  const startConversation = (next: Scenario, nextSettings: SessionSettings) => {
    setScenario(next)
    setSettings(nextSettings)
    setMessages([])
    setFeedback(null)
    void runTurn(next, nextSettings, [])
  }

  const sendTurn = (text: string, speaker: SpeakerId) => {
    if (!scenario) return
    const next = [...messages, { id: nextId(), role: 'user' as const, text, speaker }]
    setMessages(next)
    void runTurn(scenario, settings, next)
  }

  const editTurn = (id: string, text: string) => {
    const index = messages.findIndex((message) => message.id === id)
    const target = messages[index]
    const trimmed = text.trim()
    if (!scenario || isAnalyzing || index < 0 || target.role !== 'user' || !trimmed) return
    const next = [...messages.slice(0, index), { ...target, text: trimmed }]
    setMessages(next)
    void runTurn(scenario, settings, next)
  }

  const retry = () => {
    if (scenario) void runTurn(scenario, settings, messages)
  }

  const resetConversation = () => {
    requestIdRef.current += 1
    stopSpeaking()
    setScenario(null)
    setMessages([])
    setFeedback(null)
    setIsAnalyzing(false)
    setError(null)
    setSaveStatus('idle')
  }

  return {
    scenario,
    settings,
    messages,
    feedback,
    isAnalyzing,
    error,
    saveStatus,
    startConversation,
    sendTurn,
    editTurn,
    retry,
    resetConversation,
  }
}
