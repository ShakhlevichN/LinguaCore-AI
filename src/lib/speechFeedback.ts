export const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const
export type CefrLevel = (typeof CEFR_LEVELS)[number]

export interface GrammarCorrection {
  original: string
  corrected: string
  note: string
}

export interface PowerVocabulary {
  term: string
  meaning: string
  example: string
}

export interface SpeechFeedback {
  cefrLevel: CefrLevel
  corrections: GrammarCorrection[]
  polishedVersion: string
  powerVocabulary: PowerVocabulary[]
  encouragement: string
  clarityScore: number
  phoneticTips: string[]
  flaggedWords: string[]
}

export function grammarAccuracyFromCorrections(correctionCount: number): number {
  return Math.max(0, 100 - 15 * correctionCount)
}
