import { ArrowUpRight } from 'lucide-react'
import { wedding } from '@/lib/wedding-config'
import { Divider } from './ornaments'
import { Reveal } from './primitives'

export function Details() {
  const { venue, schedule, dressCode, dateDisplay } = wedding
  const rows = [
    { label: 'Date', value: dateDisplay.short, note: 'Saturday evening' },
    ...schedule.map((s) => ({ label: s.label, value: s.time, note: s.note })),
    { label: 'Dress code', value: dressCode.title, note: dressCode.note },
  ]

  return (
    <section
      id="details"
      aria-labelledby="details-heading"
      className="relative border-y border-gold/25 bg-parchment/70 px-6 py-24 md:py-36"
    >
      <div aria-hidden="true" className="paper pointer-events-none absolute inset-0 opacity-25" />
      <div className="relative mx-auto grid max-w-6xl gap-16 md:grid-cols-12 md:gap-10">
        <Reveal className="md:col-span-5 md:pr-8">
          <p className="eyebrow text-gold-deep">The Details</p>
          <h2
            id="details-heading"
            className="mt-5 font-serif text-5xl font-light leading-[1.02] text-espresso md:text-7xl"
          >
            An evening at <span className="italic">{venue.name}</span>
          </h2>
          <Divider className="mt-8 w-32" />
          <address className="mt-8 not-italic">
            <p className="font-serif text-2xl text-espresso">{venue.name}</p>
            <p className="mt-1 font-serif text-xl italic text-espresso/75">{venue.city}</p>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {venue.address}
            </p>
          </address>
          <a
            href={venue.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="eyebrow group mt-10 inline-flex items-center gap-3 border-b border-gold pb-2 text-espresso transition-colors hover:border-espresso"
          >
            View location
            <ArrowUpRight
              className="size-3.5 text-gold-deep transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
            <span className="sr-only">(opens Google Maps in a new tab)</span>
          </a>
        </Reveal>

        <Reveal delay={0.15} className="md:col-span-7">
          <dl className="border-t border-gold/40">
            {rows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-1 gap-2 border-b border-gold/40 py-7 sm:grid-cols-[9rem_1fr] sm:gap-8 md:py-9"
              >
                <dt className="eyebrow pt-2 text-gold-deep">{row.label}</dt>
                <dd>
                  <p className="font-serif text-3xl font-light text-espresso md:text-4xl">
                    {row.value}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{row.note}</p>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
