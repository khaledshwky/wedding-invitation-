'use client'

import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { wedding } from '@/lib/wedding-config'
import { Reveal, SafeImage, SectionHeading } from './primitives'

const images = wedding.images.gallery

/** Editorial placement for each photograph, in order. */
const layout = [
  { wrap: 'md:col-span-5', aspect: 'aspect-[4/5]', sizes: '(min-width: 768px) 40vw, 100vw' },
  { wrap: 'md:col-span-7 md:mt-32', aspect: 'aspect-[3/2]', sizes: '(min-width: 768px) 56vw, 100vw' },
  { wrap: 'md:col-span-4 md:col-start-2 md:-mt-10', aspect: 'aspect-[3/4]', sizes: '(min-width: 768px) 32vw, 100vw' },
  { wrap: 'md:col-span-5 md:col-start-7 md:mt-20', aspect: 'aspect-square', sizes: '(min-width: 768px) 40vw, 100vw' },
  { wrap: 'md:col-span-10 md:col-start-2', aspect: 'aspect-[16/9]', sizes: '(min-width: 768px) 80vw, 100vw' },
]

export function Gallery() {
  const [active, setActive] = useState<number | null>(null)
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([])

  return (
    <section
      aria-labelledby="gallery-heading"
      className="relative px-6 py-24 md:py-36"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading eyebrow="A collection" title="Moments in Light" />
          <span id="gallery-heading" className="sr-only">
            Photo gallery
          </span>
        </Reveal>

        <ul className="mt-16 grid grid-cols-1 gap-10 md:mt-24 md:grid-cols-12 md:gap-x-10 md:gap-y-16">
          {images.map((image, i) => (
            <li key={image.src} className={cn(layout[i]?.wrap)}>
              <Reveal delay={(i % 2) * 0.12}>
                <figure>
                  <button
                    type="button"
                    ref={(el) => {
                      triggerRefs.current[i] = el
                    }}
                    onClick={() => setActive(i)}
                    className={cn(
                      'group relative block w-full cursor-zoom-in overflow-hidden bg-parchment',
                      layout[i]?.aspect ?? 'aspect-[4/5]',
                    )}
                  >
                    <SafeImage
                      src={image.src}
                      alt={image.alt}
                      fill
                      loading="lazy"
                      sizes={layout[i]?.sizes ?? '100vw'}
                      className="object-cover transition-[scale,opacity] duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    />
                    <span className="pointer-events-none absolute inset-3 border border-ivory/0 transition-colors duration-700 group-hover:border-ivory/60" />
                    <span className="sr-only">Open photo: {image.caption}</span>
                  </button>
                  <figcaption className="mt-4 flex items-baseline justify-between gap-4">
                    <span className="font-serif text-lg italic text-espresso/80">
                      {image.caption}
                    </span>
                    <span className="eyebrow text-[0.5625rem] text-gold-deep">
                      {String(i + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      <Lightbox
        index={active}
        onChange={setActive}
        onClose={() => {
          const last = active
          setActive(null)
          if (last !== null) triggerRefs.current[last]?.focus()
        }}
      />
    </section>
  )
}

function Lightbox({
  index,
  onChange,
  onClose,
}: {
  index: number | null
  onChange: (i: number) => void
  onClose: () => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const open = index !== null

  const go = useCallback(
    (dir: 1 | -1) => {
      if (index === null) return
      onChange((index + dir + images.length) % images.length)
    },
    [index, onChange],
  )

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, go, onClose])

  const image = index !== null ? images[index] : null

  return (
    <AnimatePresence>
      {image && index !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${index + 1} of ${images.length}: ${image.caption}`}
          className="fixed inset-0 z-[60] flex flex-col bg-[#1f1814] text-ivory"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-between px-5 py-4 md:px-10 md:py-6">
            <p className="eyebrow text-[0.625rem] text-[#d9c08f]">
              {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="eyebrow flex items-center gap-2 p-2 text-[0.625rem] text-ivory/80 transition-colors hover:text-ivory"
            >
              Close
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          <div
            className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-24"
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose()
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={image.src}
                className="relative h-full w-full"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <SafeImage
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="100vw"
                  className="bg-transparent object-contain"
                />
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center border border-ivory/25 bg-[#1f1814]/50 text-ivory/80 transition-colors hover:border-[#d9c08f] hover:text-ivory md:left-8"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center border border-ivory/25 bg-[#1f1814]/50 text-ivory/80 transition-colors hover:border-[#d9c08f] hover:text-ivory md:right-8"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>

          <p className="px-6 py-6 text-center font-serif text-lg italic text-ivory/80 md:py-8">
            {image.caption}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
