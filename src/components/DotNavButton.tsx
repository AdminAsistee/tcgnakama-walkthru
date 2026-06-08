import { useState, type ReactNode } from 'react'
import InteractivePopout from './InteractivePopout'

interface DotNavButtonProps {
  index: number
  active: boolean
  label: string
  popoutTitle: string
  popoutSubtitle?: string
  confirmLabel?: string
  onConfirm: () => void
  children: ReactNode
}

export default function DotNavButton({
  index,
  active,
  label,
  popoutTitle,
  popoutSubtitle,
  confirmLabel = 'Go to slide',
  onConfirm,
  children,
}: DotNavButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        aria-label={label}
        aria-current={active ? 'step' : undefined}
        onClick={() => setOpen(true)}
        className={`slideshow-dot ${active ? 'slideshow-dot--active' : ''}`}
      >
        <span className="slideshow-dot__pill" />
        <span className="sr-only">{`Slide ${index + 1}`}</span>
      </button>
      <InteractivePopout
        open={open}
        title={popoutTitle}
        subtitle={popoutSubtitle}
        confirmLabel={confirmLabel}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          setOpen(false)
          onConfirm()
        }}
      >
        {children}
      </InteractivePopout>
    </>
  )
}
