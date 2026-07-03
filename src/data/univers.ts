/**
 * "L'Univers Elite" — the experiential categories teased on the home page,
 * each with its own dedicated page (/univers/:slug). Distinct content + a
 * layout `variant` so no two pages feel cloned.
 */

export interface UniversFeature { title: string; text: string }

export interface Univers {
  slug: string
  num: string
  kicker: string
  title: string
  tagline: string
  hero: string
  intro: string[]
  features: UniversFeature[]
  gallery: { src: string; caption: string }[]
  quote: string
  stats: { n: string; l: string }[]
  variant: 'gallery' | 'cinematic' | 'editorial'
  show3D: boolean
}

export const UNIVERS: Univers[] = [
  {
    slug: 'interieurs',
    num: '01',
    kicker: "L'Univers Elite",
    title: 'Nos Intérieurs',
    tagline: "L'art de l'espace et de la lumière",
    hero: '/images/univers/interieurs/sejour-02.jpg',
    intro: [
      "Chaque intérieur signé Elite est pensé comme une scène de vie : des volumes généreux, une lumière qui circule librement et des matériaux choisis pour vieillir avec grâce.",
      "Du séjour traversant à la suite parentale, rien n'est laissé au hasard, la proportion, la texture et le silence deviennent un luxe.",
    ],
    features: [
      { title: 'Volumes traversants', text: 'Des séjours baignés de lumière du matin au couchant, ouverts sur la ville.' },
      { title: 'Plafonds étoilés', text: 'Une voûte de fibres optiques qui prolonge le jour à la nuit dans chaque pièce de vie.' },
      { title: 'Matières nobles', text: 'Marbres, bois et laitons sélectionnés pièce par pièce, sans compromis.' },
    ],
    gallery: [
      { src: '/images/univers/interieurs/sejour-01.jpg', caption: 'Séjour · ouverture sur la baie' },
      { src: '/images/univers/interieurs/sejour-02.jpg', caption: 'Séjour traversant' },
      { src: '/images/univers/interieurs/sejour-03.jpg', caption: 'Salon · lumière du matin' },
      { src: '/images/univers/interieurs/chambre-01.jpg', caption: 'Suite parentale' },
      { src: '/images/univers/interieurs/chambre-02.jpg', caption: 'Chambre avec vue' },
      { src: '/images/univers/interieurs/chambre-03.jpg', caption: 'Suite · matières nobles' },
      { src: '/images/univers/interieurs/sdb-01.jpg', caption: 'Salle de bain en marbre' },
      { src: '/images/univers/interieurs/sdb-02.jpg', caption: 'Salle d\'eau · finitions sur-mesure' },
      { src: '/images/univers/interieurs/sdb-03.jpg', caption: 'Espace bain · sérénité' },
    ],
    quote: "Le vrai luxe, c'est l'espace, la lumière et le silence.",
    stats: [
      { n: '103', l: 'm² habitables min.' },
      { n: 'F3', l: '3 pièces signature' },
      { n: '3.2', l: 'm sous plafond' },
    ],
    variant: 'gallery',
    show3D: false,
  },
  {
    slug: 'design',
    num: '02',
    kicker: "L'Univers Elite",
    title: 'Nos Design',
    tagline: 'Le détail comme signature',
    hero: '/images/univers/design/building-01.jpg',
    intro: [
      "Le design Elite se reconnaît à ce qui ne se voit pas au premier regard : la justesse d'une jonction, la noblesse d'un matériau, la lumière pensée centimètre par centimètre.",
      "De la façade ondulante à la dernière poignée de porte, une même main, une même exigence, une signature architecturale cohérente du gros œuvre à la finition.",
    ],
    features: [
      { title: 'Façade vivante', text: 'Des courbes qui défient la ligne droite, sculptées pour capter la lumière.' },
      { title: 'Finitions sur-mesure', text: 'Chaque détail dessiné, prototypé et validé avant la pose.' },
      { title: 'Lumière maîtrisée', text: 'Un éclairage pensé pièce par pièce, du jour artificiel au coucher.' },
    ],
    gallery: [
      { src: '/images/univers/design/building-01.jpg', caption: 'ASTERIA · façade signature' },
      { src: '/images/univers/design/building-02.jpg', caption: 'Volumes sculptés · jeu d\'ombres' },
      { src: '/images/univers/design/building-03.jpg', caption: 'Vue d\'ensemble · contexte urbain' },
      { src: '/images/univers/design/plan-f3-01.jpg', caption: 'Plan 3D · F3 typique' },
      { src: '/images/univers/design/plan-f4-01.jpg', caption: 'Plan 3D · F4 traversant' },
      { src: '/images/univers/design/plan-villa-01.jpg', caption: 'Villa · plan d\'étage' },
      { src: '/images/univers/design/plan-villa-02.jpg', caption: 'Villa · niveau supérieur' },
    ],
    quote: 'Le luxe, ce sont mille décisions invisibles prises correctement.',
    stats: [
      { n: '100%', l: 'Sur-mesure' },
      { n: '10+', l: "Années d'expertise" },
      { n: '24/7', l: 'Accompagnement' },
    ],
    variant: 'editorial',
    show3D: true,
  },
]

export const getUnivers = (slug?: string) => UNIVERS.find((u) => u.slug === slug)
