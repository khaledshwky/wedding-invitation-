'use client'

import { MotionConfig } from 'motion/react'
import { useEffect, useState } from 'react'
import { Celebration } from './celebration'
import { Closing } from './closing'
import { Countdown } from './countdown'
import { Details } from './details'
import { EnvelopeIntro } from './envelope-intro'
import { Gallery } from './gallery'
import { Hero } from './hero'
import { Rsvp } from './rsvp'

type Phase = 'sealed' | 'revealing' | 'open'

export function InvitationExperience() {
  const [phase, setPhase] = useState<Phase>('sealed')

  useEffect(() => {
    if (phase === 'open') return
    window.scrollTo(0, 0)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [phase])

  return (
    <MotionConfig reducedMotion="user">
      {phase !== 'open' && (
        <EnvelopeIntro
          onReveal={() => setPhase('revealing')}
          onComplete={() => setPhase('open')}
        />
      )}
      <main
        className="relative z-10"
        aria-hidden={phase === 'sealed' ? true : undefined}
        inert={phase === 'sealed' ? true : undefined}
      >
        <Hero revealed={phase !== 'sealed'} />
        <Celebration />
        <Details />
        <Countdown />
        <Gallery />
        <Rsvp />
        <Closing />
      </main>
    </MotionConfig>
  )
}
