import { wedding } from '@/lib/wedding-config'
import { Divider, OliveSprig } from './ornaments'
import { Reveal } from './primitives'

export function Celebration() {
  return (
    <section id="celebration" className="relative scroll-mt-0 px-6 py-28 md:py-40">
      <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <OliveSprig className="h-14 w-16" />
        <p className="eyebrow mt-8 text-gold-deep">Chapter One</p>
        <h2 className="mt-5 font-serif text-5xl font-light text-espresso md:text-7xl">
          {wedding.celebration.heading}
        </h2>
        <Divider className="mt-8" />
        <p className="mt-10 text-balance font-serif text-2xl font-light italic leading-relaxed text-espresso/85 md:text-[1.9rem] md:leading-[1.55]">
          {`“${wedding.celebration.message}”`}
        </p>
        <p className="eyebrow mt-10 text-espresso/60">
          {wedding.couple.partnerOne} &amp; {wedding.couple.partnerTwo}
        </p>
      </Reveal>
    </section>
  )
}
