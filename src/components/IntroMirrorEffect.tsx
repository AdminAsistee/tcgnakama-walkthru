import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { MIRROR_SLIDES } from '../lib/mirrorSlideImages'

const AUTO_MS = 5000
const VISIBLE_AREA = 1
const TILT_FACTOR = 0.6
const TILT_ROTATION = 6

function lineEq(y2: number, y1: number, x2: number, x1: number, currentVal: number) {
  const m = (y2 - y1) / (x2 - x1)
  const b = y1 - m * x1
  return m * currentVal + b
}

function restTranslateX(visibleArea: number) {
  return `${Math.ceil((1 - visibleArea) * 100)}%`
}

interface MirrorSideProps {
  src: string
  alt: string
  side: 'one' | 'two'
  revealed: boolean
  translateX: string
  rotateZ: number
}

function MirrorSide({ src, alt, side, revealed, translateX, rotateZ }: MirrorSideProps) {
  return (
    <div className={`mirror__side mirror__side--${side}`}>
      <motion.img
        src={src}
        alt={alt}
        draggable={false}
        className="mirror__img"
        initial={{ x: '100%', opacity: 0, rotateZ: 0 }}
        animate={{
          x: revealed ? translateX : '100%',
          opacity: revealed ? 1 : 0,
          rotateZ: revealed ? rotateZ : 0,
        }}
        exit={{ x: '100%', opacity: 0, rotateZ: 0 }}
        transition={{
          duration: revealed ? 1.35 : 0.55,
          ease: revealed ? [0.16, 1, 0.3, 1] : [0.22, 1, 0.36, 1],
        }}
      />
    </div>
  )
}

interface IntroMirrorEffectProps {
  showBrand?: boolean
}

export default function IntroMirrorEffect({ showBrand = true }: IntroMirrorEffectProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [translateX, setTranslateX] = useState(restTranslateX(VISIBLE_AREA))
  const [tiltRotate, setTiltRotate] = useState(0)
  const slideCount = MIRROR_SLIDES.length
  const slide = MIRROR_SLIDES[activeIndex] ?? MIRROR_SLIDES[0]

  useEffect(() => {
    MIRROR_SLIDES.forEach((item) => {
      const img = new Image()
      img.src = item.image
    })
  }, [])

  useEffect(() => {
    if (slideCount === 0) return
    setRevealed(false)
    setTranslateX(restTranslateX(VISIBLE_AREA))
    const timer = window.setTimeout(() => setRevealed(true), 80)
    return () => window.clearTimeout(timer)
  }, [activeIndex, slideCount])

  useEffect(() => {
    if (slideCount <= 1) return
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slideCount)
    }, AUTO_MS)
    return () => window.clearInterval(timer)
  }, [slideCount])

  useEffect(() => {
    if (!revealed || slideCount === 0) return

    const handleMouseMove = (event: MouseEvent) => {
      const winWidth = window.innerWidth
      const winHeight = window.innerHeight
      const relX = event.clientX
      const relY = event.clientY
      const mid = winWidth / 2

      const tVal =
        relX < mid
          ? lineEq(VISIBLE_AREA, VISIBLE_AREA * TILT_FACTOR, mid, 0, relX)
          : lineEq(VISIBLE_AREA * TILT_FACTOR, VISIBLE_AREA, winWidth, mid, relX)

      setTranslateX(`${Math.ceil((1 - tVal) * 100)}%`)
      setTiltRotate((TILT_ROTATION / winHeight) * relY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [revealed, slideCount])

  useEffect(() => {
    if (!revealed) {
      setTranslateX(restTranslateX(VISIBLE_AREA))
      setTiltRotate(0)
    }
  }, [revealed])

  if (!slide) return null

  return (
    <div className="intro-mirror-bg intro-mirror-bg--demo3">
      {showBrand ? (
        <div className="intro-mirror-bg__brand" aria-hidden="true">
          <span className="intro-mirror-bg__brand-tcg">TCG</span>
          <span className="intro-mirror-bg__brand-nakama">NAKAMA</span>
        </div>
      ) : null}

      <div className="intro-mirror-bg__slide">
        <div className="mirror mirror--demo3" data-tilt>
          <AnimatePresence mode="wait">
            <motion.div key={slide.id} className="mirror__demo3-row">
              <MirrorSide
                src={slide.image}
                alt={slide.title}
                side="one"
                revealed={revealed}
                translateX={translateX}
                rotateZ={tiltRotate}
              />
              <MirrorSide
                src={slide.image}
                alt=""
                side="two"
                revealed={revealed}
                translateX={translateX}
                rotateZ={tiltRotate}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
