'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useAnimations, useGLTF } from '@react-three/drei'
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import * as THREE from 'three'
import { Bed, Info, Mail, Music, Volume2, VolumeX, type LucideIcon } from 'lucide-react'
import {
  SCAN_BUTTON_SIZE,
  SCAN_BUTTONS_LIFT_MOBILE,
  SCAN_ROW_DESKTOP,
  SCAN_STRIP,
  WORDMARK_LAST_O_CENTER,
  WORDMARK_MARGIN_DESKTOP,
} from './scanLayout'

const MODEL_URL = '/models/pablo-moves.glb'

// Scan is in metres, +Y up, feet at 0, facing +Z (XR Brooklyn 2026 capture),
// rigged in Mixamo; each clip is a named animation in the GLB, played in place
// Clips, in button order; the first is what the page lands on
const CLIPS: {
  name: string
  label: string
  Icon?: LucideIcon // no icon = no button (the landing clip)
  yaw?: number
  center?: { desktop: number; mobile: number }
  audio?: string // looped while this clip plays
}[] = [
  // Turn the figure (degrees around its vertical axis) while this clip plays
  { name: 'pacing', label: 'On the phone', yaw: 150 },
  { name: 'dancing', label: 'Dancing', Icon: Music, audio: '/audio/dance.mp3' },
  { name: 'laying', label: 'Lying down', Icon: Bed, yaw: 40 },
]
// Played by the contact (email) button rather than its own icon
const EMAIL_CLIP = 'typing'
const CROSSFADE = 0.5 // seconds
// Lying down rests on a YOPABLO wordmark; its letters' top edge as a fraction of the svg height
const LIE_ON_WORDMARK_CLIP = 'laying'
const WORDMARK_CAP_TOP = 14 / 160
const DISTANCE = 4
const FOV = 30
const FLOOR_MARGIN = 0.13 // metres of floor visible below the feet
// Aim at the figure's middle (≈ hip height), leaving a little floor below the feet
const TARGET = new THREE.Vector3(0, DISTANCE * Math.tan(THREE.MathUtils.degToRad(FOV / 2)) - FLOOR_MARGIN, 0)
// Width of the figure's column at the right edge; full width, so the figure and buttons are centred
const FIGURE_WIDTH = { desktop: 1, mobile: 1 } // fraction of the viewport
// Desktop: shift the figure this many px right of centre
const FIGURE_OFFSET_X_DESKTOP = 300
const MIN_POLAR = Math.PI * 0.2
const MAX_POLAR = Math.PI * 0.62
const IDLE_SPIN = 0.25 // radians per second; pauses while the visitor drags, then eases back in

const INTERACTIVE = 'a, button, input, textarea, select, label, [role="button"]'

// True when the point sits on rendered text, so dragging there selects text instead of orbiting
function isOverText(x: number, y: number) {
  let node: Node | null = null
  let offset = 0
  const doc = document as Document & {
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null
  }
  if (doc.caretPositionFromPoint) {
    const pos = doc.caretPositionFromPoint(x, y)
    node = pos?.offsetNode ?? null
    offset = pos?.offset ?? 0
  } else if (document.caretRangeFromPoint) {
    const range = document.caretRangeFromPoint(x, y)
    node = range?.startContainer ?? null
    offset = range?.startOffset ?? 0
  }
  if (!node || node.nodeType !== Node.TEXT_NODE) return false

  const length = node.textContent?.length ?? 0
  const range = document.createRange()
  range.setStart(node, Math.max(0, Math.min(offset, length) - 1))
  range.setEnd(node, Math.min(length, offset + 1))
  return Array.from(range.getClientRects()).some(
    (r) => x >= r.left - 2 && x <= r.right + 2 && y >= r.top - 2 && y <= r.bottom + 2
  )
}

function Figure({
  clip,
  yaw,
  onLoaded,
  figureRef,
}: {
  clip: string
  yaw: number
  onLoaded: () => void
  figureRef: React.RefObject<THREE.Group | null>
}) {
  // useGLTF(url, draco, meshopt) — model is meshopt-compressed
  const { scene, animations } = useGLTF(MODEL_URL, false, true)
  const { actions } = useAnimations(animations, figureRef)

  // Photo-scanned texture already has lighting baked in, so render it unlit
  useMemo(() => {
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh
      if (!mesh.isMesh) return
      const source = mesh.material as THREE.MeshStandardMaterial
      mesh.material = new THREE.MeshBasicMaterial({ map: source.map, toneMapped: false })
      // Skinned bounds are computed in the bind pose, so don't let culling hide the animated figure
      mesh.frustumCulled = false
    })
  }, [scene])

  useEffect(() => {
    onLoaded()
  }, [scene, onLoaded])

  // Crossfade into the selected clip; the cleanup fades out the previous one
  useEffect(() => {
    const action = actions[clip]
    if (!action) return
    action.reset().fadeIn(CROSSFADE).play()
    return () => {
      action.fadeOut(CROSSFADE)
    }
  }, [actions, clip])

  // Ease into the clip's facing direction alongside the crossfade (start already turned on load)
  const placed = useRef(false)
  useFrame((_, delta) => {
    const group = figureRef.current
    if (!group) return
    const facing = THREE.MathUtils.degToRad(yaw)
    group.rotation.y = placed.current ? THREE.MathUtils.damp(group.rotation.y, facing, 6, delta) : facing
    placed.current = true
  })

  return (
    <group ref={figureRef}>
      <primitive object={scene} />
    </group>
  )
}

// The page content sits above this canvas, so drags are picked up on the window
// and only start when the pointer is on the figure and not on text or a link.
// center: where the figure stands across the (full-width) canvas, 0 = left edge, 1 = right edge
// offsetX: extra px to shift the figure right of `center`
// faceYaw: when set (degrees the figure is turned), the idle spin pauses and the camera
// swings round to the figure's front, so it faces the visitor (e.g. sitting at the contact form)
function Orbit({
  figureRef,
  center,
  offsetX = 0,
  faceYaw = null,
  floorY = null,
}: {
  figureRef: React.RefObject<THREE.Group | null>
  center: number
  offsetX?: number
  faceYaw?: number | null
  floorY?: number | null // viewport px the floor (where the figure rests) should sit at
}) {
  const { camera, gl, size } = useThree()
  const orbit = useRef({
    azimuth: 0,
    polar: Math.PI / 2 - 0.03,
    held: false,
    spin: IDLE_SPIN,
    center,
    snapTo: null as number | null,
    offsetY: 0,
  })
  const origin = useMemo(() => new THREE.Vector3(), [])

  // The canvas is pinned, so its position only changes on resize; cache it rather than
  // reading layout every frame (which fights the smooth scroll)
  const canvasTop = useRef(0)
  useEffect(() => {
    const measure = () => {
      canvasTop.current = gl.domElement.getBoundingClientRect().top
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [gl, floorY])

  // Swing to the nearest front-facing angle (the figure faces +Z, turned by faceYaw)
  useEffect(() => {
    const o = orbit.current
    if (faceYaw === null) {
      o.snapTo = null
      return
    }
    const front = THREE.MathUtils.degToRad(faceYaw)
    const turns = Math.round((o.azimuth - front) / (Math.PI * 2))
    o.snapTo = front + turns * Math.PI * 2
  }, [faceYaw])
  const spherical = useMemo(() => new THREE.Spherical(), [])

  useEffect(() => {
    const canvas = gl.domElement
    const raycaster = new THREE.Raycaster()
    const ndc = new THREE.Vector2()
    let dragging = false
    let lastX = 0
    let lastY = 0
    let touchStart: { x: number; y: number } | null = null
    let touchDecided = false

    const hitsFigure = (x: number, y: number) => {
      const rect = canvas.getBoundingClientRect()
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom || !figureRef.current) return false
      ndc.set(((x - rect.left) / rect.width) * 2 - 1, -((y - rect.top) / rect.height) * 2 + 1)
      raycaster.setFromCamera(ndc, camera)
      return raycaster.intersectObject(figureRef.current, true).length > 0
    }

    const canGrab = (x: number, y: number, target: EventTarget | null) =>
      !(target instanceof Element && target.closest(INTERACTIVE)) && !isOverText(x, y) && hitsFigure(x, y)

    const rotate = (dx: number, dy: number) => {
      const o = orbit.current
      o.azimuth -= dx * 0.008
      o.polar = THREE.MathUtils.clamp(o.polar - dy * 0.005, MIN_POLAR, MAX_POLAR)
    }

    const setCursor = (cursor: string) => {
      document.body.style.cursor = cursor
    }

    // Mouse / pen
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || e.button !== 0) return
      if (!canGrab(e.clientX, e.clientY, e.target)) return
      e.preventDefault() // stop text selection from starting
      dragging = true
      orbit.current.held = true
      lastX = e.clientX
      lastY = e.clientY
      setCursor('grabbing')
    }
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      if (dragging) {
        rotate(e.clientX - lastX, e.clientY - lastY)
        lastX = e.clientX
        lastY = e.clientY
        return
      }
      setCursor(canGrab(e.clientX, e.clientY, e.target) ? 'grab' : '')
    }
    const onPointerUp = () => {
      if (!dragging) return
      dragging = false
      orbit.current.held = false
      setCursor('')
    }

    // Touch: sideways swipes on the figure orbit, vertical swipes still scroll the page
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0]
      touchStart = e.touches.length === 1 && canGrab(t.clientX, t.clientY, e.target) ? { x: t.clientX, y: t.clientY } : null
      touchDecided = false
      lastX = t.clientX
      lastY = t.clientY
    }
    const onTouchMove = (e: TouchEvent) => {
      if (!touchStart) return
      const t = e.touches[0]
      if (!touchDecided) {
        const dx = Math.abs(t.clientX - touchStart.x)
        const dy = Math.abs(t.clientY - touchStart.y)
        if (dx + dy < 4) return
        touchDecided = true
        if (dy > dx) {
          touchStart = null
          return
        }
      }
      e.preventDefault()
      orbit.current.held = true
      rotate(t.clientX - lastX, 0)
      lastX = t.clientX
      lastY = t.clientY
    }
    const onTouchEnd = () => {
      touchStart = null
      orbit.current.held = false
    }

    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd)
    window.addEventListener('touchcancel', onTouchEnd)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('touchcancel', onTouchEnd)
      setCursor('')
    }
  }, [camera, gl, figureRef])

  useFrame((_, delta) => {
    const o = orbit.current
    // Stop spinning while held or facing the visitor; otherwise ease back up to the idle speed
    o.spin = o.held || faceYaw !== null ? 0 : THREE.MathUtils.damp(o.spin, IDLE_SPIN, 1.5, delta)
    o.azimuth += delta * o.spin
    if (o.snapTo !== null) {
      if (o.held) {
        o.snapTo = null // a drag takes over
      } else {
        o.azimuth = THREE.MathUtils.damp(o.azimuth, o.snapTo, 4, delta)
        if (Math.abs(o.azimuth - o.snapTo) < 0.001) o.snapTo = null
      }
    }
    spherical.set(DISTANCE, o.polar, o.azimuth)
    camera.position.setFromSpherical(spherical).add(TARGET)
    camera.lookAt(TARGET)

    // Off-centre framing: render a window into a wider virtual view whose middle
    // is the figure, so the figure lands at `center` across the canvas
    o.center = THREE.MathUtils.damp(o.center, center, 4, delta)
    const cam = camera as THREE.PerspectiveCamera
    const { width: w, height: h } = size
    const fx = o.center * w + offsetX
    const fullWidth = 2 * Math.max(fx, w - fx)
    cam.aspect = fullWidth / h
    cam.setViewOffset(fullWidth, h, fullWidth / 2 - fx, 0, w, h)

    // Vertical shift so the floor lands on floorY (e.g. lying on top of the wordmark).
    // The floor under the figure projects to the same height at any orbit angle.
    let targetY = 0
    if (floorY !== null) {
      origin.set(0, 0, 0).project(cam)
      const floorInCanvas = ((1 - origin.y) / 2) * h
      targetY = floorInCanvas - (floorY - canvasTop.current)
    }
    o.offsetY = THREE.MathUtils.damp(o.offsetY, targetY, 4, delta)
    if (Math.abs(o.offsetY) > 0.01) cam.setViewOffset(fullWidth, h, fullWidth / 2 - fx, o.offsetY, w, h)
  })

  return null
}

interface ScanFigureProps {
  mobile?: boolean
  sectionClip?: string // the clip for the section in the middle of the screen
  onContactClick?: () => void
  onInfoClick?: () => void
}

export default function ScanFigure({ mobile = false, sectionClip, onContactClick, onInfoClick }: ScanFigureProps) {
  const [loaded, setLoaded] = useState(false)
  const [typing, setTyping] = useState(false)

  // Clip soundtrack: off until a clip with a soundtrack is picked, then keeps playing across
  // clips until muted with the speaker.
  // Started straight from click handlers (not an effect) so mobile Safari counts it as
  // user-initiated playback; silently does nothing if a file is missing.
  const [soundOn, setSoundOn] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const playClipAudio = (name: string, on = soundOn) => {
    const src = CLIPS.find((c) => c.name === name)?.audio
    if (!on) {
      audioRef.current?.pause()
      return
    }
    // Clips without a soundtrack leave whatever is playing running; only the speaker stops it
    if (!src) return
    if (!audioRef.current || !audioRef.current.src.endsWith(src)) {
      audioRef.current?.pause()
      audioRef.current = new Audio(src)
      audioRef.current.loop = true
    }
    if (audioRef.current.paused) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
    }
  }
  useEffect(() => () => audioRef.current?.pause(), [])

  // Autoplay when scrolling into a dancing section. Browsers only allow sound after the visitor
  // has clicked, tapped or pressed a key (scrolling doesn't count), so the soundtrack is
  // "unlocked" on the first such gesture anywhere; from then on scrolling into a dancing section
  // starts it unmuted. Muting with the speaker turns this off for the rest of the visit.
  const unlockedRef = useRef(false)
  const userMutedRef = useRef(false)
  const clipRef = useRef(CLIPS[0].name)
  const hasSoundtrack = (name: string) => !!CLIPS.find((c) => c.name === name)?.audio
  useEffect(() => {
    const src = CLIPS.find((c) => c.audio)?.audio
    if (!src) return
    const unlock = () => {
      if (unlockedRef.current) return
      unlockedRef.current = true
      if (!audioRef.current || !audioRef.current.src.endsWith(src)) {
        audioRef.current?.pause()
        audioRef.current = new Audio(src)
        audioRef.current.loop = true
      }
      const audio = audioRef.current
      if (!audio.paused) return // this gesture already started it (e.g. the dance button)
      // Play during the gesture (what mobile Safari needs), then keep it going only if the
      // visitor is in a dancing section and hasn't muted
      audio.muted = true
      audio
        .play()
        .then(() => {
          audio.muted = false
          if (hasSoundtrack(clipRef.current) && !userMutedRef.current) {
            audio.currentTime = 0
            setSoundOn(true)
          } else {
            audio.pause()
            audio.currentTime = 0
          }
        })
        .catch(() => {
          audio.muted = false
          unlockedRef.current = false // not allowed yet; try again on the next gesture
        })
    }
    const events = ['click', 'keydown', 'touchend'] as const
    events.forEach((type) => window.addEventListener(type, unlock, { capture: true }))
    return () => events.forEach((type) => window.removeEventListener(type, unlock, { capture: true }))
  }, [])

  // On touch screens, get the pinned buttons out of the way while the keyboard is up
  useEffect(() => {
    if (!window.matchMedia('(hover: none) and (pointer: coarse)').matches) return
    const isField = (el: EventTarget | null) =>
      el instanceof HTMLElement && (el.matches('input, textarea, select') || el.isContentEditable)
    const onFocusIn = (e: FocusEvent) => setTyping(isField(e.target))
    const onFocusOut = (e: FocusEvent) => {
      if (!isField(e.relatedTarget)) setTyping(false)
    }
    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('focusout', onFocusOut)
    return () => {
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('focusout', onFocusOut)
    }
  }, [])
  const [clip, setClip] = useState(CLIPS[0].name)

  // Lying down rests on top of a YOPABLO wordmark: the landing one near the top of the page,
  // the footer one near the bottom. floorY is where its letters' top edge sits on screen with
  // the page scrolled to that wordmark (the landing at the top, the footer at the very end);
  // the figure is pinned, so it's measured once rather than tracked while scrolling.
  const [wordmarkTop, setWordmarkTop] = useState<number | null>(null)
  useEffect(() => {
    if (clip !== LIE_ON_WORDMARK_CLIP) return
    const measure = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const nearBottom = window.scrollY > maxScroll / 2
      const el = document.getElementById(nearBottom ? 'footer-wordmark' : 'landing-wordmark')
      const content = document.querySelector('[data-scroll-content]')
      if (!el || !content) return setWordmarkTop(null)
      const r = el.getBoundingClientRect()
      // Position within the page (both rects move with the scroll), plus the gap above the
      // letters' cap height (glyph tops at ~14 of 160 units)
      const pageTop = r.top - content.getBoundingClientRect().top
      setWordmarkTop(pageTop - (nearBottom ? maxScroll : 0) + r.height * WORDMARK_CAP_TOP)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [clip])

  useEffect(() => {
    clipRef.current = clip
  }, [clip])

  // Follow the section in the middle of the screen (a button click wins until the next section).
  // Dancing sections start the music once sound is unlocked, unless the visitor muted it.
  useEffect(() => {
    if (!sectionClip) return
    setClip(sectionClip)
    if (hasSoundtrack(sectionClip) && unlockedRef.current && !userMutedRef.current) {
      setSoundOn(true)
      playClipAudio(sectionClip, true)
    } else {
      playClipAudio(sectionClip)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionClip])
  const handleLoaded = useCallback(() => setLoaded(true), [])
  const figureRef = useRef<THREE.Group>(null)
  const activeClip = CLIPS.find((c) => c.name === clip)
  // Speaker shows during a clip with a soundtrack, and stays while music plays so it can be muted
  const showSpeaker = !!activeClip?.audio || soundOn

  const figureWidth = mobile ? FIGURE_WIDTH.mobile : FIGURE_WIDTH.desktop
  const width = `${figureWidth * 100}vw`
  const center = (mobile ? activeClip?.center?.mobile : activeClip?.center?.desktop) ?? 1 - figureWidth / 2
  // Mobile: 1.5x the old 45svh figure (canvas = height minus the button strip), sized from
  // --hero-h, the screen height locked at load, so the keyboard opening can't shrink the figure
  const height = mobile ? 'calc(var(--hero-h, 100svh) * 0.675 - 28px)' : '85vh'
  const strip = mobile ? SCAN_STRIP.mobile : SCAN_STRIP.desktop // space under the figure for the clip buttons
  // Mobile: raise the button row off the bottom of the screen (desktop keeps it in the corner)
  const buttonsLift = mobile ? SCAN_BUTTONS_LIFT_MOBILE : 0
  const buttonSize = mobile ? SCAN_BUTTON_SIZE.mobile : SCAN_ROW_DESKTOP.buttonSize
  const iconSize = mobile ? 16 : SCAN_ROW_DESKTOP.iconSize
  const fade: React.CSSProperties = { opacity: loaded ? 1 : 0, transition: 'opacity 0.8s ease' }
  const buttonStyle = (active: boolean): React.CSSProperties => ({
    width: buttonSize,
    height: buttonSize,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: '1px solid',
    borderColor: active ? '#FDF843' : 'rgba(255, 255, 255, 0.5)',
    background: active ? '#FDF843' : 'transparent',
    color: active ? '#0020FF' : '#FFFFFF',
    transition: 'background 0.2s ease, color 0.2s ease, border-color 0.2s ease',
  })

  // Rendered into <body>, outside the smooth-scroll wrapper, so it stays pinned
  // to the viewport while the page content scrolls over it. The figure sits
  // behind the page; the clip buttons sit above it so they stay clickable.
  return createPortal(
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: '#0020FF', pointerEvents: 'none' }}>
        {/* Figure box, vertically centred on screen (the camera already aims at the figure's middle) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: mobile ? 'calc(var(--hero-h, 100svh) / 2)' : '50%',
            transform: 'translateY(-50%)',
            height: `calc(${height} - ${strip}px)`,
            ...fade,
          }}
        >
          <Canvas
            flat
            dpr={[1, 1.5]} // full-width canvas: 1.5x keeps it crisp without starving the scroll
            camera={{ position: [0, 1.05, DISTANCE], fov: FOV, near: 0.1, far: 50 }}
            gl={{ alpha: true, antialias: true }}
            style={{ pointerEvents: 'none' }}
          >
            <Suspense fallback={null}>
              <Figure clip={clip} yaw={activeClip?.yaw ?? 0} onLoaded={handleLoaded} figureRef={figureRef} />
            </Suspense>
            <Orbit
              figureRef={figureRef}
              center={center}
              offsetX={mobile ? 0 : FIGURE_OFFSET_X_DESKTOP}
              faceYaw={clip === EMAIL_CLIP ? 0 : null}
              floorY={clip === LIE_ON_WORDMARK_CLIP ? wordmarkTop : null}
            />
          </Canvas>
        </div>
      </div>

      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          visibility: typing ? 'hidden' : 'visible',
          opacity: typing ? 0 : 1,
          transition: 'opacity 0.2s ease, visibility 0.2s',
        }}
      >
        <div style={{ position: 'absolute', right: 0, bottom: buttonsLift, width, height: strip, ...fade }}>
          {/* Row of clip buttons: centred under the figure on mobile; on desktop centred under the
              last O of the landing wordmark (same margins as the wordmark, measured from the right) */}
          <div
            role="group"
            aria-label="Sound, animations, info and contact"
            style={{
              position: 'absolute',
              ...(mobile
                ? { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }
                : {
                    right: `calc(${WORDMARK_MARGIN_DESKTOP}px + ${1 - WORDMARK_LAST_O_CENTER} * (100% - ${2 * WORDMARK_MARGIN_DESKTOP}px))`,
                    bottom: SCAN_ROW_DESKTOP.centerFromBottom,
                    transform: 'translate(50%, 50%)',
                  }),
              display: 'flex',
              gap: 8,
              pointerEvents: 'auto',
            }}
          >
            {/* Sound on / off: shown during Dancing and while its music keeps playing. Sits just
                outside the row's left end so showing it doesn't shift the centred buttons. */}
            <button
              type="button"
              title={soundOn ? 'Mute' : 'Sound on'}
              aria-label={soundOn ? 'Mute' : 'Sound on'}
              aria-pressed={soundOn}
              aria-hidden={!showSpeaker}
              tabIndex={showSpeaker ? 0 : -1}
              onClick={() => {
                const next = !soundOn
                setSoundOn(next)
                userMutedRef.current = !next // a deliberate mute also stops scroll autoplay
                playClipAudio(clip, next)
              }}
              className="scan-clip-button"
              style={{
                ...buttonStyle(false),
                position: 'absolute',
                right: `calc(100% + ${mobile ? 12 : 16}px)`,
                top: 0,
                opacity: showSpeaker ? 1 : 0,
                visibility: showSpeaker ? 'visible' : 'hidden',
                transition: 'opacity 0.2s ease, visibility 0.2s, background 0.2s ease, color 0.2s ease, border-color 0.2s ease',
              }}
            >
              {soundOn ? (
                <Volume2 size={iconSize} strokeWidth={1.5} />
              ) : (
                <VolumeX size={iconSize} strokeWidth={1.5} />
              )}
            </button>
            {/* Info first, then the animations, then contact */}
            {onInfoClick && (
              <button
                type="button"
                title="Info"
                aria-label="Info"
                onClick={onInfoClick}
                className="scan-clip-button"
                style={buttonStyle(false)}
              >
                <Info size={iconSize} strokeWidth={1.5} />
              </button>
            )}
            {CLIPS.map(({ name, label, Icon }) => {
              if (!Icon) return null
              const active = clip === name
              return (
                <button
                  key={name}
                  type="button"
                  title={label}
                  aria-label={label}
                  aria-pressed={active}
                  onClick={() => {
                    setClip(name)
                    // Picking a clip with a soundtrack turns sound on; the speaker can then mute it
                    const withSound = soundOn || !!CLIPS.find((c) => c.name === name)?.audio
                    setSoundOn(withSound)
                    if (withSound) userMutedRef.current = false
                    playClipAudio(name, withSound)
                  }}
                  className="scan-clip-button"
                  style={buttonStyle(active)}
                >
                  <Icon size={iconSize} strokeWidth={1.5} />
                </button>
              )
            })}
            {onContactClick && (
              <button
                type="button"
                title="Contact me"
                aria-label="Contact me"
                aria-pressed={clip === EMAIL_CLIP}
                onClick={() => {
                  setClip(EMAIL_CLIP)
                  playClipAudio(EMAIL_CLIP)
                  onContactClick()
                }}
                className="scan-clip-button"
                style={buttonStyle(clip === EMAIL_CLIP)}
              >
                <Mail size={iconSize} strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}

useGLTF.preload(MODEL_URL, false, true)
