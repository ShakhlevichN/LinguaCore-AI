import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import CustomScenarioForm from './CustomScenarioForm'
import SessionSettingsForm from './SessionSettingsForm'
import {
  buildCustomScenario,
  CASUAL_CATEGORY_ID,
  SCENARIO_CATEGORIES,
  type CustomScenarioInput,
  type Scenario,
  type ScenarioCategory,
  type ScenarioRole,
} from '../lib/scenarios'
import { heroThemeForCategory, type HeroTheme } from '../lib/heroCopy'
import { DEFAULT_SESSION_SETTINGS, type SessionSettings } from '../lib/sessionSettings'

interface ScenarioPickerProps {
  onStart: (scenario: Scenario, settings: SessionSettings) => void
  onThemeChange: (theme: HeroTheme) => void
}

type ScenarioSource = 'preset' | 'custom'

const EMPTY_CUSTOM: CustomScenarioInput = { topic: '', persona: '', myRole: '', goal: '' }

export default function ScenarioPicker({ onStart, onThemeChange }: ScenarioPickerProps) {
  const [source, setSource] = useState<ScenarioSource>('preset')
  const [category, setCategory] = useState<ScenarioCategory>(SCENARIO_CATEGORIES[0])
  const [role, setRole] = useState<ScenarioRole>(SCENARIO_CATEGORIES[0].roles[0])
  const [custom, setCustom] = useState<CustomScenarioInput>(EMPTY_CUSTOM)
  const [settings, setSettings] = useState<SessionSettings>(DEFAULT_SESSION_SETTINGS)

  const isCasual = source === 'preset' && category.id === CASUAL_CATEGORY_ID
  const isCustomReady =
    custom.topic.trim().length > 0 && custom.persona.trim().length > 0 && custom.myRole.trim().length > 0
  const canStart = source === 'preset' || isCustomReady

  const selectSource = (next: ScenarioSource) => {
    setSource(next)
    onThemeChange(next === 'custom' ? 'custom' : heroThemeForCategory(category.id))
  }

  const selectCategory = (next: ScenarioCategory) => {
    setCategory(next)
    setRole(next.roles[0])
    onThemeChange(heroThemeForCategory(next.id))
  }

  const handleStart = () => {
    if (source === 'custom') {
      onStart(buildCustomScenario(custom), { ...settings, participants: 'solo' })
    } else if (isCasual) {
      onStart({ category, role, goal: null, learnerRole: null }, { ...settings, mode: 'candidate' })
    } else {
      onStart({ category, role, goal: null, learnerRole: null }, { ...settings, participants: 'solo' })
    }
  }

  return (
    <section className="flex flex-col gap-8 rounded-3xl border border-ink-700 bg-ink-900/70 p-6 backdrop-blur sm:p-8">
      <div>
        <h2 className="text-base font-semibold text-ink-100">1. Choose a scenario</h2>
        <div role="tablist" aria-label="Scenario source" className="mt-4 inline-flex rounded-xl border border-ink-600 bg-ink-950 p-1">
          {(['preset', 'custom'] as const).map((option) => {
            const isSelected = option === source
            return (
              <button
                key={option}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => selectSource(option)}
                className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition duration-200 ${
                  isSelected ? 'bg-pink-500 text-ink-950' : 'text-ink-300 hover:text-ink-100'
                }`}
              >
                {option === 'preset' ? 'Preset Roles' : 'Custom Scenario'}
              </button>
            )
          })}
        </div>

        {source === 'preset' ? (
          <PresetScenarioPicker
            category={category}
            role={role}
            onSelectCategory={selectCategory}
            onSelectRole={setRole}
          />
        ) : (
          <div className="mt-6">
            <CustomScenarioForm value={custom} onChange={setCustom} />
          </div>
        )}
      </div>

      <div>
        <h2 className="text-base font-semibold text-ink-100">2. Set up your session</h2>
        <div className="mt-4">
          <SessionSettingsForm settings={settings} isCasual={isCasual} isCustom={source === 'custom'} onChange={setSettings} />
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-ink-700 bg-ink-950/60 p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-ink-300">
          {source === 'preset' ? (
            <>
              You will talk with a <span className="font-semibold text-lilac-300">{role.speaker}</span> about{' '}
              <span className="font-semibold text-ink-100">{role.label}</span>.
            </>
          ) : (
            <>
              Your scenario is <span className="font-semibold text-ink-100">{custom.topic.trim() || 'not named yet'}</span>
              . You will play <span className="font-semibold text-lilac-300">{custom.myRole.trim() || 'your role'}</span>
              {' '}and the AI will play <span className="font-semibold text-lilac-300">{custom.persona.trim() || 'its persona'}</span>.
            </>
          )}{' '}
          {source === 'custom' ? null : isCasual
            ? settings.participants === 'duo'
              ? 'Two people take turns on this device while the AI coaches every message.'
              : 'Chat freely and the AI replies and coaches you.'
            : settings.mode === 'candidate'
              ? 'The AI asks the questions and you answer.'
              : 'You ask the questions and the AI answers as the candidate.'}
        </p>
        <button
          type="button"
          onClick={handleStart}
          disabled={!canStart}
          className="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-pink-500 px-5 py-3 text-sm font-semibold text-ink-950 shadow-[0_0_24px_rgba(255,46,147,0.3)] transition hover:bg-pink-400 active:scale-95 disabled:cursor-not-allowed disabled:bg-ink-700 disabled:text-ink-400 disabled:shadow-none"
        >
          Start conversation
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}

interface PresetScenarioPickerProps {
  category: ScenarioCategory
  role: ScenarioRole
  onSelectCategory: (category: ScenarioCategory) => void
  onSelectRole: (role: ScenarioRole) => void
}

function PresetScenarioPicker({ category, role, onSelectCategory, onSelectRole }: PresetScenarioPickerProps) {
  return (
    <div className="mt-6 flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {SCENARIO_CATEGORIES.map((option) => {
          const isSelected = option.id === category.id
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelectCategory(option)}
              className={`flex h-full cursor-pointer flex-col items-start gap-2 rounded-2xl border p-4 text-left transition duration-200 ${
                isSelected
                  ? 'border-pink-500 bg-pink-500/10 shadow-[0_0_24px_-6px_rgba(255,46,147,0.5)]'
                  : 'border-ink-700 bg-ink-800/50 hover:border-lilac-400/40 hover:bg-ink-800'
              }`}
            >
              <span className="text-sm font-semibold text-ink-100">{option.label}</span>
              <span className="text-xs leading-relaxed text-ink-400">{option.description}</span>
            </button>
          )
        })}
      </div>
      <div className="flex flex-wrap gap-2">
        {category.roles.map((option) => {
          const isSelected = option.id === role.id
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelectRole(option)}
              className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition duration-200 ${
                isSelected
                  ? 'border-lilac-300 bg-lilac-400/15 text-lilac-300'
                  : 'border-ink-600 text-ink-300 hover:border-ink-400 hover:text-ink-100'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
