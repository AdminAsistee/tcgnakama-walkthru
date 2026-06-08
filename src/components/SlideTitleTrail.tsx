import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  createTextTrailAnimator,
  hiddenTextTrailOpacities,
  initialTextTrailOpacities,
  trailTransitionMetrics,
} from '../lib/textTrailEffect'
import TextTrailDisplay from './TextTrailDisplay'

export interface TrailTransitionRequest {
  fromTitle: string
  toTitle: string
  targetIndex: number
}

interface SlideTitleTrailProps {
  trailTransition: TrailTransitionRequest | null
  onSwap: () => void
  onComplete: () => void
}

type PanelVisibility = 'hidden' | 'visible'

const PANEL_FADE_MS = 240
const TITLE_EXIT_MS = 200

function wait(ms: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, ms))
}

function waitPanelFade(node: HTMLDivElement | null) {
  return new Promise<void>((resolve) => {
    if (!node) {
      resolve()
      return
    }

    const timeout = window.setTimeout(resolve, PANEL_FADE_MS + 40)
    const onEnd = (event: TransitionEvent) => {
      if (event.target !== node || event.propertyName !== 'opacity') return
      window.clearTimeout(timeout)
      node.removeEventListener('transitionend', onEnd)
      resolve()
    }

    node.addEventListener('transitionend', onEnd)
  })
}

export default function SlideTitleTrail({ trailTransition, onSwap, onComplete }: SlideTitleTrailProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [panelVisible, setPanelVisible] = useState<PanelVisibility>('hidden')
  const [overlayText, setOverlayText] = useState('')
  const [overlayLines, setOverlayLines] = useState<string[]>([''])
  const [fontScale, setFontScale] = useState(1)
  const [titleVisible, setTitleVisible] = useState(true)
  const [opacities, setOpacities] = useState<number[]>(initialTextTrailOpacities)
  const animatorRef = useRef(createTextTrailAnimator(setOpacities))
  const runIdRef = useRef(0)

  const onSwapRef = useRef(onSwap)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onSwapRef.current = onSwap
    onCompleteRef.current = onComplete
  }, [onSwap, onComplete])

  useEffect(() => {
    if (!trailTransition) return

    document.body.classList.add('trail-transition-active')
    return () => document.body.classList.remove('trail-transition-active')
  }, [trailTransition])

  useEffect(() => {
    if (!trailTransition) return

    const runId = ++runIdRef.current
    let cancelled = false
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const animator = animatorRef.current
    const transitionMetrics = trailTransitionMetrics(trailTransition.fromTitle, trailTransition.toTitle)
    const { fromTitle, toTitle } = trailTransition

    const isStale = () => cancelled || runId !== runIdRef.current

    const fadePanel = async (visibility: PanelVisibility) => {
      setPanelVisible(visibility)
      await waitPanelFade(panelRef.current)
    }

    const run = async () => {
      setFontScale(transitionMetrics.scale)
      setOverlayText(fromTitle)
      setOverlayLines(transitionMetrics.fromLines)
      setTitleVisible(true)
      animator.resetToMiddle()
      setPanelVisible('hidden')

      if (reducedMotion) {
        onSwapRef.current()
        onCompleteRef.current()
        return
      }

      await wait(16)
      await fadePanel('visible')
      if (isStale()) return

      await animator.hide(() => {
        if (isStale()) return
        setOverlayText(toTitle)
        setOverlayLines(transitionMetrics.toLines)
        setOpacities(hiddenTextTrailOpacities())
      })
      if (isStale()) return

      await animator.show()
      if (isStale()) return

      setTitleVisible(false)
      await wait(TITLE_EXIT_MS)
      if (isStale()) return

      onSwapRef.current()
      await fadePanel('hidden')
      if (isStale()) return

      onCompleteRef.current()
    }

    run()

    return () => {
      cancelled = true
    }
  }, [trailTransition])

  if (!trailTransition) return null

  return createPortal(
    <div className="slideshow-title__trail-scene" aria-hidden="true">
      <div
        ref={panelRef}
        className={`slideshow-title__trail-panel${panelVisible === 'visible' ? ' is-visible' : ' is-hidden'}`}
      >
        <div className="slideshow-title__trail-backdrop" />
        <div className={`slideshow-title__trail-portal-wrap${titleVisible ? '' : ' is-hidden'}`}>
          <TextTrailDisplay
            text={overlayText}
            lines={overlayLines}
            opacities={opacities}
            color="#facc15"
            size="fullscreen"
            fontScale={fontScale}
            className="slideshow-title__trail-portal"
            label={overlayText}
          />
        </div>
      </div>
    </div>,
    document.body
  )
}
