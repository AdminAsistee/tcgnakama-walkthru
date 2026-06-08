/**
 * Frontend API client — calls the FastAPI backend.
 * In dev, Vite proxies /api to http://localhost:8000.
 * In production, requests go to the same origin (FastAPI serves the build).
 */

import type { MockCard } from './mockData'

export interface GradeResult {
  score: number
  reasoning: string
}

export interface PriceResult {
  range: string
  driver: string
}

async function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  const res = await fetch(path, options)
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(`API ${res.status}: ${text}`)
  }
  return res
}

export async function gradeCard(card: MockCard): Promise<GradeResult> {
  const res = await apiFetch('/api/grade', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      card_id: card.id,
      card_name: card.name,
      card_set: card.set,
      card_year: card.year,
      rarity: card.rarity,
      condition_notes: card.conditionNotes,
      game: card.game,
    }),
  })
  return res.json() as Promise<GradeResult>
}

export async function priceCard(card: MockCard, grade: number): Promise<PriceResult> {
  const res = await apiFetch('/api/price', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      card_id: card.id,
      card_name: card.name,
      card_set: card.set,
      card_year: card.year,
      rarity: card.rarity,
      grade,
      game: card.game,
    }),
  })
  return res.json() as Promise<PriceResult>
}

// ── Profile ───────────────────────────────────────────────────────────────────

export interface ProfilePayload {
  display_name: string
  username: string
  email: string
  bio?: string
  favorite_game: string
  avatar_color: string
  plan: string
}

export interface ProfileData {
  id: number
  display_name: string
  username: string
  email: string
  bio: string | null
  favorite_game: string
  avatar_color: string
  plan: string
  cards_graded: number
  created_at: string
}

export async function createProfile(payload: ProfilePayload): Promise<ProfileData> {
  const res = await apiFetch('/api/profiles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return res.json() as Promise<ProfileData>
}

export async function streamNarration(
  step: string,
  context: string,
  onChunk: (text: string) => void,
  onDone: () => void,
  signal?: AbortSignal
): Promise<void> {
  const params = new URLSearchParams({ step, context })
  let res: Response

  try {
    res = await fetch(`/api/narrate?${params.toString()}`, { signal })
  } catch (err) {
    if ((err as Error)?.name !== 'AbortError') console.error('[narrate fetch]', err)
    onDone()
    return
  }

  if (!res.ok || !res.body) {
    onDone()
    return
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (signal?.aborted) break

      const raw = decoder.decode(value, { stream: true })
      for (const line of raw.split('\n')) {
        const trimmed = line.trim()
        if (!trimmed.startsWith('data:')) continue
        const payload = trimmed.slice(5).trim()
        if (payload === '[DONE]') break
        try {
          const parsed = JSON.parse(payload) as { text?: string }
          if (parsed.text) onChunk(parsed.text)
        } catch {
          // ignore malformed chunk
        }
      }
    }
  } catch (err) {
    if ((err as Error)?.name !== 'AbortError') console.error('[narrate stream]', err)
  } finally {
    onDone()
  }
}
