'use client'

import { motion } from 'motion/react'
import Image, { type ImageProps } from 'next/image'
import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Monogram } from './ornaments'

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  className,
}: {
  eyebrow: string
  title: string
  className?: string
}) {
  return (
    <div className={cn('text-center', className)}>
      <p className="eyebrow text-gold-deep">{eyebrow}</p>
      <h2 className="mt-5 text-balance font-serif text-4xl font-light leading-[1.05] text-espresso md:text-6xl">
        {title}
      </h2>
    </div>
  )
}

/** next/image with a soft parchment loading state and a graceful monogram fallback. */
export function SafeImage({ className, alt, ...props }: ImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading')

  if (status === 'error') {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn('paper flex items-center justify-center bg-parchment', className)}
      >
        <Monogram label={false} className="h-16 w-16 opacity-60" />
      </div>
    )
  }

  return (
    <Image
      {...props}
      alt={alt}
      onLoad={() => setStatus('loaded')}
      onError={() => setStatus('error')}
      className={cn(
        'bg-parchment transition-opacity duration-700',
        status === 'loaded' ? 'opacity-100' : 'opacity-0',
        className,
      )}
    />
  )
}
