'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import * as THREE from 'three'

const MODEL_URL = '/models/pablo.glb'

// Scan is in metres, +Y up, feet at 0, facing +Z (XR Brooklyn 2026 capture)
const TARGET = new THREE.Vector3(0, 0.94, 0)
const DISTANCE = 4
const MIN_POLAR = Math.PI * 0.2
const MAX_POLAR = Math.PI * 0.62
const IDLE_SPIN = 0.25 // radians per second until the visitor drags

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

function Figure({ onLoaded, figureRef }: { onLoaded: () => void; figureRef: React.RefObject<THREE.Group | null> }) {
  // useGLTF(url, draco, meshopt) — model is meshopt-compressed
  const { scene } = useGLTF(MODEL_URL, false, true)

  // Photo-scanned texture already has lighting baked in, so render it unlit
  const figure = useMemo(() => {
    const root = scene.clone(true)
    root.traverse((obj) => {
      const mesh = obj as THREE.Mesh
      if (!mesh.isMesh) return
      const source = mesh.material as THREE.MeshStandardMaterial
      mesh.material = new THREE.MeshBasicMaterial({ map: source.map, toneMapped: false })
    })
    return root
  }, [scene])

  useEffect(() => {
    onLoaded()
  }, [figure, onLoaded])

  return (
    <group ref={figureRef}>
      <primitive object={figure} />
    </group>
  )
}

// The page content sits above this canvas, so drags are picked up on the window
// and only start when the pointer is on the figure and not on text or a link.
function Orbit({ figureRef }: { figureRef: React.RefObject<THREE.Group | null> }) {
  const { camera, gl } = useThree()
  const orbit = useRef({ azimuth: 0, polar: Math.PI / 2 - 0.03, interacted: false })
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
      o.interacted = true
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
      rotate(t.clientX - lastX, 0)
      lastX = t.clientX
      lastY = t.clientY
    }
    const onTouchEnd = () => {
      touchStart = null
    }

    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      setCursor('')
    }
  }, [camera, gl, figureRef])

  useFrame((_, delta) => {
    const o = orbit.current
    if (!o.interacted) o.azimuth += delta * IDLE_SPIN
    spherical.set(DISTANCE, o.polar, o.azimuth)
    camera.position.setFromSpherical(spherical).add(TARGET)
    camera.lookAt(TARGET)
  })

  return null
}

export default function ScanFigure({ mobile = false }: { mobile?: boolean }) {
  const [loaded, setLoaded] = useState(false)
  const handleLoaded = useCallback(() => setLoaded(true), [])
  const figureRef = useRef<THREE.Group>(null)

  // Rendered into <body>, outside the smooth-scroll wrapper, so it stays pinned
  // to the viewport while the page content scrolls over it.
  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: '#0020FF', pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: mobile ? '60vw' : '34vw',
          height: mobile ? '45dvh' : '85vh',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.8s ease',
        }}
      >
        <Canvas
          flat
          dpr={[1, 2]}
          camera={{ position: [0, 1.05, DISTANCE], fov: 30, near: 0.1, far: 50 }}
          gl={{ alpha: true, antialias: true }}
          style={{ pointerEvents: 'none' }}
        >
          <Suspense fallback={null}>
            <Figure onLoaded={handleLoaded} figureRef={figureRef} />
          </Suspense>
          <Orbit figureRef={figureRef} />
        </Canvas>
      </div>
    </div>,
    document.body
  )
}

useGLTF.preload(MODEL_URL, false, true)
