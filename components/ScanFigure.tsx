'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useAnimations, useGLTF } from '@react-three/drei'
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import * as THREE from 'three'
import { Bed, Footprints, Mail, Music, Phone, type LucideIcon } from 'lucide-react'

const MODEL_URL = '/models/pablo-moves.glb'

// Scan is in metres, +Y up, feet at 0, facing +Z (XR Brooklyn 2026 capture),
// rigged in Mixamo; each clip is a named animation in the GLB, played in place
// Clips with their own button in the row
const CLIPS: { name: string; label: string; Icon: LucideIcon; distance?: number; yaw?: number }[] = [
  { name: 'pacing', label: 'On the phone', Icon: Phone },
  // Turn the figure (degrees around its vertical axis) while this clip plays
  { name: 'walking', label: 'Walking', Icon: Footprints, yaw: 130 },
  { name: 'dancing', label: 'Dancing', Icon: Music },
  // Lying flat is wider than standing tall, so pull the camera back
  { name: 'laying', label: 'Lying down', Icon: Bed, distance: 6 },
]
// Played by the email button rather than its own icon
const EMAIL_CLIP = 'typing'
const CROSSFADE = 0.5 // seconds
const DISTANCE = 4
const FOV = 30
const FLOOR_MARGIN = 0.13 // metres of floor visible below the feet
// Aim so the floor stays at the bottom of the frame at any camera distance
const targetHeight = (distance: number) => distance * Math.tan(THREE.MathUtils.degToRad(FOV / 2)) - FLOOR_MARGIN
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

  // Ease into the clip's facing direction alongside the crossfade
  useFrame((_, delta) => {
    const group = figureRef.current
    if (!group) return
    group.rotation.y = THREE.MathUtils.damp(group.rotation.y, THREE.MathUtils.degToRad(yaw), 6, delta)
  })

  return (
    <group ref={figureRef}>
      <primitive object={scene} />
    </group>
  )
}

// The page content sits above this canvas, so drags are picked up on the window
// and only start when the pointer is on the figure and not on text or a link.
function Orbit({ figureRef, distance }: { figureRef: React.RefObject<THREE.Group | null>; distance: number }) {
  const { camera, gl } = useThree()
  const orbit = useRef({ azimuth: 0, polar: Math.PI / 2 - 0.03, held: false, spin: IDLE_SPIN, distance })
  const spherical = useMemo(() => new THREE.Spherical(), [])
  const target = useMemo(() => new THREE.Vector3(), [])

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
    // Stop spinning while held; afterwards ease back up to the idle speed
    o.spin = o.held ? 0 : THREE.MathUtils.damp(o.spin, IDLE_SPIN, 1.5, delta)
    o.azimuth += delta * o.spin
    o.distance = THREE.MathUtils.damp(o.distance, distance, 4, delta)
    target.set(0, targetHeight(o.distance), 0)
    spherical.set(o.distance, o.polar, o.azimuth)
    camera.position.setFromSpherical(spherical).add(target)
    camera.lookAt(target)
  })

  return null
}

interface ScanFigureProps {
  mobile?: boolean
  onEmailClick?: () => void
}

export default function ScanFigure({ mobile = false, onEmailClick }: ScanFigureProps) {
  const [loaded, setLoaded] = useState(false)
  const [clip, setClip] = useState(CLIPS[0].name)
  const handleLoaded = useCallback(() => setLoaded(true), [])
  const figureRef = useRef<THREE.Group>(null)
  const activeClip = CLIPS.find((c) => c.name === clip)

  const width = mobile ? '60vw' : '34vw'
  const height = mobile ? '45dvh' : '85vh'
  const strip = mobile ? 56 : 72 // space under the figure for the clip buttons
  const buttonSize = mobile ? 36 : 40
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
        <div style={{ position: 'absolute', right: 0, bottom: strip, width, height: `calc(${height} - ${strip}px)`, ...fade }}>
          <Canvas
            flat
            dpr={[1, 2]}
            camera={{ position: [0, 1.05, DISTANCE], fov: FOV, near: 0.1, far: 50 }}
            gl={{ alpha: true, antialias: true }}
            style={{ pointerEvents: 'none' }}
          >
            <Suspense fallback={null}>
              <Figure clip={clip} yaw={activeClip?.yaw ?? 0} onLoaded={handleLoaded} figureRef={figureRef} />
            </Suspense>
            <Orbit figureRef={figureRef} distance={activeClip?.distance ?? DISTANCE} />
          </Canvas>
        </div>
      </div>

      <div style={{ position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', right: 0, bottom: 0, width, height: strip, ...fade }}>
          {/* Row of clip buttons, ending under the figure's feet */}
          <div
            role="group"
            aria-label="Animations and contact"
            style={{
              position: 'absolute',
              right: '50%',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              gap: 8,
              pointerEvents: 'auto',
            }}
          >
            {CLIPS.map(({ name, label, Icon }) => {
              const active = clip === name
              return (
                <button
                  key={name}
                  type="button"
                  title={label}
                  aria-label={label}
                  aria-pressed={active}
                  onClick={() => setClip(name)}
                  className="scan-clip-button"
                  style={buttonStyle(active)}
                >
                  <Icon size={mobile ? 16 : 18} strokeWidth={1.5} />
                </button>
              )
            })}
            {onEmailClick && (
              <button
                type="button"
                title="Email me"
                aria-label="Email me"
                aria-pressed={clip === EMAIL_CLIP}
                onClick={() => {
                  setClip(EMAIL_CLIP)
                  onEmailClick()
                }}
                className="scan-clip-button"
                style={{ ...buttonStyle(clip === EMAIL_CLIP), marginLeft: mobile ? 4 : 8 }}
              >
                <Mail size={mobile ? 16 : 18} strokeWidth={1.5} />
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
