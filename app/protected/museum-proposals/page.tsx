'use client'

import { PasswordGate } from '@/components/password-gate'
import Link from 'next/link'

export default function MuseumProposalsPage() {
  return (
    <PasswordGate storageKey="museum-proposals-auth" correctPassword="briguel">
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#f8f9fa',
          padding: '40px 20px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
        >
          <h1
            style={{
              textAlign: 'center',
              color: '#2c3e50',
              fontSize: '36px',
              marginBottom: '20px',
            }}
          >
            Holocaust Museum Interactive Installation
          </h1>
          <p
            style={{
              textAlign: 'center',
              color: '#7f8c8d',
              fontSize: '18px',
              marginBottom: '40px',
            }}
          >
            Two Professional Architecture Approaches
          </p>

          <div
            style={{
              backgroundColor: '#e8f4f8',
              borderLeft: '4px solid #3498db',
              padding: '20px',
              marginBottom: '40px',
              borderRadius: '5px',
            }}
          >
            <h3 style={{ marginTop: 0, color: '#2c3e50' }}>
              Project Overview
            </h3>
            <p style={{ color: '#34495e', lineHeight: '1.6', margin: 0 }}>
              We are pleased to present two comprehensive system architecture
              proposals for the Holocaust Museum interactive installation. Both
              solutions deliver the same powerful visitor experience: a
              2-minute synchronized video presentation followed by engaging
              touchscreen Q&amp;A sessions. The key difference lies in the
              technical approach—each optimized for different operational
              priorities and budget considerations.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '30px',
              marginTop: '40px',
            }}
          >
            {/* BrightSign Option */}
            <div
              style={{
                border: '2px solid #f39c12',
                borderRadius: '10px',
                padding: '30px',
                backgroundColor: '#fefaf3',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '60px',
                    backgroundColor: '#f39c12',
                    borderRadius: '4px',
                  }}
                />
                <h2 style={{ color: '#2c3e50', margin: 0, fontSize: '28px' }}>
                  BrightSign-Centric
                  <br />
                  <span style={{ fontSize: '16px', color: '#7f8c8d' }}>
                    All-in-One Solution
                  </span>
                </h2>
              </div>

              <div
                style={{
                  backgroundColor: '#fff3cd',
                  padding: '15px',
                  borderRadius: '5px',
                  marginBottom: '20px',
                }}
              >
                <div style={{ fontSize: '14px', color: '#856404' }}>
                  Total Investment
                </div>
                <div
                  style={{
                    fontSize: '42px',
                    fontWeight: 'bold',
                    color: '#2c3e50',
                  }}
                >
                  $26,460
                </div>
              </div>

              <h4 style={{ color: '#2c3e50', marginTop: 0 }}>Key Benefits:</h4>
              <ul style={{ color: '#34495e', lineHeight: '1.8' }}>
                <li>
                  <strong>Simplified Setup:</strong> Single device ecosystem
                </li>
                <li>
                  <strong>Maximum Reliability:</strong> No single point of
                  failure
                </li>
                <li>
                  <strong>Museum-Friendly:</strong> Web-based content management
                </li>
                <li>
                  <strong>Easy Maintenance:</strong> Unified platform for all
                  displays
                </li>
              </ul>

              <h4 style={{ color: '#2c3e50' }}>System Highlights:</h4>
              <ul style={{ color: '#34495e', fontSize: '14px' }}>
                <li>7 BrightSign players (3 standalone + 5 integrated)</li>
                <li>Docent button control via GPIO</li>
                <li>Network-synchronized playback</li>
                <li>Remote monitoring &amp; updates</li>
              </ul>

              <Link
                href="/protected/museum-proposals/brightsign"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '15px 30px',
                  backgroundColor: '#f39c12',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  marginTop: '20px',
                }}
              >
                View Full Proposal →
              </Link>
            </div>

            {/* QLab Hybrid Option */}
            <div
              style={{
                border: '2px solid #2196f3',
                borderRadius: '10px',
                padding: '30px',
                backgroundColor: '#f3f8ff',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '60px',
                    backgroundColor: '#2196f3',
                    borderRadius: '4px',
                  }}
                />
                <h2 style={{ color: '#2c3e50', margin: 0, fontSize: '28px' }}>
                  QLab Hybrid
                  <br />
                  <span style={{ fontSize: '16px', color: '#7f8c8d' }}>
                    Professional Show Control
                  </span>
                </h2>
              </div>

              <div
                style={{
                  backgroundColor: '#cfe2ff',
                  padding: '15px',
                  borderRadius: '5px',
                  marginBottom: '20px',
                }}
              >
                <div style={{ fontSize: '14px', color: '#084298' }}>
                  Total Investment
                </div>
                <div
                  style={{
                    fontSize: '42px',
                    fontWeight: 'bold',
                    color: '#2c3e50',
                  }}
                >
                  $24,460
                </div>
              </div>

              <h4 style={{ color: '#2c3e50', marginTop: 0 }}>Key Benefits:</h4>
              <ul style={{ color: '#34495e', lineHeight: '1.8' }}>
                <li>
                  <strong>Theater-Grade Control:</strong> Professional timeline
                  precision
                </li>
                <li>
                  <strong>Cost Effective:</strong> $2,000 less than
                  BrightSign-only
                </li>
                <li>
                  <strong>Zero Latency:</strong> Direct HDMI connections
                </li>
                <li>
                  <strong>Flexible Content:</strong> Advanced video effects
                  capability
                </li>
              </ul>

              <h4 style={{ color: '#2c3e50' }}>System Highlights:</h4>
              <ul style={{ color: '#34495e', fontSize: '14px' }}>
                <li>Mac Studio M2 + QLab Pro show control</li>
                <li>4 BrightSign players for interactive stations</li>
                <li>QLab Go tablet for wireless docent control</li>
                <li>Frame-perfect synchronization</li>
              </ul>

              <Link
                href="/protected/museum-proposals/qlab-hybrid"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '15px 30px',
                  backgroundColor: '#2196f3',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  marginTop: '20px',
                }}
              >
                View Full Proposal →
              </Link>
            </div>
          </div>

          <div
            style={{
              marginTop: '40px',
              padding: '20px',
              backgroundColor: '#e8f5e8',
              borderRadius: '8px',
              borderLeft: '4px solid #28a745',
            }}
          >
            <h3 style={{ marginTop: 0, color: '#155724' }}>
              Both Solutions Include:
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                color: '#155724',
              }}
            >
              <ul style={{ margin: 0 }}>
                <li>Professional installation &amp; setup</li>
                <li>Interactive content development</li>
                <li>Video production support</li>
                <li>Complete hardware &amp; mounting</li>
              </ul>
              <ul style={{ margin: 0 }}>
                <li>Network infrastructure</li>
                <li>Staff training session</li>
                <li>2 existing projectors (integrated)</li>
                <li>Full documentation &amp; support</li>
              </ul>
            </div>
          </div>

          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <p style={{ color: '#7f8c8d', fontSize: '14px' }}>
              Questions? Contact us to discuss which solution best fits your
              museum&apos;s needs and operational workflow.
            </p>
          </div>
        </div>
      </div>
    </PasswordGate>
  )
}

