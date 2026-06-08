import {
  IconChevronLeft,
  IconChevronRight,
  IconClose,
  IconPause,
  IconPlay,
  IconSettings,
} from './buttonIcons'

export type SlideshowButtonVariant = 'continue' | 'previous' | 'settings' | 'ghost' | 'close'

interface SlideshowButtonProps {
  variant: SlideshowButtonVariant
  onClick?: () => void
  disabled?: boolean
  /** Accessible name — always set even when icon-only */
  label: string
  /** Visible label; falls back to `label` */
  displayLabel?: string
  /** Hide visible text and show icon only */
  iconOnly?: boolean
  size?: 'xs' | 'sm' | 'md'
  /** Settings variant: swap gear for play/pause */
  settingsState?: 'play' | 'pause'
  active?: boolean
  className?: string
}

function variantClasses(variant: SlideshowButtonVariant) {
  switch (variant) {
    case 'continue':
      return 'slideshow-btn--primary'
    case 'previous':
      return 'slideshow-btn--secondary'
    case 'close':
      return 'slideshow-btn--ghost slideshow-btn--icon-only'
    default:
      return 'slideshow-btn--ghost'
  }
}

function defaultDisplayLabel(variant: SlideshowButtonVariant, label: string, iconOnly?: boolean) {
  if (iconOnly || variant === 'close') return ''
  if (variant === 'previous') return 'Back'
  if (variant === 'continue') return 'Continue'
  if (variant === 'settings') return 'Settings'
  return label
}

export default function SlideshowButton({
  variant,
  onClick,
  disabled = false,
  label,
  displayLabel,
  iconOnly = false,
  size = 'md',
  settingsState,
  active = false,
  className = '',
}: SlideshowButtonProps) {
  const visibleText = displayLabel ?? defaultDisplayLabel(variant, label, iconOnly)
  const showIconOnly = iconOnly || variant === 'close' || (variant === 'settings' && !visibleText)

  const leadingIcon =
    variant === 'previous' ? (
      <IconChevronLeft className="slideshow-btn__icon slideshow-btn__icon--leading" />
    ) : variant === 'settings' ? (
      settingsState === 'pause' ? (
        <IconPause className="slideshow-btn__icon" />
      ) : settingsState === 'play' ? (
        <IconPlay className="slideshow-btn__icon" />
      ) : (
        <IconSettings className="slideshow-btn__icon" />
      )
    ) : variant === 'close' ? (
      <IconClose className="slideshow-btn__icon" />
    ) : null

  const trailingIcon =
    variant === 'continue' && !showIconOnly ? (
      <IconChevronRight className="slideshow-btn__icon slideshow-btn__icon--trailing" />
    ) : null

  return (
    <button
      type="button"
      aria-label={label}
      title={showIconOnly ? label : undefined}
      disabled={disabled}
      onClick={onClick}
      data-variant={variant}
      className={[
        'slideshow-btn',
        variantClasses(variant),
        size === 'xs' ? 'slideshow-btn--xs' : size === 'sm' ? 'slideshow-btn--sm' : '',
        showIconOnly ? 'slideshow-btn--icon-only' : '',
        active ? 'slideshow-btn--active' : '',
        disabled ? 'slideshow-btn--disabled' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="slideshow-btn__stack">
        <span className="slideshow-btn__surface">
          <span className="slideshow-btn__content">
            {leadingIcon}
            {visibleText ? <span className="slideshow-btn__label">{visibleText}</span> : null}
            {trailingIcon}
          </span>
        </span>
        <span className="slideshow-btn__lip" aria-hidden="true" />
      </span>
    </button>
  )
}
