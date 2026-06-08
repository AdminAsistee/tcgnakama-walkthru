import type { CSSProperties } from 'react'
import {
  TEXT_TRAIL_LAYERS,
  TEXT_TRAIL_MIDDLE_IDX,
  type TextTrailLayerStyle,
} from '../lib/textTrailEffect'

export interface TextTrailDisplayProps {
  text: string
  lines?: string[]
  opacities: number[]
  color?: string
  size?: 'demo1' | 'fullscreen' | 'inline' | 'transition' | 'stack'
  fontScale?: number
  className?: string
  label?: string
}

export default function TextTrailDisplay({
  text,
  lines,
  opacities,
  color = '#f8fafc',
  size = 'demo1',
  fontScale = 1,
  className = '',
  label,
}: TextTrailDisplayProps) {
  const displayLines = lines?.length ? lines : [text]

  return (
    <div
      className={['text-trail', `text-trail--${size}`, className].filter(Boolean).join(' ')}
      style={
        {
          '--text-trail-color': color,
          '--trail-title-scale': fontScale,
        } as CSSProperties
      }
      role="img"
      aria-label={label ?? text}
    >
      {TEXT_TRAIL_LAYERS.map((layer: TextTrailLayerStyle, index: number) => (
        <div
          key={`layer-${index}`}
          className={[
            'text-trail__layer',
            layer.full ? 'text-trail__layer--full' : '',
            index === TEXT_TRAIL_MIDDLE_IDX ? 'text-trail__layer--main' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          style={{ opacity: opacities[index] ?? 0 }}
          aria-hidden="true"
        >
          <span
            className={[
              'text-trail__inner',
              layer.stroke ? 'text-trail__inner--stroke' : '',
              layer.bottom ? 'text-trail__inner--bottom' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {displayLines.map((line, lineIndex) => (
              <span key={`${line}-${lineIndex}`} className="text-trail__line">
                {line}
              </span>
            ))}
          </span>
        </div>
      ))}
    </div>
  )
}
