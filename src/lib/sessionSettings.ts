export type ConversationMode = 'candidate' | 'interviewer'

export type ParticipantMode = 'solo' | 'duo'

export interface SessionSettings {
  mode: ConversationMode
  participants: ParticipantMode
  maxTurns: number | null
  targetVocabulary: string[]
}

export interface SessionLengthOption {
  label: string
  turns: number | null
}

export const SESSION_LENGTH_OPTIONS: SessionLengthOption[] = [
  { label: 'Sprint', turns: 3 },
  { label: 'Standard', turns: 6 },
  { label: 'Deep Dive', turns: 10 },
  { label: 'Unlimited', turns: null },
]

export const MAX_TARGET_VOCABULARY = 12

export const DEFAULT_SESSION_SETTINGS: SessionSettings = {
  mode: 'candidate',
  participants: 'solo',
  maxTurns: 6,
  targetVocabulary: [],
}
