'use client'

import { useEffect, useState } from 'react'
import { wedding } from '@/lib/wedding-config'
import { Reveal } from './primitives'

const target = new Date(wedding.dateISO).getTime()

function getRemaining(now: number) {
  const diff = Math.max(0, target - now)
  return {
    done: diff === 0,
    units: [
      { label: 'Days', value: Math.floor(diff / 86_400_000) },
      { label: 'Hours', value: Math.floor(diff / 3_600_000) % 24 },
      { label: 'Minutes', value: Math.floor(diff / 60_000) % 60 },
      { label: 'Seconds', value: Math.floor(diff / 1000) % 60 },
    ],
  }
}

export function Countdown() {
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const remaining = now === null ? null : getRemaining(now)

  return (
    <section aria-labelledby="countdown-heading" className="px-6 py-24 md:py-36">
      <Reveal className="mx-auto max-w-5xl text-center">
        <p className="eyebrow text-gold-deep">Counting the moments</p>
        <h2
          id="countdown-heading"
          className="mt-5 font-serif text-4xl font-light italic text-espresso md:text-5xl"
        >
          {remaining?.done ? 'The celebration has begun' : 'Until we say “I do”'}
        </h2>

        <div
          role="timer"
          aria-live="off"
          aria-label={
            remaining
              ? remaining.units.map((u) => `${u.value} ${u.label}`).join(', ')
              : 'Calculating time remaining'
          }
          className="mt-14 grid grid-cols-2 border-y border-gold/40 md:grid-cols-4"
        >
          {(remaining?.units ?? getRemaining(target).units).map((unit, i) => (
            <div
              key={unit.label}
              className={[
                'flex flex-col items-center py-8 md:py-12',
                i % 2 === 1 ? 'border-l border-gold/40' : '',
                i >= 2 ? 'border-t border-gold/40 md:border-t-0' : '',
                i === 2 ? 'md:border-l md:border-gold/40' : '',
              ].join(' ')}
            >
              <span
                aria-hidden="true"
                className="font-serif text-6xl font-light tabular-nums lining-nums leading-none text-espresso md:text-8xl"
              >
                {remaining ? String(unit.value).padStart(2, '0') : '—'}
              </span>
              <span aria-hidden="true" className="eyebrow mt-4 text-[0.625rem] text-gold-deep">
                {unit.label}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-8 font-serif text-lg italic text-muted-foreground">
          {wedding.dateDisplay.short} · {wedding.schedule[0].time}
        </p>
      </Reveal>
    </section>
  )
}
