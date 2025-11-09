'use client'

import { PortfolioStick } from '@/types/stick'
import Image from 'next/image'
import { COLORS, TYPOGRAPHY } from '@/lib/animation'

interface StickImageProps {
  stick: PortfolioStick
}

export function StickImage({ stick }: StickImageProps) {
  if (!stick.isHovered || !stick.imageUrl) return null

  const imageSize = 450 // px

  return (
    <div
      style={{
        position: 'fixed',
        right: '150px', // Fixed position on right side
        top: '50%', // Centered vertically
        transform: 'translateY(-50%)',
        pointerEvents: 'none',
        zIndex: 100, // Above the canvas
        // Fast drop fade-in animation
        animation: 'dropFadeIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        alignItems: 'flex-end',
      }}
    >
      {/* Project Image */}
      <div
        style={{
          width: `${imageSize}px`,
          height: `${imageSize}px`,
          mixBlendMode: 'difference',
        }}
      >
        <Image
          src={stick.imageUrl}
          alt={stick.title || stick.skill}
          width={imageSize}
          height={imageSize}
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
          }}
          unoptimized // For local images
        />
      </div>
      
      <style jsx>{`
        @keyframes dropFadeIn {
          0% {
            opacity: 0;
            transform: translateY(-50%) translateY(-30px);
          }
          100% {
            opacity: 1;
            transform: translateY(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

