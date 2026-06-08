import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import SlideshowButton, { type SlideshowButtonVariant } from './SlideshowButton'

export interface InteractivePopoutProps {
  open: boolean
  title: string
  subtitle?: string
  onClose: () => void
  onConfirm?: () => void
  confirmLabel?: string
  confirmVariant?: SlideshowButtonVariant
  children: ReactNode
}

export default function InteractivePopout({
  open,
  title,
  subtitle,
  onClose,
  onConfirm,
  confirmLabel = 'Continue',
  confirmVariant = 'continue',
  children,
}: InteractivePopoutProps) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="interactive-popout"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button type="button" className="interactive-popout__backdrop" aria-label="Close dialog" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="popout-title"
            className="interactive-popout__panel"
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.94 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="interactive-popout__header">
              <div>
                <p className="interactive-popout__eyebrow">Interactive window</p>
                <h2 id="popout-title" className="interactive-popout__title">
                  {title}
                </h2>
                {subtitle ? <p className="interactive-popout__subtitle">{subtitle}</p> : null}
              </div>
              <SlideshowButton variant="close" size="sm" label="Close panel" onClick={onClose} />
            </div>

            <div className="interactive-popout__body">{children}</div>

            {onConfirm ? (
              <div className="interactive-popout__footer">
                <SlideshowButton variant="ghost" size="sm" label="Cancel" displayLabel="Cancel" onClick={onClose} />
                <SlideshowButton
                  variant={confirmVariant}
                  size="sm"
                  label={confirmLabel}
                  displayLabel={confirmLabel}
                  onClick={onConfirm}
                />
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
