import { supabase } from './supabase'
import type { CefrLevel, GrammarCorrection, PowerVocabulary } from './speechFeedback'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export interface PracticeSessionInput {
  topic: string
  transcript: string
  cefrLevel: CefrLevel
  corrections: GrammarCorrection[]
  vocabulary: PowerVocabulary[]
  fluencyScore: number
  grammarAccuracy: number
}

export interface PracticeSessionRow {
  id: string
  topic: string
  transcript: string
  cefr_level: CefrLevel
  grammar_corrections: GrammarCorrection[]
  vocabulary_suggestions: PowerVocabulary[]
  fluency_score: number | null
  grammar_accuracy: number | null
  created_at: string
}

const SESSION_COLUMNS =
  'id, topic, transcript, cefr_level, grammar_corrections, vocabulary_suggestions, fluency_score, grammar_accuracy, created_at'

const STATS_ROW_LIMIT = 500

export async function savePracticeSession(input: PracticeSessionInput): Promise<void> {
  const { error } = await supabase.from('practice_sessions').insert({
    topic: input.topic,
    transcript: input.transcript,
    cefr_level: input.cefrLevel,
    grammar_corrections: input.corrections,
    vocabulary_suggestions: input.vocabulary,
    fluency_score: input.fluencyScore,
    grammar_accuracy: input.grammarAccuracy,
  })
  if (error) throw error
}

export async function fetchRecentPracticeSessions(limit: number) {
  const { data, error, count } = await supabase
    .from('practice_sessions')
    .select(SESSION_COLUMNS, { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  if (!Array.isArray(data)) throw new Error('Unexpected response from the server')

  return { rows: data as PracticeSessionRow[], total: count ?? data.length }
}

export async function fetchAllPracticeSessions(): Promise<PracticeSessionRow[]> {
  const { data, error } = await supabase
    .from('practice_sessions')
    .select(SESSION_COLUMNS)
    .order('created_at', { ascending: false })
    .limit(STATS_ROW_LIMIT)

  if (error) throw error
  if (!Array.isArray(data)) throw new Error('Unexpected response from the server')

  return data as PracticeSessionRow[]
}
