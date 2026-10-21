'use client'

import { useEffect, useState } from 'react'
import { AnimatedLink } from './AnimatedLink'

// Roles the bio types through — "Hi, I’m Pablo. I’m a/an ___."
const ROLES = [
  'experiential director',
  'creative technologist',
  'multi-hyphenate',
  'installation artist',
  'light designer',
  'new media artist',
  'experience director',
  'spatial designer',
  'creative director',
]

// Typewriter timing (ms)
const TYPE_MS = 70 // per letter typed
const DELETE_MS = 40 // per letter backspaced
const HOLD_MS = 2600 // a full role stays on screen
const GAP_MS = 350 // pause on the empty role before typing the next

// Width of the longest desktop bio line ("immersive experiences, apps, and interactive art in",
// 23.7em) plus slack for the scrollbar, in ems of the bio font; used to shrink the font until it fits
const DESKTOP_LONGEST_LINE_EM = 24.6

interface InteractiveBioProps {
  mobile?: boolean
  className?: string
  style?: React.CSSProperties
  // Desktop renders "View selected projects" in the bottom bar instead (see LandingPage)
  showWorkLink?: boolean
}

// "a" or "an" for a role
const getArticle = (phrase: string) => ('aeiou'.includes(phrase.trim().charAt(0).toLowerCase()) ? 'an' : 'a')

// Backspaces the current role and types the next, looping through ROLES
function useTypedRole() {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState(ROLES[0])
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const role = ROLES[index]
    let delay: number
    let step: () => void
    if (!deleting && text === role) {
      delay = HOLD_MS
      step = () => setDeleting(true)
    } else if (deleting && text === '') {
      delay = GAP_MS
      step = () => {
        setDeleting(false)
        setIndex((i) => (i + 1) % ROLES.length)
      }
    } else if (deleting) {
      delay = DELETE_MS
      step = () => setText((t) => t.slice(0, -1))
    } else {
      delay = TYPE_MS
      step = () => setText(role.slice(0, text.length + 1))
    }
    const timer = setTimeout(step, delay)
    return () => clearTimeout(timer)
  }, [index, text, deleting])

  // The article follows the role being typed (or the one being deleted)
  return { text, article: getArticle(ROLES[index]) }
}

export function InteractiveBio({ mobile = false, className = '', style = {}, showWorkLink = true }: InteractiveBioProps) {
  const { text: role, article } = useTypedRole()

  // Desktop: the bio is always exactly four lines; mobile wraps naturally
  const desktopBreak = mobile ? ' ' : <br />

  return (
    <h1
      className={`font-bold text-white hero-title ${className}`}
      style={{
        lineHeight: mobile ? '1.2' : '1.1',
        maxWidth: mobile ? '100%' : 'none',
        // Desktop: set lines (see desktopBreak) that never wrap; the font shrinks on narrower
        // windows so the longest line still fits beside the page margins
        whiteSpace: mobile ? undefined : 'nowrap',
        fontSize: mobile
          ? 'clamp(0.99rem, 2.2vw + 0.44rem, 1.32rem)'
          : `min(clamp(0.945rem, 2.52vw + 0.63rem, 2.835rem), calc((100vw - 176px) / ${DESKTOP_LONGEST_LINE_EM}))`,
        marginBottom: mobile ? '8px' : '0',
        ...style,
      }}
    >
      Hi, I’m Pablo.
      {/* Second sentence always starts on its own line */}
      <br />
      I’m <span aria-hidden="true">{article} </span>
      {/* Keep the role and its period together so the period never wraps onto its own line */}
      <span style={{ whiteSpace: 'nowrap' }}>
        {/* Screen readers get one stable role instead of every keystroke */}
        <span className="sr-only">{getArticle(ROLES[0])} {ROLES[0]}</span>
        <span aria-hidden="true">
          {role}
          <span className="typing-caret" />
        </span>
        .
      </span>{' '}
      I create and produce{desktopBreak}
      immersive experiences, apps, and interactive art in{desktopBreak}
      New York City, the best city in the world.
      {showWorkLink && (
        <span className="block" style={{ marginTop: '0.75em' }}>
          <AnimatedLink href="https://studiostudio.nyc" target="_blank" rel="noopener noreferrer" className="underline">
            View selected projects
          </AnimatedLink>
        </span>
      )}
    </h1>
  )
}
