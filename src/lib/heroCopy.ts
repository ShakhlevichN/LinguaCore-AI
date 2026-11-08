import { CASUAL_CATEGORY_ID } from './scenarios'

export type HeroTheme = 'technical' | 'startup' | 'casual' | 'custom'

export interface HeroCopy {
  title: string
  subtitle: string
}

export const HERO_COPY: Record<HeroTheme, HeroCopy> = {
  technical: {
    title: 'Master technical interviews out loud',
    subtitle: 'Tackle tough engineering questions, edge cases, and refine your technical terminology.',
  },
  startup: {
    title: 'Pitch your startup & defend your metrics',
    subtitle: 'Defend your unit economics, convince venture capitalists, and master persuasive delivery.',
  },
  casual: {
    title: 'Converse freely & debate on one device',
    subtitle: 'Casual discussions, spontaneous debates, or duo practice with live AI coaching.',
  },
  custom: {
    title: 'Simulate your own custom roleplay',
    subtitle: 'Practice any custom scenario with your own tailored personas and target vocabulary.',
  },
}

export function heroThemeForCategory(categoryId: string): HeroTheme {
  if (categoryId === 'startup-pitch') return 'startup'
  if (categoryId === CASUAL_CATEGORY_ID) return 'casual'
  if (categoryId === 'custom') return 'custom'
  return 'technical'
}
