/**
 * Projects catalogue.
 * ASTERIA is the real flagship (has its own bespoke showroom page).
 * MAGNOLIA is a beachfront residence in Boumerdès with premium renders.
 */

export interface ProjectStat { n: string; l: string }

export interface GalleryItem {
  src: string
  caption: string
  desc?: string
  aspect?: string // CSS aspect-ratio, e.g. '16/9', '4/3', '3/4', '1/1'
  wide?: boolean  // spans both columns in 2-col grid
}

export interface Project {
  slug: string
  name: string
  tagline: string
  location: string
  year: string
  status: 'En cours' | 'Livré' | 'À venir'
  cover: string
  gallery: string[]
  galleryItems?: GalleryItem[] // rich gallery with captions and layout hints
  description: string[]
  stats: ProjectStat[]
  to: string // route to its detail page
  featured?: boolean
  isTest?: boolean // marks fabricated placeholder content
}

export const PROJECTS: Project[] = [
  {
    slug: 'asteria',
    name: 'ASTERIA',
    tagline: 'Luxury Living',
    location: 'Alger',
    year: '2025',
    status: 'En cours',
    cover: '/images/asteria/asteria-hero.png',
    gallery: [
      '/images/asteria/building-front.jpg',
      '/images/asteria/living-1.jpg',
      '/images/asteria/balcony-1.jpg',
      '/images/asteria/common-pool.jpg',
      '/images/asteria/bedroom-1.jpg',
      '/images/asteria/bathroom-1.jpg',
    ],
    description: [
      "Une architecture sculptée par la lumière, où chaque balcon ondule comme une vague et chaque cascade murmure le luxe.",
      "ASTERIA n'est pas une adresse, c'est une signature. Découvrez la résidence dans son intégralité.",
    ],
    stats: [
      { n: '12', l: 'Étages signature' },
      { n: 'F3', l: 'Résidences 103–110 m²' },
      { n: '∞', l: 'Piscines et cascades' },
      { n: '24/7', l: 'Conciergerie privée' },
    ],
    to: '/projets/asteria',
    featured: true,
  },
  {
    slug: 'magnolia',
    name: 'MAGNOLIA',
    tagline: 'Résidence Balnéaire',
    location: 'Boumerdès',
    year: '2026',
    status: 'À venir',
    cover: '/images/magnolia/FD6EFAB0-B423-4189-8B31-FC866BF7E3E1.png',
    gallery: [
      '/images/magnolia/FD6EFAB0-B423-4189-8B31-FC866BF7E3E1.png',
      '/images/magnolia/3A2C0AAE-608F-4B79-90BE-6B92E97E4C1F.png',
      '/images/magnolia/6A5DB9C9-F082-496D-905F-1142989BEE99.png',
      '/images/magnolia/96A19E33-DCA6-48AB-A511-6C701D3C9F55.png',
      '/images/magnolia/484EAAB8-29C3-4D32-8C84-BE2332D58056.png',
      '/images/magnolia/066FCA3D-8CB6-4F0D-9EBD-82C0CB162806.png',
      '/images/magnolia/A5585F72-C839-4C50-8250-FCC55FB335B7.png',
      '/images/magnolia/CC978A0A-07F5-485B-947F-CB893B34ABA0.png',
      '/images/magnolia/F1212258-C210-4667-8F23-233E9A9A0649.png',
    ],
    galleryItems: [
      {
        src: '/images/magnolia/FD6EFAB0-B423-4189-8B31-FC866BF7E3E1.png',
        caption: 'Vue Panoramique',
        desc: "Face à la mer, MAGNOLIA s'élève comme une sculpture contemporaine — ses volumes épurés dialoguent avec l'horizon méditerranéen.",
        aspect: '16/9',
        wide: true,
      },
      {
        src: '/images/magnolia/066FCA3D-8CB6-4F0D-9EBD-82C0CB162806.png',
        caption: 'Cadre de Vie Exclusif',
        desc: "Un environnement pensé pour l'exception : matériaux nobles, finitions sur-mesure et vue imprenable sur la mer.",
        aspect: '16/9',
        wide: true,
      },
      {
        src: '/images/magnolia/F1212258-C210-4667-8F23-233E9A9A0649.png',
        caption: 'Chambres avec Vue sur la Méditerranée',
        desc: "Des chambres baignées de lumière, où chaque réveil s'ouvre sur l'immensité de la Méditerranée.",
        aspect: '16/9',
        wide: true,
      },
    ],
    description: [
      "MAGNOLIA s'impose face à la Méditerranée : une résidence balnéaire d'exception où l'architecture épurée rencontre l'horizon infini de la mer.",
      "Pensée pour Boumerdès, cette adresse conjugue intimité, lumière marine et art de vivre littoral — une parenthèse de prestige au bord des flots.",
    ],
    stats: [
      { n: '8', l: 'Étages vue mer' },
      { n: 'F4', l: 'Résidences 120–145 m²' },
      { n: '∞', l: 'Vue sur la Méditerranée' },
      { n: '2027', l: 'Livraison prévue' },
    ],
    to: '/projets/magnolia',
  },
]

export const getProject = (slug?: string) => PROJECTS.find((p) => p.slug === slug)
export const featuredProject = () => PROJECTS.find((p) => p.featured) ?? PROJECTS[0]
