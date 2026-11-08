import type { CustomScenarioInput } from '../lib/scenarios'

interface CustomScenarioFormProps {
  value: CustomScenarioInput
  onChange: (next: CustomScenarioInput) => void
}

const FIELD_CLASS =
  'mt-2 w-full rounded-xl border border-ink-600 bg-ink-950 px-4 py-3 text-sm text-ink-100 transition placeholder:text-ink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 focus:outline-none'

export default function CustomScenarioForm({ value, onChange }: CustomScenarioFormProps) {
  const update = (field: keyof CustomScenarioInput) => (event: { target: { value: string } }) =>
    onChange({ ...value, [field]: event.target.value })

  return (
    <div className="grid gap-5">
      <p className="text-xs text-ink-400">
        You can write any field in English or Russian. The whole conversation and coaching stay in English.
      </p>
      <div>
        <label htmlFor="custom-topic" className="text-sm font-medium text-ink-200">
          Scenario topic
        </label>
        <input
          id="custom-topic"
          type="text"
          maxLength={80}
          value={value.topic}
          onChange={update('topic')}
          placeholder="e.g. Medical Consultation, Visa Interview, Design System Review"
          className={FIELD_CLASS}
        />
      </div>
      <div>
        <label htmlFor="custom-persona" className="text-sm font-medium text-ink-200">
          AI role / persona
        </label>
        <textarea
          id="custom-persona"
          rows={2}
          maxLength={300}
          value={value.persona}
          onChange={update('persona')}
          placeholder="e.g. Strict university professor, Landlord in London, Angel investor"
          className={`${FIELD_CLASS} resize-y`}
        />
      </div>
      <div>
        <label htmlFor="custom-my-role" className="text-sm font-medium text-ink-200">
          My role
        </label>
        <input
          id="custom-my-role"
          type="text"
          maxLength={120}
          value={value.myRole}
          onChange={update('myRole')}
          placeholder="e.g. Student defending a thesis, Tenant negotiating rent, Founder"
          className={FIELD_CLASS}
        />
      </div>
      <div>
        <label htmlFor="custom-goal" className="text-sm font-medium text-ink-200">
          Your goal
        </label>
        <textarea
          id="custom-goal"
          rows={2}
          maxLength={300}
          value={value.goal}
          onChange={update('goal')}
          placeholder="e.g. Clearly explain microservices decoupling"
          className={`${FIELD_CLASS} resize-y`}
        />
      </div>
    </div>
  )
}
