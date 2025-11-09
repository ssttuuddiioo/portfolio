import { PortfolioStick } from '@/types/stick'
import { ANIMATION, COLORS } from '@/lib/animation'

interface StickProps {
  stick: PortfolioStick
}

export function Stick({ stick }: StickProps) {
  const x1 = stick.position.x
  const y1 = stick.position.y
  const x2 = x1 + Math.cos(stick.angle) * stick.length
  const y2 = y1 + Math.sin(stick.angle) * stick.length

  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={COLORS.STICK}
      strokeWidth={ANIMATION.STROKE_WIDTH}
      strokeLinecap="butt"
      style={{
        shapeRendering: 'crispEdges',
      }}
    />
  )
}







