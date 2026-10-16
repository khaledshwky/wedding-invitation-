'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useId, useState, type FormEvent } from 'react'
import { cn } from '@/lib/utils'
import { wedding } from '@/lib/wedding-config'
import { Divider } from './ornaments'
import { Reveal } from './primitives'

type Attendance = 'accept' | 'decline'
type Errors = Partial<Record<'name' | 'attendance' | 'guests', string>>
type Status =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success'; name: string; attendance: Attendance; demo: boolean }
  | { kind: 'error'; message: string }

const fieldBase =
  'w-full border-0 border-b border-gold/60 bg-transparent px-0 py-3 font-serif text-xl text-espresso placeholder:text-espresso/35 transition-colors focus:border-espresso focus:outline-none focus-visible:outline-none'

export function Rsvp() {
  const id = useId()
  const [attendance, setAttendance] = useState<Attendance | null>(null)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status.kind === 'submitting') return
    const form = new FormData(e.currentTarget)
    const name = String(form.get('name') ?? '').trim()
    const guests = Number(form.get('guests') ?? 1)
    const dietary = String(form.get('dietary') ?? '').trim().slice(0, 500)

    const next: Errors = {}
    if (name.length < 2) next.name = 'Please share your full name.'
    if (name.length > 120) next.name = 'Please use a shorter name.'
    if (!attendance) next.attendance = 'Kindly let us know if you can join us.'
    if (
      attendance === 'accept' &&
      (!Number.isInteger(guests) || guests < 1 || guests > wedding.rsvp.maxGuests)
    ) {
      next.guests = `Please choose between 1 and ${wedding.rsvp.maxGuests} guests.`
    }
    setErrors(next)
    if (Object.keys(next).length > 0 || !attendance) {
      const first = Object.keys(next)[0]
      document.getElementById(`${id}-${first}`)?.focus()
      return
    }

    setStatus({ kind: 'submitting' })
    const payload = {
      name,
      attendance,
      guests: attendance === 'accept' ? guests : 0,
      dietary,
    }

    try {
      if (wedding.rsvp.endpoint) {
        const res = await fetch(wedding.rsvp.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error(`Request failed with ${res.status}`)
        setStatus({ kind: 'success', name, attendance, demo: false })
      } else {
        // Demo mode: no RSVP service is configured, so nothing is stored or sent.
        await new Promise((r) => setTimeout(r, 900))
        setStatus({ kind: 'success', name, attendance, demo: true })
      }
    } catch {
      setStatus({
        kind: 'error',
        message: 'We couldn’t send your reply just now. Please try again in a moment.',
      })
    }
  }

  return (
    <section
      id="rsvp"
      aria-labelledby="rsvp-heading"
      className="relative px-6 py-24 md:py-36"
    >
      <Reveal className="relative mx-auto max-w-2xl border border-gold/50 bg-card px-6 py-14 shadow-[0_40px_80px_-50px_rgba(48,37,31,0.45)] sm:px-12 md:px-16 md:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-2 border border-gold/25" />
        <div aria-hidden="true" className="paper pointer-events-none absolute inset-0 opacity-20" />

        <div className="relative text-center">
          <p className="eyebrow text-gold-deep">Répondez s’il vous plaît</p>
          <h2
            id="rsvp-heading"
            className="mt-5 font-serif text-5xl font-light text-espresso md:text-6xl"
          >
            Kindly Reply
          </h2>
          <Divider className="mx-auto mt-6 w-32" />
          <p className="mt-6 font-serif text-lg italic text-muted-foreground">
            We would be grateful for your response by {wedding.rsvp.deadline}.
          </p>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {status.kind === 'success' ? (
            <motion.div
              key="success"
              role="status"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative mt-14 text-center"
            >
              <p className="font-serif text-3xl font-light text-espresso">
                {status.attendance === 'accept'
                  ? `Thank you, ${status.name}.`
                  : `Thank you for letting us know, ${status.name}.`}
              </p>
              <p className="mx-auto mt-4 max-w-md font-serif text-lg italic text-muted-foreground">
                {status.attendance === 'accept'
                  ? 'We cannot wait to celebrate with you.'
                  : 'You will be dearly missed.'}
              </p>
              {status.demo && (
                <p className="mx-auto mt-8 max-w-md border border-gold/50 bg-parchment/60 px-5 py-4 text-sm leading-relaxed text-espresso/80">
                  <span className="eyebrow mb-1 block text-[0.625rem] text-gold-deep">
                    Preview mode
                  </span>
                  This invitation is a preview, so your reply has not been saved or sent to the
                  couple yet.
                </p>
              )}
              <button
                type="button"
                onClick={() => {
                  setStatus({ kind: 'idle' })
                  setAttendance(null)
                }}
                className="eyebrow mt-10 border-b border-gold pb-1 text-espresso transition-colors hover:border-espresso"
              >
                Edit response
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              noValidate
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative mt-12 space-y-10"
            >
              <div>
                <label htmlFor={`${id}-name`} className="eyebrow block text-gold-deep">
                  Guest name
                </label>
                <input
                  id={`${id}-name`}
                  name="name"
                  type="text"
                  autoComplete="name"
                  maxLength={120}
                  placeholder="Your full name"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? `${id}-name-error` : undefined}
                  className={cn(fieldBase, errors.name && 'border-destructive')}
                />
                <FieldError id={`${id}-name-error`} message={errors.name} />
              </div>

              <fieldset aria-describedby={errors.attendance ? `${id}-attendance-error` : undefined}>
                <legend className="eyebrow text-gold-deep">Will you attend?</legend>
                <div
                  id={`${id}-attendance`}
                  tabIndex={-1}
                  className="mt-4 grid gap-3 focus:outline-none sm:grid-cols-2"
                >
                  {(
                    [
                      { value: 'accept', label: 'Joyfully Accept' },
                      { value: 'decline', label: 'Regretfully Decline' },
                    ] as const
                  ).map((opt) => {
                    const selected = attendance === opt.value
                    return (
                      <label
                        key={opt.value}
                        className={cn(
                          'relative flex cursor-pointer items-center justify-center gap-3 border px-4 py-4 font-serif text-xl transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-gold-deep',
                          selected
                            ? 'border-espresso bg-espresso text-ivory'
                            : 'border-gold/60 text-espresso hover:border-espresso',
                        )}
                      >
                        <input
                          type="radio"
                          name="attendance"
                          value={opt.value}
                          checked={selected}
                          onChange={() => {
                            setAttendance(opt.value)
                            setErrors((e) => ({ ...e, attendance: undefined }))
                          }}
                          className="sr-only"
                        />
                        <span
                          aria-hidden="true"
                          className={cn(
                            'size-2 rotate-45 border',
                            selected ? 'border-[#d9c08f] bg-[#d9c08f]' : 'border-gold',
                          )}
                        />
                        <span className="italic">{opt.label}</span>
                      </label>
                    )
                  })}
                </div>
                <FieldError id={`${id}-attendance-error`} message={errors.attendance} />
              </fieldset>

              <div className="grid gap-10 sm:grid-cols-[10rem_1fr]">
                <div>
                  <label htmlFor={`${id}-guests`} className="eyebrow block text-gold-deep">
                    Guests
                  </label>
                  <select
                    id={`${id}-guests`}
                    name="guests"
                    defaultValue="1"
                    disabled={attendance === 'decline'}
                    aria-invalid={Boolean(errors.guests)}
                    aria-describedby={errors.guests ? `${id}-guests-error` : undefined}
                    className={cn(fieldBase, 'cursor-pointer disabled:cursor-not-allowed disabled:opacity-40')}
                  >
                    {Array.from({ length: wedding.rsvp.maxGuests }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'guest' : 'guests'}
                      </option>
                    ))}
                  </select>
                  <FieldError id={`${id}-guests-error`} message={errors.guests} />
                </div>
                <div>
                  <label htmlFor={`${id}-dietary`} className="eyebrow block text-gold-deep">
                    Dietary requirements{' '}
                    <span className="normal-case tracking-normal text-muted-foreground">
                      (optional)
                    </span>
                  </label>
                  <input
                    id={`${id}-dietary`}
                    name="dietary"
                    type="text"
                    maxLength={500}
                    placeholder="Allergies, preferences…"
                    className={fieldBase}
                  />
                </div>
              </div>

              {status.kind === 'error' && (
                <p role="alert" className="border border-destructive/40 px-4 py-3 text-sm text-destructive">
                  {status.message}
                </p>
              )}

              <div className="flex flex-col items-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={status.kind === 'submitting'}
                  className="eyebrow group relative inline-flex min-w-64 items-center justify-center overflow-hidden bg-espresso px-10 py-5 text-ivory transition-colors hover:bg-[#241b16] disabled:cursor-wait disabled:opacity-80"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-1 border border-[#d9c08f]/40 transition-colors group-hover:border-[#d9c08f]/80"
                  />
                  <span className="relative">
                    {status.kind === 'submitting' ? 'Sending…' : 'Confirm attendance'}
                  </span>
                </button>
                {!wedding.rsvp.endpoint && (
                  <p className="text-center text-xs text-muted-foreground">
                    Preview mode — replies are not yet saved or sent.
                  </p>
                )}
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </Reveal>
    </section>
  )
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-2 text-sm italic text-destructive">
      {message}
    </p>
  )
}
