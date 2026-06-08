import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { createProfile } from '../lib/api'
import type { ProfileData } from '../lib/api'

interface ProfileCreateProps {
  onBack: () => void
  embedded?: boolean
}

// ── Plans ─────────────────────────────────────────────────────────────────────

interface Plan {
  id: 'free' | 'pro' | 'enterprise'
  name: string
  price: string
  period: string
  badge?: string
  features: string[]
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Collector',
    price: '$0',
    period: 'forever',
    features: [
      '5 card grades per month',
      'Community price estimates',
      'Pokémon, MTG & Yu-Gi-Oh',
      'Demo access',
    ],
  },
  {
    id: 'pro',
    name: 'Investor',
    price: '$19',
    period: 'per month',
    badge: 'Most Popular',
    features: [
      'Unlimited card grading',
      'Live market pricing',
      'Portfolio tracker',
      'CSV & PDF export',
      'All card games',
    ],
  },
  {
    id: 'enterprise',
    name: 'Dealer',
    price: '$99',
    period: 'per month',
    features: [
      'Everything in Investor',
      'Seller listing & bulk CSV upload',
      '48h payout seller workflow',
      'Zero listing fees on marketplace',
      'Priority seller support',
    ],
  },
]

const GAME_OPTIONS = [
  { value: 'all',     label: 'All Games' },
  { value: 'pokemon', label: 'Pokémon' },
  { value: 'mtg',     label: 'Magic: The Gathering' },
  { value: 'yugioh',  label: 'Yu-Gi-Oh!' },
]

const AVATAR_COLORS = [
  '#C9A84C', '#e85d04', '#7c3aed', '#0077b6',
  '#059669', '#db2777', '#b45309', '#475569',
]

// ── Avatar preview ────────────────────────────────────────────────────────────

function AvatarPreview({ name, color }: { name: string; color: string }) {
  const initials = name
    .trim()
    .split(' ')
    .map((w) => w[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('')

  return (
    <div
      className="flex items-center justify-center rounded-full font-display font-black select-none"
      style={{
        width: 64,
        height: 64,
        background: color,
        color: '#080c14',
        fontSize: initials ? '1.4rem' : '0',
        boxShadow: `0 0 24px ${color}60`,
        fontFamily: 'Cinzel, serif',
      }}
    >
      {initials || '?'}
    </div>
  )
}

// ── Plan card ─────────────────────────────────────────────────────────────────

function PlanCard({
  plan,
  selected,
  onClick,
}: {
  plan: Plan
  selected: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      className="relative w-full text-left rounded-xl p-4 transition-all"
      style={{
        background: selected ? 'rgba(201,168,76,0.08)' : 'rgba(13,21,38,0.6)',
        border: selected ? '1.5px solid #C9A84C' : '1.5px solid #1e2d4a',
        boxShadow: selected ? '0 0 20px rgba(201,168,76,0.15)' : 'none',
      }}
    >
      {plan.badge && (
        <span
          className="absolute -top-2.5 left-4 px-2 py-0.5 rounded-full font-mono text-black font-bold"
          style={{ background: '#C9A84C', fontSize: '0.55rem', letterSpacing: '0.1em' }}
        >
          {plan.badge.toUpperCase()}
        </span>
      )}

      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-display font-bold" style={{ fontFamily: 'Cinzel, serif', color: '#f0f4ff', fontSize: '0.95rem' }}>
            {plan.name}
          </div>
          <div className="font-mono text-xs mt-0.5" style={{ color: '#4a5a7a' }}>
            {plan.period}
          </div>
        </div>
        <div className="text-right">
          <span className="font-mono font-black" style={{ color: selected ? '#C9A84C' : '#8899bb', fontSize: '1.4rem', lineHeight: 1 }}>
            {plan.price}
          </span>
          <span className="font-mono text-xs" style={{ color: '#4a5a7a' }}>/mo</span>
        </div>
      </div>

      <ul className="flex flex-col gap-1.5">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center gap-2">
            <span style={{ color: selected ? '#C9A84C' : '#3a4a6a', fontSize: '0.65rem' }}>✦</span>
            <span style={{ color: selected ? '#c8d8f0' : '#4a5a7a', fontSize: '0.72rem' }}>{f}</span>
          </li>
        ))}
      </ul>
    </motion.button>
  )
}

// ── Success card ──────────────────────────────────────────────────────────────

function SuccessCard({ profile }: { profile: ProfileData }) {
  const planLabel = PLANS.find((p) => p.id === profile.plan)?.name ?? profile.plan
  const gameLabel = GAME_OPTIONS.find((g) => g.value === profile.favorite_game)?.label ?? profile.favorite_game
  const joined = new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      className="flex flex-col items-center text-center"
    >
      {/* Success glow */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="mb-6 w-16 h-16 rounded-full flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #C9A84C, #9a7a30)', boxShadow: '0 0 40px rgba(201,168,76,0.5)' }}
      >
        <span style={{ fontSize: '1.8rem' }}>✓</span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="font-mono text-xs uppercase tracking-widest mb-2"
        style={{ color: '#C9A84C', letterSpacing: '0.25em' }}
      >
        Profile Created
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="font-display font-black text-3xl mb-8"
        style={{ fontFamily: 'Cinzel, serif', color: '#f0f4ff' }}
      >
        Welcome, {profile.display_name}
      </motion.h2>

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="w-full max-w-sm rounded-2xl overflow-hidden"
        style={{ border: `1.5px solid ${profile.avatar_color}40`, background: 'rgba(13,21,38,0.9)', boxShadow: `0 0 40px ${profile.avatar_color}20` }}
      >
        {/* Header strip */}
        <div className="h-2" style={{ background: profile.avatar_color }} />

        <div className="p-6 flex flex-col items-center gap-4">
          <AvatarPreview name={profile.display_name} color={profile.avatar_color} />

          <div>
            <div className="font-display font-bold text-xl text-center" style={{ fontFamily: 'Cinzel, serif', color: '#f0f4ff' }}>
              {profile.display_name}
            </div>
            <div className="font-mono text-xs text-center mt-0.5" style={{ color: '#4a5a7a' }}>
              @{profile.username}
            </div>
          </div>

          {profile.bio && (
            <p className="text-sm text-center leading-relaxed" style={{ color: '#8899bb' }}>
              {profile.bio}
            </p>
          )}

          <div
            className="w-full"
            style={{ height: 1, background: 'linear-gradient(90deg, transparent, #1e2d4a, transparent)' }}
          />

          <div className="grid grid-cols-2 gap-3 w-full">
            {[
              { label: 'Plan', value: planLabel },
              { label: 'Favorite Game', value: gameLabel },
              { label: 'Cards Graded', value: String(profile.cards_graded) },
              { label: 'Member Since', value: joined },
            ].map((item) => (
              <div key={item.label} className="p-3 rounded-lg text-center" style={{ background: 'rgba(8,12,20,0.6)', border: '1px solid #1e2d4a' }}>
                <div className="font-mono" style={{ color: '#4a5a7a', fontSize: '0.55rem', marginBottom: 2 }}>{item.label}</div>
                <div className="font-mono font-bold" style={{ color: '#C9A84C', fontSize: '0.72rem' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-8 flex gap-3"
      >
        <button
          className="btn-gold px-8 py-3.5 rounded-xl text-sm tracking-widest uppercase"
          style={{ fontFamily: 'Cinzel, serif', fontSize: '0.78rem' }}
        >
          Go to Dashboard →
        </button>
      </motion.div>
    </motion.div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface FormState {
  display_name: string
  username: string
  email: string
  bio: string
  favorite_game: string
  avatar_color: string
}

interface FormErrors {
  display_name?: string
  username?: string
  email?: string
}

export default function ProfileCreate({ onBack, embedded = false }: ProfileCreateProps) {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | 'enterprise'>('pro')
  const [form, setForm] = useState<FormState>({
    display_name: '',
    username: '',
    email: '',
    bio: '',
    favorite_game: 'all',
    avatar_color: '#C9A84C',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [created, setCreated] = useState<ProfileData | null>(null)

  const set = (field: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
    setApiError(null)
  }

  const validate = (): boolean => {
    const errs: FormErrors = {}
    if (form.display_name.trim().length < 2) errs.display_name = 'At least 2 characters required'
    if (!/^[a-z0-9_]{3,30}$/.test(form.username.trim().toLowerCase()))
      errs.username = '3–30 chars: letters, numbers, underscores only'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      errs.email = 'Enter a valid email address'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setApiError(null)
    try {
      const profile = await createProfile({
        display_name: form.display_name.trim(),
        username: form.username.trim().toLowerCase(),
        email: form.email.trim().toLowerCase(),
        bio: form.bio.trim() || undefined,
        favorite_game: form.favorite_game,
        avatar_color: form.avatar_color,
        plan: selectedPlan,
      })
      setCreated(profile)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setApiError(msg.includes('409') ? msg.replace(/^API \d+: /, '') : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      className={embedded ? 'w-full' : 'min-h-screen'}
      style={{ background: embedded ? 'transparent' : '#080c14' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {!embedded && (
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(201,168,76,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.8) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      )}

      {!embedded && (
        <div className="sticky top-0 z-40" style={{ background: 'rgba(8,12,20,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #1e2d4a' }}>
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <button
              onClick={onBack}
              className="btn-ghost px-4 py-2 rounded-lg text-xs flex items-center gap-2"
            >
              ← Back to Demo
            </button>
            <span className="font-display font-bold text-gold-gradient" style={{ fontFamily: 'Cinzel, serif', fontSize: '1.1rem' }}>
              TCGNakama
            </span>
            <div className="w-24" />
          </div>
        </div>
      )}

      <div className={`${embedded ? 'px-0 py-0' : 'max-w-6xl mx-auto px-6 py-12'} relative z-10`}>
        <AnimatePresence mode="wait">
          {created ? (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center"
            >
              <SuccessCard profile={created} />
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {!embedded && (
                <div className="text-center mb-12">
                  <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: '#C9A84C', letterSpacing: '0.3em' }}>
                    — Create Your Account —
                  </p>
                  <h1 className="font-display font-black text-4xl md:text-5xl mb-3" style={{ fontFamily: 'Cinzel, serif', color: '#f0f4ff' }}>
                    Start Your Collection
                  </h1>
                  <p className="text-sm" style={{ color: '#4a5a7a' }}>
                    Choose a plan and set up your profile in under a minute
                  </p>
                </div>
              )}

              <div className={`grid gap-8 items-start ${embedded ? 'grid-cols-1' : 'md:grid-cols-5'}`}>
                {/* Left — Plan selector */}
                <div className="md:col-span-2 flex flex-col gap-3">
                  <p className="font-mono text-xs uppercase tracking-widest mb-1" style={{ color: '#C9A84C', letterSpacing: '0.2em' }}>
                    Select Plan
                  </p>
                  {PLANS.map((plan) => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      selected={selectedPlan === plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                    />
                  ))}
                </div>

                {/* Right — Profile form */}
                <div className="md:col-span-3">
                  <div
                    className="rounded-2xl p-8"
                    style={{ background: 'rgba(13,21,38,0.8)', border: '1px solid #1e2d4a' }}
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <AvatarPreview name={form.display_name} color={form.avatar_color} />
                      <div>
                        <p className="font-display font-bold" style={{ fontFamily: 'Cinzel, serif', color: '#f0f4ff', fontSize: '1rem' }}>
                          {form.display_name || 'Your Name'}
                        </p>
                        <p className="font-mono text-xs mt-0.5" style={{ color: '#4a5a7a' }}>
                          @{form.username || 'username'}
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                      {/* Display name + username */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Field
                          label="Display Name"
                          required
                          error={errors.display_name}
                          value={form.display_name}
                          onChange={(v) => set('display_name', v)}
                          placeholder="Ash Ketchum"
                        />
                        <Field
                          label="Username"
                          required
                          error={errors.username}
                          value={form.username}
                          onChange={(v) => set('username', v.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                          placeholder="ash_ketchum"
                          prefix="@"
                        />
                      </div>

                      {/* Email */}
                      <Field
                        label="Email Address"
                        required
                        type="email"
                        error={errors.email}
                        value={form.email}
                        onChange={(v) => set('email', v)}
                        placeholder="ash@pallet.town"
                      />

                      {/* Favorite game */}
                      <div>
                        <label className="block font-mono text-xs uppercase tracking-widest mb-2" style={{ color: '#C9A84C', fontSize: '0.6rem', letterSpacing: '0.2em' }}>
                          Favorite Game
                        </label>
                        <select
                          value={form.favorite_game}
                          onChange={(e) => set('favorite_game', e.target.value)}
                          className="w-full rounded-lg px-4 py-3 text-sm font-mono outline-none"
                          style={{
                            background: 'rgba(8,12,20,0.8)',
                            border: '1px solid #1e2d4a',
                            color: '#f0f4ff',
                          }}
                        >
                          {GAME_OPTIONS.map((g) => (
                            <option key={g.value} value={g.value} style={{ background: '#0d1526' }}>
                              {g.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Avatar color */}
                      <div>
                        <label className="block font-mono text-xs uppercase tracking-widest mb-2" style={{ color: '#C9A84C', fontSize: '0.6rem', letterSpacing: '0.2em' }}>
                          Avatar Color
                        </label>
                        <div className="flex gap-2 flex-wrap">
                          {AVATAR_COLORS.map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => set('avatar_color', color)}
                              className="w-8 h-8 rounded-full transition-all"
                              style={{
                                background: color,
                                boxShadow: form.avatar_color === color ? `0 0 0 2px #080c14, 0 0 0 4px ${color}` : 'none',
                                transform: form.avatar_color === color ? 'scale(1.15)' : 'scale(1)',
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Bio */}
                      <div>
                        <label className="block font-mono text-xs uppercase tracking-widest mb-2" style={{ color: '#C9A84C', fontSize: '0.6rem', letterSpacing: '0.2em' }}>
                          Bio <span style={{ color: '#3a4a6a', textTransform: 'none', fontFamily: 'Inter, sans-serif', letterSpacing: 0 }}>(optional)</span>
                        </label>
                        <textarea
                          value={form.bio}
                          onChange={(e) => set('bio', e.target.value)}
                          placeholder="Tell the community about your collection…"
                          maxLength={160}
                          rows={3}
                          className="w-full rounded-lg px-4 py-3 text-sm resize-none outline-none"
                          style={{
                            background: 'rgba(8,12,20,0.8)',
                            border: '1px solid #1e2d4a',
                            color: '#f0f4ff',
                            fontFamily: 'Inter, sans-serif',
                          }}
                        />
                        <p className="text-right mt-1" style={{ color: '#3a4a6a', fontSize: '0.6rem', fontFamily: 'monospace' }}>
                          {form.bio.length}/160
                        </p>
                      </div>

                      {/* API error */}
                      <AnimatePresence>
                        {apiError && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="px-4 py-3 rounded-lg text-sm"
                            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}
                          >
                            {apiError}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Submit */}
                      <motion.button
                        type="submit"
                        disabled={loading}
                        className="btn-gold w-full py-4 rounded-xl text-sm tracking-widest uppercase mt-2"
                        style={{ fontFamily: 'Cinzel, serif', fontSize: '0.82rem', opacity: loading ? 0.7 : 1 }}
                        whileHover={!loading ? { scale: 1.01 } : {}}
                        whileTap={!loading ? { scale: 0.98 } : {}}
                      >
                        {loading ? 'Creating Profile…' : `Create ${PLANS.find(p => p.id === selectedPlan)?.name} Account →`}
                      </motion.button>

                      <p className="text-center" style={{ color: '#3a4a6a', fontSize: '0.65rem' }}>
                        By creating an account you agree to the TCGNakama Terms of Service
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ── Reusable field ────────────────────────────────────────────────────────────

function Field({
  label, required, type = 'text', error, value, onChange, placeholder, prefix,
}: {
  label: string
  required?: boolean
  type?: string
  error?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  prefix?: string
}) {
  return (
    <div>
      <label className="block font-mono text-xs uppercase tracking-widest mb-2" style={{ color: '#C9A84C', fontSize: '0.6rem', letterSpacing: '0.2em' }}>
        {label}{required && <span style={{ color: '#e85d04', marginLeft: 2 }}>*</span>}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm" style={{ color: '#4a5a7a' }}>
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all"
          style={{
            background: 'rgba(8,12,20,0.8)',
            border: error ? '1px solid rgba(239,68,68,0.6)' : '1px solid #1e2d4a',
            color: '#f0f4ff',
            fontFamily: 'Inter, sans-serif',
            paddingLeft: prefix ? '1.8rem' : undefined,
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = '#C9A84C' }}
          onBlur={(e) => { e.currentTarget.style.borderColor = error ? 'rgba(239,68,68,0.6)' : '#1e2d4a' }}
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ color: '#fca5a5', fontSize: '0.65rem', marginTop: 4, fontFamily: 'monospace' }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
