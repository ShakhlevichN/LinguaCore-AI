import { AudioWaveform, CreditCard, LayoutDashboard, Mic, type LucideIcon } from 'lucide-react'

export type Tab = 'arena' | 'dashboard' | 'pricing'

const SHOW_PRICING = false

const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: 'arena', label: 'AI Voice Arena', icon: Mic },
  { id: 'dashboard', label: 'Skills Dashboard', icon: LayoutDashboard },
  { id: 'pricing', label: 'Pricing', icon: CreditCard },
]

const VISIBLE_TABS = TABS.filter((tab) => SHOW_PRICING || tab.id !== 'pricing')

interface HeaderProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-ink-700/60 bg-ink-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-pink-500 text-ink-950 shadow-[0_0_24px_rgba(255,46,147,0.45)]">
              <AudioWaveform className="size-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold tracking-tight text-ink-100">
              LinguaCore <span className="text-pink-400">AI</span>
            </span>
          </div>
          <span className="rounded-full border border-pink-500/40 bg-pink-500/10 px-2.5 py-0.5 text-xs font-medium text-pink-300">
            Beta
          </span>
          <span className="rounded-full border border-lilac-400/30 bg-lilac-400/10 px-2.5 py-0.5 text-xs font-medium text-lilac-300">
            CEFR-aligned
          </span>
        </div>

        <nav
          aria-label="Main"
          className="flex gap-1 overflow-x-auto rounded-2xl bg-ink-900 p-1 ring-1 ring-ink-700"
        >
          {VISIBLE_TABS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => onTabChange(id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex flex-1 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-sm transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-300 lg:flex-none ${
                  isActive
                    ? 'bg-pink-500 font-semibold text-ink-950 shadow-[0_0_20px_rgba(255,46,147,0.35)]'
                    : 'font-medium text-ink-300 hover:bg-ink-800 hover:text-ink-100'
                }`}
              >
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
