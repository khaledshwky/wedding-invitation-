'use client'

import { motion, type Variants } from 'motion/react'
import { wedding } from '@/lib/wedding-config'
import { SafeImage } from './primitives'

const container: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.18, delayChildren: 0.5 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
  shown: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.3, ease: [0.22, 1, 0.36, 1] },
  },
}

export function Hero({ revealed }: { revealed: boolean }) {
  const { partnerOne, partnerTwo } = wedding.couple
  return (
    <section
      aria-label="Wedding invitation"
      className="relative flex min-h-svh items-end justify-center md:items-start overflow-hidden bg-espresso text-ivory"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.12 }}
        animate={revealed ? { scale: 1 } : { scale: 1.12 }}
        transition={{ duration: 3.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <SafeImage
          src={wedding.images.hero.src}
          alt={wedding.images.hero.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_60%]"
        />
      </motion.div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(48,37,31,0.35)_0%,rgba(48,37,31,0.08)_25%,rgba(36,27,22,0.55)_48%,rgba(36,27,22,0.7)_70%,rgba(30,22,18,0.88)_100%)] md:bg-[linear-gradient(to_bottom,rgba(30,22,18,0.78)_0%,rgba(36,27,22,0.55)_38%,rgba(48,37,31,0.08)_62%,rgba(36,27,22,0.45)_100%)]"
      />
      <div aria-hidden="true" className="paper absolute inset-0 opacity-20 mix-blend-overlay" />

      <motion.div
        variants={container}
        initial="hidden"
        animate={revealed ? 'shown' : 'hidden'}
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 pb-28 pt-40 text-center [text-shadow:0_1px_18px_rgba(30,22,18,0.45)] md:pb-0 md:pt-[12vh]"
      >
        <motion.p variants={item} className="eyebrow text-[#ecdcbb]">
          Together with their families
        </motion.p>
        <motion.h1
          variants={item}
          className="mt-6 font-serif text-[clamp(3.5rem,13vw,9.5rem)] font-light leading-[0.88] tracking-tight"
        >
          <span className="block md:inline">{partnerOne}</span>
          <span className="mx-4 block font-normal italic text-[#d9c08f] md:inline">&amp;</span>
          <span className="block md:inline">{partnerTwo}</span>
        </motion.h1>
        <motion.p
          variants={item}
          className="mt-8 max-w-md text-pretty font-serif text-xl italic leading-relaxed text-ivory/90 md:text-2xl"
        >
          {wedding.invitationLine}
        </motion.p>
        <motion.div variants={item} className="mt-10 flex items-center gap-5">
          <span className="h-px w-10 bg-[#d9c08f]/70 md:w-16" />
          <p className="eyebrow max-w-[16rem] text-[0.625rem] leading-loose text-ivory md:max-w-none md:text-[0.6875rem]">
            {wedding.dateDisplay.long}
          </p>
          <span className="h-px w-10 bg-[#d9c08f]/70 md:w-16" />
        </motion.div>
      </motion.div>

      <motion.a
        href="#celebration"
        initial={{ opacity: 0 }}
        animate={revealed ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 p-2 text-ivory/80 transition-colors hover:text-ivory"
      >
        <span className="eyebrow text-[0.5625rem]">Scroll</span>
        <span className="relative block h-10 w-px overflow-hidden bg-ivory/25">
          <motion.span
            className="absolute inset-x-0 top-0 h-4 bg-[#d9c08f]"
            animate={{ y: ['-100%', '260%'] }}
            transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: [0.65, 0, 0.35, 1] }}
          />
        </span>
        <span className="sr-only">to the celebration details</span>
      </motion.a>
    </section>
  )
}
