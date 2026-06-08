export const TEXT_TRAIL_LAYER_COUNT = 11

export const TEXT_TRAIL_MIDDLE_IDX = Math.floor(TEXT_TRAIL_LAYER_COUNT / 2)

export const TEXT_TRAIL_INTERVAL = { show: 45, hide: 45, idle: 45 }

export type TextTrailLayerStyle = {
  full?: boolean
  stroke?: boolean
  bottom?: boolean
  main?: boolean
}

/** Layer styling pattern from Codrops TextTrailEffect demo 1 */
export const TEXT_TRAIL_LAYERS: TextTrailLayerStyle[] = [
  { stroke: true },
  { stroke: false },
  { full: true, stroke: true },
  { stroke: true },
  { stroke: false },
  { full: true, main: true },
  { stroke: false, bottom: true },
  { stroke: false },
  { full: true, stroke: true },
  { stroke: true, bottom: true },
  { stroke: false },
]

export function initialTextTrailOpacities(count = TEXT_TRAIL_LAYER_COUNT) {
  const middle = Math.floor(count / 2)
  return Array.from({ length: count }, (_, index) => (index === middle ? 1 : 0))
}

export function hiddenTextTrailOpacities(count = TEXT_TRAIL_LAYER_COUNT) {
  return Array.from({ length: count }, () => 0)
}

/** Break long slide titles so the fullscreen trail does not clip. */
export function trailTitleLines(title: string, maxLineLength = 22): string[] {
  const normalized = title.trim()
  if (normalized.length <= maxLineLength) return [normalized]

  if (normalized.includes(' — ')) {
    const [head, ...rest] = normalized.split(' — ')
    const tail = rest.join(' — ').trim()
    const lines: string[] = []
    if (head.trim()) lines.push(...trailTitleLines(head.trim(), maxLineLength))
    if (tail) lines.push(...trailTitleLines(tail, maxLineLength))
    return lines.length ? lines : [normalized]
  }

  if (normalized.includes(' · ')) {
    return normalized.split(' · ').map((part) => part.trim()).filter(Boolean)
  }

  const words = normalized.split(/\s+/)
  const lines: string[] = []
  let current = ''

  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (next.length > maxLineLength && current) {
      lines.push(current)
      current = word
    } else {
      current = next
    }
  }

  if (current) lines.push(current)
  return lines.length ? lines : [normalized]
}

export const TRAIL_TITLE_FONT_SCALE = 1

export interface TrailTitleMetrics {
  lines: string[]
  scale: number
}

const MAX_TITLE_LINES = 4

function fitTrailTitleLines(title: string, maxLineLength = 16): string[] {
  let lines = trailTitleLines(title, maxLineLength)

  if (lines.length > MAX_TITLE_LINES) {
    lines = trailTitleLines(title, 12)
  }

  if (lines.length > MAX_TITLE_LINES) {
    lines = trailTitleLines(title, 10)
  }

  return lines
}

function scaleForLines(lines: string[]): number {
  const maxChars = Math.max(...lines.map((line) => line.length), 1)
  const lineCount = lines.length

  let scale = 1
  if (maxChars > 12) scale = Math.min(scale, 12 / maxChars)
  if (maxChars > 16) scale = Math.min(scale, 16 / maxChars)
  if (maxChars > 22) scale = Math.min(scale, (22 / maxChars) * 0.9)
  if (lineCount === 2) scale *= 0.8
  if (lineCount === 3) scale *= 0.64
  if (lineCount >= 4) scale *= 0.52

  return Math.max(0.28, Math.min(TRAIL_TITLE_FONT_SCALE, scale))
}

/** Line breaks and scale so the full title fits the title band and trail overlay. */
export function trailTitleMetrics(title: string, maxLineLength = 16): TrailTitleMetrics {
  const lines = fitTrailTitleLines(title, maxLineLength)
  return { lines, scale: scaleForLines(lines) }
}

/** One shared font scale for every slide title trail — sized to the longest title. */
export function computeUniformTrailFontScale(titles: string[]): number {
  if (titles.length === 0) return TRAIL_TITLE_FONT_SCALE

  let scale = TRAIL_TITLE_FONT_SCALE
  for (const title of titles) {
    const lines = fitTrailTitleLines(title)
    scale = Math.min(scale, scaleForLines(lines))
  }

  return scale
}

let cachedUniformTrailScale: number | null = null

export function uniformTrailFontScale(): number {
  if (cachedUniformTrailScale !== null) return cachedUniformTrailScale
  return TRAIL_TITLE_FONT_SCALE
}

export function setUniformTrailFontScale(scale: number) {
  cachedUniformTrailScale = scale
}

/** Line breaks with the shared trail font scale so titles never clip. */
export function uniformTrailTitleMetrics(title: string): TrailTitleMetrics {
  return {
    lines: fitTrailTitleLines(title),
    scale: uniformTrailFontScale(),
  }
}

/** Keep one font size for both titles during a trail transition. */
export function trailTransitionMetrics(fromTitle: string, toTitle: string) {
  const from = uniformTrailTitleMetrics(fromTitle)
  const to = uniformTrailTitleMetrics(toTitle)

  return {
    fromLines: from.lines,
    toLines: to.lines,
    scale: uniformTrailFontScale(),
  }
}

function wait(ms: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, ms))
}

function setPairOpacity(opacities: number[], middleIdx: number, pos: number, value: number) {
  const next = [...opacities]
  const up = middleIdx - pos
  const down = middleIdx + pos
  if (up >= 0 && up < next.length) next[up] = value
  if (down >= 0 && down < next.length) next[down] = value
  return next
}

/** Mirrors Codrops TextTrailEffect demo1.js TextFX hide/show sequencing */
export function createTextTrailAnimator(
  setOpacities: (value: number[] | ((prev: number[]) => number[])) => void,
  count = TEXT_TRAIL_LAYER_COUNT
) {
  const middleIdx = Math.floor(count / 2)

  const showPair = (pos: number) => {
    setOpacities((prev) => setPairOpacity(prev, middleIdx, pos, 1))
  }

  const hidePair = (pos: number) => {
    setOpacities((prev) => setPairOpacity(prev, middleIdx, pos, 0))
  }

  const show = async () => {
    for (let pos = middleIdx; pos >= 0; pos -= 1) {
      showPair(pos)
      await wait(TEXT_TRAIL_INTERVAL.show)
    }

    for (let pos = middleIdx; pos >= 1; pos -= 1) {
      hidePair(pos)
      await wait(TEXT_TRAIL_INTERVAL.hide)
    }

    await wait(TEXT_TRAIL_INTERVAL.idle)
  }

  const hide = async (halfwayCallback?: () => void) => {
    for (let pos = 1; pos <= middleIdx; pos += 1) {
      showPair(pos)
      await wait(TEXT_TRAIL_INTERVAL.show)
    }

    halfwayCallback?.()

    for (let pos = 0; pos <= middleIdx; pos += 1) {
      hidePair(pos)
      await wait(TEXT_TRAIL_INTERVAL.hide)
    }

    await wait(TEXT_TRAIL_INTERVAL.idle)
  }

  const resetToMiddle = () => {
    setOpacities(initialTextTrailOpacities(count))
  }

  const resetToHidden = () => {
    setOpacities(hiddenTextTrailOpacities(count))
  }

  return { show, hide, resetToMiddle, resetToHidden, middleIdx }
}
