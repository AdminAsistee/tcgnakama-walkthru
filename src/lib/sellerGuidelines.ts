/** Re-exports for seller guide PDF assets and legacy constants */

export {
  SELLER_GUIDELINES_PDF,
  SELLER_URL,
  SITE_URL,
  sellerGuidelinePageSrc,
} from './sellerGuidelineSlides'

export { getGuidelinePageContent, guidelinePageNarration, SELLER_GUIDELINE_PAGES } from './sellerGuidelineContent'

export const SELLER_GUIDELINES_PAGE_COUNT = 18

export const SELLER_STATS = [
  { label: 'Core features', value: '5' },
  { label: 'Cards per upload', value: '50' },
  { label: 'AI pricing', value: 'Live' },
  { label: 'Guide version', value: 'v1.0' },
] as const
