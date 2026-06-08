import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import type { MockCard } from '../lib/mockData'
import ActionButton from './ActionButton'

const GAME_LABELS: Record<string, string> = { pokemon: 'Pokémon', mtg: 'Magic', yugioh: 'Yu-Gi-Oh!' }
const GAME_COLORS: Record<string, string> = { pokemon: '#ffba08', mtg: '#c4b5fd', yugioh: '#90e0ef' }

function TiltCard({ card, isSelected, onClick }: { card: MockCard; isSelected: boolean; onClick: () => void }) {
  const [imgErr, setImgErr] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [shimmer, setShimmer] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const nx = (e.clientX - r.left) / r.width
    const ny = (e.clientY - r.top) / r.height
    setTilt({ x: (ny - 0.5) * 18, y: (nx - 0.5) * -18 })
    setShimmer({ x: nx * 100, y: ny * 100 })
  }

  const handleMouseLeave = () => {
    setHovered(false)
    setTilt({ x: 0, y: 0 })
  }

  return (
    <div
      style={{ perspective: 900 }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className="cursor-pointer select-none"
    >
      <motion.div
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
          scale: hovered ? 1.07 : 1,
          y: hovered ? -10 : 0,
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          style={{
            position: 'relative',
            borderRadius: 12,
            aspectRatio: '5 / 7',
            width: '100%',
            overflow: 'hidden',
            background: '#080c14',
            border: isSelected
              ? `2.5px solid ${card.borderColor}`
              : hovered
                ? `1.5px solid ${card.borderColor}88`
                : '1.5px solid rgba(30,45,74,0.9)',
            boxShadow: isSelected
              ? `0 0 32px ${card.borderColor}55, 0 20px 40px rgba(0,0,0,0.6)`
              : hovered
                ? `0 0 20px ${card.borderColor}30, 0 24px 40px rgba(0,0,0,0.5)`
                : '0 8px 24px rgba(0,0,0,0.4)',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
        >
          {/* Card image */}
          {!imgErr ? (
            <img
              src={card.imageUrl}
              alt={card.name}
              onError={() => setImgErr(true)}
              draggable={false}
              style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: card.fallbackGradient,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '2.5rem' }}>🃏</span>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Cinzel, serif', fontSize: '0.5rem', textAlign: 'center', padding: '0 8px', marginTop: 4 }}>
                {card.name}
              </span>
            </div>
          )}

          {/* Mouse-tracked foil shimmer — plain div, no motion values */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              mixBlendMode: 'screen',
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.2s',
              background: `radial-gradient(ellipse 55% 55% at ${shimmer.x}% ${shimmer.y}%, rgba(255,255,255,0.2) 0%, rgba(190,160,255,0.08) 45%, transparent 70%)`,
            }}
          />

          {/* Sweep shimmer on hover */}
          {hovered && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                background: 'linear-gradient(110deg, transparent 30%, rgba(255,220,120,0.1) 44%, rgba(255,255,255,0.18) 50%, rgba(200,168,255,0.1) 56%, transparent 68%)',
                backgroundSize: '250% 100%',
                animation: 'foilSweep 3s linear infinite',
              }}
            />
          )}

          {/* Selected checkmark */}
          <AnimatePresence>
            {isSelected && (
              <motion.div
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.4 }}
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: card.borderColor,
                  boxShadow: `0 0 14px ${card.borderColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: '0.7rem', color: '#080c14', fontWeight: 800 }}>✓</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom gradient label */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '16px 8px 6px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontFamily: 'Cinzel, serif', color: '#f0f4ff', fontSize: '0.5rem', letterSpacing: '0.06em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {card.name}
            </span>
            <span style={{ fontSize: '0.4rem', background: GAME_COLORS[card.game], color: '#080c14', fontWeight: 700, padding: '1px 5px', borderRadius: 3, flexShrink: 0, marginLeft: 4, fontFamily: 'monospace' }}>
              {GAME_LABELS[card.game]}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

interface CardSelectorProps {
  cards: MockCard[]
  onGrade: (card: MockCard) => void
  onSkip: () => void
  embedded?: boolean
  hideHeader?: boolean
}

export default function CardSelector({ cards, onGrade, onSkip, embedded = false, hideHeader = false }: CardSelectorProps) {
  const [selected, setSelected] = useState<MockCard | null>(null)

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
          <>
            <div className="text-center mb-10">
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ color: '#C9A84C', letterSpacing: '0.3em', fontSize: '0.62rem', fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: 12 }}
              >
                — Step 01 —
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{ fontFamily: 'Cinzel, serif', color: '#f0f4ff', fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 10 }}
              >
                Select a Card
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{ color: '#4a5a7a', fontSize: '0.85rem' }}
              >
                Hover to inspect · Click to select · Then grade it
              </motion.p>
            </div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              style={{ height: 1, background: 'linear-gradient(90deg, transparent, #1e2d4a, transparent)', marginBottom: 32 }}
            />
          </>
        )}

        {/* Card grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <TiltCard
                card={card}
                isSelected={selected?.id === card.id}
                onClick={() => setSelected(card)}
              />
              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <p style={{ color: '#3a4a6a', fontSize: '0.58rem', fontFamily: 'monospace' }}>
                  {card.set} · {card.year}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Selected detail */}
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="mb-6"
            >
              <div
                className="p-4 rounded-xl flex items-center gap-4"
                style={{
                  background: 'rgba(13,21,38,0.95)',
                  border: `1px solid ${selected.borderColor}35`,
                }}
              >
                <div
                  className="flex-shrink-0 rounded-lg overflow-hidden"
                  style={{ width: 40, height: 56, border: `1.5px solid ${selected.borderColor}50` }}
                >
                  <img
                    src={selected.imageUrl}
                    alt={selected.name}
                    draggable={false}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div style={{ fontFamily: 'Cinzel, serif', color: '#f0f4ff', fontSize: '0.9rem', fontWeight: 700 }}>
                    {selected.name}
                  </div>
                  <div style={{ fontFamily: 'monospace', color: '#4a5a7a', fontSize: '0.6rem', marginTop: 2 }}>
                    {selected.set} · {selected.year} · {selected.rarity}
                  </div>
                </div>
                <span
                  className="flex-shrink-0"
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 5,
                    background: `${GAME_COLORS[selected.game]}18`,
                    color: GAME_COLORS[selected.game],
                    border: `1px solid ${GAME_COLORS[selected.game]}35`,
                  }}
                >
                  {GAME_LABELS[selected.game]}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Divider */}
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #1e2d4a, transparent)', marginBottom: 24 }} />

        {/* Actions */}
        <div className="slideshow-cta-row">
          <ActionButton
            variant="continue"
            displayLabel="Grade card"
            label="Grade this card"
            disabled={!selected}
            popoutTitle="Grade selected card?"
            popoutSubtitle={selected ? `${selected.name} · ${selected.set}` : 'Select a card first'}
            confirmLabel="Start grading"
            onConfirm={() => selected && onGrade(selected)}
          >
            {selected ? (
              <div className="space-y-4">
                <div
                  className="flex items-center gap-4 rounded-xl p-4"
                  style={{
                    background: 'rgba(13,21,38,0.95)',
                    border: `1px solid ${selected.borderColor}35`,
                  }}
                >
                  <div
                    className="flex-shrink-0 overflow-hidden rounded-lg"
                    style={{ width: 56, height: 78, border: `1.5px solid ${selected.borderColor}50` }}
                  >
                    <img
                      src={selected.imageUrl}
                      alt={selected.name}
                      draggable={false}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Cinzel, serif', color: '#f0f4ff', fontSize: '1rem', fontWeight: 700 }}>
                      {selected.name}
                    </div>
                    <div style={{ fontFamily: 'monospace', color: '#4a5a7a', fontSize: '0.65rem', marginTop: 4 }}>
                      {selected.set} · {selected.year} · {selected.rarity}
                    </div>
                  </div>
                </div>
                <p className="text-sm leading-6 text-slate-400">
                  AI grading checks surface, corners, edges, and centering before you buy or list this card.
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-400">Pick a card from the grid to inspect it here.</p>
            )}
          </ActionButton>

          <ActionButton
            variant="ghost"
            displayLabel="Skip"
            label="Skip card selection"
            popoutTitle="Skip with default card?"
            popoutSubtitle="Continue grading with the demo default"
            confirmLabel="Skip"
            onConfirm={onSkip}
          >
            <p className="text-sm leading-6 text-slate-400">
              Skip keeps the walkthrough moving with the first demo card so you can still try grading and pricing.
            </p>
          </ActionButton>
        </div>
      </div>
    </motion.div>
  )
}
