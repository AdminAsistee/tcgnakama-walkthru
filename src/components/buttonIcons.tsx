import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

export function IconChevronLeft(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M10 3.5L5.5 8 10 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconChevronRight(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M6 3.5L10.5 8 6 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconSettings(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
        stroke="currentColor"
        strokeWidth="1.35"
      />
      <path
        d="M12.7 9.5a1 1 0 0 0 .2 1.1l.03.03a1.2 1.2 0 1 1-1.7 1.7l-.03-.03a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V13a1.2 1.2 0 0 1-2.4 0v-.05a1 1 0 0 0-.65-.92 1 1 0 0 0-1.1.2l-.03.03a1.2 1.2 0 1 1-1.7-1.7l.03-.03a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H3.2a1.2 1.2 0 0 1 0-2.4h.05a1 1 0 0 0 .92-.65 1 1 0 0 0-.2-1.1l-.03-.03a1.2 1.2 0 1 1 1.7-1.7l.03.03a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V3.2a1.2 1.2 0 0 1 2.4 0v.05a1 1 0 0 0 .65.92 1 1 0 0 0 1.1-.2l.03-.03a1.2 1.2 0 1 1 1.7 1.7l-.03.03a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6H13a1.2 1.2 0 0 1 0 2.4h-.05a1 1 0 0 0-.92.65 1 1 0 0 0 .2 1.1Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconPlay(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path d="M6 4.5v7l6-3.5-6-3.5Z" fill="currentColor" />
    </svg>
  )
}

export function IconPause(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path d="M5.5 4.5h2v7h-2v-7Zm3 0h2v7h-2v-7Z" fill="currentColor" />
    </svg>
  )
}

export function IconClose(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4.5 4.5l7 7M11.5 4.5l-7 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
