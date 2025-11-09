'use client'

import { PortfolioStick } from '@/types/stick'
import { COLORS, TYPOGRAPHY } from '@/lib/animation'
import { Html } from '@react-three/drei'

interface StickText3DProps {
  stick: PortfolioStick
}

export function StickText3D({ stick }: StickText3DProps) {
  if (!stick.textVisible) return null

  return (
    <group position={[stick.position.x, stick.position.y, stick.position.z]}>
      <Html
        center
        distanceFactor={10}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {/* Client name above */}
        {stick.client && (
          <div
            style={{
              color: COLORS.TEXT,
              fontFamily: TYPOGRAPHY.FONT_FAMILY,
              fontWeight: TYPOGRAPHY.FONT_WEIGHT,
              fontSize: '10px',
              letterSpacing: TYPOGRAPHY.LETTER_SPACING,
              opacity: 0.7,
              mixBlendMode: 'difference',
              whiteSpace: 'nowrap',
            }}
          >
            {stick.client}
          </div>
        )}
        
        {/* Main skill text */}
        <div
          style={{
            color: COLORS.TEXT,
            fontFamily: TYPOGRAPHY.FONT_FAMILY,
            fontWeight: TYPOGRAPHY.FONT_WEIGHT,
            fontSize: TYPOGRAPHY.FONT_SIZE,
            letterSpacing: TYPOGRAPHY.LETTER_SPACING,
            mixBlendMode: 'difference',
            whiteSpace: 'nowrap',
          }}
        >
          {stick.skill}
        </div>
        
        {/* Project title below */}
        {stick.title && (
          <div
            style={{
              color: COLORS.TEXT,
              fontFamily: TYPOGRAPHY.FONT_FAMILY,
              fontWeight: TYPOGRAPHY.FONT_WEIGHT,
              fontSize: '10px',
              letterSpacing: TYPOGRAPHY.LETTER_SPACING,
              opacity: 0.7,
              mixBlendMode: 'difference',
              whiteSpace: 'nowrap',
            }}
          >
            {stick.title}
          </div>
        )}
      </Html>
    </group>
  )
}

