import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface WelcomeScreenProps {
  onStart: () => void
  onSkip: () => void
}

interface WalkthroughSlide {
  id: string
  section: string
  title: string
  subtitle: string
  bullets: string[]
  image: string
  metricA: { label: string; value: string }
  metricB: { label: string; value: string }
  chips: string[]
}

const SLIDES: WalkthroughSlide[] = [
  {
    id: 'hero-categories',
    section: 'Hero + Categories',
    title: 'Start at the storefront hero.',
    subtitle: 'The homepage opens with category-led entry points for One Piece, Pokemon, and MTG plus popular search terms.',
    bullets: [
      'Category rails direct buyers into game-specific inventory fast.',
      'Popular searches surface high-intent cards like Charizard and Black Lotus.',
      'The hero frames this as a Japan-direct buying experience in JPY.',
    ],
    image: 'https://images.pokemontcg.io/base1/4_hires.png',
    metricA: { label: 'Primary categories', value: '3' },
    metricB: { label: 'Search-first discovery', value: 'Enabled' },
    chips: ['One Piece', 'Pokemon', 'Magic', 'Popular Search'],
  },
  {
    id: 'fresh-pulls',
    section: 'Trending + Fresh Pulls',
    title: 'Move to live inventory sections.',
    subtitle: 'Trending Now and Fresh Pulls highlight in-stock listings with condition tags and fast add-to-cart actions.',
    bullets: [
      'Cards are displayed with condition labels like Lightly Played.',
      'Live status emphasizes continuously updated listings.',
      'Product cards include authenticity and secure shipping messaging.',
    ],
    image: 'https://images.pokemontcg.io/base1/93_hires.png',
    metricA: { label: 'Live freshness', value: 'Real-time' },
    metricB: { label: 'Inventory status', value: 'In stock' },
    chips: ['Trending Now', 'Fresh Pulls', 'Authentic', 'Secure Ship'],
  },
  {
    id: 'market-signals',
    section: "What's Hot + Grails",
    title: 'Review market movers and grails.',
    subtitle: 'The site separates short-term gainers from premium grails so collectors can scan momentum and high-value cards quickly.',
    bullets: [
      "What's Hot highlights top gainers with directional movement.",
      'Grails focuses on premium, high-ticket inventory currently available.',
      'This pairing helps users compare velocity vs. absolute value.',
    ],
    image: 'https://cards.scryfall.io/large/front/b/d/bd8fa327-dd41-4737-8f19-2cf5eb1f7cdd.jpg',
    metricA: { label: 'Top gainer example', value: '▲ 288.9%' },
    metricB: { label: 'Premium card segment', value: 'Grails' },
    chips: ["What's Hot", 'Top Gainers', 'Grails', 'Demand Spike'],
  },
  {
    id: 'concierge',
    section: 'Concierge Service',
    title: 'Use Treasure Hunt for hard-to-find cards.',
    subtitle: 'If a card is missing from inventory, users can submit concierge sourcing requests across Japan with no obligation to buy.',
    bullets: [
      'Captures demand beyond current listed inventory.',
      'Supports rare card hunting and niche wants lists.',
      'Bridges manual sourcing with the storefront purchase flow.',
    ],
    image: 'https://images.pokemontcg.io/gym2/24_hires.png',
    metricA: { label: 'Submission cost', value: 'Free' },
    metricB: { label: 'Purchase obligation', value: 'None' },
    chips: ['Treasure Hunt', 'Rare Sourcing', 'Japan-wide', 'Concierge'],
  },
  {
    id: 'collections-cardbot',
    section: 'Collections + CardBot',
    title: 'Finish with guided browsing and support.',
    subtitle: 'Collections filters and CardBot cover navigation and buyer assistance, from product search to pricing help.',
    bullets: [
      'Collections lets users jump between Pokemon, One Piece, Yu-Gi-Oh, and MTG.',
      'CardBot introduces conversational support for discovery and value questions.',
      'Together they reduce friction between browsing and checkout.',
    ],
    image: 'https://images.pokemontcg.io/base1/47_hires.png',
    metricA: { label: 'Collections shortcuts', value: '4+' },
    metricB: { label: 'Assisted support', value: 'CardBot' },
    chips: ['Collections', 'CardBot', 'Discovery', 'Support'],
  },
  {
    id: 'full-walkthrough',
    section: 'Full Journey Recap',
    title: 'Storefront walkthrough complete.',
    subtitle: 'You have now seen every major part of the tcgnakama website before entering the grading demo flow.',
    bullets: [
      'Hero categories and popular search.',
      'Trending inventory, Fresh Pulls, and market movers.',
      'Grails, concierge sourcing, collections navigation, and CardBot.',
    ],
    image: 'https://images.pokemontcg.io/base1/10_hires.png',
    metricA: { label: 'Website coverage', value: 'End-to-end' },
    metricB: { label: 'Next action', value: 'Start demo' },
    chips: ['Clear Walkthrough', 'Slideshow', 'Motion UI', 'Ready'],
  },
]

function SlidePreviewCard({ slide }: { slide: WalkthroughSlide }) {
  const [imgErr, setImgErr] = useState(false)

  return (
    <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
        <div className="aspect-[5/3] w-full">
          {!imgErr ? (
            <img
              src={slide.image}
              alt={slide.title}
              onError={() => setImgErr(true)}
              className="h-full w-full object-cover"
              draggable={false}
            />
          ) : (
            <div className="h-full w-full bg-slate-800" />
          )}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{slide.metricA.label}</div>
          <div className="mt-1 text-sm font-semibold text-slate-100">{slide.metricA.value}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{slide.metricB.label}</div>
          <div className="mt-1 text-sm font-semibold text-slate-100">{slide.metricB.value}</div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {slide.chips.map((chip) => (
          <span key={chip} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-slate-300">
            {chip}
          </span>
        ))}
      </div>
    </div>
  )
}

function PreviewBullet({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3">
      <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-amber-300" />
      <span className="text-sm leading-6 text-slate-300">{text}</span>
    </li>
  )
}

export default function WelcomeScreen({ onStart, onSkip }: WelcomeScreenProps) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  const totalSlides = SLIDES.length
  const activeSlide = SLIDES[activeSlideIndex]
  const isLastSlide = activeSlideIndex === totalSlides - 1
  const progressPercent = ((activeSlideIndex + 1) / totalSlides) * 100

  const goToSlide = (targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= totalSlides || targetIndex === activeSlideIndex) return
    setDirection(targetIndex > activeSlideIndex ? 1 : -1)
    setActiveSlideIndex(targetIndex)
  }

  const goNext = () => {
    if (isLastSlide) {
      onStart()
      return
    }
    goToSlide(activeSlideIndex + 1)
  }

  const goPrev = () => {
    if (activeSlideIndex === 0) return
    goToSlide(activeSlideIndex - 1)
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        setDirection(1)
        setActiveSlideIndex((prev) => {
          if (prev >= totalSlides - 1) {
            onStart()
            return prev
          }
          return prev + 1
        })
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setDirection(-1)
        setActiveSlideIndex((prev) => (prev === 0 ? prev : prev - 1))
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onStart, totalSlides])

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      style={{ background: 'radial-gradient(circle at top, #121a2b 0%, #080d16 50%, #05070c 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(rgba(148,163,184,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.35) 1px, transparent 1px)`,
          backgroundSize: '72px 72px',
        }}
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-slate-950/75" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="glass-panel flex items-center justify-between rounded-2xl px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-amber-400/35 bg-amber-400/10 text-sm font-semibold text-amber-300">
              T
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.16em] text-slate-50">TCGNakama Walkthrough</p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Slideshow view of all website sections</p>
            </div>
          </div>
          <button onClick={onSkip} className="btn-ghost rounded-lg px-4 py-2 text-xs uppercase tracking-[0.2em]">
            Skip to summary
          </button>
        </header>

        <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.22em] text-amber-200">Slide {activeSlideIndex + 1} of {totalSlides}</p>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{activeSlide.section}</p>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-amber-300 to-amber-500"
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.25 }}
            />
          </div>
        </div>

        <main className="flex-1 py-6">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.section
              key={activeSlide.id}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 80 : -80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -80 : 80 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]"
            >
              <article className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-amber-200">{activeSlide.section}</p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">{activeSlide.title}</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">{activeSlide.subtitle}</p>

                <ul className="mt-6 grid gap-3">
                  {activeSlide.bullets.map((bullet) => (
                    <PreviewBullet key={bullet} text={bullet} />
                  ))}
                </ul>
              </article>

              <SlidePreviewCard slide={activeSlide} />
            </motion.section>
          </AnimatePresence>
        </main>

        <footer className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {SLIDES.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => goToSlide(index)}
                className="group"
                aria-label={`Go to slide ${index + 1}`}
              >
                <span
                  className="block h-2.5 rounded-full transition-all"
                  style={{
                    width: index === activeSlideIndex ? 34 : 14,
                    background: index === activeSlideIndex ? '#d4af54' : 'rgba(148,163,184,0.35)',
                  }}
                />
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Tip: use ← and → keys for slideshow navigation</div>
            <div className="flex items-center gap-3">
              <button
                onClick={goPrev}
                disabled={activeSlideIndex === 0}
                className="btn-ghost rounded-lg px-4 py-2 text-xs uppercase tracking-[0.18em] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={goNext}
                className="btn-gold rounded-lg px-5 py-2.5 text-xs uppercase tracking-[0.18em]"
              >
                {isLastSlide ? 'Start Demo' : 'Next Slide'}
              </button>
            </div>
          </div>
        </footer>
      </div>
    </motion.div>
  )
}
