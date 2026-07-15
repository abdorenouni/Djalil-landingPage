/**
 * Projects catalogue.
 * ASTERIA is the real flagship (has its own bespoke showroom page).
 * MAGNOLIA is a FAKE TEST project (placeholder pics + invented info) used to
 * demonstrate the multi-project listing + the generic detail page.
 */

export interface ProjectStat { n: string; l: string }

export interface Project {
  slug: string
  name: string
  tagline: string
  location: string
  year: string
  status: 'En cours' | 'Livré' | 'À venir'
  cover: string
  gallery: string[]
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
    tagline: 'Résidence-Jardin',
    location: 'Oran',
    year: '2026',
    status: 'À venir',
    cover: '/images/carousel-2.jpg',
    gallery: [
      '/images/magnolia/A5585F72-C839-4C50-8250-FCC55FB335B7.png',
      '/images/magnolia/3A2C0AAE-608F-4B79-90BE-6B92E97E4C1F.png',
      '/images/magnolia/6A5DB9C9-F082-496D-905F-1142989BEE99.png',
      '/images/magnolia/96A19E33-DCA6-48AB-A511-6C701D3C9F55.png',
      '/images/magnolia/484EAAB8-29C3-4D32-8C84-BE2332D58056.png',
      '/images/magnolia/066FCA3D-8CB6-4F0D-9EBD-82C0CB162806.png',
      '/images/magnolia/CC978A0A-07F5-485B-947F-CB893B34ABA0.png',
      '/images/magnolia/F1212258-C210-4667-8F23-233E9A9A0649.png',
      '/images/magnolia/FD6EFAB0-B423-4189-8B31-FC866BF7E3E1.png',
      '/images/magnolia/IMG_8194.PNG',
      '/images/magnolia/IMG_8190.PNG',
      '/images/magnolia/IMG_8191.PNG',
      '/images/magnolia/IMG_8193.PNG',
      '/images/magnolia/IMG_7946.JPG',
    ],
    description: [
      "MAGNOLIA réinvente la résidence-jardin : des terrasses végétalisées en cascade, des patios suspendus et une lumière qui circule librement entre l'intérieur et le dehors.",
      "Pensée pour Oran, cette adresse conjugue intimité, verdure et art de vivre méditerranéen, une parenthèse de calme au cœur de la ville.",
    ],
    stats: [
      { n: '8', l: 'Étages jardin' },
      { n: 'F4', l: 'Résidences 120–145 m²' },
      { n: '3', l: 'Patios suspendus' },
      { n: '2027', l: 'Livraison prévue' },
    ],
    to: '/projets/magnolia',
    isTest: true,
  },
]

export const getProject = (slug?: string) => PROJECTS.find((p) => p.slug === slug)
export const featuredProject = () => PROJECTS.find((p) => p.featured) ?? PROJECTS[0]
