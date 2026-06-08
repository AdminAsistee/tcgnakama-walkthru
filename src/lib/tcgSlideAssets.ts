const TCG_BASE = 'https://tcgnakama.com/static'

import { MIRROR_SLIDES } from './mirrorSlideImages'

/** PNG and storefront imagery pulled from tcgnakama.com */
export const TCG_ASSETS = {
  logo: `${TCG_BASE}/live_logo.png`,
  favicon: `${TCG_BASE}/favicon-512x512.png`,
  appleTouch: `${TCG_BASE}/apple-touch-icon.png`,
  bannerOnePiece: `${TCG_BASE}/banners/banner_1770714431.webp`,
  bannerPokemon: `${TCG_BASE}/banners/banner_1770714934.webp`,
  bannerMtg: `${TCG_BASE}/banners/banner_1770715097.webp`,
} as const

/** Intro mirror slide — card photos in public/assets/mirror/ (see npm run mirror:manifest) */
export { MIRROR_SLIDES } from './mirrorSlideImages'

const SLIDE_IMAGE_MAP: Record<string, string> = {
  intro: TCG_ASSETS.favicon,
  search: TCG_ASSETS.favicon,
  categories: TCG_ASSETS.bannerOnePiece,
  inventory: TCG_ASSETS.bannerPokemon,
  product: TCG_ASSETS.appleTouch,
  checkout: TCG_ASSETS.favicon,
  'seller-program': TCG_ASSETS.bannerMtg,
  'seller-benefits': TCG_ASSETS.bannerOnePiece,
  'seller-onboarding': TCG_ASSETS.bannerPokemon,
  'seller-catalog': TCG_ASSETS.bannerMtg,
  'seller-condition': TCG_ASSETS.favicon,
  'seller-listing': TCG_ASSETS.appleTouch,
  'seller-payouts': TCG_ASSETS.bannerOnePiece,
  concierge: TCG_ASSETS.bannerPokemon,
  collections: TCG_ASSETS.appleTouch,
  cardbot: TCG_ASSETS.favicon,
  trust: TCG_ASSETS.favicon,
  'tools-intro': TCG_ASSETS.bannerPokemon,
  'select-card': TCG_ASSETS.bannerPokemon,
  'grade-card': TCG_ASSETS.favicon,
  'price-card': TCG_ASSETS.bannerMtg,
  'session-summary': TCG_ASSETS.bannerOnePiece,
  'account-portal': TCG_ASSETS.appleTouch,
  cta: TCG_ASSETS.bannerMtg,
}

export function getSlideBackground(slideId: string): string {
  return SLIDE_IMAGE_MAP[slideId] ?? TCG_ASSETS.favicon
}

export function preloadSlideImages(): void {
  Object.values(TCG_ASSETS).forEach((src) => {
    const img = new Image()
    img.src = src
  })
  MIRROR_SLIDES.forEach((slide) => {
    const img = new Image()
    img.src = slide.image
  })
}
