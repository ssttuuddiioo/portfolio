# 3D Features Documentation

## Overview

The portfolio now uses **React Three Fiber** for true 3D rendering. Sticks float in 3D space and can be arranged into various geometric formations.

## Features

### 3D Sticks
- Sticks are rendered as 3D cylinders with full 3D rotation
- Physics simulation includes x, y, and z axes
- Bouncing and movement in 3D space
- Maintains the brutalist aesthetic (white on black)

### Initial State
- **Scattered Mode**: Sticks start scattered in a shallow 3D plane
- Appears similar to 2D but with subtle depth
- Natural floating behavior maintained

### Geometric Formations

Press number keys to switch between formations:

1. **Scattered** - Free-floating (default)
2. **Sphere** - Arranged on a spherical surface
3. **Cube** - Arranged in a cubic grid
4. **Grid** - Flat 2D grid layout
5. **Helix** - Spiral/helix formation
6. **Wave** - Wavy 3D surface

### Smooth Transitions
- Sticks smoothly transition between formations
- Lerp-based animation for organic movement
- Velocity dampens when entering formation
- Physics resume when returning to scattered mode

### Interactions
- **Click stick** - Toggle text visibility
- **Hover stick** - Show project image (2D overlay)
- **Keyboard controls** - Switch formations

## Technical Architecture

### Components

#### `Stick3D.tsx`
- 3D cylinder mesh using `<cylinderGeometry>`
- Position and rotation in 3D space
- Click and hover interactions

#### `StickText3D.tsx`
- HTML overlay using `@react-three/drei`'s `<Html>` component
- Shows skill, client, and project title
- Brutalist typography maintained

#### `useSticks3D.ts`
- Physics engine with 3D velocity and position
- Formation calculations (sphere, cube, grid, helix, wave)
- Smooth transitions between states
- Bounds checking for x, y, z axes

#### `Scene3D.tsx`
- React Three Fiber `<Canvas>` setup
- PerspectiveCamera for 3D view
- Keyboard controls for formations
- Custom cursor (white circle with difference blend)

### Data Structure

```typescript
interface PortfolioStick {
  // ... other fields
  position: { x: number; y: number; z: number }  // 3D position
  velocity: { x: number; y: number; z: number }  // 3D velocity
  rotation3D: { x: number; y: number; z: number } // 3D rotation angles
}
```

### Performance
- Server-side rendering with fixed initial positions
- Client-side hydration with dynamic 3D
- Efficient requestAnimationFrame loop
- Minimal re-renders with proper React patterns

## Future Enhancements

Potential additions:
- More formation types (torus, DNA double helix, etc.)
- Mouse-driven formations (sticks follow cursor in 3D)
- Depth-based scaling (perspective size changes)
- 3D shadows and lighting effects
- WebXR support for VR/AR viewing
- Timeline scrubbing for formation transitions

## Migration Notes

### Breaking Changes
- Position and velocity now require `z` coordinate
- `rotation3D` is now an object with x, y, z properties
- Old 2D SVG components replaced with 3D meshes

### Backward Compatibility
- Sanity data structure remains unchanged
- Server-side rendering still works
- Images and text still use 2D overlays




