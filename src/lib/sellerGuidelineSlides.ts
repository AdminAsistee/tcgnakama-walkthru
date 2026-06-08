import { getGuidelinePageContent, type GuidelinePageContent } from './sellerGuidelineContent'
import { computeUniformTrailFontScale, setUniformTrailFontScale } from './textTrailEffect'

export const SELLER_GUIDELINES_PDF = '/docs/TCGNakama-Seller-Page-Guidelines.pdf'
export const SELLER_URL = 'https://tcgnakama.com/sell'
export const SITE_URL = 'https://tcgnakama.com/'

/** Strip PDF section numbers like "3. Bulk Upload" → "Bulk Upload". */
export function displaySlideTitle(title: string): string {
  return title
    .replace(/^\d+\.\s*/, '')
    .replace(/\s*\(continued\)$/i, '')
    .trim()
}

/** Strip section prefixes like "Section 3 · Bulk Upload" → "Bulk Upload". */
export function displaySlideEyebrow(eyebrow: string): string {
  return eyebrow.replace(/^Section\s+(?:\d+|★)\s*·\s*/i, '').trim()
}

/** Strip TOC numbering like "3 Bulk Upload — …" → "Bulk Upload — …". */
export function displayTocItem(item: string): string {
  return item.replace(/^\d+\s+/, '').replace(/^★\s*/, '').trim()
}

export type SlidePhase = 'overview' | 'guide' | 'interactive'
export type InteractiveKind = 'select' | 'grade' | 'price' | 'summary' | 'portal'
export type GuideVisual =
  | 'intro'
  | 'toc'
  | 'dashboard'
  | 'vault'
  | 'bulk-upload'
  | 'add-card'
  | 'bulk-vs-add'
  | 'orders'
  | 'storefront'
  | 'tools'
  | 'cta'

export interface GuideSlide {
  id: string
  kind: 'info' | 'interactive'
  interactive?: InteractiveKind
  phase: SlidePhase
  eyebrow: string
  title: string
  body: string
  points: string[]
  visual?: GuideVisual
  pdfPages?: number[]
}

function pointsFromContent(...pages: number[]): string[] {
  const points: string[] = []
  for (const page of pages) {
    const content = getGuidelinePageContent(page)
    if (content.isBlank) continue
    if (content.bullets) points.push(...content.bullets)
    if (content.steps) points.push(...content.steps.map((step) => `${step.title}: ${step.body}`))
    if (content.definitions) {
      points.push(...content.definitions.map((row) => `${row.term} — ${row.definition}`))
    }
    if (content.callouts) {
      points.push(...content.callouts.map((callout) => (callout.title ? `${callout.title}: ${callout.body}` : callout.body)))
    }
  }
  return points
}

function primaryContent(...pages: number[]): GuidelinePageContent {
  const first = pages.find((page) => !getGuidelinePageContent(page).isBlank) ?? pages[0]
  return getGuidelinePageContent(first)
}

function slideFromPdf(
  id: string,
  eyebrow: string,
  pages: number[],
  visual: GuideVisual,
  phase: SlidePhase = 'guide'
): GuideSlide {
  const content = primaryContent(...pages)
  const mergedParagraphs = pages.flatMap((page) => getGuidelinePageContent(page).paragraphs ?? [])
  return {
    id,
    kind: 'info',
    phase,
    eyebrow,
    title: displaySlideTitle(content.title),
    body: mergedParagraphs.join(' ') || content.subtitle || '',
    points: pointsFromContent(...pages),
    visual,
    pdfPages: pages,
  }
}

export const GUIDE_SLIDES: GuideSlide[] = [
  {
    id: 'intro',
    kind: 'info',
    phase: 'overview',
    eyebrow: 'Seller guide · Cover',
    title: getGuidelinePageContent(1).title,
    body: getGuidelinePageContent(1).paragraphs?.[0] ?? '',
    points: getGuidelinePageContent(1).bullets ?? [],
    visual: 'intro',
    pdfPages: [1],
  },
  slideFromPdf('guide-toc', 'Seller guide · Contents', [3], 'toc', 'overview'),
  slideFromPdf('dashboard', 'Section 1 · Dashboard', [5, 6], 'dashboard'),
  slideFromPdf('my-vault', 'Section 2 · My Vault', [7, 8], 'vault'),
  slideFromPdf('bulk-upload', 'Section 3 · Bulk Upload', [9, 10], 'bulk-upload'),
  slideFromPdf('add-card', 'Section 4 · Add Card', [11, 12], 'add-card'),
  slideFromPdf('bulk-vs-add', 'Section ★ · Bulk vs Add Card', [13], 'bulk-vs-add'),
  slideFromPdf('my-orders', 'Section 5 · My Orders', [15, 16], 'orders'),
  slideFromPdf('my-storefront', 'Section 6 · My Storefront', [17, 18], 'storefront'),
  {
    id: 'tools-intro',
    kind: 'info',
    phase: 'interactive',
    eyebrow: 'Interactive demo · AI toolkit',
    title: 'Try the seller AI toolkit live.',
    body: 'The PDF guide covers dashboard workflows — now run the same appraise, price, and account flow collectors use before listing.',
    points: [
      'Select a demo card from the catalog.',
      'Run AI grading to validate condition before listing.',
      'Check market range, review the session, then open the account portal.',
    ],
    visual: 'tools',
  },
  {
    id: 'select-card',
    kind: 'interactive',
    interactive: 'select',
    phase: 'interactive',
    eyebrow: 'Interactive · Select card',
    title: 'Pick a card to inspect before you list.',
    body: 'Choose from the demo catalog — the same decision point before Bulk Upload appraise or Add Card pricing.',
    points: [
      'Hover cards to inspect artwork and set details.',
      'Select one card, then grade it on the next slide.',
      'Use Skip to continue with the default demo card.',
    ],
  },
  {
    id: 'grade-card',
    kind: 'interactive',
    interactive: 'grade',
    phase: 'interactive',
    eyebrow: 'Interactive · AI grading',
    title: 'Grade the card with PSA-style AI analysis.',
    body: 'Surface, corners, edges, and centering are evaluated — the same criteria the Bulk Upload appraise step checks.',
    points: [
      'Live scanning animation while criteria are checked.',
      'PSA-style score with reasoning notes.',
      'Continue once grading completes to see market pricing.',
    ],
  },
  {
    id: 'price-card',
    kind: 'interactive',
    interactive: 'price',
    phase: 'interactive',
    eyebrow: 'Interactive · Market pricing',
    title: 'Check the live market range for this grade.',
    body: 'Pricing pulls demand signals so you know what sell price to set on Add Card or Bulk Upload results.',
    points: [
      'Market signals show demand, rarity, and condition impact.',
      'Estimated range updates based on the grade result.',
      'Use this step to decide your listing price.',
    ],
  },
  {
    id: 'session-summary',
    kind: 'interactive',
    interactive: 'summary',
    phase: 'interactive',
    eyebrow: 'Interactive · Session summary',
    title: 'Review grade, price, and seller guide coverage.',
    body: 'The summary ties the PDF dashboard guide to actionable card intelligence before account creation.',
    points: [
      'See grade reasoning and price drivers side by side.',
      'Confirm the card context before moving forward.',
      'Continue to the account portal when ready.',
    ],
  },
  {
    id: 'account-portal',
    kind: 'interactive',
    interactive: 'portal',
    phase: 'interactive',
    eyebrow: 'Interactive · Seller account',
    title: 'Create your seller profile and choose a plan.',
    body: 'Set up a collector, investor, or dealer account to list inventory, run AI pricing, and publish to the live marketplace.',
    points: [
      'Dealer plan unlocks bulk CSV upload and seller tooling.',
      'Register aligns with the tcgNakama.com/sell onboarding flow.',
      'Finish here, then open the live seller dashboard to list cards.',
    ],
  },
  {
    id: 'cta',
    kind: 'info',
    phase: 'overview',
    eyebrow: 'Finish · Start selling',
    title: 'Guide complete — open the live seller dashboard.',
    body: getGuidelinePageContent(18).callouts?.find((c) => c.body.includes('support@'))?.body ?? 'Open tcgNakama.com/sell to start listing.',
    points: [
      'Bulk Upload to create listings fast, Add Card to polish each one.',
      'My Vault, My Orders, and My Storefront manage the rest.',
      getGuidelinePageContent(18).callouts?.find((c) => c.body.includes('v1.0'))?.body ?? 'TCGNakama Seller Onboarding Guide v1.0 · May 2026',
    ],
    visual: 'cta',
  },
]

setUniformTrailFontScale(
  computeUniformTrailFontScale(GUIDE_SLIDES.map((item) => displaySlideTitle(item.title)))
)

export const PHASE_LABELS: Record<SlidePhase, string> = {
  overview: 'Overview',
  guide: 'Seller guide',
  interactive: 'Interactive',
}

export function sellerGuidelinePageSrc(page: number): string {
  return `/guidelines/pages/page-${String(page).padStart(2, '0')}.png`
}
