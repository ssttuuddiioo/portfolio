import { PortfolioStick } from '@/types/stick'
import { COLORS, TYPOGRAPHY } from '@/lib/animation'

interface StickTextProps {
  stick: PortfolioStick
}

export function StickText({ stick }: StickTextProps) {
  // Only show on hover
  if (!stick.isHovered) return null

  // Left position of stick (start at beginning + small offset)
  const leftX = stick.position.x + Math.cos(stick.angle) * 20 // 20px from start
  const leftY = stick.position.y + Math.sin(stick.angle) * 20
  
  // Text rotates parallel to stick direction (same angle)
  const degrees = (stick.angle * 180) / Math.PI

  // Calculate perpendicular offset for text positioning
  // Text should be offset perpendicular to the stick
  const perpendicularAngle = stick.angle + Math.PI / 2
  const offsetDistance = 25 // px - distance from stick line
  
  // Client name ABOVE the stick (left-aligned)
  const clientX = leftX + Math.cos(perpendicularAngle) * offsetDistance
  const clientY = leftY + Math.sin(perpendicularAngle) * offsetDistance
  
  // Project title BELOW the stick (left-aligned)
  const titleX = leftX - Math.cos(perpendicularAngle) * offsetDistance
  const titleY = leftY - Math.sin(perpendicularAngle) * offsetDistance

  return (
    <g style={{ pointerEvents: 'none' }}>
      {/* Client name above stick */}
      {stick.client && (
        <text
          x={clientX}
          y={clientY}
          fill={COLORS.TEXT}
          fontSize="16px"
          fontFamily={TYPOGRAPHY.FONT_FAMILY}
          fontWeight={TYPOGRAPHY.FONT_WEIGHT}
          letterSpacing="2px"
          textAnchor="start"
          dominantBaseline="middle"
          transform={`rotate(${degrees} ${clientX} ${clientY})`}
          style={{
            textTransform: 'uppercase',
            userSelect: 'none',
          }}
        >
          {stick.client}
        </text>
      )}
      
      {/* Project title below stick */}
      {stick.title && (
        <text
          x={titleX}
          y={titleY}
          fill={COLORS.TEXT}
          fontSize="16px"
          fontFamily={TYPOGRAPHY.FONT_FAMILY}
          fontWeight={TYPOGRAPHY.FONT_WEIGHT}
          letterSpacing="2px"
          textAnchor="start"
          dominantBaseline="middle"
          transform={`rotate(${degrees} ${titleX} ${titleY})`}
          style={{
            textTransform: 'uppercase',
            userSelect: 'none',
          }}
        >
          {stick.title}
        </text>
      )}
    </g>
  )
}

