import { cn } from '@/lib/utils'
import { wedding } from '@/lib/wedding-config'

export function Divider({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 20"
      className={cn('h-4 w-40 text-gold', className)}
      fill="none"
      aria-hidden="true"
    >
      <path d="M0 10 H78" stroke="currentColor" strokeWidth="0.75" />
      <path d="M122 10 H200" stroke="currentColor" strokeWidth="0.75" />
      <circle cx="84" cy="10" r="1.2" fill="currentColor" />
      <circle cx="116" cy="10" r="1.2" fill="currentColor" />
      <path d="M100 3 L106 10 L100 17 L94 10 Z" stroke="currentColor" strokeWidth="0.75" />
      <path d="M100 7 L103 10 L100 13 L97 10 Z" fill="currentColor" />
    </svg>
  )
}

const leaves: Array<[number, number, number]> = [
  [26, 78, -70],
  [40, 70, 20],
  [48, 58, -60],
  [62, 52, 30],
  [68, 40, -50],
  [82, 34, 40],
  [86, 22, -40],
  [100, 18, 50],
]

export function OliveSprig({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 100"
      className={cn('h-16 w-20 text-olive', className)}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M14 92 C 38 74, 66 48, 112 10"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      {leaves.map(([cx, cy, rot]) => (
        <ellipse
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          rx="9"
          ry="3.2"
          transform={`rotate(${rot} ${cx} ${cy})`}
          stroke="currentColor"
          strokeWidth="0.8"
        />
      ))}
      <circle cx="56" cy="64" r="2.4" stroke="var(--gold)" strokeWidth="0.8" />
      <circle cx="90" cy="30" r="2.4" stroke="var(--gold)" strokeWidth="0.8" />
    </svg>
  )
}

export function Monogram({ className, label = true }: { className?: string; label?: boolean }) {
  const { first, second } = wedding.couple.initials
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn('h-20 w-20 text-gold', className)}
      role={label ? 'img' : undefined}
      aria-label={label ? `Monogram ${first} and ${second}` : undefined}
      aria-hidden={label ? undefined : true}
    >
      <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="0.6" />
      <circle cx="50" cy="50" r="43" fill="none" stroke="currentColor" strokeWidth="0.3" />
      <text
        x="33"
        y="60"
        textAnchor="middle"
        className="font-serif"
        fontSize="32"
        fontWeight="300"
        fill="currentColor"
      >
        {first}
      </text>
      <text
        x="50"
        y="58"
        textAnchor="middle"
        className="font-serif"
        fontStyle="italic"
        fontSize="16"
        fill="currentColor"
      >
        &amp;
      </text>
      <text
        x="67"
        y="60"
        textAnchor="middle"
        className="font-serif"
        fontSize="32"
        fontWeight="300"
        fill="currentColor"
      >
        {second}
      </text>
    </svg>
  )
}
