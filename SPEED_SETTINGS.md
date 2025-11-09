# 🎛️ Speed Settings - Quick Reference

**All speed/rotation settings are now in ONE place: `lib/animation.ts`**

## 📍 Single Source of Truth: `lib/animation.ts`

### 🏃 Movement Speed

```typescript
MIN_VELOCITY: -400,  // Minimum velocity
MAX_VELOCITY: 400,   // Maximum velocity
```

**How to adjust:**
- **Faster movement**: Increase both (e.g., ±600, ±800)
- **Slower movement**: Decrease both (e.g., ±200, ±100)
- **More variation**: Increase the gap between min/max

### 🔄 Rotation Speed

```typescript
MIN_ROTATION_SPEED: -0.004,  // Minimum (negative = counterclockwise)
MAX_ROTATION_SPEED: 0.004,   // Maximum (positive = clockwise)
```

**How to adjust:**
- **Faster spinning**: Increase max (e.g., 0.008, 0.01)
- **Slower spinning**: Decrease max (e.g., 0.002, 0.001)
- **All clockwise**: Set min to 0
- **All counterclockwise**: Set max to 0

### 📏 Stick Length

```typescript
MIN_LENGTH: 320,  // Minimum stick length (px)
MAX_LENGTH: 400,  // Maximum stick length (px)
```

**How to adjust:**
- **Longer sticks**: Increase both (e.g., 400-500)
- **Shorter sticks**: Decrease both (e.g., 100-200)

### ⚙️ Physics

```typescript
BOUNCE_DAMPING: 1.0,    // Energy retained on bounce
VELOCITY_DAMPING: 1.0,  // Slowdown per frame
```

**Bounce Damping:**
- `1.0` = maintains full speed (brutal!)
- `0.8` = loses 20% per bounce
- `0.5` = loses half speed per bounce

**Velocity Damping:**
- `1.0` = no slowdown at all
- `0.999` = very gradual slowdown
- `0.99` = noticeable slowdown

### 🎯 Interaction

```typescript
CLICK_THRESHOLD: 15,  // Click detection radius (px)
```

**How to adjust:**
- **Easier to click**: Increase (e.g., 20, 30)
- **Harder to click**: Decrease (e.g., 5, 8)

### 📊 Visual Settings

```typescript
STICK_COUNT: 15,      // Number of sticks
STROKE_WIDTH: 2,      // Line thickness (px)
```

---

## 🎯 Common Presets

### Preset: "CHAOS MODE" 🔥
```typescript
MIN_VELOCITY: -800,
MAX_VELOCITY: 800,
MIN_ROTATION_SPEED: -0.02,
MAX_ROTATION_SPEED: 0.02,
VELOCITY_DAMPING: 1.0,
```

### Preset: "CHILL VIBES" 😌
```typescript
MIN_VELOCITY: -100,
MAX_VELOCITY: 100,
MIN_ROTATION_SPEED: -0.001,
MAX_ROTATION_SPEED: 0.001,
VELOCITY_DAMPING: 0.99,
```

### Preset: "MECHANICAL" 🤖
```typescript
MIN_VELOCITY: -200,
MAX_VELOCITY: 200,
MIN_ROTATION_SPEED: 0.005,  // All rotate same direction
MAX_ROTATION_SPEED: 0.005,  // No variation
VELOCITY_DAMPING: 1.0,
```

### Preset: "GLACIAL" 🧊
```typescript
MIN_VELOCITY: -50,
MAX_VELOCITY: 50,
MIN_ROTATION_SPEED: -0.0005,
MAX_ROTATION_SPEED: 0.0005,
VELOCITY_DAMPING: 0.98,
```

---

## 📁 File Structure

```
lib/
└── animation.ts        ← ALL SETTINGS HERE (single source of truth)

app/
└── page.tsx           ← Uses settings from animation.ts
```

---

## ⚡ Quick Changes

Want to quickly test different speeds?

1. Open `lib/animation.ts`
2. Change `MIN_VELOCITY` and `MAX_VELOCITY`
3. Save and refresh browser
4. Done! 🎉

---

## 🎨 Current Settings (Your Config)

```typescript
STICK_COUNT: 15
MIN_LENGTH: 320
MAX_LENGTH: 400
MIN_VELOCITY: -400
MAX_VELOCITY: 400
MIN_ROTATION_SPEED: -0.004
MAX_ROTATION_SPEED: 0.004
BOUNCE_DAMPING: 1.0
VELOCITY_DAMPING: 1.0
CLICK_THRESHOLD: 15
```

**Character:** Long sticks, moderate speed, slow rotation, brutal physics

---

## 💡 Pro Tips

1. **Test in isolation**: Change one setting at a time
2. **Performance**: More sticks = lower FPS. Keep under 20 for smooth 60fps
3. **Visibility**: Longer sticks are easier to click
4. **Feel**: No damping = relentless, mechanical feel
5. **Contrast**: Higher velocities with slower rotation = interesting contrast

---

**Remember: Everything is in `lib/animation.ts` now! 🎯**







