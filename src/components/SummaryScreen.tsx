import { motion } from 'framer-motion'
import { useState } from 'react'
import type { MockCard } from '../lib/mockData'
import type { GradeResult, PriceResult } from '../lib/api'
import ActionButton from './ActionButton'

interface SummaryScreenProps {
  card: MockCard
  grade: GradeResult
  price: PriceResult
  onRestart: () => void
  onGetStarted: () => void
  embedded?: boolean
  hideHeader?: boolean
}

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

export default function SummaryScreen({ card, grade, price, onRestart, onGetStarted, embedded = false, hideHeader = false }: SummaryScreenProps) {
  const [imgErr, setImgErr] = useState(false)
  const featureRecap = [
    { title: 'Hero storefront', text: 'Category-led landing page with Pokemon, One Piece, and Magic entry points.' },
    { title: 'Trending now', text: 'Live inventory and fresh pulls with visible condition and price context.' },
    { title: "What's hot", text: 'Market movers and percentage change callouts to explain demand.' },
    { title: 'Grails', text: 'Premium in-stock cards highlighted as high-value inventory.' },
    { title: 'Concierge', text: 'Treasure Hunt sourcing for rare cards with no obligation to buy.' },
    { title: 'CardBot', text: 'Guided support for pricing questions, discovery, and inventory help.' },
  ]

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <motion.div
      className={embedded ? 'w-full px-1 py-2' : 'flex flex-col items-center min-h-screen px-4 pt-24 pb-32'}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="w-full max-w-5xl">
        {!hideHeader && (
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
              className="inline-block mb-4 w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #C9A84C, #9a7a30)', boxShadow: '0 0 40px rgba(201,168,76,0.4)' }}
            >
              <span style={{ fontSize: '1.8rem' }}>✦</span>
            </motion.div>
            <p className="font-mono text-xs tracking-widest uppercase mb-3 block" style={{ color: '#C9A84C', letterSpacing: '0.3em' }}>
              — Analysis Complete —
            </p>
            <h2 className="font-display font-black text-3xl md:text-5xl" style={{ fontFamily: 'Cinzel, serif', color: '#f0f4ff' }}>
              Storefront Summary
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6" style={{ color: '#4a5a7a' }}>
              The flow now mirrors the tcgnakama storefront more closely: category browsing, live inventory, market movers, concierge sourcing, and support bot
              discovery are all explained before and after the demo.
            </p>
          </div>
        )}

        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.div
            variants={itemVariants}
            className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] mb-5"
          >
            <div
              className="flex gap-6 p-6 rounded-2xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(13,21,38,0.98) 0%, rgba(13,21,38,0.86) 100%)',
                border: `1.5px solid ${card.borderColor}30`,
                boxShadow: `0 0 40px ${card.borderColor}12`,
              }}
            >
              {!imgErr && (
                <div
                  className="absolute inset-0 opacity-5 pointer-events-none"
                  style={{ backgroundImage: `url(${card.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(8px)' }}
                />
              )}

              <div className="relative flex-shrink-0">
                <div
                  className="rounded-xl overflow-hidden"
                  style={{
                    width: 108,
                    aspectRatio: '5/7',
                    border: `2px solid ${card.borderColor}55`,
                    boxShadow: `0 0 24px ${card.borderColor}25`,
                  }}
                >
                  {!imgErr ? (
                    <img src={card.imageUrl} alt={card.name} onError={() => setImgErr(true)} className="w-full h-full object-cover" draggable={false} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: card.fallbackGradient }}>
                      <span className="text-3xl">🃏</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 relative z-10">
                <div className="font-display font-black text-2xl mb-1" style={{ fontFamily: 'Cinzel, serif', color: '#f0f4ff' }}>
                  {card.name}
                </div>
                <div className="font-mono text-xs mb-4" style={{ color: '#4a5a7a' }}>
                  {card.set} · {card.year} · {card.rarity}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <div className="text-[11px] uppercase tracking-[0.2em]" style={{ color: '#C9A84C' }}>PSA Grade</div>
                    <div className="mt-1 text-2xl font-black" style={{ color: gradeColor(grade.score) }}>{grade.score}</div>
                    <div className="mt-1 text-[11px] uppercase tracking-[0.18em]" style={{ color: '#4a5a7a' }}>{gradeLabel(grade.score)}</div>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <div className="text-[11px] uppercase tracking-[0.2em]" style={{ color: '#C9A84C' }}>Price Range</div>
                    <div className="mt-1 text-lg font-semibold" style={{ color: '#f0f4ff' }}>{price.range}</div>
                    <div className="mt-1 text-[11px] uppercase tracking-[0.18em]" style={{ color: '#4a5a7a' }}>Market range</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="text-xs uppercase tracking-[0.25em]" style={{ color: '#C9A84C' }}>Feature Coverage</div>
              <h3 className="mt-2 text-xl font-semibold text-slate-50">Everything mirrored from the reference site</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {featureRecap.map((item) => (
                  <div key={item.title} className="rounded-xl border border-white/10 bg-black/20 p-3">
                    <div className="text-sm font-medium text-slate-100">{item.title}</div>
                    <p className="mt-1 text-xs leading-5 text-slate-400">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card showcase hero */}
          <motion.div
            variants={itemVariants}
            className="grid gap-5 md:grid-cols-2 mb-5"
          >
            <div className="p-4 rounded-2xl" style={{ background: 'rgba(13,21,38,0.7)', border: '1px solid #1e2d4a' }}>
              <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: '#C9A84C', letterSpacing: '0.2em', fontSize: '0.55rem' }}>
                Grading Notes
              </p>
              <p className="text-sm leading-relaxed" style={{ color: '#8899bb' }}>{grade.reasoning}</p>
            </div>
            <div className="p-4 rounded-2xl" style={{ background: 'rgba(13,21,38,0.7)', border: '1px solid #1e2d4a' }}>
              <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: '#C9A84C', letterSpacing: '0.2em', fontSize: '0.55rem' }}>
                Price Driver
              </p>
              <p className="text-sm leading-relaxed" style={{ color: '#8899bb' }}>{price.driver}</p>
            </div>
          </motion.div>

          {/* Notes */}
          <div className="grid gap-4 md:grid-cols-3 mb-5">
            {[
              { title: 'Trending rails', value: 'Fresh pulls + live inventory' },
              { title: 'Storefront tools', value: 'Collections + CardBot guidance' },
              { title: 'Concierge flow', value: 'Treasure Hunt sourcing' },
            ].map((item) => (
              <motion.div key={item.title} variants={itemVariants} className="rounded-xl p-4" style={{ background: 'rgba(13,21,38,0.7)', border: '1px solid #1e2d4a' }}>
                <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: '#C9A84C', letterSpacing: '0.2em', fontSize: '0.55rem' }}>
                  {item.title}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: '#8899bb' }}>{item.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Divider */}
          <motion.div
            variants={itemVariants}
            className="mb-6"
            style={{ height: 1, background: 'linear-gradient(90deg, transparent, #1e2d4a, transparent)' }}
          />

          {/* CTAs */}
          <motion.div variants={itemVariants} className="slideshow-cta-row">
            <ActionButton
              variant="ghost"
              displayLabel="Restart"
              label="Try another card"
              popoutTitle="Restart interactive session?"
              confirmLabel="Restart"
              onConfirm={onRestart}
            >
              <p className="text-sm leading-6 text-slate-400">
                Return to card selection and run grading and pricing again with a different demo card.
              </p>
            </ActionButton>
            <ActionButton
              variant="continue"
              displayLabel="Account"
              label="Open account portal"
              popoutTitle="Continue to account setup?"
              popoutSubtitle={`${card.name} · PSA ${grade.score} · ${price.range}`}
              confirmLabel="Continue"
              onConfirm={onGetStarted}
            >
              <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-slate-300">
                Grade PSA {grade.score} · {price.range}
              </div>
            </ActionButton>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
