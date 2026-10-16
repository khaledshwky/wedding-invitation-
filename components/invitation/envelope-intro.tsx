'use client'

import { motion, useAnimate, useReducedMotion } from 'motion/react'
import { useRef, useState } from 'react'
import { coupleNames, wedding } from '@/lib/wedding-config'

type Props = {
  onReveal: () => void
  onComplete: () => void
}

const easeLux = [0.22, 1, 0.36, 1] as const
const easeInOut = [0.65, 0, 0.35, 1] as const

export function EnvelopeIntro({ onReveal, onComplete }: Props) {
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const reduceMotion = useReducedMotion()
  const started = useRef(false)
  const [opening, setOpening] = useState(false)
  const { first, second } = wedding.couple.initials

  async function open() {
    if (started.current) return
    started.current = true
    setOpening(true)

    if (reduceMotion) {
      onReveal()
      await animate(scope.current, { opacity: 0 }, { duration: 0.5 })
      onComplete()
      return
    }

    const root = scope.current
    const envelope = root.querySelector<HTMLElement>('[data-envelope]')!
    const flap = root.querySelector<HTMLElement>('[data-flap]')!
    const card = root.querySelector<HTMLElement>('[data-card]')!
    const envHeight = envelope.offsetHeight

    animate('[data-intro-copy]', { opacity: 0, y: 6 }, { duration: 0.6, ease: easeLux })

    // 1. The wax seal yields to the touch with a soft glint
    await Promise.all([
      animate('[data-seal]', { scale: [1, 0.93, 1.03] }, { duration: 0.5, ease: easeLux }),
      animate(
        '[data-seal-glint]',
        { x: ['-140%', '140%'], opacity: [0, 0.9, 0] },
        { duration: 0.65, ease: 'easeInOut' },
      ),
    ])
    animate(
      '[data-seal]',
      { opacity: 0, scale: 1.12, filter: 'blur(3px)' },
      { duration: 0.5, ease: easeLux },
    )

    // 2. The flap swings open around its top fold
    animate('[data-flap-shadow]', { opacity: 0 }, { duration: 0.4 })
    await animate(
      flap,
      { rotateX: 90 },
      { duration: 0.55, ease: [0.5, 0, 0.9, 0.4], delay: 0.15 },
    )
    flap.style.zIndex = '5'
    await animate(flap, { rotateX: 180 }, { duration: 0.6, ease: [0.1, 0.6, 0.3, 1] })

    // 3. The card slides upward out of the pocket, gaining depth
    const riseY = -envHeight * 0.74
    await animate(
      card,
      {
        y: riseY,
        boxShadow: '0 30px 60px -20px rgba(48,37,31,0.35), 0 8px 18px -8px rgba(48,37,31,0.22)',
      },
      { duration: 1.25, ease: easeInOut },
    )

    // 4. Camera push: the card comes forward as the envelope recedes
    card.style.zIndex = '40'
    await Promise.all([
      animate(
        '[data-env-part]',
        { opacity: 0, y: envHeight * 0.18, scale: 0.94 },
        { duration: 1, ease: easeLux },
      ),
      animate(card, { y: riseY * 0.35, scale: 1.18 }, { duration: 1.1, ease: easeInOut }),
      animate('[data-stage]', { scale: 1.06 }, { duration: 1.1, ease: easeInOut }),
    ])

    // 5. The card expands to become the page itself
    const rect = card.getBoundingClientRect()
    const currentScale = 1.18
    const fill =
      Math.max(window.innerWidth / rect.width, window.innerHeight / rect.height) * 1.08
    const dx = window.innerWidth / 2 - (rect.left + rect.width / 2)
    const dy = window.innerHeight / 2 - (rect.top + rect.height / 2)

    onReveal()
    animate('[data-card-content]', { opacity: 0 }, { duration: 0.35 })
    await animate(
      card,
      {
        x: dx / 1.06,
        y: riseY * 0.35 + dy / 1.06,
        scale: currentScale * fill,
        boxShadow: '0 0 0 0 rgba(48,37,31,0)',
      },
      { duration: 0.95, ease: [0.7, 0, 0.2, 1] },
    )
    await animate(root, { opacity: 0 }, { duration: 0.9, ease: 'easeOut' })
    onComplete()
  }

  return (
    <div
      ref={scope}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-ivory"
    >
      <div aria-hidden="true" className="paper pointer-events-none absolute inset-0 opacity-30" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 42%, rgba(255,252,245,0.95) 0%, rgba(247,243,235,0) 70%), radial-gradient(120% 90% at 50% 120%, rgba(184,154,101,0.18) 0%, rgba(247,243,235,0) 60%)',
        }}
      />

      <div data-stage className="relative flex w-full flex-col items-center px-6">
        <p data-intro-copy className="eyebrow mb-10 text-gold-deep md:mb-14">
          A little note for you
        </p>

        <motion.div
          animate={opening ? { y: 0 } : { y: [0, -7, 0] }}
          transition={
            opening
              ? { duration: 0.4 }
              : { duration: 6, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }
          }
          className="w-[min(86vw,34rem)]"
        >
          <button
            type="button"
            onClick={open}
            disabled={opening}
            aria-label={`Open your invitation from ${coupleNames}`}
            className="group relative block w-full cursor-pointer touch-manipulation rounded-[2px] focus-visible:outline-offset-8 disabled:cursor-default"
          >
            <div
              data-envelope
              className="relative aspect-[1.55/1] w-full"
              style={{ perspective: '1800px' }}
            >
              {/* Ground shadow */}
              <div
                data-env-part
                aria-hidden="true"
                className="absolute -bottom-8 left-[6%] right-[6%] h-10 rounded-[50%] bg-espresso/25 blur-2xl"
              />

              {/* Back / interior of the envelope */}
              <div
                data-env-part
                aria-hidden="true"
                className="absolute inset-0 overflow-hidden rounded-[3px] bg-[#e4d9c6] shadow-[0_40px_70px_-30px_rgba(48,37,31,0.45),0_12px_24px_-12px_rgba(48,37,31,0.25)]"
              >
                <div
                  className="envelope-liner absolute inset-x-[3%] top-[3%] h-[60%]"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 50% 92%)' }}
                />
              </div>

              {/* The invitation card */}
              <div
                data-card
                className="absolute left-[5%] top-[6%] z-10 h-[86%] w-[90%] origin-center rounded-[2px] bg-[#fbf8f2] shadow-[0_2px_6px_rgba(48,37,31,0.12)] [container-type:inline-size]"
              >
                <div aria-hidden="true" className="paper absolute inset-0 opacity-25" />
                <div
                  data-card-content
                  className="absolute inset-[4%] flex flex-col items-center justify-center border border-gold/60 text-center"
                >
                  <div className="absolute inset-[3px] border border-gold/30" />
                  <p className="font-sans text-[2.1cqw] uppercase tracking-[0.35em] text-gold-deep">
                    Together with their families
                  </p>
                  <p className="mt-[3cqw] font-serif text-[8.2cqw] font-light leading-none text-espresso">
                    {wedding.couple.partnerOne}{' '}
                    <span className="italic text-gold">&amp;</span>{' '}
                    {wedding.couple.partnerTwo}
                  </p>
                  <span className="mt-[3.5cqw] h-px w-[14cqw] bg-gold/70" />
                  <p className="mt-[3cqw] font-serif text-[3cqw] tracking-[0.3em] text-espresso/80">
                    {wedding.dateDisplay.numeric}
                  </p>
                </div>
              </div>

              {/* Front pocket */}
              <div
                data-env-part
                aria-hidden="true"
                className="absolute inset-0 z-20"
                style={{ filter: 'drop-shadow(0 -2px 3px rgba(48,37,31,0.12))' }}
              >
                <div
                  className="paper absolute inset-0 rounded-[3px] bg-[#f1e9dc]"
                  style={{ clipPath: 'polygon(0 0, 50% 55%, 100% 0, 100% 100%, 0 100%)' }}
                >
                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="absolute inset-0 h-full w-full"
                  >
                    <path
                      d="M0 100 L50 55 L100 100"
                      fill="none"
                      stroke="rgba(48,37,31,0.08)"
                      strokeWidth="0.6"
                      vectorEffect="non-scaling-stroke"
                    />
                    <rect
                      x="2.2"
                      y="3.5"
                      width="95.6"
                      height="93"
                      fill="none"
                      stroke="var(--gold)"
                      strokeOpacity="0.55"
                      strokeWidth="0.75"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>
              </div>

              {/* Top flap — rotates around its real fold line */}
              <div
                data-flap
                data-env-part
                aria-hidden="true"
                className="absolute inset-x-0 top-0 z-30 h-[58%] origin-top"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Exterior */}
                <div
                  className="absolute inset-0"
                  style={{
                    backfaceVisibility: 'hidden',
                    filter: 'drop-shadow(0 6px 6px rgba(48,37,31,0.16))',
                  }}
                >
                  <div
                    className="paper absolute inset-0 bg-[#f4ede2]"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
                  >
                    <svg
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      className="absolute inset-0 h-full w-full"
                    >
                      <path
                        d="M3 2 L50 93 L97 2"
                        fill="none"
                        stroke="var(--gold)"
                        strokeOpacity="0.7"
                        strokeWidth="0.75"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                    <p className="absolute inset-x-0 top-[16%] text-center font-serif text-[clamp(1.1rem,4.2vw,1.65rem)] font-light tracking-[0.18em] text-gold">
                      {first}
                      <span className="mx-1 italic">&amp;</span>
                      {second}
                    </p>
                  </div>
                </div>
                {/* Interior liner, visible once opened */}
                <div
                  className="absolute inset-0"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
                >
                  <div
                    className="absolute inset-0 bg-[#e8dece]"
                    style={{ clipPath: 'polygon(0 100%, 100% 100%, 50% 0)' }}
                  >
                    <div
                      className="envelope-liner absolute inset-[6%_3%_3%_3%]"
                      style={{ clipPath: 'polygon(0 100%, 100% 100%, 50% 0)' }}
                    />
                  </div>
                </div>
              </div>

              {/* Subtle shadow the flap casts on the pocket */}
              <div
                data-flap-shadow
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 z-[25] h-[62%] bg-espresso/10 blur-[6px]"
                style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
              />

              {/* Wax seal */}
              <div
                data-seal
                aria-hidden="true"
                className="absolute left-[41.5%] top-[45%] z-[35] w-[17%]"
              >
                <div className="relative transition-[scale] duration-500 ease-out group-hover:scale-[1.04]">
                  <WaxSeal first={first} second={second} />
                  <div className="absolute inset-[4%] overflow-hidden rounded-full">
                    <div
                      data-seal-glint
                      className="absolute inset-y-0 left-1/4 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-[#f4e3bd]/70 to-transparent opacity-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </button>
        </motion.div>

        <p
          data-intro-copy
          className="mt-12 font-serif text-lg italic text-espresso/70 md:mt-16 md:text-xl"
        >
          Tap to open your invitation
        </p>
      </div>
    </div>
  )
}

function WaxSeal({ first, second }: { first: string; second: string }) {
  return (
    <svg viewBox="0 0 100 100" className="block h-auto w-full drop-shadow-[0_4px_5px_rgba(48,37,31,0.35)]">
      <defs>
        <radialGradient id="wax" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#8a8862" />
          <stop offset="45%" stopColor="#5f5e44" />
          <stop offset="100%" stopColor="#3b3a29" />
        </radialGradient>
        <radialGradient id="wax-inner" cx="60%" cy="65%" r="70%">
          <stop offset="0%" stopColor="#6d6b4d" />
          <stop offset="100%" stopColor="#4a4934" />
        </radialGradient>
      </defs>
      <path
        d="M50 2 C62 3 66 8 76 9 C86 12 92 22 95 32 C99 42 97 50 98 58 C97 70 90 80 82 87 C73 95 62 98 50 97 C38 99 27 95 18 88 C9 80 3 70 3 58 C1 47 4 38 7 30 C12 18 21 10 32 6 C39 3 44 2 50 2 Z"
        fill="url(#wax)"
      />
      <circle cx="50" cy="50" r="34" fill="url(#wax-inner)" />
      <circle cx="50" cy="50" r="34" fill="none" stroke="#2f2e20" strokeOpacity="0.5" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="30" fill="none" stroke="#c9b07e" strokeOpacity="0.55" strokeWidth="0.6" />
      <text
        x="50"
        y="58"
        textAnchor="middle"
        className="font-serif"
        fontSize="24"
        fontWeight="500"
        fill="#d6bf8c"
        fillOpacity="0.9"
        letterSpacing="1"
      >
        {first}
        <tspan fontStyle="italic" fontSize="14" dx="1" dy="-2">
          &amp;
        </tspan>
        <tspan dx="1" dy="2">
          {second}
        </tspan>
      </text>
      <ellipse cx="34" cy="24" rx="12" ry="5" fill="#ffffff" fillOpacity="0.12" transform="rotate(-25 34 24)" />
    </svg>
  )
}
