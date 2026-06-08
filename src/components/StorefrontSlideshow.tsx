import { motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import CardSelector from './CardSelector'
import GradeReveal from './GradeReveal'
import PriceOracle from './PriceOracle'
import SummaryScreen from './SummaryScreen'
import ProfileCreate from './ProfileCreate'
import ActionButton from './ActionButton'
import DotNavButton from './DotNavButton'
import SlideshowButton from './SlideshowButton'
import IntroMirrorEffect from './IntroMirrorEffect'
import SlideshowPageBorders from './SlideshowPageBorders'
import IntroGuidePanel from './IntroGuidePanel'
import SlideTitleTrail from './SlideTitleTrail'
import SlideTitleBand from './SlideTitleBand'
import { GuideVisualPanel } from './SellerGuideDemos'
import {
  GUIDE_SLIDES,
  PHASE_LABELS,
  SELLER_URL,
  SITE_URL,
  displaySlideTitle,
  type GuideSlide,
  type InteractiveKind,
} from '../lib/sellerGuidelineSlides'
import { uniformTrailTitleMetrics } from '../lib/textTrailEffect'
import { gradeCard, priceCard } from '../lib/api'
import type { GradeResult, PriceResult } from '../lib/api'
import type { MockCard } from '../lib/mockData'
import { MOCK_CARDS } from '../lib/mockData'

const AUTO_ADVANCE_MS = 6000
const CONTENT_FADE_TRANSITION = { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const }
const DEFAULT_GRADE: GradeResult = { score: 7, reasoning: 'Default grade applied for demo purposes.' }
const DEFAULT_PRICE: PriceResult = { range: '¥8,000 – ¥12,000', driver: 'Default estimate for demo purposes.' }

interface TrailTransitionState {
  fromTitle: string
  toTitle: string
  targetIndex: number
}

function slideIndex(id: string) {
  return GUIDE_SLIDES.findIndex((slide) => slide.id === id)
}

function SlidePreview({ targetSlide, actionLabel }: { targetSlide: GuideSlide; actionLabel: string }) {
  const title = displaySlideTitle(targetSlide.title)
  const titleMetrics = uniformTrailTitleMetrics(title)

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/10 bg-black/30 p-4">
        <h3
          className="slideshow-heading"
          style={{ fontSize: `calc(var(--trail-title-base-size) * ${titleMetrics.scale})` }}
        >
          {title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">{targetSlide.body}</p>
      </div>
      <ul className="space-y-2">
        {targetSlide.points.slice(0, 4).map((point) => (
          <li key={point} className="flex items-start gap-2 text-sm text-slate-300">
            <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-300" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{actionLabel}</p>
    </div>
  )
}

function AutoplayPopout({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/10 bg-black/30 p-4">
        <p className="text-sm text-slate-300">
          Autoplay advances guide slides every {AUTO_ADVANCE_MS / 1000} seconds. Interactive steps always pause for input.
        </p>
      </div>
      <SlideshowButton
        variant="ghost"
        size="sm"
        label={enabled ? 'Pause autoplay' : 'Resume autoplay'}
        displayLabel={enabled ? 'Pause autoplay' : 'Resume autoplay'}
        active={enabled}
        onClick={onToggle}
        className="w-full"
      />
    </div>
  )
}

interface InteractiveSlidePanelProps {
  kind: InteractiveKind
  selectedCard: MockCard | null
  gradeResult: GradeResult | null
  priceResult: PriceResult | null
  onSelectCard: (card: MockCard) => void
  onSkipSelect: () => void
  onGradeComplete: (result: GradeResult) => void
  onGradeNext: () => void
  onSkipGrade: () => void
  onPriceComplete: (result: PriceResult) => void
  onPriceNext: () => void
  onSkipPrice: () => void
  onSummaryNext: () => void
  onRestartSession: () => void
  onPortalBack: () => void
}

function InteractiveSlidePanel({
  kind,
  selectedCard,
  gradeResult,
  priceResult,
  onSelectCard,
  onSkipSelect,
  onGradeComplete,
  onGradeNext,
  onSkipGrade,
  onPriceComplete,
  onPriceNext,
  onSkipPrice,
  onSummaryNext,
  onRestartSession,
  onPortalBack,
}: InteractiveSlidePanelProps) {
  const card = selectedCard ?? MOCK_CARDS[0]
  const grade = gradeResult ?? DEFAULT_GRADE
  const price = priceResult ?? DEFAULT_PRICE

  if (kind === 'select') {
    return <CardSelector embedded hideHeader cards={MOCK_CARDS} onGrade={onSelectCard} onSkip={onSkipSelect} />
  }
  if (kind === 'grade') {
    return (
      <GradeReveal
        key={card.id}
        embedded
        hideHeader
        card={card}
        gradeCard={gradeCard}
        onGradeComplete={onGradeComplete}
        onNext={onGradeNext}
        onSkip={onSkipGrade}
      />
    )
  }
  if (kind === 'price') {
    return (
      <PriceOracle
        key={`${card.id}-${grade.score}`}
        embedded
        hideHeader
        card={card}
        grade={grade}
        priceCard={priceCard}
        onPriceComplete={onPriceComplete}
        onNext={onPriceNext}
        onSkip={onSkipPrice}
      />
    )
  }
  if (kind === 'summary') {
    return (
      <SummaryScreen
        embedded
        hideHeader
        card={card}
        grade={grade}
        price={price}
        onRestart={onRestartSession}
        onGetStarted={onSummaryNext}
      />
    )
  }
  return <ProfileCreate embedded onBack={onPortalBack} />
}

export default function StorefrontSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [selectedCard, setSelectedCard] = useState<MockCard | null>(null)
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null)
  const [priceResult, setPriceResult] = useState<PriceResult | null>(null)
  const [trailTransition, setTrailTransition] = useState<TrailTransitionState | null>(null)
  const [slideUiVisible, setSlideUiVisible] = useState(true)

  const total = GUIDE_SLIDES.length
  const slide = GUIDE_SLIDES[activeIndex]
  const isIntroSlide = slide.visual === 'intro'
  const isGradeSlide = slide.interactive === 'grade'
  const showMirrorBackground = !isGradeSlide
  const isLast = activeIndex === total - 1
  const isInteractive = slide.kind === 'interactive'
  const canAutoPlay = autoPlayEnabled && !isPaused && !isInteractive && !isLast && !isAnimating && !trailTransition && slide.visual !== 'intro'

  const goToImmediate = useCallback(
    (index: number) => {
      if (index < 0 || index >= total || index === activeIndex) return
      setSlideUiVisible(true)
      setTrailTransition(null)
      setActiveIndex(index)
      setIsAnimating(false)
    },
    [activeIndex, total]
  )

  const navigateWithTrail = useCallback(
    (targetIndex: number) => {
      if (isAnimating || trailTransition || targetIndex < 0 || targetIndex >= total || targetIndex === activeIndex) {
        return
      }
      if (isLast && targetIndex > activeIndex) {
        window.open(SELLER_URL, '_blank', 'noopener,noreferrer')
        return
      }
      setIsAnimating(true)
      setTrailTransition({
        fromTitle: displaySlideTitle(GUIDE_SLIDES[activeIndex].title),
        toTitle: displaySlideTitle(GUIDE_SLIDES[targetIndex].title),
        targetIndex,
      })
    },
    [activeIndex, isAnimating, isLast, total, trailTransition]
  )

  const handleTrailSwap = useCallback(() => {
    setSlideUiVisible(false)
    setTrailTransition((current) => {
      if (!current) return current
      setActiveIndex((prevIndex) => current.targetIndex)
      return current
    })
  }, [])

  const handleTrailComplete = useCallback(() => {
    setTrailTransition(null)
    setIsAnimating(false)
    setSlideUiVisible(true)
  }, [])

  const goTo = useCallback(
    (index: number) => {
      goToImmediate(index)
    },
    [goToImmediate]
  )

  const goToId = (id: string) => {
    const index = slideIndex(id)
    if (index >= 0) goToImmediate(index)
  }

  const goNext = () => {
    if (isLast) {
      window.open(SELLER_URL, '_blank', 'noopener,noreferrer')
      return
    }
    if (isInteractive) {
      goToImmediate(activeIndex + 1)
      return
    }
    if (isAnimating || trailTransition) return
    navigateWithTrail(activeIndex + 1)
  }

  const goPrev = () => {
    if (isAnimating || trailTransition) return
    navigateWithTrail(activeIndex - 1)
  }

  const resetSession = () => {
    setSelectedCard(null)
    setGradeResult(null)
    setPriceResult(null)
    goToId('select-card')
  }

  useEffect(() => {
    document.body.classList.add('slideshow-mirror-intro')
    return () => document.body.classList.remove('slideshow-mirror-intro')
  }, [])

  useEffect(() => {
    if (!canAutoPlay) return
    const timer = window.setTimeout(() => navigateWithTrail(activeIndex + 1), AUTO_ADVANCE_MS)
    return () => window.clearTimeout(timer)
  }, [canAutoPlay, activeIndex, navigateWithTrail])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        goNext()
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        goPrev()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  const tocItems = GUIDE_SLIDES.find((item) => item.id === 'guide-toc')?.points ?? []

  return (
    <div
      className={`slideshow-shell relative flex min-h-screen flex-col overflow-hidden bg-black text-slate-100 ${
        isIntroSlide ? 'slideshow-shell--intro' : ''
      }`}
    >
      {showMirrorBackground ? <IntroMirrorEffect showBrand={isIntroSlide} /> : null}

      {trailTransition ? (
        <SlideTitleTrail
          trailTransition={trailTransition}
          onSwap={handleTrailSwap}
          onComplete={handleTrailComplete}
        />
      ) : null}

      <SlideshowPageBorders />

      {isIntroSlide ? (
        <>
          <IntroGuidePanel />
          <div className="intro-slide-continue">
            <SlideshowButton
              variant="continue"
              size="md"
              displayLabel="Continue"
              label="Start seller guide"
              disabled={isAnimating || !!trailTransition}
              onClick={goNext}
            />
          </div>
        </>
      ) : (
        <>
          <main
            className="relative z-10 flex flex-1 items-center px-4 py-6 sm:px-8"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <motion.div
              className="slideshow-stage mx-auto w-full max-w-6xl"
              initial={false}
              animate={{ opacity: slideUiVisible ? 1 : 0 }}
              transition={CONTENT_FADE_TRANSITION}
            >
              {!trailTransition ? <SlideTitleBand title={displaySlideTitle(slide.title)} /> : null}
              <div className="slideshow-content">
                <div
                  className={
                    isInteractive
                      ? 'slideshow-body flex flex-col gap-4'
                      : 'slideshow-body grid gap-5 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-start'
                  }
                >
                  <div className="slideshow-copy-col">
                    <p className="slideshow-copy text-slate-300">{slide.body}</p>
                    <ul className="slideshow-points mt-3 space-y-2">
                      {slide.points.slice(0, 3).map((point) => (
                        <li key={point} className="flex items-start gap-2.5 text-slate-200">
                          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-300" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {isInteractive && slide.interactive ? (
                    <div className="max-h-[min(48vh,520px)] overflow-y-auto rounded-xl border border-white/10 bg-black p-2 sm:p-3">
                      <InteractiveSlidePanel
                        kind={slide.interactive}
                        selectedCard={selectedCard}
                        gradeResult={gradeResult}
                        priceResult={priceResult}
                        onSelectCard={(card) => {
                          setSelectedCard(card)
                          goToId('grade-card')
                        }}
                        onSkipSelect={() => {
                          setSelectedCard(MOCK_CARDS[0])
                          goToId('grade-card')
                        }}
                        onGradeComplete={setGradeResult}
                        onGradeNext={() => goToId('price-card')}
                        onSkipGrade={() => {
                          if (!gradeResult) setGradeResult(DEFAULT_GRADE)
                          goToId('price-card')
                        }}
                        onPriceComplete={setPriceResult}
                        onPriceNext={() => goToId('session-summary')}
                        onSkipPrice={() => {
                          if (!priceResult) setPriceResult(DEFAULT_PRICE)
                          goToId('session-summary')
                        }}
                        onSummaryNext={() => goToId('account-portal')}
                        onRestartSession={resetSession}
                        onPortalBack={() => goToId('session-summary')}
                      />
                    </div>
                  ) : slide.visual ? (
                    <GuideVisualPanel type={slide.visual} tocItems={slide.visual === 'toc' ? tocItems : undefined} />
                  ) : null}
                </div>
              </div>
            </motion.div>
          </main>

          <footer className="slideshow-footer">
          <div className="slideshow-footer__inner">
            <div className="slideshow-footer__dots" role="tablist" aria-label="Slide navigation">
              {GUIDE_SLIDES.map((item, index) => (
                <DotNavButton
                  key={item.id}
                  index={index}
                  active={index === activeIndex}
                  label={`Go to slide ${index + 1}`}
                  popoutTitle={`Jump to slide ${index + 1}?`}
                  popoutSubtitle={displaySlideTitle(item.title)}
                  onConfirm={() => goTo(index)}
                >
                  <SlidePreview targetSlide={item} actionLabel={`Open ${PHASE_LABELS[item.phase]} · ${displaySlideTitle(item.title)}`} />
                </DotNavButton>
              ))}
            </div>

            <div className="slideshow-footer__controls">
              {!isInteractive && (
                <div className="slideshow-btn-group">
                  <ActionButton
                    variant="settings"
                    size="sm"
                    iconOnly
                    active={autoPlayEnabled}
                    settingsState={autoPlayEnabled ? 'pause' : 'play'}
                    label={autoPlayEnabled ? 'Pause autoplay' : 'Resume autoplay'}
                    popoutTitle="Slideshow settings"
                    popoutSubtitle="Control timed autoplay for guide slides"
                    confirmLabel={autoPlayEnabled ? 'Keep autoplay on' : 'Resume autoplay'}
                    onConfirm={() => setAutoPlayEnabled(true)}
                  >
                    <AutoplayPopout enabled={autoPlayEnabled} onToggle={() => setAutoPlayEnabled((prev) => !prev)} />
                  </ActionButton>
                </div>
              )}

              <div className="slideshow-btn-group slideshow-btn-group--nav">
                <ActionButton
                  variant="previous"
                  size="sm"
                  displayLabel="Back"
                  label="Previous slide"
                  disabled={activeIndex === 0 || isAnimating || !!trailTransition}
                  popoutTitle="Go to previous slide?"
                  popoutSubtitle={activeIndex > 0 ? displaySlideTitle(GUIDE_SLIDES[activeIndex - 1].title) : undefined}
                  confirmLabel="Back"
                  onConfirm={goPrev}
                >
                  {activeIndex > 0 ? (
                    <SlidePreview targetSlide={GUIDE_SLIDES[activeIndex - 1]} actionLabel="Step back one slide" />
                  ) : (
                    <p className="text-sm text-slate-400">You are on the first slide.</p>
                  )}
                </ActionButton>

                <ActionButton
                  variant="continue"
                  size="sm"
                  displayLabel={isLast ? 'Dashboard' : isInteractive ? 'Skip' : 'Next'}
                  label={isLast ? 'Open seller dashboard' : isInteractive ? 'Skip step' : 'Next slide'}
                  disabled={isAnimating || !!trailTransition}
                  popoutTitle={
                    isLast ? 'Open the live seller dashboard?' : isInteractive ? 'Skip this interactive step?' : 'Continue to next slide?'
                  }
                  popoutSubtitle={
                    isLast ? SELLER_URL : !isInteractive ? displaySlideTitle(GUIDE_SLIDES[activeIndex + 1]?.title ?? '') : displaySlideTitle(slide.title)
                  }
                  confirmLabel={isLast ? 'Open dashboard' : isInteractive ? 'Skip step' : 'Continue'}
                  onConfirm={goNext}
                >
                  {isLast ? (
                    <div className="space-y-4">
                      <SlidePreview targetSlide={slide} actionLabel="Finish the guide and open tcgNakama seller dashboard" />
                      <a
                        href={SITE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-center text-sm text-slate-300"
                      >
                        Or browse the marketplace
                      </a>
                    </div>
                  ) : isInteractive ? (
                    <SlidePreview targetSlide={slide} actionLabel="Skip manual input and continue with defaults" />
                  ) : (
                    <SlidePreview targetSlide={GUIDE_SLIDES[activeIndex + 1]} actionLabel="Advance to the next guide slide" />
                  )}
                </ActionButton>
              </div>
            </div>
          </div>
        </footer>
        </>
      )}
    </div>
  )
}
