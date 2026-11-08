import { HERO_COPY, type HeroTheme } from '../lib/heroCopy'

interface HeroHeadingProps {
  theme: HeroTheme
}

export default function HeroHeading({ theme }: HeroHeadingProps) {
  const copy = HERO_COPY[theme]
  return (
    <div key={theme} className="animate-fade-up">
      <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-ink-100 sm:text-4xl">{copy.title}</h1>
      <p className="mt-3 text-base leading-relaxed text-ink-300">{copy.subtitle}</p>
    </div>
  )
}
