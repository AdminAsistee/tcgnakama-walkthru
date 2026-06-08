import Anthropic from '@anthropic-ai/sdk'
import type { MockCard } from './mockData'

export interface GradeResult {
  score: number
  reasoning: string
}

export interface PriceResult {
  range: string
  driver: string
}

function getClient(): Anthropic {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string
  if (!apiKey) throw new Error('VITE_ANTHROPIC_API_KEY is not set')
  return new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
}

function extractJSON(text: string): string {
  const match = text.match(/\{[\s\S]*\}/)
  return match ? match[0] : text
}

export async function gradeCard(card: MockCard): Promise<GradeResult> {
  const client = getClient()
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 120,
    system:
      'You are a PSA-certified TCG card grader with 20 years experience. ' +
      'Grade the card on a PSA 1–10 scale. ' +
      'Respond ONLY with valid JSON: {"score": <integer 1-10>, "reasoning": "<exactly 2 sentences>"}. ' +
      'No markdown, no extra text.',
    messages: [
      {
        role: 'user',
        content: `Grade this card: "${card.name}" from ${card.set} (${card.year}), ${card.rarity}. Condition notes: ${card.conditionNotes}`,
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
  try {
    const parsed = JSON.parse(extractJSON(text)) as { score: number; reasoning: string }
    return { score: Math.max(1, Math.min(10, Math.round(parsed.score))), reasoning: parsed.reasoning }
  } catch {
    return { score: 7, reasoning: 'Card shows typical wear for its era. Centering and surface integrity are within acceptable PSA standards.' }
  }
}

export async function priceCard(card: MockCard, grade: number): Promise<PriceResult> {
  const client = getClient()
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 120,
    system:
      'You are a TCG market analyst tracking eBay sold listings and PSA population reports. ' +
      'Estimate a realistic market price range. ' +
      'Respond ONLY with valid JSON: {"range": "<e.g. $120 – $180>", "driver": "<1 sentence key price driver>"}. ' +
      'No markdown, no extra text.',
    messages: [
      {
        role: 'user',
        content: `Price this card: "${card.name}" from ${card.set} (${card.year}), ${card.rarity}, PSA grade ${grade}.`,
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
  try {
    const parsed = JSON.parse(extractJSON(text)) as { range: string; driver: string }
    return { range: parsed.range, driver: parsed.driver }
  } catch {
    return { range: '$80 – $120', driver: 'Market demand and card rarity are the primary value drivers at this grade level.' }
  }
}

export async function streamNarration(
  step: string,
  context: string,
  onChunk: (text: string) => void,
  onDone: () => void,
  signal?: AbortSignal
): Promise<void> {
  const client = getClient()

  const stream = client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 80,
    system:
      'You are the AI narrator for TCGNakama, a next-gen TCG intelligence platform. ' +
      'Narrate what is happening in exactly 1–2 short sentences. ' +
      'Be knowledgeable, precise, and slightly dramatic. ' +
      'No markdown. No bullet points. No questions. Just flowing narration.',
    messages: [
      {
        role: 'user',
        content: `Step: ${step}. Context: ${context}. Narrate this moment.`,
      },
    ],
  })

  try {
    stream.on('text', (text: string) => {
      if (!signal?.aborted) onChunk(text)
    })
    await stream.finalMessage()
  } finally {
    if (!signal?.aborted) onDone()
  }
}
