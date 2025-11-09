# Brutalist Rotating Sticks Portfolio

## Design Philosophy

This portfolio follows brutalist design principles:
- **Raw & Direct**: No decorative elements, pure functionality
- **Harsh Aesthetics**: High contrast, sharp edges, no easing
- **Mechanical Motion**: Relentless, systematic movement
- **No Comfort**: Function over user experience niceties

## What You'll See

### Visual Elements
- 8 thin white lines (2px stroke) on pure black background
- Lines: 120-200px long
- Moving at high velocity (full screen in 3-4 seconds)
- Sharp, angular rotations with perfect wall bounces

### Interaction
- **No hover effects** - No visual feedback until click
- **Click on any stick** - Text appears instantly (no fade)
- **Text rotates** - Parallel to stick direction
- **High contrast** - White text on black background
- **Multiple reveals** - No limit on visible texts

### Motion Characteristics
- High base velocity
- Perfect angle reflections on walls
- No velocity damping (maintains speed after bounces)
- Varied rotation speeds (some slow, some very fast)
- Urgent, industrial feel

## Managing Content

### In Sanity Studio (http://localhost:3333/studio)

1. **Add New Stick**:
   - Go to "Portfolio Stick" in sidebar
   - Click "+ Create"
   - Fill in:
     - **Skill/Label**: Short text (CODE, DESIGN, BUILD, etc.)
     - **Rotation Speed**: -0.02 to 0.02 (negative = counterclockwise)
     - **Length**: 120-200px
     - **Velocity X/Y**: -200 to 200 (initial movement direction)
     - **Display Order**: Number for rendering order
   - Click "Publish"

2. **Default Configuration**:
   - If no sticks exist, system generates 8 default sticks
   - Skills: CODE, DESIGN, BUILD, SHIP, TEST, DEPLOY, CREATE, ITERATE
   - Random velocities and rotations
   - Random initial positions

## Technical Details

### Physics
- Position updates: `position += velocity * deltaTime`
- Wall bouncing: Perfect angle reflection, velocity maintained
- Rotation: `angle += rotationSpeed * deltaTime`
- Velocity damping: 0.999 per frame (minimal)
- Target: 60fps

### Text Anchoring
- Text positioned at 50% of stick length
- Rotates parallel to stick angle
- Instant appear/disappear (no transitions)
- Uppercase, bold, monospace font
- 2px letter spacing

### Interaction System
- Click detection: Point-to-line distance < 5px
- Toggle text visibility per stick
- No limit on visible texts
- Instant state changes

## Performance

- Target: 60fps on modern devices
- SVG rendering with crisp edges
- Minimal anti-aliasing
- Optimized physics loop with deltaTime
- Max 8 sticks by default

## Customization

### Colors
Edit `lib/animation.ts`:
```typescript
export const COLORS = {
  BACKGROUND: '#000000', // Pure black
  STICK: '#FFFFFF',      // White sticks
  TEXT: '#FFFFFF',       // White text
}
```

### Typography
```typescript
export const TYPOGRAPHY = {
  FONT_FAMILY: "'Courier New', monospace",
  FONT_WEIGHT: 'bold',
  LETTER_SPACING: '2px',
  FONT_SIZE: '14px',
}
```

### Physics Constants
```typescript
export const ANIMATION = {
  STICK_COUNT: 8,
  STROKE_WIDTH: 2,
  MIN_LENGTH: 120,
  MAX_LENGTH: 200,
  BASE_VELOCITY: 150,
  BOUNCE_DAMPING: 1.0,  // No damping
  VELOCITY_DAMPING: 0.999,
  CLICK_THRESHOLD: 5,
  TARGET_FPS: 60,
}
```

## File Structure

```
app/
├── scenes/
│   └── rotating-sticks/
│       ├── index.tsx      # Main scene component
│       ├── Stick.tsx      # Individual stick rendering
│       ├── StickText.tsx  # Text overlay
│       └── useSticks.ts   # Physics hook
lib/
└── animation.ts           # Constants & config
types/
└── stick.ts               # TypeScript interfaces
sanity/
└── schemas/
    └── stick.ts           # Sanity schema
```

## Brutalist Principles Applied

1. **No Animations**: Instant state changes, no easing curves
2. **No Hover States**: Pure click interaction
3. **Sharp Edges**: crisp-edges rendering, no anti-aliasing
4. **High Contrast**: Pure black & white only
5. **Mechanical Motion**: Perfect physics, no organic feel
6. **Raw Typography**: Monospace, bold, uppercase
7. **No Comfort**: Fast movement, harsh aesthetics
8. **Function First**: Every element serves a purpose

## Browser Support

- Modern Chrome/Firefox/Safari
- Requires SVG support
- Requires requestAnimationFrame
- Best on desktop (60fps target)
- Mobile: Reduced stick count may be needed

---

**This is brutalism. It doesn't care about your comfort. It just works.**







