export interface ScenarioVocabulary {
  term: string
  meaning: string
  example: string
}

export interface ScenarioRole {
  id: string
  label: string
  speaker: string
  persona: string
  questions: string[]
  vocabulary: ScenarioVocabulary[]
}

export interface ScenarioCategory {
  id: string
  label: string
  description: string
  roles: ScenarioRole[]
}

export interface Scenario {
  category: ScenarioCategory
  role: ScenarioRole
  goal: string | null
  learnerRole: string | null
}

export interface CustomScenarioInput {
  topic: string
  persona: string
  myRole: string
  goal: string
}

export function buildCustomScenario({ topic, persona, myRole, goal }: CustomScenarioInput): Scenario {
  const label = topic.trim()
  return {
    category: { id: 'custom', label: 'Custom Scenario', description: label, roles: [] },
    role: { id: 'custom', label, speaker: 'AI Persona', persona: persona.trim(), questions: [], vocabulary: [] },
    goal: goal.trim() || null,
    learnerRole: myRole.trim(),
  }
}

export const CASUAL_CATEGORY_ID = 'casual-chat'

export const SCENARIO_CATEGORIES: ScenarioCategory[] = [
  {
    id: 'technical-interview',
    label: 'Technical Interview',
    description: 'Answer probing questions from a senior interviewer about your craft.',
    roles: [
      {
        id: 'data-engineering',
        label: 'Data Engineering',
        speaker: 'Senior Interviewer',
        persona: 'a senior interviewer hiring a Data Engineer',
        questions: [
          'Let us start with your background. Walk me through a data pipeline you built end to end.',
          'How do you make your ETL jobs idempotent, so a rerun does not duplicate data?',
          'Tell me about a schema change that broke a downstream report. How did you handle it?',
          'How would you design throughput for a stream that spikes tenfold during peak hours?',
          'Which tools do you use to monitor data quality, and what do you alert on?',
        ],
        vocabulary: [
          { term: 'Idempotency', meaning: 'Running a job twice gives the same result as running it once.', example: 'Our loader is idempotent, so retries never create duplicate rows.' },
          { term: 'Schema evolution', meaning: 'Changing a data structure without breaking the systems that read it.', example: 'We manage schema evolution with backward-compatible migrations.' },
        ],
      },
      {
        id: 'cybersecurity',
        label: 'Cybersecurity',
        speaker: 'Senior Interviewer',
        persona: 'a senior interviewer hiring a Cybersecurity Specialist',
        questions: [
          'Walk me through how you would respond to a suspected phishing compromise.',
          'How do you decide which alerts to escalate in a busy security operations center?',
          'Describe a time you reduced risk without slowing the business down.',
          'How would you explain a critical vulnerability to a non-technical executive?',
          'What does defense in depth mean to you in a cloud environment?',
        ],
        vocabulary: [
          { term: 'Threat modeling', meaning: 'Identifying how a system could be attacked before building it.', example: 'We ran threat modeling before approving the new payment flow.' },
          { term: 'Least privilege', meaning: 'Giving each account only the access it truly needs.', example: 'Least privilege limited the service account to read-only access.' },
        ],
      },
      {
        id: 'ai-ml-specialist',
        label: 'AI/ML Specialist',
        speaker: 'Senior Interviewer',
        persona: 'a senior interviewer hiring an AI/ML Specialist',
        questions: [
          'Tell me about a machine learning model you deployed to production.',
          'How do you detect data drift after a model goes live?',
          'Walk me through how you evaluate a model before launch.',
          'How do you balance model accuracy against latency and cost?',
          'How would you handle bias in a model that scores job applicants?',
        ],
        vocabulary: [
          { term: 'Model drift', meaning: 'Gradual loss of accuracy as real-world data changes.', example: 'Monitoring caught model drift within two weeks of launch.' },
          { term: 'Feature store', meaning: 'A shared system that serves consistent features to training and production.', example: 'A feature store keeps training and serving data aligned.' },
        ],
      },
      {
        id: 'cloud-architect',
        label: 'Cloud Architect',
        speaker: 'Senior Interviewer',
        persona: 'a senior interviewer hiring a Cloud Architect',
        questions: [
          'How would you design a highly available web service across two regions?',
          'When do you choose serverless over containers, and why?',
          'Tell me about a cloud cost overrun you found and fixed.',
          'How would you plan a database migration with zero downtime?',
          'How do you keep infrastructure consistent across several teams?',
        ],
        vocabulary: [
          { term: 'Infrastructure as code', meaning: 'Defining servers and networks in versioned configuration files.', example: 'Infrastructure as code makes every environment reproducible.' },
          { term: 'Blast radius', meaning: 'How much of the system one failure can affect.', example: 'Separate accounts reduce the blast radius of a bad deployment.' },
        ],
      },
    ],
  },
  {
    id: 'startup-pitch',
    label: 'Startup Pitch',
    description: 'Pitch your company to investors and defend your numbers.',
    roles: [
      {
        id: 'vc-pitch',
        label: 'VC Pitch',
        speaker: 'VC Partner',
        persona: 'a venture capital partner evaluating a startup founder pitching for a funding round',
        questions: [
          'Thanks for coming in. What problem do you solve, and why now?',
          'How big is the market, and how did you calculate that number?',
          'What is your customer acquisition cost compared with customer lifetime value?',
          'Who are your closest competitors, and why will you win?',
          'What will this round achieve for the company in the next year?',
        ],
        vocabulary: [
          { term: 'Product-market fit', meaning: 'Strong evidence that customers want what you sell.', example: 'Retention numbers show clear product-market fit.' },
          { term: 'Unit economics', meaning: 'Revenue and cost measured for a single customer.', example: 'Our unit economics turn positive after month eight.' },
        ],
      },
      {
        id: 'angel-qa',
        label: 'Angel Q&A',
        speaker: 'Angel Investor',
        persona: 'an angel investor asking a founder hard follow-up questions after a short pitch',
        questions: [
          'Give me your pitch in two minutes.',
          'What is the biggest risk that could kill this company?',
          'Why would a customer switch from what they use today?',
          'Which milestones will you hit in the next six months?',
          'If I invest, how will I know you will be honest when things go wrong?',
        ],
        vocabulary: [
          { term: 'Runway', meaning: 'The months a company can operate before it runs out of cash.', example: 'We have eighteen months of runway at the current burn rate.' },
          { term: 'Traction', meaning: 'Measurable evidence that customers are adopting the product.', example: 'Our pilot programs give us strong early traction.' },
        ],
      },
    ],
  },
  {
    id: CASUAL_CATEGORY_ID,
    label: 'Casual & Multi-Speaker',
    description: 'Free-flowing conversation on any topic, or practice with a partner on a single device.',
    roles: [
      {
        id: 'coffee-hobbies',
        label: 'Coffee & Hobbies',
        speaker: 'Conversation Partner',
        persona: 'a friendly native speaker chatting casually about coffee, hobbies and weekend plans',
        questions: [
          'Hey, how is your week going? Are you having a good one?',
          'What hobby have you picked up recently that you really enjoy?',
        ],
        vocabulary: [],
      },
      {
        id: 'tech-debate',
        label: 'Tech & Future Debate',
        speaker: 'Conversation Partner',
        persona: 'a thoughtful friend who enjoys debating how technology will shape the future',
        questions: [
          'Do you think artificial intelligence will make most jobs easier or harder?',
          'Which technology from the last ten years do you think will matter most?',
        ],
        vocabulary: [],
      },
      {
        id: 'travel-culture',
        label: 'Travel & Culture',
        speaker: 'Conversation Partner',
        persona: 'a well-travelled friend who loves talking about different cultures, food and places',
        questions: [
          'Where is the most interesting place you have ever visited?',
          'What is one custom from your culture that surprises people abroad?',
        ],
        vocabulary: [],
      },
    ],
  },
]
