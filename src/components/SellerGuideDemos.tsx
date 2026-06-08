import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import type { GuideVisual } from '../lib/sellerGuidelineSlides'
import { SELLER_GUIDELINES_PDF, SELLER_URL, SITE_URL, displayTocItem } from '../lib/sellerGuidelineSlides'

const panel = 'rounded-xl border border-white/10 bg-black p-3'
const demoBtn = 'demo-btn px-3 py-1.5 text-[10px] uppercase tracking-[0.12em]'
const demoBtnGold = 'demo-btn demo-btn--gold px-3 py-1.5 text-[10px] uppercase tracking-[0.12em]'

export function TocDemo({ items }: { items: string[] }) {
  return (
    <div className={`${panel} space-y-1.5`}>
      {items.map((item) => (
        <motion.button
          key={item}
          type="button"
          className={`${demoBtn} flex w-full items-center justify-between py-2 text-left`}
          whileHover={{ x: 2 }}
          onClick={() => {}}
        >
          <span className="slideshow-points line-clamp-1">{displayTocItem(item)}</span>
          <span className="text-slate-500">Open</span>
        </motion.button>
      ))}
      <div className="mt-2 px-3 py-2 text-[10px] leading-4 text-slate-400">
        New sellers: Bulk Upload first, then Add Card to fine-tune.
      </div>
    </div>
  )
}

const DASHBOARD_TOOLS = [
  { id: 'vault', label: 'My Vault', copy: 'View and manage listed products' },
  { id: 'add', label: 'Add Single Card', copy: 'List one card with full control' },
  { id: 'bulk', label: 'Bulk Upload', copy: 'Upload up to 50 cards at once' },
  { id: 'orders', label: 'My Orders', copy: 'Track sales and revenue' },
  { id: 'store', label: 'My Storefront', copy: 'Logo, banner, and brand identity' },
]

export function DashboardDemo() {
  const [active, setActive] = useState('vault')
  const tool = DASHBOARD_TOOLS.find((item) => item.id === active) ?? DASHBOARD_TOOLS[0]

  return (
    <div className={`${panel} space-y-2`}>
      <div className={`${demoBtn} w-full py-2 text-center`}>✓ Approved Seller</div>
      <div className="grid gap-1.5">
        {DASHBOARD_TOOLS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActive(item.id)}
            className={`${active === item.id ? demoBtnGold : demoBtn} flex w-full items-center gap-2 py-2 text-left`}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#d4af54] text-xs font-bold text-black">
              {item.label[0]}
            </span>
            <div className="min-w-0">
              <div className="slideshow-points">{item.label}</div>
              <div className="text-[10px] text-slate-500">{item.copy}</div>
            </div>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={tool.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="px-3 py-2 text-[10px] text-slate-300"
        >
          Opening <strong className="text-[#d4af54]">{tool.label}</strong> from your seller dashboard.
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

const VAULT_ROWS = [
  { name: 'Garchomp & Giratina-GX', set: 'sm12a #099/173', value: '¥2,316' },
  { name: 'Monkey.D.Luffy', set: 'OP13-118 SEC', value: '¥18,400' },
]

export function VaultDemo() {
  const [appraised, setAppraised] = useState<string | null>(null)
  const [synced, setSynced] = useState(false)

  return (
    <div className={`${panel} space-y-2`}>
      <div className="flex items-center justify-between gap-2">
        <span className="slideshow-points text-slate-400">Vault operations</span>
        <button type="button" onClick={() => setSynced(true)} className={demoBtnGold}>
          Sync Shopify
        </button>
      </div>
      {VAULT_ROWS.map((row) => (
        <div key={row.name} className="rounded-lg border border-white/10 p-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="slideshow-points">{row.name}</div>
              <div className="mt-1 text-[10px] text-slate-500">{row.set}</div>
              <div className="mt-1 text-[10px] text-[#d4af54]">
                {appraised === row.name ? '¥2,480 appraised' : row.value}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <button type="button" onClick={() => setAppraised(row.name)} className={demoBtnGold}>
                Appraise
              </button>
              <button type="button" className={demoBtn}>
                Edit
              </button>
            </div>
          </div>
        </div>
      ))}
      {synced ? (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-slate-400">
          All vault listings pushed to Shopify instantly.
        </motion.p>
      ) : null}
    </div>
  )
}

export function BulkUploadDemo() {
  const [phase, setPhase] = useState<'idle' | 'appraising' | 'done'>('idle')
  const [files, setFiles] = useState(0)

  const appraise = () => {
    if (files === 0) setFiles(3)
    setPhase('appraising')
    window.setTimeout(() => setPhase('done'), 1400)
  }

  return (
    <div className={`${panel} space-y-2`}>
      <div
        className="rounded-lg border border-dashed border-white/15 px-3 py-6 text-center"
        onClick={() => setFiles((count) => Math.min(count + 1, 50) || 3)}
      >
        <div className="slideshow-points text-slate-300">Click to select files or drag and drop</div>
        <div className="mt-1 text-[10px] text-slate-500">PNG, JPG, JPEG up to 10MB · max 50 cards</div>
        {files > 0 ? <div className="mt-2 text-[10px] text-slate-400">{files} front images ready</div> : null}
      </div>
      <button type="button" onClick={appraise} disabled={phase === 'appraising'} className={`${demoBtnGold} w-full py-2 disabled:opacity-50`}>
        {phase === 'appraising' ? 'AI identifying cards…' : 'Appraise Cards'}
      </button>
      <AnimatePresence>
        {phase === 'done' ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-1.5">
            {['Charizard GX', 'Pikachu VMAX', 'Luffy SEC'].map((name) => (
              <div key={name} className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-1.5 text-[10px]">
                <span className="text-slate-200">{name}</span>
                <span className="text-[#d4af54]">AI priced</span>
              </div>
            ))}
            <button type="button" className={`${demoBtnGold} w-full py-2`}>
              Confirm & Add to Vault
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export function AddCardDemo() {
  const [appraised, setAppraised] = useState(false)

  return (
    <div className={`${panel} grid gap-2 sm:grid-cols-2`}>
      <div className="rounded-lg border border-dashed border-white/15 px-2 py-4 text-center text-[10px] text-slate-500">
        Drop card images here
      </div>
      <div className="space-y-1.5">
        {[
          { label: 'Card Name', value: appraised ? 'Charizard GX' : '' },
          { label: 'Set Code', value: appraised ? 's12a' : '' },
          { label: 'Sell Price (¥)', value: appraised ? '12,800' : '' },
        ].map((field) => (
          <div key={field.label} className="rounded-lg border border-white/10 px-2.5 py-1.5">
            <div className="text-[9px] uppercase tracking-[0.12em] text-slate-500">{field.label}</div>
            <div className="slideshow-points mt-0.5 text-slate-200">{field.value || '—'}</div>
          </div>
        ))}
        <button type="button" onClick={() => setAppraised(true)} className={`${demoBtn} w-full py-2`}>
          Appraise Card with AI
        </button>
        {appraised ? (
          <button type="button" className={`${demoBtnGold} w-full py-2`}>
            Save All Changes
          </button>
        ) : null}
      </div>
    </div>
  )
}

export function BulkVsAddDemo() {
  const [step, setStep] = useState(0)
  const workflow = ['Bulk Upload', 'AI Appraises', 'Confirm & Add', 'Add Card polish']

  return (
    <div className={`${panel} space-y-2`}>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg border border-white/10 p-2">
          <div className="slideshow-points">Bulk Upload = CREATE fast</div>
          <p className="mt-1 text-[10px] leading-4 text-slate-500">2–50 front images, AI prices all at once.</p>
        </div>
        <div className="rounded-lg border border-white/10 p-2">
          <div className="slideshow-points">Add Card = EDIT individually</div>
          <p className="mt-1 text-[10px] leading-4 text-slate-500">Full fields, multiple photos, fine-tune price.</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        {workflow.map((label, index) => (
          <button
            key={label}
            type="button"
            onClick={() => setStep(index)}
            className={`${step >= index ? demoBtnGold : demoBtn} px-2 py-1 text-[9px]`}
          >
            {index + 1}. {label}
          </button>
        ))}
      </div>
      <motion.p key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="slideshow-points text-slate-300">
        {step === 0 && 'Upload 10 card fronts in one session.'}
        {step === 1 && 'AI identifies and prices all 10 cards together.'}
        {step === 2 && 'Confirm & Add — all 10 listings go live in your Vault.'}
        {step === 3 && 'Open Add Card only when a listing needs extra photos or edits.'}
      </motion.p>
    </div>
  )
}

export function OrdersDemo() {
  const [tab, setTab] = useState('All')
  const tabs = ['All', 'Unfulfilled', 'Unpaid', 'Open', 'Archived']

  return (
    <div className={`${panel} space-y-2`}>
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { label: 'Total', value: '0' },
          { label: 'Paid', value: '0' },
          { label: 'Unfulfilled', value: '0' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-white/10 px-2 py-2">
            <div className="text-sm font-semibold text-slate-100">{stat.value}</div>
            <div className="text-[10px] uppercase tracking-[0.12em] text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {tabs.map((item) => (
          <button key={item} type="button" onClick={() => setTab(item)} className={`${tab === item ? demoBtnGold : demoBtn} px-2 py-1 text-[9px]`}>
            {item}
          </button>
        ))}
      </div>
      <div className="rounded-lg border border-white/10 px-3 py-4 text-center text-[10px] text-slate-500">
        {tab} · Total Revenue ¥0 · Use date filter to calculate period revenue
      </div>
    </div>
  )
}

export function StorefrontDemo() {
  const [tagline, setTagline] = useState('Japan\'s trusted seller')

  return (
    <div className={`${panel} space-y-2`}>
      <div className="overflow-hidden rounded-lg border border-white/10">
        <div className="h-12 bg-[#141414]" />
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d4af54] text-[10px] font-bold text-black">TM</div>
          <div>
            <div className="slideshow-points">TCG Mini</div>
            <div className="text-[10px] text-slate-500">{tagline}</div>
          </div>
        </div>
      </div>
      <label className="block space-y-1">
        <span className="text-[10px] uppercase tracking-[0.14em] text-slate-500">Tagline</span>
        <input
          value={tagline}
          onChange={(event) => setTagline(event.target.value)}
          className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-slate-200 outline-none"
        />
      </label>
      <button type="button" className={`${demoBtnGold} w-full py-2`}>
        Save Branding
      </button>
    </div>
  )
}

export function ToolsIntroDemo() {
  return (
    <div className={`${panel} grid gap-2 sm:grid-cols-3`}>
      {['AI Grading', 'Live Pricing', 'Account Portal'].map((label) => (
        <div key={label} className={`${demoBtn} py-4 text-center`}>
          <div className="slideshow-points">{label}</div>
          <div className="mt-1 text-[10px] text-slate-500">Try it on the next slides</div>
        </div>
      ))}
    </div>
  )
}

export function CtaDemo() {
  return (
    <div className={`${panel} flex flex-col items-center gap-3 py-4 text-center`}>
      <p className="text-[10px] text-slate-500">You finished the seller onboarding guide walkthrough.</p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <a href={SELLER_URL} target="_blank" rel="noopener noreferrer" className={`${demoBtnGold} inline-flex px-5 py-2.5 no-underline`}>
          Open seller dashboard
        </a>
        <a href={SELLER_GUIDELINES_PDF} target="_blank" rel="noopener noreferrer" className={`${demoBtn} inline-flex px-5 py-2.5 no-underline`}>
          Download PDF guide
        </a>
        <a href={SITE_URL} target="_blank" rel="noopener noreferrer" className={`${demoBtn} inline-flex px-5 py-2.5 no-underline`}>
          Marketplace
        </a>
      </div>
    </div>
  )
}

export function GuideVisualPanel({ type, tocItems }: { type: GuideVisual; tocItems?: string[] }) {
  if (type === 'toc') return <TocDemo items={tocItems ?? []} />
  if (type === 'dashboard') return <DashboardDemo />
  if (type === 'vault') return <VaultDemo />
  if (type === 'bulk-upload') return <BulkUploadDemo />
  if (type === 'add-card') return <AddCardDemo />
  if (type === 'bulk-vs-add') return <BulkVsAddDemo />
  if (type === 'orders') return <OrdersDemo />
  if (type === 'storefront') return <StorefrontDemo />
  if (type === 'tools') return <ToolsIntroDemo />
  return <CtaDemo />
}
