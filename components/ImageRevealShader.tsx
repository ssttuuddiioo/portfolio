'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import { gsap } from 'gsap'

interface ShaderPlaneProps {
  imageUrl: string
  progress: number
}

function ShaderPlane({ imageUrl, progress }: ShaderPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const texture = useTexture(imageUrl)
  const { viewport } = useThree()

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uSize: { value: new THREE.Vector2(viewport.width, viewport.height) },
    }),
    [texture, viewport.width, viewport.height]
  )

  const vertexShader = `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const fragmentShader = `
    uniform sampler2D uTexture;
    uniform float uTime;
    uniform float uProgress;
    uniform vec2 uSize;
    varying vec2 vUv;

    float noise(vec2 point, float timeOffset) {
      float frequency = 1.0;
      float angle = atan(point.y, point.x) + uTime * 0.02 + timeOffset;
      
      float w0 = (cos(angle * frequency) + 1.0) / 2.0;
      float w1 = (sin(2.0 * angle * frequency) + 1.0) / 2.0;
      float w2 = (cos(3.0 * angle * frequency) + 1.0) / 2.0;
      float wave = (w0 + w1 + w2) / 3.0;
      return wave;
    }

    float circleSDF(vec2 pos, float rad, float timeOffset) {
      float a = sin(uTime * 0.2 + timeOffset) * 0.3;
      float amt = 0.7 + a;
      float circle = length(pos);
      circle += noise(pos, timeOffset) * rad * amt;
      return circle;
    }

    float radialCircles(vec2 p, float offsetDist, float timeOffset) {
      float count = 6.0;
      float angle = (2.0 * 3.1415926535) / count;
      float s = round(atan(p.y, p.x) / angle);
      float an = angle * s;
      vec2 q = vec2(offsetDist * cos(an), offsetDist * sin(an));
      vec2 pos = p - q;
      float circle = circleSDF(pos, 80.0, timeOffset);
      return circle;
    }

    float softMin(float a, float b, float k) {
      float h = max(k - abs(a - b), 0.0) / k;
      return min(a, b) - h * h * k * 0.25;
    }

    void main() {
      vec4 bg = vec4(0.0, 0.0, 0.0, 0.0);
      vec4 textureColor = texture2D(uTexture, vUv);
      vec2 coords = vUv * uSize;
      
      // Starting point for main circle (center of canvas)
      vec2 o1 = vec2(0.5, 0.5) * uSize;
      
      // Easing function for smooth reveal
      float t = pow(uProgress, 1.0);
      float radius = max(uSize.x, uSize.y) * 1.2;
      float rad = t * radius;
      
      // Main circle
      float c1 = circleSDF(coords - o1, rad, 0.0);
      
      // Radial circles with different offsets
      vec2 p = (vUv - 0.5) * uSize;
      float r1 = radialCircles(p, 0.2 * max(uSize.x, uSize.y), 0.5);
      float r2 = radialCircles(p, 0.45 * max(uSize.x, uSize.y), 1.0);
      
      // Smooth merge all circles
      float circle = softMin(c1, r1, 80.0);
      circle = softMin(circle, r2, 80.0);
      
      // Step function to create the mask
      circle = step(circle, rad);
      
      // Mix background with texture based on circle mask
      vec4 color = mix(bg, textureColor, circle);
      
      gl_FragColor = color;
    }
  `

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial
      material.uniforms.uTime.value = state.clock.elapsedTime
      material.uniforms.uProgress.value = progress
    }
  })

  useEffect(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial
      material.uniforms.uSize.value.set(viewport.width, viewport.height)
    }
  }, [viewport.width, viewport.height])

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
      />
    </mesh>
  )
}

interface ImageRevealShaderProps {
  imageUrl: string
  isVisible: boolean
  width: number
  height: number
  style?: React.CSSProperties
}

export function ImageRevealShader({
  imageUrl,
  isVisible,
  width,
  height,
  style,
}: ImageRevealShaderProps) {
  const [progress, setProgress] = useState(0)
  const progressRef = useRef({ value: 0 })

  useEffect(() => {
    gsap.to(progressRef.current, {
      value: isVisible ? 1 : 0,
      duration: 1.2,
      ease: 'power2.out',
      onUpdate: () => {
        setProgress(progressRef.current.value)
      },
    })
  }, [isVisible])

  return (
    <div style={{ width, height, ...style }}>
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ShaderPlane imageUrl={imageUrl} progress={progress} />
      </Canvas>
    </div>
  )
}

