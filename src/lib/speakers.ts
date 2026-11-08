export type SpeakerId = 1 | 2

export interface SpeakerStyle {
  label: string
  role: string
  bubble: string
  nameText: string
  micButton: string
  micRing: string
  micGlow: string
  switchButton: string
}

export const SPEAKER_STYLES: Record<SpeakerId, SpeakerStyle> = {
  1: {
    label: 'Speaker 1',
    role: 'Primary',
    bubble: 'border-pink-500/30 bg-pink-500/15',
    nameText: 'text-pink-300',
    micButton: 'bg-pink-500 text-ink-950 shadow-[0_0_40px_rgba(255,46,147,0.45)] hover:bg-pink-400',
    micRing: 'border-pink-500',
    micGlow: 'bg-pink-500/30',
    switchButton: 'border-pink-500/50 text-pink-200 hover:bg-pink-500/15',
  },
  2: {
    label: 'Speaker 2',
    role: 'Partner',
    bubble: 'border-cyan-400/30 bg-cyan-400/15',
    nameText: 'text-cyan-300',
    micButton: 'bg-cyan-400 text-ink-950 shadow-[0_0_40px_rgba(34,211,238,0.45)] hover:bg-cyan-300',
    micRing: 'border-cyan-400',
    micGlow: 'bg-cyan-400/30',
    switchButton: 'border-cyan-400/50 text-cyan-200 hover:bg-cyan-400/15',
  },
}
