// Brutalist animation constants - ALL SETTINGS IN ONE PLACE
export const ANIMATION = {
  // Stick appearance
  STICK_COUNT: 32,
  STROKE_WIDTH: 2,
  MIN_LENGTH: 320,
  MAX_LENGTH: 400,
  
  // Speed settings (adjust these for overall speed)
  BASE_VELOCITY: 15.5, // px/second base speed (25% slower)
  MIN_VELOCITY: -50, // Min velocity range (25% slower)
  MAX_VELOCITY: 50,  // Max velocity range (25% slower)
  
  // Rotation settings
  MIN_ROTATION_SPEED: -0.3, // Min rotation speed (25% slower)
  MAX_ROTATION_SPEED: 0.3,  // Max rotation speed (25% slower)
  
  // Physics
  BOUNCE_DAMPING: 1.0, // 1.0 = maintains velocity, 0.8 = loses 20% per bounce
  VELOCITY_DAMPING: 1.0, // 1.0 = no slowdown, 0.999 = gradual slowdown
  
  // Interaction
  CLICK_THRESHOLD: 15, // px distance for click detection (higher = easier to click)
  TEXT_FADE_DURATION: 0, // Instant - no transitions
  MAX_VISIBLE_TEXTS: 999, // No limit
  
  // Mouse proximity effects
  PROXIMITY_RADIUS: 200, // px - distance where slowdown begins (larger = more obvious)
  PROXIMITY_SLOWDOWN: 0.15, // 85% slowdown at mouse position (VERY dramatic)
  PROXIMITY_EASING: 2, // Lower = sharper, more noticeable transition
  
  // Custom cursor
  CURSOR_RADIUS: 25, // px - white circle cursor size (inverts colors)
  CURSOR_LAG: 0.99, // 0.01 = lots of drag, 0.5 = minimal drag, 1.0 = no drag
  
  // Hover images
  HOVER_DETECTION_RADIUS: 45, // px - distance to trigger image hover (CLICK_THRESHOLD + 30)
  IMAGE_SIZE: 600, // px - size of hover image (displayed on right side, 2x bigger)
  IMAGE_RIGHT_MARGIN: 80, // px - distance from right edge of screen
  IMAGE_DROP_DISTANCE: 30, // px - how far image drops on appear
  IMAGE_ANIMATION_DURATION: 0.2, // seconds - fast drop animation
  
  // Performance
  TARGET_FPS: 60,
} as const

export const COLORS = {
  BACKGROUND: '#000000',
  STICK: '#FFFFFF',
  TEXT: '#FFFFFF',
} as const

export const TYPOGRAPHY = {
  FONT_FAMILY: "'Futura', 'Futura PT', -apple-system, BlinkMacSystemFont, sans-serif",
  FONT_WEIGHT: 'bold',
  LETTER_SPACING: '2px',
  FONT_SIZE: '14px',
} as const

