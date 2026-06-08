import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { MockCard } from '../lib/mockData'
import type { GradeResult } from '../lib/api'
import ActionButton from './ActionButton'

interface GradeRevealProps {
  card: MockCard
  onGradeComplete: (result: GradeResult) => void
  onNext: () => void
  onSkip: () => void
  gradeCard: (card: MockCard) => Promise<GradeResult>
  embedded?: boolean
  hideHeader?: boolean
}

const CIRCUMFERENCE = 2 * Math.PI * 52

const CRITERIA = ['Surface Integrity', 'Corner Sharpness', 'Edge Wear', 'Print Quality', 'Centering']

function gradeColor(score: number) {
  if (score >= 9) return '#4ade80'
  if (score >= 7) return '#C9A84C'
  if (score >= 5) return '#f97316'
  return '#ef4444'
}

function gradeLabel(score: number) {
  if (score === 10) return 'GEM MINT'
  if (score === 9) return 'MINT'
  if (score >= 7) return 'NEAR MINT'
  if (score >= 5) return 'EXCELLENT'
  if (score >= 3) return 'VERY GOOD'
  return 'POOR'
}

function ScoreRing({ score, show }: { score: number; show: boolean }) {
  const [count, setCount] = useState(0)
  const color = gradeColor(score)
  const offset = CIRCUMFERENCE * (1 - score / 10)

  useEffect(() => {
    if (!show) return
    let frame = 0
    const total = 80
    const tick = () => {
      frame++
      setCount(Math.round(score * Math.min(frame / total, 1)))
      if (frame < total) requestAnimationFrame(tick)
    }
    const t = setTimeout(() => requestAnimationFrame(tick), 600)
    return () => clearTimeout(t)
  }, [show, score])

  return (
    <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
      {/* Outer glow */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: 180, height: 180, background: `radial-gradient(circle, ${color}20 0%, transparent 70%)` }}
        animate={show ? { opacity: [0, 1], scale: [0.8, 1] } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      />

      <svg width="180" height="180" viewBox="0 0 120 120">
        {/* Track */}
        <circle cx="60" cy="60" r="52" fill="none" stroke="#1e2d4a" strokeWidth="7" />
        {/* Tick marks */}
        {Array.from({ length: 10 }).map((_, i) => {
          const angle = (i / 10) * 360 - 90
          const rad = (angle * Math.PI) / 180
          const x1 = 60 + 48 * Math.cos(rad)
          const y1 = 60 + 48 * Math.sin(rad)
          const x2 = 60 + 44 * Math.cos(rad)
          const y2 = 60 + 44 * Math.sin(rad)
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2a3d5a" strokeWidth="1.5" />
        })}
        {/* Fill arc */}
        <motion.circle
          cx="60" cy="60" r="52"
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          style={{
            strokeDasharray: CIRCUMFERENCE,
            rotate: -90,
            transformOrigin: 'center',
          }}
          initial={{ strokeDashoffset: CIRCUMFERENCE }}
          animate={show ? { strokeDashoffset: offset } : { strokeDashoffset: CIRCUMFERENCE }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
        />
      </svg>

      {/* Score number */}
      <div className="absolute flex flex-col items-center leading-none">
        <motion.span
          className="font-mono font-black"
          style={{ fontSize: '3.2rem', color, lineHeight: 1 }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={show ? { opacity: 1, scale: 1 } : { opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.5 }}
        >
          {count}
        </motion.span>
        <span className="font-mono text-xs mt-1" style={{ color: '#4a5a7a' }}>/10 PSA</span>
      </div>
    </div>
  )
}

export default function GradeReveal({ card, onGradeComplete, onNext, onSkip, gradeCard, embedded = false, hideHeader = false }: GradeRevealProps) {
  const [phase, setPhase] = useState<'scanning' | 'revealing' | 'done'>('scanning')
  const [result, setResult] = useState<GradeResult | null>(null)
  const [criteriaStates, setCriteriaStates] = useState<boolean[]>(Array(5).fill(false))
  const [imgErr, setImgErr] = useState(false)
  const called = useRef(false)

  useEffect(() => {
    if (called.current) return
    called.current = true

    // Stagger criteria checks while waiting for API
    CRITERIA.forEach((_, i) => {
      setTimeout(() => {
        setCriteriaStates((prev) => { const next = [...prev]; next[i] = true; return next })
      }, 400 + i * 350)
    })

    gradeCard(card).then((r) => {
      setResult(r)
      setPhase('revealing')
      onGradeComplete(r)
      setTimeout(() => setPhase('done'), 400)
    })
  }, [card, gradeCard, onGradeComplete])

  return (
    <motion.div
      className={embedded ? 'w-full px-1 py-2' : 'flex flex-col items-center min-h-screen pt-24 pb-32 px-4'}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-3xl w-full">
        {!hideHeader && (
          <div className="text-center mb-10">
            <p className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: '#C9A84C', letterSpacing: '0.3em' }}>
              — Step 02 —
            </p>
            <h2 className="font-display font-black text-3xl md:text-5xl mb-3" style={{ fontFamily: 'Cinzel, serif', color: '#f0f4ff' }}>
              {phase === 'scanning' ? 'AI Grading…' : 'Grade Report'}
            </h2>
            <p className="text-sm" style={{ color: '#4a5a7a' }}>
              {phase === 'scanning' ? 'Analyzing surface integrity and print quality' : 'Analysis complete'}
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Card with scanner */}
          <div className="flex flex-col items-center">
            <motion.div
              className="relative rounded-xl overflow-hidden"
              style={{
                width: 220,
                aspectRatio: '5/7',
                border: `2px solid ${card.borderColor}60`,
                boxShadow: `0 0 40px ${card.borderColor}25, 0 20px 60px rgba(0,0,0,0.6)`,
              }}
              animate={phase === 'scanning' ? { boxShadow: [`0 0 20px ${card.borderColor}20`, `0 0 50px ${card.borderColor}50`, `0 0 20px ${card.borderColor}20`] } : {}}
              transition={{ duration: 2, repeat: phase === 'scanning' ? Infinity : 0 }}
            >
              {!imgErr ? (
                <img src={card.imageUrl} alt={card.name} onError={() => setImgErr(true)} className="w-full h-full object-cover" draggable={false} />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: card.fallbackGradient }}>
                  <span className="text-6xl">🃏</span>
                </div>
              )}

              {/* Scanning line */}
              <AnimatePresence>
                {phase === 'scanning' && (
                  <motion.div
                    className="absolute left-0 right-0 pointer-events-none"
                    style={{ height: 2, background: `linear-gradient(90deg, transparent, ${card.accentColor}, rgba(255,255,255,0.9), ${card.accentColor}, transparent)` }}
                    initial={{ top: '0%' }}
                    animate={{ top: ['0%', '100%', '0%'] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                  />
                )}
              </AnimatePresence>

              {/* Scan grid overlay */}
              {phase === 'scanning' && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.15, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{
                    backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 18px, ${card.accentColor}30 18px, ${card.accentColor}30 19px), repeating-linear-gradient(90deg, transparent, transparent 18px, ${card.accentColor}30 18px, ${card.accentColor}30 19px)`,
                  }}
                />
              )}
            </motion.div>

            {/* Card details below */}
            <div className="text-center mt-4">
              <div className="font-display font-bold" style={{ fontFamily: 'Cinzel, serif', color: '#f0f4ff', fontSize: '0.95rem' }}>
                {card.name}
              </div>
              <div className="font-mono text-xs mt-1" style={{ color: '#4a5a7a' }}>
                {card.set} · {card.year} · {card.rarity}
              </div>
            </div>
          </div>

          {/* Results panel */}
          <div className="flex flex-col gap-5">
            {/* Criteria checklist */}
            <div
              className="p-5 rounded-xl"
              style={{ background: 'rgba(13,21,38,0.8)', border: '1px solid #1e2d4a' }}
            >
              <p className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: '#C9A84C', letterSpacing: '0.2em' }}>
                Grading Criteria
              </p>
              <div className="flex flex-col gap-2.5">
                {CRITERIA.map((criterion, i) => (
                  <motion.div
                    key={criterion}
                    className="flex items-center justify-between"
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: criteriaStates[i] ? 1 : 0.3 }}
                  >
                    <span className="text-sm" style={{ color: criteriaStates[i] ? '#c8d8f0' : '#3a4a6a' }}>
                      {criterion}
                    </span>
                    <motion.div
                      className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: criteriaStates[i] ? '#C9A84C' : '#1e2d4a' }}
                      animate={criteriaStates[i] ? { scale: [1.4, 1] } : { scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      {criteriaStates[i] && <span style={{ fontSize: '0.5rem', color: '#080c14', fontWeight: 800 }}>✓</span>}
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Score */}
            <AnimatePresence>
              {phase !== 'scanning' && result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-4 p-5 rounded-xl"
                  style={{ background: 'rgba(13,21,38,0.8)', border: '1px solid #1e2d4a' }}
                >
                  <ScoreRing score={result.score} show={true} />

                  <div className="text-center">
                    <div
                      className="font-display font-bold text-xl tracking-widest"
                      style={{ fontFamily: 'Cinzel, serif', color: gradeColor(result.score) }}
                    >
                      {gradeLabel(result.score)}
                    </div>
                  </div>

                  <div className="w-full p-3 rounded-lg" style={{ background: 'rgba(8,12,20,0.6)', border: '1px solid #1a2535' }}>
                    <p className="text-xs leading-relaxed" style={{ color: '#8899bb' }}>{result.reasoning}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8" style={{ height: 1, background: 'linear-gradient(90deg, transparent, #1e2d4a, transparent)' }} />

        {/* Actions */}
        <div className="slideshow-cta-row">
          {phase === 'done' ? (
            <ActionButton
              variant="continue"
              displayLabel="Check price"
              label="Check market price"
              popoutTitle="Continue to pricing?"
              popoutSubtitle={`PSA ${result?.score ?? 7} grade ready for market lookup`}
              confirmLabel="Check price"
              onConfirm={onNext}
            >
              <div className="space-y-3">
                <p className="text-sm text-slate-300">
                  Open the live pricing step to see demand signals and estimated range for this grade.
                </p>
                {result ? (
                  <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-slate-200">
                    Score PSA {result.score} · {result.reasoning}
                  </div>
                ) : null}
              </div>
            </ActionButton>
          ) : (
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate-500">
              Scanning card…
            </p>
          )}

          <ActionButton
            variant="ghost"
            displayLabel="Skip"
            label="Skip grading"
            popoutTitle="Skip with default grade?"
            confirmLabel="Skip"
            onConfirm={onSkip}
          >
            <p className="text-sm leading-6 text-slate-400">
              Skip applies a default PSA 7 estimate so you can still explore pricing and account setup.
            </p>
          </ActionButton>
        </div>
      </div>
    </motion.div>
  )
}
