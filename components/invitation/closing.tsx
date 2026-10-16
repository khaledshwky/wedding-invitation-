import { wedding } from '@/lib/wedding-config'
import { Divider, Monogram, OliveSprig } from './ornaments'
import { Reveal } from './primitives'

export function Closing() {
  return (
    <footer className="relative px-4 pb-10 pt-12 md:px-8 md:pt-16">
      <Reveal className="paper relative mx-auto max-w-6xl bg-parchment px-6 py-24 text-center md:py-32">
        <div aria-hidden="true" className="pointer-events-none absolute inset-3 border border-gold/50 md:inset-5" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-4 border border-gold/25 md:inset-6" />

        <div className="relative flex flex-col items-center">
          <Monogram className="h-20 w-20 md:h-24 md:w-24" />
          <p className="eyebrow mt-12 max-w-xs leading-loose text-gold-deep md:max-w-none">
            {wedding.closing.heading}
          </p>
          <h2 className="mt-6 font-serif text-[clamp(3rem,10vw,7rem)] font-light leading-[0.95] text-espresso">
            {wedding.couple.partnerOne}{' '}
            <span className="italic text-gold">&amp;</span>{' '}
            {wedding.couple.partnerTwo}
          </h2>
          <p className="mt-8 font-serif text-xl italic text-espresso/75">
            {wedding.dateDisplay.short} · {wedding.venue.name}, {wedding.venue.city}
          </p>
          <Divider className="mt-12" />
          <div className="mt-10 flex items-center gap-2">
            <OliveSprig className="h-8 w-10 -scale-x-100" />
            <OliveSprig className="h-8 w-10" />
          </div>
        </div>
      </Reveal>
      <p className="eyebrow mt-10 text-center text-[0.5625rem] text-espresso/50">
        {wedding.closing.footer} · {wedding.couple.initials.first} &amp;{' '}
        {wedding.couple.initials.second} · MMXXVI
      </p>
    </footer>
  )
}
