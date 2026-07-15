/**
 * Le Journal — editorial content.
 * No CMS for delivery: articles are authored here as typed data.
 * `body` blocks render in order in the article template.
 */

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'image'; src: string; caption?: string }

export interface Article {
  slug: string
  category: 'Architecture' | 'Art de vivre' | 'Investissement'
  title: string
  excerpt: string
  cover: string
  date: string // ISO
  readMinutes: number
  author: string
  featured?: boolean
  body: Block[]
}

export const ARTICLES: Article[] = [
  {
    slug: 'asteria-paysage-vertical',
    category: 'Investissement',
    title: "ASTERIA : repenser le paysage vertical",
    excerpt:
      "Comment l'eau, la lumière et la végétation se conjuguent pour transformer une tour résidentielle en écosystème vivant au cœur d'Alger.",
    cover: '/images/asteria/building-hero.jpg',
    date: '2026-05-28',
    readMinutes: 6,
    author: 'Elite Promotion',
    featured: true,
    body: [
      { type: 'p', text: "À Alger, la verticalité a longtemps rimé avec densité. ASTERIA propose l'inverse : une tour conçue comme un paysage habité, où chaque étage prolonge le ciel plutôt que de l'occulter." },
      { type: 'h2', text: 'Une façade qui respire' },
      { type: 'p', text: "Des cascades suspendues glissent entre les niveaux, adoucissant la lumière et rafraîchissant naturellement les terrasses. La façade n'est plus une limite : elle devient une membrane vivante entre l'intérieur et la ville." },
      { type: 'image', src: '/images/asteria/building-front.jpg', caption: "Les cascades suspendues d'ASTERIA, façade sud." },
      { type: 'quote', text: "Nous ne dessinons pas des appartements empilés. Nous composons un territoire vertical." },
      { type: 'h2', text: "L'eau comme matériau" },
      { type: 'p', text: "Chaque terrasse supérieure s'ouvre sur son propre bassin à débordement, suspendu au-dessus de la ville. L'eau y est traitée comme un matériau architectural à part entière, réfléchissante le jour, lumineuse la nuit." },
      { type: 'image', src: '/images/asteria/balcony-1.jpg', caption: 'Piscine à débordement privative.' },
      { type: 'p', text: "ASTERIA n'est pas une promesse de standing. C'est une démonstration : l'Algérie peut produire une architecture résidentielle de rang international." },
    ],
  },
  {
    slug: 'art-de-vivre-vertical',
    category: 'Art de vivre',
    title: "L'art de vivre en hauteur",
    excerpt:
      "Lumière, silence, vues dégagées : ce que change réellement la vie à plusieurs dizaines de mètres au-dessus de la ville.",
    cover: '/images/asteria/living-1.jpg',
    date: '2026-05-12',
    readMinutes: 5,
    author: 'Elite Promotion',
    body: [
      { type: 'p', text: "Vivre en hauteur n'est pas qu'une question de vue. C'est une autre relation au temps, à la lumière et au calme." },
      { type: 'h2', text: 'La lumière comme luxe premier' },
      { type: 'p', text: "Aux étages supérieurs, la lumière entre plus longtemps, plus pure. Les séjours d'ASTERIA sont orientés pour capter le couchant sur la baie." },
      { type: 'image', src: '/images/asteria/living-2.jpg', caption: 'Séjour traversant, lumière de fin de journée.' },
      { type: 'quote', text: "Le vrai luxe, c'est l'espace, le silence et la lumière, tout le reste suit." },
      { type: 'p', text: "Les plafonds étoilés en fibre optique prolongent le jour à la nuit, recréant une voûte nocturne dans chaque pièce de vie." },
    ],
  },
  {
    slug: 'standing-algerien-2026',
    category: 'Investissement',
    title: "Le standing algérien en 2026",
    excerpt:
      "Le marché du haut de gamme à Alger évolue. Décryptage des attentes d'une clientèle exigeante et de ce qui définit désormais l'exception.",
    cover: '/images/asteria/common-1.jpg',
    date: '2026-04-30',
    readMinutes: 7,
    author: 'Elite Promotion',
    body: [
      { type: 'p', text: "La demande de résidences d'exception à Alger n'a jamais été aussi affirmée. Mais les critères ont changé." },
      { type: 'h2', text: 'Au delà des mètres carrés' },
      { type: 'p', text: "La clientèle ne compare plus seulement des surfaces. Elle évalue des services, des espaces communs, une sécurité, une signature architecturale et une promesse de délais tenus." },
      { type: 'image', src: '/images/asteria/common-pool.jpg', caption: 'Espaces communs, piscine intérieure.' },
      { type: 'quote', text: "L'exception ne se mesure plus en m², mais en qualité d'expérience." },
      { type: 'p', text: "C'est précisément ce déplacement des attentes qu'ASTERIA anticipe : un projet pensé comme une adresse, pas comme un produit." },
    ],
  },
  {
    slug: 'detail-signature-finitions',
    category: 'Architecture',
    title: "Le détail comme signature",
    excerpt:
      "Du choix des matériaux à la dernière poignée de porte, pourquoi l'excellence d'une résidence se joue dans ce qui ne se voit pas au premier regard.",
    cover: '/images/asteria/bathroom-1.jpg',
    date: '2026-04-15',
    readMinutes: 4,
    author: 'Elite Promotion',
    body: [
      { type: 'p', text: "Une résidence d'exception se reconnaît moins à ses volumes qu'à la constance de ses détails." },
      { type: 'h2', text: 'La cohérence jusqu’au bout' },
      { type: 'p', text: "Matériaux nobles, jonctions parfaites, éclairage pensé pièce par pièce : l'excellence est une discipline qui ne s'autorise aucun relâchement, du gros œuvre à la remise des clés." },
      { type: 'image', src: '/images/asteria/bedroom-1.jpg', caption: 'Suite parentale, finitions sur mesure.' },
      { type: 'quote', text: "Le luxe, c'est mille décisions invisibles prises correctement." },
    ],
  },
]

export const getArticle = (slug: string) => ARTICLES.find((a) => a.slug === slug)
export const featuredArticle = () => ARTICLES.find((a) => a.featured) ?? ARTICLES[0]

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
