interface TargetWordTextProps {
  text: string
  words: string[]
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export default function TargetWordText({ text, words }: TargetWordTextProps) {
  if (words.length === 0) return text

  const alternatives = [...words].sort((a, b) => b.length - a.length).map(escapeRegExp).join('|')
  const parts = text.split(new RegExp(`(${alternatives})`, 'gi'))

  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <mark
        key={index}
        className="rounded-md bg-pink-500/20 px-1.5 py-0.5 font-semibold text-pink-200 ring-1 ring-pink-500/70 shadow-[0_0_12px_rgba(255,46,147,0.45)]"
      >
        {part}
      </mark>
    ) : (
      <span key={index}>{part}</span>
    ),
  )
}
