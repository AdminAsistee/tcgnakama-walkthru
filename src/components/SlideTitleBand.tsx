import { useMemo } from 'react'
import { initialTextTrailOpacities, uniformTrailTitleMetrics } from '../lib/textTrailEffect'
import TextTrailDisplay from './TextTrailDisplay'

interface SlideTitleBandProps {
  title: string
  color?: string
}

export default function SlideTitleBand({ title, color = '#f8fafc' }: SlideTitleBandProps) {
  const metrics = useMemo(() => uniformTrailTitleMetrics(title), [title])
  const opacities = useMemo(() => initialTextTrailOpacities(), [])

  return (
    <div className="slideshow-slide-header">
      <TextTrailDisplay
        text={title}
        lines={metrics.lines}
        opacities={opacities}
        color={color}
        size="transition"
        fontScale={metrics.scale}
        className="slideshow-title-band"
        label={title}
      />
    </div>
  )
}
