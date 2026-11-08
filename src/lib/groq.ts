const COMPLETIONS_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'openai/gpt-oss-20b'
export const GROQ_API_KEY: string = 'PASTE_KEY_HERE'

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export async function createChatCompletion(messages: ChatMessage[]): Promise<string> {
  if (!GROQ_API_KEY.trim() || GROQ_API_KEY === 'PASTE_KEY_HERE') {
    throw new Error('AI key not configured')
  }

  const response = await fetch(COMPLETIONS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      response_format: { type: 'json_object' },
      temperature: 0.7,
    }),
  })

  if (!response.ok) throw new Error(`AI service error ${response.status}`)

  const data = (await response.json()) as { choices?: { message?: { content?: string | null } }[] }
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error('Empty AI reply')
  return content
}
