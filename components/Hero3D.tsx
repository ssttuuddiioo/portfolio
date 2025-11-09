'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Float, Text3D, Center } from '@react-three/drei'
import { Suspense } from 'react'

function FloatingShape({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh position={position}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={color} wireframe />
      </mesh>
    </Float>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#667eea" />
      
      <FloatingShape position={[-4, 2, -2]} color="#667eea" />
      <FloatingShape position={[4, -2, -2]} color="#764ba2" />
      <FloatingShape position={[0, 0, -5]} color="#f093fb" />
      
      <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} />
    </>
  )
}

export default function Hero3D() {
  return (
    <section className="relative h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>
      
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-6 text-5xl font-bold text-white md:text-7xl lg:text-8xl">
          Creative Developer
        </h1>
        <p className="mb-8 max-w-2xl text-xl text-gray-300 md:text-2xl">
          Building immersive digital experiences with modern web technologies
        </p>
        <div className="flex gap-4">
          <a
            href="#projects"
            className="rounded-full bg-white px-8 py-3 font-semibold text-purple-900 transition hover:bg-gray-100"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="rounded-full border-2 border-white px-8 py-3 font-semibold text-white transition hover:bg-white hover:text-purple-900"
          >
            Contact Me
          </a>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <svg
          className="h-6 w-6 text-white"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  )
}







