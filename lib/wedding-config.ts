/**
 * Every detail of the invitation lives here.
 * Replace names, dates, venue, photographs and RSVP settings in this one file.
 */

export type GalleryImage = {
  src: string
  alt: string
  caption: string
}

export const wedding = {
  couple: {
    partnerOne: 'Amelia',
    partnerTwo: 'Sebastian',
    initials: { first: 'A', second: 'S' },
  },

  /** ISO 8601 with timezone offset — the single source of truth for the countdown. */
  dateISO: '2026-11-21T17:00:00+02:00',
  dateDisplay: {
    long: 'Saturday, the Twenty-First of November, 2026',
    short: 'November 21, 2026',
    numeric: '21 · XI · 2026',
  },

  invitationLine: 'Joyfully invite you to celebrate the beginning of their forever.',

  celebration: {
    heading: 'Our Celebration',
    message:
      'Two hearts, one beautiful story, and a lifetime of memories waiting to be made. We would be honored to celebrate this special beginning with you.',
  },

  schedule: [
    { label: 'Ceremony', time: '5:00 PM', note: 'Guests are kindly asked to be seated by 4:45 PM' },
    { label: 'Reception', time: '7:00 PM', note: 'Dinner, dancing & champagne under the stars' },
  ],

  venue: {
    name: 'The Grand Palace',
    city: 'Cairo, Egypt',
    /** Placeholder — replace with the confirmed venue address. */
    address: '[Placeholder] 00 Corniche El Nil, Garden City, Cairo',
    /** Placeholder Google Maps search — replace with the real venue query or a share link. */
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Garden+City+Cairo+Egypt',
  },

  dressCode: {
    title: 'Formal Evening Attire',
    note: 'Black tie optional. Soft neutrals and evening tones warmly encouraged.',
  },

  images: {
    hero: {
      src: '/images/hero.webp',
      alt: 'The bride and groom walking hand in hand through a sunlit limestone palace courtyard',
    },
    gallery: [
      {
        src: '/images/gallery-1.webp',
        alt: 'Bridal bouquet of ivory roses, ranunculus and olive branches held in soft window light',
        caption: 'The bouquet',
      },
      {
        src: '/images/gallery-2.webp',
        alt: 'A long candlelit reception table dressed in ivory linen, gold-rimmed china and white flowers',
        caption: 'The table',
      },
      {
        src: '/images/gallery-3.webp',
        alt: 'The groom kissing the bride on the forehead beneath a stone colonnade',
        caption: 'A quiet moment',
      },
      {
        src: '/images/gallery-5.webp',
        alt: 'Gold wedding rings resting beside a letterpress invitation and a wax seal',
        caption: 'The details',
      },
      {
        src: '/images/gallery-4.webp',
        alt: 'A neoclassical palace with symmetrical gardens and cypress trees at golden hour',
        caption: 'The palace',
      },
    ] satisfies GalleryImage[],
  },

  rsvp: {
    deadline: 'October 15, 2026',
    maxGuests: 4,
    /**
     * Set to a URL (e.g. a Formspree endpoint or your own API route) to receive replies.
     * While null, the form runs in clearly labelled demo mode and nothing is sent.
     */
    endpoint: null as string | null,
  },

  closing: {
    heading: "We can't wait to celebrate with you.",
    footer: 'Made with love',
  },
} as const

export const coupleNames = `${wedding.couple.partnerOne} & ${wedding.couple.partnerTwo}`
