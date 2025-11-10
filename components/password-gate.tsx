'use client'

import { useState, useEffect, type FormEvent } from 'react'

interface PasswordGateProps {
  readonly children: React.ReactNode
  readonly storageKey: string
  readonly correctPassword: string
}

export function PasswordGate({
  children,
  storageKey,
  correctPassword,
}: PasswordGateProps) {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const stored = sessionStorage.getItem(storageKey)
    if (stored === 'true') {
      setIsAuthenticated(true)
    }
  }, [storageKey])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password === correctPassword) {
      setIsAuthenticated(true)
      sessionStorage.setItem(storageKey, 'true')
      setError('')
    } else {
      setError('Incorrect password')
      setPassword('')
    }
  }

  if (!isClient) {
    return null
  }

  if (isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        <h2
          style={{
            color: '#2c3e50',
            marginBottom: '20px',
            fontSize: '24px',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          Protected Content
        </h2>
        <p
          style={{
            color: '#7f8c8d',
            marginBottom: '30px',
            textAlign: 'center',
          }}
        >
          Please enter the password to access this page
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            autoFocus
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              marginBottom: '15px',
              boxSizing: 'border-box',
            }}
          />
          {error && (
            <p
              style={{
                color: '#e74c3c',
                marginBottom: '15px',
                fontSize: '14px',
              }}
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Access
          </button>
        </form>
      </div>
    </div>
  )
}

