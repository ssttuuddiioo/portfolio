'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function BrightSignArchitecturePage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('museum-proposals-auth')
    if (stored !== 'true') {
      router.push('/protected/museum-proposals')
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'museum-system-brightsign-architecture.html'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div style={{ margin: 0, padding: 0, position: 'relative' }}>
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          display: 'flex',
          gap: '10px',
          zIndex: 1000,
        }}
      >
        <Link
          href="/protected/museum-proposals"
          style={{
            padding: '12px 24px',
            backgroundColor: '#6c757d',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '14px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
          }}
        >
          ← Back to Overview
        </Link>
        <button
          onClick={handleDownload}
          style={{
            padding: '12px 24px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
          }}
        >
          📄 Download Proposal
        </button>
      </div>
      <iframe
        srcDoc={htmlContent}
        style={{
          width: '100%',
          height: '100vh',
          border: 'none',
          display: 'block',
        }}
        title="Museum System BrightSign Architecture"
      />
    </div>
  )
}

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Museum System Proposal - BrightSign-Centric Architecture</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 20px;
            background-color: #f8f9fa;
            line-height: 1.6;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        h1 {
            text-align: center;
            color: #2c3e50;
            margin-bottom: 30px;
        }
        .comparison-note {
            background: #e8f4f8;
            border-left: 4px solid #3498db;
            padding: 15px;
            margin-bottom: 30px;
            border-radius: 5px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 14px;
        }
        th {
            background-color: #f39c12;
            color: white;
            padding: 15px 12px;
            text-align: left;
            font-weight: bold;
        }
        td {
            padding: 12px;
            border-bottom: 1px solid #ddd;
            vertical-align: top;
        }
        tr:nth-child(even) {
            background-color: #fef9e7;
        }
        tr:hover {
            background-color: #fff3cd;
        }
        .component {
            font-weight: bold;
            color: #2c3e50;
        }
        .analogy {
            font-style: italic;
            color: #7f8c8d;
            font-size: 13px;
        }
        .purpose {
            color: #34495e;
        }
        .flow-section {
            margin-top: 30px;
            padding: 20px;
            background-color: #fef9e7;
            border-radius: 8px;
            border-left: 4px solid #f39c12;
        }
        .flow-section h3 {
            color: #2c3e50;
            margin-top: 0;
        }
        .flow-steps {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin-top: 15px;
        }
        .flow-step {
            background: white;
            padding: 10px 15px;
            border-radius: 5px;
            border: 1px solid #f39c12;
            flex: 1;
            min-width: 200px;
            text-align: center;
        }
        .tech-detail {
            font-size: 10px;
            color: #e67e22;
            font-style: italic;
            margin-top: 8px;
            padding-top: 5px;
            border-top: 1px solid #ffeaa7;
        }
        .arrow {
            color: #f39c12;
            font-weight: bold;
            align-self: center;
            min-width: 30px;
        }
        .master-badge {
            background: #e74c3c;
            color: white;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Museum System Interactive Installation<br><small>BrightSign-Centric Architecture</small></h1>
        
        <div class="comparison-note">
            <h4 style="margin-top: 0; color: #2c3e50;">Simplified Architecture Benefits:</h4>
            <strong>Cost Savings:</strong> Eliminates QLab computer + FX4 matrix (~$8,000+ savings) • 
            <strong>Reliability:</strong> Fewer components = fewer failure points • 
            <strong>Museum-Friendly:</strong> All content managed through web interface • 
            <strong>Scalability:</strong> Easy to add more zones or interactive elements
        </div>

        <div class="flow-section">
            <h3>How The BrightSign System Works Together</h3>
            <div class="flow-steps">
                <div class="flow-step">
                    <strong>1. Idle Mode</strong><br>
                    All players show ambient content in synchronized loop
                    <div class="tech-detail">Master BrightSign coordinates idle content across all players via network sync commands</div>
                </div>
                <div class="arrow">→</div>
                <div class="flow-step">
                    <strong>2. Docent Activation</strong><br>
                    Staff presses physical button
                    <div class="tech-detail">GPIO signal to master player triggers network broadcast to prepare all players for main content</div>
                </div>
                <div class="arrow">→</div>
                <div class="flow-step">
                    <strong>3. Main Video</strong><br>
                    2-minute synchronized experience across all displays
                    <div class="tech-detail">Master sends start commands via BrightSign Network, all players begin synchronized playback</div>
                </div>
                <div class="arrow">→</div>
                <div class="flow-step">
                    <strong>4. Interactive Transition</strong><br>
                    Video ends, touchscreens become active
                    <div class="tech-detail">Master signals interactive players to launch Q&A content while other displays show waiting state</div>
                </div>
                <div class="arrow">→</div>
                <div class="flow-step">
                    <strong>5. Q&A Experience</strong><br>
                    Visitors engage with questions and follow-ups
                    <div class="tech-detail">Interactive players handle touch input, log data locally, and signal completion status back to master</div>
                </div>
                <div class="arrow">→</div>
                <div class="flow-step">
                    <strong>6. Return to Idle</strong><br>
                    System resets automatically for next group
                    <div class="tech-detail">Master receives completion signals, sends reset commands to all players, returns to idle sync</div>
                </div>
            </div>
        </div>

        <h2 style="color: #2c3e50; margin-top: 40px; margin-bottom: 20px; border-bottom: 3px solid #f39c12; padding-bottom: 10px;">System Components</h2>
        
        <table>
            <thead>
                <tr>
                    <th style="width: 18%;">Component</th>
                    <th style="width: 22%;">Role in Setup</th>
                    <th style="width: 40%;">What It Does</th>
                    <th style="width: 20%;">Tech & Signals</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="component">Master BrightSign Player <span class="master-badge">MASTER</span></td>
                    <td class="analogy">Central coordinator - connects to docent button and controls all other players</td>
                    <td class="purpose">Controls the entire experience timing and coordinates all other players. Responds to docent button press and manages the complete visitor journey from idle through interactive sections.</td>
                    <td class="purpose"><strong>BrightSign XTx44</strong><br>
                    • GPIO for button input<br>
                    • Dual HDMI outputs<br>
                    • Ethernet master sync<br>
                    • Content management</td>
                </tr>
                <tr>
                    <td class="component">Projector BrightSign (2)</td>
                    <td class="analogy">Video players - one dedicated player per projector for main content</td>
                    <td class="purpose">Dedicated players for each projector that receive sync commands from master. Play the main 2-minute video content in perfect synchronization with all other displays.</td>
                    <td class="purpose"><strong>BrightSign XD1034</strong><br>
                    • Ethernet sync from master<br>
                    • 4K HDMI output<br>
                    • Local video storage<br>
                    • Network controlled</td>
                </tr>
                <tr>
                    <td class="component">Display BrightSigns (3)</td>
                    <td class="analogy">Supporting content players - one per information screen for supplementary materials</td>
                    <td class="purpose">Handle supporting content for the three information screens. Show timelines, photos, maps, or contextual material that complements the main projector video.</td>
                    <td class="purpose"><strong>BrightSign LS424</strong><br>
                    • Ethernet sync control<br>
                    • HDMI to displays<br>
                    • Multi-zone layouts<br>
                    • Content scheduling</td>
                </tr>
                <tr>
                    <td class="component">Interactive BrightSigns (2)</td>
                    <td class="analogy">Touch interface controllers - dedicated players for Q&A and data collection</td>
                    <td class="purpose">Run the touchscreen Q&A experiences with true/false questions and follow-ups. Handle all user interactions, data logging, and educational content delivery independently.</td>
                    <td class="purpose"><strong>BrightSign XD1034</strong><br>
                    • Ethernet coordination<br>
                    • HDMI + USB touch<br>
                    • HTML5 interactive<br>
                    • Analytics logging</td>
                </tr>
                <tr>
                    <td class="component">Existing Projectors (2)</td>
                    <td class="analogy">Pre-installed display output - already mounted and configured</td>
                    <td class="purpose">Existing projectors in the space that will receive 4K signals from their dedicated BrightSign players. No additional projector hardware required.</td>
                    <td class="purpose"><strong>Existing Hardware</strong><br>
                    • HDMI input required<br>
                    • Connects to BrightSign<br>
                    • Already installed<br>
                    • Ready for integration</td>
                </tr>
                <tr>
                    <td class="component">Information Screens (3)</td>
                    <td class="analogy">Secondary displays - wall/stand mounted for contextual information</td>
                    <td class="purpose">Display supporting materials synchronized with the main video experience. Each has its own BrightSign player for reliable, independent operation.</td>
                    <td class="purpose"><strong>43" 4K Displays</strong><br>
                    • HDMI from BrightSign<br>
                    • Commercial grade<br>
                    • Portrait/landscape<br>
                    • Anti-glare coating</td>
                </tr>
                <tr>
                    <td class="component">Touchscreens (2)</td>
                    <td class="analogy">Interactive stations - pedestal or wall-mounted for visitor engagement</td>
                    <td class="purpose">Interactive displays where visitors answer questions and explore educational content. Connected directly to their dedicated BrightSign players.</td>
                    <td class="purpose"><strong>32" Touch Displays</strong><br>
                    • HDMI from BrightSign<br>
                    • USB touch interface<br>
                    • Capacitive multi-touch<br>
                    • Vandal-resistant</td>
                </tr>
                <tr>
                    <td class="component">Network Switch</td>
                    <td class="analogy">Network backbone - rack-mounted for connecting all BrightSign players</td>
                    <td class="purpose">Connects all BrightSign players for synchronized timing and coordination. Enables the master player to send commands and receive status from all other players.</td>
                    <td class="purpose"><strong>Managed Switch</strong><br>
                    • Gigabit Ethernet<br>
                    • 8-port minimum<br>
                    • BrightSign Network<br>
                    • Remote monitoring</td>
                </tr>
                <tr>
                    <td class="component">Docent Control Button</td>
                    <td class="analogy">Staff trigger - podium or wall-mounted activation point for docents</td>
                    <td class="purpose">Simple physical button that museum staff press to start experiences. Connects directly to the master BrightSign player via GPIO for instant, reliable activation.</td>
                    <td class="purpose"><strong>Arcade Button</strong><br>
                    • GPIO to master player<br>
                    • Momentary contact<br>
                    • LED indicator<br>
                    • Vandal-resistant</td>
                </tr>
            </tbody>
        </table>

        <div style="margin-top: 30px; padding: 15px; background: #fff3cd; border-radius: 5px; border-left: 4px solid #ffc107;">
            <h4 style="margin-top: 0; color: #856404;">BrightSign Architecture Advantages:</h4>
            <ul style="margin: 5px 0; color: #856404;">
                <li><strong>Simplified Setup:</strong> One device type, unified content management platform</li>
                <li><strong>Cost Effective:</strong> Eliminates expensive video matrix and control computer</li>
                <li><strong>Bulletproof Reliability:</strong> Each display has independent player, no single point of failure</li>
                <li><strong>Easy Content Updates:</strong> Remote management via BrightSign Network</li>
                <li><strong>Scalable:</strong> Add more zones or interactions by adding players</li>
                <li><strong>Museum IT Friendly:</strong> Web-based management, no specialized AV knowledge needed</li>
            </ul>
        </div>

        <div style="margin-top: 20px; padding: 15px; background: #e8f5e8; border-radius: 5px; border-left: 4px solid #28a745;">
            <h4 style="margin-top: 0; color: #155724;">System Redundancy Features:</h4>
            <ul style="margin: 5px 0; color: #155724;">
                <li><strong>Content Storage:</strong> Each player stores content locally - network failure doesn't stop playback</li>
                <li><strong>Master Backup:</strong> Any player can be promoted to master if primary fails</li>
                <li><strong>Display Independence:</strong> Each screen continues operating even if others fail</li>
                <li><strong>Remote Monitoring:</strong> Real-time status monitoring and alerts via BrightSign Network</li>
            </ul>
        </div>

        <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #6c757d;">
            <h3 style="color: #2c3e50; margin-top: 0;">Complete Hardware List</h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
                <div>
                    <h4 style="color: #495057; margin-bottom: 10px;">BrightSign Media Players (7 total)</h4>
                    <ul style="margin: 0; font-size: 14px; color: #6c757d;">
                        <li>1x BrightSign XTx44 (Master Controller)</li>
                        <li>2x BrightSign XD1034 (Projector Players)</li>
                        <li>5x Integrated BrightSign Players (built into displays)</li>
                    </ul>

                    <h4 style="color: #495057; margin-bottom: 10px; margin-top: 15px;">Display Hardware</h4>
                    <ul style="margin: 0; font-size: 14px; color: #6c757d;">
                        <li>2x Existing Projectors (already installed - HDMI input required)</li>
                        <li>3x 43" 4K Commercial Displays with integrated BrightSign</li>
                        <li>2x 10" Capacitive Touchscreen Displays with integrated BrightSign</li>
                    </ul>

                    <h4 style="color: #495057; margin-bottom: 10px; margin-top: 15px;">Network Infrastructure</h4>
                    <ul style="margin: 0; font-size: 14px; color: #6c757d;">
                        <li>1x Managed Ethernet Switch (8+ ports, gigabit)</li>
                        <li>Cat6 Ethernet cables for all players</li>
                        <li>Network rack/enclosure</li>
                    </ul>
                </div>
                
                <div>
                    <h4 style="color: #495057; margin-bottom: 10px;">Control Hardware</h4>
                    <ul style="margin: 0; font-size: 14px; color: #6c757d;">
                        <li>1x Arcade-style Pushbutton (LED indicator)</li>
                        <li>GPIO cable to master BrightSign</li>
                        <li>Control station/podium (optional)</li>
                    </ul>

                    <h4 style="color: #495057; margin-bottom: 10px; margin-top: 15px;">Mounting & Installation</h4>
                    <ul style="margin: 0; font-size: 14px; color: #6c757d;">
                        <li>Projector mounts (ceiling/wall)</li>
                        <li>Display wall mounts (3x for info screens)</li>
                        <li>Touchscreen pedestals or wall mounts (2x)</li>
                        <li>Cable management (conduits, covers)</li>
                    </ul>

                    <h4 style="color: #495057; margin-bottom: 10px; margin-top: 15px;">Power & Connectivity</h4>
                    <ul style="margin: 0; font-size: 14px; color: #6c757d;">
                        <li>HDMI cables (8x - one per player to display)</li>
                        <li>USB cables (2x - touchscreen interface)</li>
                        <li>Power supplies for all BrightSign players</li>
                        <li>UPS backup power (recommended)</li>
                    </ul>
                </div>
            </div>

            <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 5px; text-align: center;">
                <strong style="color: #2c3e50;">System Totals: 7 BrightSign Players (3 standalone + 5 integrated) • 5 New Displays + 2 Existing Projectors • 7 Network Ports Required</strong>
            </div>
        </div>

        <div style="margin-top: 30px; padding: 20px; background: #f1f8ff; border-radius: 8px; border-left: 4px solid #007bff;">
            <h3 style="color: #2c3e50; margin-top: 0;">Itemized Budget Estimate</h3>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px; background: white;">
                <thead>
                    <tr style="background: #007bff;">
                        <th style="color: white; padding: 12px; text-align: left;">Category</th>
                        <th style="color: white; padding: 12px; text-align: left;">Item</th>
                        <th style="color: white; padding: 12px; text-align: center;">Qty</th>
                        <th style="color: white; padding: 12px; text-align: right;">Unit Price</th>
                        <th style="color: white; padding: 12px; text-align: right;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; font-weight: bold;">Media Players</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">BrightSign XTx44 (Master)</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: center;">1</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$1,200</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$1,200</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;"></td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">BrightSign XD1034 (Projector Players)</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: center;">2</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$800</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$1,600</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;"></td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">Integrated Players (included in displays)</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: center;">5</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$0</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$0</td>
                    </tr>
                    <tr style="background: #f8f9fa;">
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; font-weight: bold;">Existing Hardware</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">Projectors (already installed)</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: center;">2</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$0</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$0</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; font-weight: bold;">Displays</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">43" 4K Display with integrated BrightSign</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: center;">3</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$1,800</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$5,400</td>
                    </tr>
                    <tr style="background: #f8f9fa;">
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;"></td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">10" Touchscreen with integrated BrightSign</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: center;">2</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$829.99</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$1,660</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; font-weight: bold;">Network</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">Managed Switch + Cabling</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: center;">1</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$800</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$800</td>
                    </tr>
                    <tr style="background: #f8f9fa;">
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; font-weight: bold;">Control & Mounting</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">Mounts, Button, Cables, Power</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: center;">1</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$2,000</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$2,000</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; font-weight: bold;">Installation</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">Professional Installation & Setup</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: center;">1</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$4,000</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$4,000</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; font-weight: bold;">Content Development</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">Interactive Content, Video Production</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: center;">1</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$8,000</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$8,000</td>
                    </tr>
                    <tr style="background: #e8f5e8; font-weight: bold;">
                        <td colspan="4" style="padding: 15px; border-top: 2px solid #28a745; text-align: right; font-size: 16px;">TOTAL PROJECT COST:</td>
                        <td style="padding: 15px; border-top: 2px solid #28a745; text-align: right; font-size: 16px;">$26,460</td>
                    </tr>
                </tbody>
            </table>

            <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 5px; border-left: 4px solid #ffc107;">
                <h4 style="margin-top: 0; color: #856404;">Budget Notes:</h4>
                <ul style="margin: 5px 0; color: #856404; font-size: 14px;">
                    <li><strong>Integrated Display Benefits:</strong> Built-in BrightSign players reduce cabling and installation complexity</li>
                    <li><strong>Additional Savings:</strong> $7,000 saved by using existing projectors in space</li>
                    <li><strong>Cost Savings vs QLab System:</strong> ~$13,000+ less than traditional QLab + FX4 + projector setup</li>
                    <li><strong>Ongoing Costs:</strong> BrightSign Network subscription ~$200/year for remote management</li>
                    <li><strong>Warranty:</strong> 3-year extended warranty recommended for museum environment (+$2,000)</li>
                    <li><strong>Training:</strong> 1-day staff training session included in installation cost</li>
                    <li><strong>Simplified Management:</strong> Fewer standalone players means easier troubleshooting and maintenance</li>
                </ul>
            </div>
        </div>
    </div>
</body>
</html>`

