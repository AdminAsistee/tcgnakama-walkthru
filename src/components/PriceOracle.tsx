import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { MockCard } from '../lib/mockData'
import type { GradeResult, PriceResult } from '../lib/api'
import ActionButton from './ActionButton'

interface PriceOracleProps {
  card: MockCard
  grade: GradeResult
  onPriceComplete: (result: PriceResult) => void
  onNext: () => void
  onSkip: () => void
  priceCard: (card: MockCard, grade: number) => Promise<PriceResult>
  embedded?: boolean
  hideHeader?: boolean
}

function gradeColor(score: number) {
  if (score >= 9) return '#4ade80'
  if (score >= 7) return '#C9A84C'
  if (score >= 5) return '#f97316'
  return '#ef4444'
}

function TickerChar({ char, delay }: { char: string; delay: number }) {
  return (
    <motion.span
      initial={{ y: '110%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: 'inline-block' }}
    >
      {char}
    </motion.span>
  )
}

function DataBars() {
  const bars = [
    { label: 'PSA Pop', value: 72 },
    { label: 'Demand', value: 89 },
    { label: 'Rarity', value: 95 },
    { label: 'Condition', value: 68 },
  ]
  return (
    <div className="flex flex-col gap-3">
      {bars.map((bar, i) => (
        <div key={bar.label}>
          <div className="flex justify-between mb-1">
            <span className="font-mono text-xs" style={{ color: '#4a5a7a', fontSize: '0.65rem' }}>{bar.label}</span>
            <motion.span
              className="font-mono text-xs"
              style={{ color: '#C9A84C', fontSize: '0.65rem' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.15 }}
            >
              {bar.value}%
            </motion.span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: '#1e2d4a' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #C9A84C, #e8c06a)' }}
              initial={{ width: 0 }}
              animate={{ width: `${bar.value}%` }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function PriceOracle({ card, grade, onPriceComplete, onNext, onSkip, priceCard, embedded = false, hideHeader = false }: PriceOracleProps) {
  const [phase, setPhase] = useState<'loading' | 'revealing' | 'done'>('loading')
  const [result, setResult] = useState<PriceResult | null>(null)
  const [imgErr, setImgErr] = useState(false)
  const called = useRef(false)

  useEffect(() => {
    if (called.current) return
    called.current = true
    priceCard(card, grade.score).then((r) => {
      setResult(r)
      setPhase('revealing')
      onPriceComplete(r)
      setTimeout(() => setPhase('done'), 300)
    })
  }, [card, grade.score, priceCard, onPriceComplete])

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
              — Step 03 —
            </p>
            <h2 className="font-display font-black text-3xl md:text-5xl mb-3" style={{ fontFamily: 'Cinzel, serif', color: '#f0f4ff' }}>
              {phase === 'loading' ? 'Querying Markets…' : 'Market Valuation'}
            </h2>
            <p className="text-sm" style={{ color: '#4a5a7a' }}>
              {phase === 'loading' ? 'Scanning eBay sold listings and PSA population reports' : 'Market analysis complete'}
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Card + grade badge */}
          <div className="flex flex-col items-center gap-5">
            <div className="relative">
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  width: 200,
                  aspectRatio: '5/7',
                  border: `2px solid ${card.borderColor}50`,
                  boxShadow: `0 0 30px ${card.borderColor}20, 0 20px 50px rgba(0,0,0,0.5)`,
                }}
              >
                {!imgErr ? (
                  <img src={card.imageUrl} alt={card.name} onError={() => setImgErr(true)} className="w-full h-full object-cover" draggable={false} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: card.fallbackGradient }}>
                    <span className="text-5xl">🃏</span>
                  </div>
                )}
              </div>

              {/* Grade badge floating on card */}
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
                className="absolute -bottom-3 -right-3 w-14 h-14 rounded-full flex flex-col items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #0d1526, #111d35)',
                  border: `2.5px solid ${gradeColor(grade.score)}`,
                  boxShadow: `0 0 20px ${gradeColor(grade.score)}50`,
                }}
              >
                <span className="font-mono font-black leading-none" style={{ color: gradeColor(grade.score), fontSize: '1.4rem' }}>
                  {grade.score}
                </span>
                <span className="font-mono" style={{ color: '#4a5a7a', fontSize: '0.45rem', letterSpacing: '0.05em' }}>PSA</span>
              </motion.div>
            </div>

            <div className="text-center">
              <div className="font-display font-bold" style={{ fontFamily: 'Cinzel, serif', color: '#f0f4ff', fontSize: '0.95rem' }}>
                {card.name}
              </div>
              <div className="font-mono text-xs mt-1" style={{ color: '#4a5a7a' }}>
                {card.set} · {card.year}
              </div>
            </div>

            {/* Market signals */}
            <div className="w-full p-4 rounded-xl" style={{ background: 'rgba(13,21,38,0.8)', border: '1px solid #1e2d4a' }}>
              <p className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: '#C9A84C', letterSpacing: '0.2em' }}>
                Market Signals
              </p>
              <DataBars />
            </div>
          </div>

          {/* Price display */}
          <div className="flex flex-col gap-4">
            {/* Loading state */}
            <AnimatePresence mode="wait">
              {phase === 'loading' && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-8 rounded-xl flex flex-col items-center gap-5"
                  style={{ background: 'rgba(13,21,38,0.8)', border: '1px solid #1e2d4a', minHeight: 200 }}
                >
                  <div className="flex items-end gap-1" style={{ height: 48 }}>
                    {[0.4, 0.7, 0.5, 1, 0.6, 0.8, 0.45].map((h, i) => (
                      <motion.div
                        key={i}
                        className="w-3 rounded-sm"
                        style={{ background: 'linear-gradient(to top, #1e2d4a, #C9A84C)' }}
                        animate={{ height: [`${h * 30}%`, `${h * 100}%`, `${h * 30}%`] }}
                        transition={{ duration: 0.9, delay: i * 0.1, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-center" style={{ color: '#4a5a7a' }}>
                    Scanning recent sold listings…
                  </p>
                </motion.div>
              )}

              {/* Price reveal */}
              {phase !== 'loading' && result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-4"
                >
                  <div
                    className="p-6 rounded-xl relative overflow-hidden"
                    style={{ background: 'rgba(13,21,38,0.9)', border: '1px solid #1e2d4a' }}
                  >
                    {/* Background glow */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(201,168,76,0.07) 0%, transparent 70%)' }}
                    />
                    <p className="font-mono text-xs uppercase tracking-widest mb-3 relative" style={{ color: '#4a5a7a', letterSpacing: '0.2em' }}>
                      Estimated Market Range
                    </p>
                    <div className="font-mono font-black overflow-hidden relative" style={{ fontSize: '2.4rem', color: '#C9A84C', lineHeight: 1.1 }}>
                      {result.range.split('').map((ch, i) => (
                        <TickerChar key={i} char={ch} delay={i * 0.04} />
                      ))}
                    </div>
                  </div>

                  <div
                    className="p-5 rounded-xl"
                    style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.15)' }}
                  >
                    <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: '#C9A84C', letterSpacing: '0.2em', fontSize: '0.6rem' }}>
                      Key Price Driver
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: '#c8d8f0' }}>{result.driver}</p>
                  </div>

                  {/* Price context */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Grade Impact', value: grade.score >= 8 ? '↑ Premium' : grade.score >= 6 ? '→ Market' : '↓ Below' },
                      { label: 'Liquidity', value: 'High' },
                    ].map((item) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="p-3 rounded-lg text-center"
                        style={{ background: 'rgba(13,21,38,0.8)', border: '1px solid #1e2d4a' }}
                      >
                        <div className="font-mono text-xs mb-1" style={{ color: '#4a5a7a', fontSize: '0.55rem' }}>{item.label}</div>
                        <div className="font-mono font-bold text-sm" style={{ color: '#C9A84C' }}>{item.value}</div>
                      </motion.div>
                    ))}
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
              displayLabel="Summary"
              label="View session summary"
              popoutTitle="Continue to summary?"
              popoutSubtitle={result ? `${result.range} estimated range` : 'Pricing complete'}
              confirmLabel="View summary"
              onConfirm={onNext}
            >
              <div className="space-y-3">
                {result ? (
                  <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                    <p className="text-sm text-amber-200">{result.range}</p>
                    <p className="mt-2 text-sm text-slate-400">{result.driver}</p>
                  </div>
                ) : null}
                <p className="text-sm text-slate-400">Review grade, price, and storefront coverage on the next slide.</p>
              </div>
            </ActionButton>
          ) : (
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate-500">
              Fetching market signals…
            </p>
          )}

          <ActionButton
            variant="ghost"
            displayLabel="Skip"
            label="Skip pricing"
            popoutTitle="Skip with default estimate?"
            confirmLabel="Skip"
            onConfirm={onSkip}
          >
            <p className="text-sm leading-6 text-slate-400">
              Skip keeps a demo price range so you can finish the walkthrough and open the account portal.
            </p>
          </ActionButton>
        </div>
      </div>
    </motion.div>
  )
}
