import { useState } from 'react'
import Header, { type Tab } from './components/Header'
import VoiceArena from './components/VoiceArena'
import SkillsDashboard from './components/SkillsDashboard'
import PricingSection from './components/PricingSection'

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('arena')

  return (
    <div className="relative min-h-screen">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(255,46,147,0.16),transparent_40%),radial-gradient(circle_at_88%_8%,rgba(200,162,255,0.12),transparent_35%)]"
      />
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="relative mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div hidden={activeTab !== 'arena'}>
          <VoiceArena />
        </div>
        <div key={activeTab} className="animate-fade-up">
          {activeTab === 'dashboard' && <SkillsDashboard />}
          {activeTab === 'pricing' && (
            <PricingSection onStartFree={() => setActiveTab('arena')} />
          )}
        </div>
      </main>
    </div>
  )
}
