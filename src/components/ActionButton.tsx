import { useState, type ReactNode } from 'react'
import InteractivePopout from './InteractivePopout'
import SlideshowButton, { type SlideshowButtonVariant } from './SlideshowButton'

interface ActionButtonProps {
  variant: SlideshowButtonVariant
  label: string
  displayLabel?: string
  iconOnly?: boolean
  settingsState?: 'play' | 'pause'
  active?: boolean
  popoutTitle: string
  popoutSubtitle?: string
  confirmLabel?: string
  disabled?: boolean
  size?: 'xs' | 'sm' | 'md'
  onConfirm: () => void
  children: ReactNode
}

export default function ActionButton({
  variant,
  label,
  displayLabel,
  iconOnly,
  settingsState,
  active,
  popoutTitle,
  popoutSubtitle,
  confirmLabel,
  disabled = false,
  size = 'md',
  onConfirm,
  children,
}: ActionButtonProps) {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    setOpen(false)
    onConfirm()
  }

  return (
    <>
      <SlideshowButton
        variant={variant}
        label={label}
        displayLabel={displayLabel}
        iconOnly={iconOnly}
        settingsState={settingsState}
        active={active}
        size={size}
        disabled={disabled}
        onClick={() => setOpen(true)}
      />
      <InteractivePopout
        open={open}
        title={popoutTitle}
        subtitle={popoutSubtitle}
        confirmLabel={confirmLabel ?? label}
        confirmVariant={
          variant === 'previous' ? 'previous' : variant === 'ghost' ? 'ghost' : 'continue'
        }
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
      >
        {children}
      </InteractivePopout>
    </>
  )
}
