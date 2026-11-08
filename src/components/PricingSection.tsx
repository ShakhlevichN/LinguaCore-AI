import { Check } from 'lucide-react'

interface PricingSectionProps {
  onStartFree: () => void
}

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Try the AI Voice Arena and see where your English stands.',
    features: [
      '3 voice practice sessions per day',
      'Grammar corrections with highlights',
      'Estimated CEFR level after each session',
      'Basic skills dashboard',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$14.99',
    period: 'per month',
    description: 'Unlimited coaching for learners who practice every day.',
    features: [
      'Unlimited voice practice sessions',
      'Advanced CEFR tracking over time',
      'Personalized vocabulary decks',
      'Full skills dashboard and streak insights',
    ],
  },
  {
    id: 'credits',
    name: 'Pay-as-you-go',
    price: '$5',
    period: 'for 120 credit tokens',
    description: 'Buy tokens only when you need them. No subscription.',
    features: [
      '1 token = one AI feedback session',
      'Credits never expire',
      'Works alongside the Free plan',
      'Top up any time',
    ],
  },
] as const

export default function PricingSection({ onStartFree }: PricingSectionProps) {
  return (
    <div className="flex flex-col gap-10">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-pink-400">Pricing</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-ink-100 sm:text-4xl">
          Pick the way you want to learn
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ink-300">
          Start free, go unlimited with Pro, or pay only for the sessions you use.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => {
          const isPro = plan.id === 'pro'
          return (
            <article
              key={plan.id}
              className={`relative flex flex-col rounded-3xl border p-7 transition duration-300 hover:-translate-y-1 ${
                isPro
                  ? 'border-pink-500 bg-ink-900 shadow-[0_0_48px_-8px_rgba(255,46,147,0.45)] ring-1 ring-pink-500/60'
                  : 'border-ink-700 bg-ink-900/70 hover:border-lilac-400/40'
              }`}
            >
              {isPro && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-pink-500 px-3 py-1 text-xs font-bold text-ink-950">
                  Most popular
                </span>
              )}
              <h2 className="text-lg font-semibold text-ink-100">{plan.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-400">{plan.description}</p>

              <p className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight text-ink-100">{plan.price}</span>
                <span className="text-sm text-ink-400">{plan.period}</span>
              </p>

              <ul className="mt-6 flex flex-1 flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-ink-300">
                    <Check className={`mt-0.5 size-4 shrink-0 ${isPro ? 'text-pink-400' : 'text-lilac-300'}`} aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>

              {plan.id === 'free' ? (
                <button
                  type="button"
                  onClick={onStartFree}
                  className="mt-8 w-full cursor-pointer rounded-xl border border-ink-600 px-5 py-3 text-sm font-semibold text-ink-100 transition hover:border-pink-500 hover:bg-ink-800 active:scale-95"
                >
                  Start free
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className={`mt-8 w-full rounded-xl px-5 py-3 text-sm font-semibold transition ${
                    isPro
                      ? 'bg-pink-500 text-ink-950 disabled:bg-pink-500/60'
                      : 'bg-lilac-400 text-ink-950 disabled:bg-lilac-400/60'
                  } cursor-not-allowed`}
                >
                  Coming soon
                </button>
              )}
            </article>
          )
        })}
      </div>
    </div>
  )
}
