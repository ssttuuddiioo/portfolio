'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function QLabHybridArchitecturePage() {
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
    link.download = 'museum-system-qlab-hybrid-architecture.html'
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
          title="Museum System QLab Hybrid Architecture"
        />
      </div>
  )
}

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Museum System Proposal - QLab + BrightSign Hybrid Architecture</title>
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
            background: #e3f2fd;
            border-left: 4px solid #2196f3;
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
            background-color: #2196f3;
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
            background-color: #f3f8ff;
        }
        tr:hover {
            background-color: #e3f2fd;
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
            background-color: #f3f8ff;
            border-radius: 8px;
            border-left: 4px solid #2196f3;
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
            border: 1px solid #2196f3;
            flex: 1;
            min-width: 200px;
            text-align: center;
        }
        .tech-detail {
            font-size: 10px;
            color: #1976d2;
            font-style: italic;
            margin-top: 8px;
            padding-top: 5px;
            border-top: 1px solid #bbdefb;
        }
        .arrow {
            color: #2196f3;
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
        .qlab-badge {
            background: #9c27b0;
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
        <h1>Museum System Interactive Installation<br><small>QLab + BrightSign Hybrid Architecture</small></h1>
        
        <div class="comparison-note">
            <h4 style="margin-top: 0; color: #2c3e50;">Hybrid Approach Benefits:</h4>
            <strong>Best of Both Worlds:</strong> QLab's powerful show control for main experience + BrightSign reliability for interactive elements • 
            <strong>Professional Control:</strong> Timeline-based video sequencing with network-triggered interactives • 
            <strong>Proven Workflow:</strong> Theater-grade reliability with museum-friendly touchscreen management • 
            <strong>Scalable:</strong> Easy to add complex video effects or additional interactive stations
        </div>

        <div class="flow-section">
            <h3>How The Hybrid System Works Together</h3>
            <div class="flow-steps">
                <div class="flow-step">
                    <strong>1. Idle Mode</strong><br>
                    QLab displays ambient content on screens, BrightSigns show standby state
                    <div class="tech-detail">QLab outputs idle video to screens via HDMI, sends network commands to keep BrightSigns in standby</div>
                </div>
                <div class="arrow">→</div>
                <div class="flow-step">
                    <strong>2. Docent Activation</strong><br>
                    Staff triggers show via QLab Go tablet or physical button
                    <div class="tech-detail">QLab receives trigger, sends OSC commands to prepare all BrightSign players for main experience</div>
                </div>
                <div class="arrow">→</div>
                <div class="flow-step">
                    <strong>3. Main Video Experience</strong><br>
                    2-minute synchronized video across projectors and information screens
                    <div class="tech-detail">QLab outputs directly to 3 info screens via HDMI, sends sync commands to projector BrightSigns via network</div>
                </div>
                <div class="arrow">→</div>
                <div class="flow-step">
                    <strong>4. Interactive Transition</strong><br>
                    Video concludes, interactive touchscreens activate
                    <div class="tech-detail">QLab timeline triggers network commands to MIMO BrightSigns to launch Q&A content</div>
                </div>
                <div class="arrow">→</div>
                <div class="flow-step">
                    <strong>5. Q&A Experience</strong><br>
                    Visitors interact with questions while other screens show waiting content
                    <div class="tech-detail">MIMO units handle touch input and data logging, send completion status back to QLab via network</div>
                </div>
                <div class="arrow">→</div>
                <div class="flow-step">
                    <strong>6. Return to Idle</strong><br>
                    System receives completion signal and resets for next group
                    <div class="tech-detail">QLab receives completion via OSC, returns all displays to idle state via timeline automation</div>
                </div>
            </div>
        </div>

        <h2 style="color: #2c3e50; margin-top: 40px; margin-bottom: 20px; border-bottom: 3px solid #2196f3; padding-bottom: 10px;">System Components</h2>
        
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
                    <td class="component">QLab Master Control PC <span class="master-badge">MASTER</span></td>
                    <td class="analogy">Central show controller - handles main video experience and triggers interactive sections</td>
                    <td class="purpose">Controls the main 2-minute video experience across projectors and information screens. Sends network commands to BrightSign players to coordinate interactive timing and manages overall experience flow.</td>
                    <td class="purpose"><strong>Mac Studio M2</strong><br>
                    • Multi-display outputs<br>
                    • Ethernet for OSC/UDP<br>
                    • Timeline-based control<br>
                    • Network show triggers</td>
                </tr>
                <tr>
                    <td class="component">Projector BrightSigns (2)</td>
                    <td class="analogy">Dedicated projector players - receive sync commands from QLab master</td>
                    <td class="purpose">Handle projector content independently but sync with QLab timing. Provides backup capability and dedicated processing for large projection content.</td>
                    <td class="purpose"><strong>BrightSign XD1034</strong><br>
                    • Network sync from QLab<br>
                    • 4K HDMI output<br>
                    • OSC/UDP commands<br>
                    • Local content backup</td>
                </tr>
                <tr>
                    <td class="component">Information Screen Players (3)</td>
                    <td class="analogy">Direct QLab outputs - connected via HDMI for synchronized supporting content</td>
                    <td class="purpose">Display contextual materials (timelines, photos, maps) directly from QLab in perfect synchronization with main video. No network delay for critical timing.</td>
                    <td class="purpose"><strong>Direct from QLab PC</strong><br>
                    • HDMI outputs 1,2,3<br>
                    • Frame-perfect sync<br>
                    • Integrated timeline<br>
                    • No network latency</td>
                </tr>
                <tr>
                    <td class="component">Interactive BrightSigns (2) <span class="qlab-badge">MIMO</span></td>
                    <td class="analogy">Smart touchscreen controllers - 10" MIMO displays with integrated players</td>
                    <td class="purpose">Run Q&A experiences independently while coordinating with QLab timing. Handle all visitor interactions, true/false questions, follow-ups, and data logging with museum-grade reliability.</td>
                    <td class="purpose"><strong>MIMO 10" + Built-in Player</strong><br>
                    • Ethernet from QLab<br>
                    • Integrated touchscreen<br>
                    • HTML5 interactive<br>
                    • Analytics logging</td>
                </tr>
                <tr>
                    <td class="component">Existing Projectors (2)</td>
                    <td class="analogy">Pre-installed display output - already mounted and configured in space</td>
                    <td class="purpose">Existing projectors in the space that will receive 4K signals from their dedicated BrightSign players. Integrated into the overall experience timing.</td>
                    <td class="purpose"><strong>Existing Hardware</strong><br>
                    • HDMI input required<br>
                    • Connects to BrightSign<br>
                    • Already installed<br>
                    • Ready for integration</td>
                </tr>
                <tr>
                    <td class="component">Information Screens (3)</td>
                    <td class="analogy">Supporting displays - direct connection to QLab for zero-latency synchronization</td>
                    <td class="purpose">Display supporting materials in perfect sync with main video timeline. Direct HDMI connection ensures frame-perfect timing for educational content.</td>
                    <td class="purpose"><strong>43" 4K Displays</strong><br>
                    • HDMI from QLab PC<br>
                    • Commercial grade<br>
                    • Portrait/landscape<br>
                    • Anti-glare coating</td>
                </tr>
                <tr>
                    <td class="component">Interactive Stations (2)</td>
                    <td class="analogy">Self-contained touch kiosks - MIMO displays with built-in processing</td>
                    <td class="purpose">Compact 10" touchscreen stations where visitors engage with Q&A content. Integrated design reduces cabling and provides reliable interactive experiences.</td>
                    <td class="purpose"><strong>MIMO 10" Touch Kiosks</strong><br>
                    • Integrated BrightSign<br>
                    • Capacitive touch<br>
                    • Self-contained unit<br>
                    • Network connected</td>
                </tr>
                <tr>
                    <td class="component">Network Switch</td>
                    <td class="analogy">Communication hub - connects QLab to all BrightSign players for coordination</td>
                    <td class="purpose">Enables QLab to send timing commands to BrightSign players and receive status updates. Handles all network-based synchronization and data collection.</td>
                    <td class="purpose"><strong>Managed Switch</strong><br>
                    • Gigabit Ethernet<br>
                    • 6-port minimum<br>
                    • OSC/UDP routing<br>
                    • Remote monitoring</td>
                </tr>
                <tr>
                    <td class="component">Docent Control Interface</td>
                    <td class="analogy">Show trigger - physical button or tablet interface for staff activation</td>
                    <td class="purpose">Simple interface for museum staff to start experiences. Can be physical button or tablet running QLab Go for wireless control and monitoring.</td>
                    <td class="purpose"><strong>QLab Go Tablet</strong><br>
                    • Wireless to QLab PC<br>
                    • Show start/stop<br>
                    • Status monitoring<br>
                    • Staff-friendly interface</td>
                </tr>
            </tbody>
        </table>

        <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #6c757d;">
            <h3 style="color: #2c3e50; margin-top: 0;">Complete Hardware List</h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
                <div>
                    <h4 style="color: #495057; margin-bottom: 10px;">Master Control System</h4>
                    <ul style="margin: 0; font-size: 14px; color: #6c757d;">
                        <li>1x Mac Studio M2 (QLab Master Control)</li>
                        <li>1x QLab Go Tablet (Docent Control)</li>
                    </ul>

                    <h4 style="color: #495057; margin-bottom: 10px; margin-top: 15px;">BrightSign Players (4 total)</h4>
                    <ul style="margin: 0; font-size: 14px; color: #6c757d;">
                        <li>2x BrightSign XD1034 (Projector Players)</li>
                        <li>2x MIMO 10" with integrated BrightSign (Interactive)</li>
                    </ul>

                    <h4 style="color: #495057; margin-bottom: 10px; margin-top: 15px;">Display Hardware</h4>
                    <ul style="margin: 0; font-size: 14px; color: #6c757d;">
                        <li>2x Existing Projectors (already installed)</li>
                        <li>3x 43" 4K Commercial Displays</li>
                        <li>2x MIMO 10" Touchscreen Kiosks</li>
                    </ul>
                </div>
                
                <div>
                    <h4 style="color: #495057; margin-bottom: 10px;">Network Infrastructure</h4>
                    <ul style="margin: 0; font-size: 14px; color: #6c757d;">
                        <li>1x Managed Ethernet Switch (6+ ports)</li>
                        <li>Cat6 Ethernet cables</li>
                        <li>WiFi for QLab Go tablet</li>
                    </ul>

                    <h4 style="color: #495057; margin-bottom: 10px; margin-top: 15px;">Connectivity</h4>
                    <ul style="margin: 0; font-size: 14px; color: #6c757d;">
                        <li>3x HDMI cables (QLab to info screens)</li>
                        <li>2x HDMI cables (BrightSign to projectors)</li>
                        <li>Multi-display adapter for Mac Studio</li>
                        <li>UPS backup power</li>
                    </ul>

                    <h4 style="color: #495057; margin-bottom: 10px; margin-top: 15px;">Mounting & Installation</h4>
                    <ul style="margin: 0; font-size: 14px; color: #6c757d;">
                        <li>Wall mounts for 3x information screens</li>
                        <li>Stands or wall mounts for MIMO kiosks</li>
                        <li>Rack mount for Mac Studio and network gear</li>
                        <li>Cable management system</li>
                    </ul>
                </div>
            </div>

            <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 5px; text-align: center;">
                <strong style="color: #2c3e50;">System Totals: 1 QLab PC + 4 BrightSign Players • 5 New Displays + 2 Existing Projectors • 6 Network Ports Required</strong>
            </div>
        </div>

        <div style="margin-top: 30px; padding: 20px; background: #f1f8ff; border-radius: 8px; border-left: 4px solid #2196f3;">
            <h3 style="color: #2c3e50; margin-top: 0;">Itemized Budget Estimate</h3>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px; background: white;">
                <thead>
                    <tr style="background: #2196f3;">
                        <th style="color: white; padding: 12px; text-align: left;">Category</th>
                        <th style="color: white; padding: 12px; text-align: left;">Item</th>
                        <th style="color: white; padding: 12px; text-align: center;">Qty</th>
                        <th style="color: white; padding: 12px; text-align: right;">Unit Price</th>
                        <th style="color: white; padding: 12px; text-align: right;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; font-weight: bold;">Master Control</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">Mac Studio M2 + QLab Pro</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: center;">1</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$3,000</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$3,000</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;"></td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">QLab Go Tablet (iPad)</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: center;">1</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$400</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$400</td>
                    </tr>
                    <tr style="background: #f8f9fa;">
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; font-weight: bold;">BrightSign Players</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">BrightSign XD1034 (Projector Players)</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: center;">2</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$800</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$1,600</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;"></td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">MIMO 10" Touchscreen Kiosks</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: center;">2</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$829.99</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$1,660</td>
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
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">43" 4K Commercial Display</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: center;">3</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$1,200</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$3,600</td>
                    </tr>
                    <tr style="background: #f8f9fa;">
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; font-weight: bold;">Network & Connectivity</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">Managed Switch, Cables, Adapters</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: center;">1</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$800</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$800</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; font-weight: bold;">Mounting & Installation</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">Mounts, Rack, Cable Management</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: center;">1</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$1,500</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$1,500</td>
                    </tr>
                    <tr style="background: #f8f9fa;">
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; font-weight: bold;">Installation</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">Professional Installation & Setup</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: center;">1</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$3,500</td>
                        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$3,500</td>
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
                        <td style="padding: 15px; border-top: 2px solid #28a745; text-align: right; font-size: 16px;">$24,460</td>
                    </tr>
                </tbody>
            </table>

            <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 5px; border-left: 4px solid #ffc107;">
                <h4 style="margin-top: 0; color: #856404;">Hybrid Architecture Advantages:</h4>
                <ul style="margin: 5px 0; color: #856404; font-size: 14px;">
                    <li><strong>Professional Control:</strong> QLab provides theater-grade show control with timeline precision</li>
                    <li><strong>Cost Effective:</strong> Lower cost than full BrightSign approach while maintaining reliability</li>
                    <li><strong>Familiar Workflow:</strong> Museum AV staff often know QLab from other installations</li>
                    <li><strong>Frame-Perfect Sync:</strong> Direct HDMI connections eliminate network latency for main content</li>
                    <li><strong>Flexible Content:</strong> Easy to add complex video effects, mapping, or audio elements</li>
                    <li><strong>Redundant Interactives:</strong> BrightSign touchscreens operate independently for reliability</li>
                    <li><strong>Remote Monitoring:</strong> QLab Go provides wireless control and status monitoring</li>
                </ul>
            </div>

            <div style="margin-top: 20px; padding: 15px; background: #e8f5e8; border-radius: 5px; border-left: 4px solid #28a745;">
                <h4 style="margin-top: 0; color: #155724;">Technical Benefits:</h4>
                <ul style="margin: 5px 0; color: #155724; font-size: 14px;">
                    <li><strong>Zero Latency:</strong> Information screens connect directly to QLab via HDMI</li>
                    <li><strong>Network Backup:</strong> Projector BrightSigns can operate independently if network fails</li>
                    <li><strong>Show Control:</strong> Timeline-based automation with professional cuing system</li>
                    <li><strong>Content Updates:</strong> QLab content updated locally, BrightSign content via network</li>
                    <li><strong>Monitoring:</strong> Real-time system status through QLab interface</li>
                </ul>
            </div>
        </div>
    </div>
</body>
</html>`

