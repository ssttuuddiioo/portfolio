# 📱 Mobile Access Guide

## How to View on Mobile

### On Same WiFi Network

1. **Make sure mobile is on same WiFi** as your computer
2. **Find your network URL** in the terminal:
   ```
   - Network:      http://192.168.1.153:3333
   ```
3. **Open on mobile browser**: Enter that URL
4. **Done!** ✨

---

## 🎯 Mobile Optimizations

The site automatically adjusts for mobile:

### Performance
- **Sticks reduced**: 15 → 8 sticks on mobile (better FPS)
- **Responsive sizing**: Sticks scale to screen size
- **Touch events**: Click detection works with touch

### Current Mobile Settings
```typescript
// Auto-detects mobile (< 768px width)
stickCount: 8           // Reduced from 15
touchThreshold: 15px    // Same as click threshold
```

---

## 🔧 Testing Different Devices

### iPhone/Android
- Safari/Chrome works best
- Touch to reveal text
- Smooth 60fps on modern devices

### Tablet
- Full experience (iPad Pro, etc.)
- More sticks visible due to larger screen
- Better for interaction

---

## 📊 Performance Tips

If laggy on mobile:

1. **Reduce stick count** in `lib/animation.ts`:
   ```typescript
   STICK_COUNT: 6,  // Even fewer sticks
   ```

2. **Shorter sticks** (less math):
   ```typescript
   MIN_LENGTH: 150,
   MAX_LENGTH: 250,
   ```

3. **Slower speeds** (less updates):
   ```typescript
   MIN_VELOCITY: -30,
   MAX_VELOCITY: 30,
   ```

---

## 🌐 Network URL Changes

Your network URL will change if:
- ❌ Computer gets new IP from router
- ❌ Connected to different WiFi
- ❌ Router restarts

**Fix:** Check terminal for new URL and update on mobile

---

## 🚀 Share with Others

Anyone on your WiFi can access:
```
http://192.168.1.153:3333
```

Share the URL to show your portfolio to:
- Friends on same network
- Test on multiple devices
- Get feedback in real-time

---

## ⚠️ Limitations

**Local only:**
- Only works on same WiFi network
- Not accessible from internet
- Not persistent (dev server only)

**For production:**
- Deploy to Vercel
- Get permanent URL
- Works from anywhere

---

## 🎨 Mobile-Specific Features

✅ **Touch interaction** - Tap sticks to reveal text  
✅ **Auto-scaling** - Adapts to screen size  
✅ **Performance** - Reduced sticks for smooth 60fps  
✅ **Full screen** - No scrolling, immersive experience  

---

**Current Network URL:** `http://192.168.1.153:3333`

Try it now on your phone! 📱







