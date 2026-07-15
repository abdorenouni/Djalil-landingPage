import { client, urlFor } from './sanity'
import { ARTICLES, type Article, type Block } from '@/data/journal'
import { PROJECTS, type Project } from '@/data/projects'
import { UNIVERS, type Univers } from '@/data/univers'

export { formatDate } from '@/data/journal'

// ── Helpers ──────────────────────────────────────────────────────

function sanityImageUrl(img: any): string {
  if (!img?.asset) return ''
  return urlFor(img).url()
}

// ── Projects ─────────────────────────────────────────────────────

const PROJECT_QUERY = `*[_type == "project"] | order(order asc) {
  name, "slug": slug.current, tagline, location, year, status,
  featured, cover, gallery, description, stats, order
}`

function mapSanityProject(p: any): Project {
  return {
    slug: p.slug,
    name: p.name,
    tagline: p.tagline || '',
    location: p.location || '',
    year: p.year || '',
    status: p.status || 'En cours',
    cover: sanityImageUrl(p.cover),
    gallery: (p.gallery || []).map((img: any) => sanityImageUrl(img)),
    description: (p.description || []).map((b: any) => b.children?.map((c: any) => c.text).join('') || ''),
    stats: (p.stats || []).map((s: any) => ({ n: s.number, l: s.label })),
    to: `/projets/${p.slug}`,
    featured: p.featured || false,
  }
}

export async function fetchProjects(): Promise<Project[]> {
  try {
    const data = await client.fetch(PROJECT_QUERY)
    if (data?.length) return data.map(mapSanityProject)
  } catch { /* fallback */ }
  return PROJECTS
}

export async function fetchProject(slug: string): Promise<Project | undefined> {
  // Always use local static data for magnolia — Sanity doesn't have the new
  // galleryItems, beach-themed content, or updated images.
  if (slug === 'magnolia') return PROJECTS.find((p) => p.slug === slug)
  try {
    const data = await client.fetch(
      `*[_type == "project" && slug.current == $slug][0]{ name, "slug": slug.current, tagline, location, year, status, featured, cover, gallery, description, stats }`,
      { slug }
    )
    if (data) return mapSanityProject(data)
  } catch { /* fallback */ }
  return PROJECTS.find((p) => p.slug === slug)
}

// ── Articles ─────────────────────────────────────────────────────

const ARTICLE_LIST_QUERY = `*[_type == "article"] | order(date desc) {
  title, "slug": slug.current, category, excerpt,
  cover, date, readMinutes, author, featured
}`

function mapSanityArticleMeta(a: any): Omit<Article, 'body'> & { body: Block[] } {
  let cat = a.category || 'Architecture'
  if (cat === 'ASTERIA' || cat === 'Marché') {
    cat = 'Investissement'
  }
  return {
    slug: a.slug,
    title: a.title,
    category: cat as any,
    excerpt: a.excerpt || '',
    cover: sanityImageUrl(a.cover),
    date: a.date?.split('T')[0] || '',
    readMinutes: a.readMinutes || 5,
    author: a.author || 'Elite Promotion',
    featured: a.featured || false,
    body: [],
  }
}

export async function fetchArticles(): Promise<Article[]> {
  try {
    const data = await client.fetch(ARTICLE_LIST_QUERY)
    if (data?.length) return data.map(mapSanityArticleMeta)
  } catch { /* fallback */ }
  return ARTICLES
}

const ARTICLE_DETAIL_QUERY = `*[_type == "article" && slug.current == $slug][0]{
  title, "slug": slug.current, category, excerpt,
  cover, date, readMinutes, author, featured, body
}`

function mapSanityBody(body: any[]): Block[] {
  if (!body) return []
  return body.map((block) => {
    if (block._type === 'image') {
      return { type: 'image' as const, src: sanityImageUrl(block), caption: block.caption || '' }
    }
    const text = block.children?.map((c: any) => c.text).join('') || ''
    if (block.style === 'h2') return { type: 'h2' as const, text }
    if (block.style === 'blockquote') return { type: 'quote' as const, text }
    return { type: 'p' as const, text }
  })
}

export async function fetchArticle(slug: string): Promise<Article | undefined> {
  try {
    const data = await client.fetch(ARTICLE_DETAIL_QUERY, { slug })
    if (data) {
      const meta = mapSanityArticleMeta(data)
      return { ...meta, body: mapSanityBody(data.body) }
    }
  } catch { /* fallback */ }
  return ARTICLES.find((a) => a.slug === slug)
}

// ── FAQ ──────────────────────────────────────────────────────────

export interface FaqItem { q: string; a: string }

const FAQ_QUERY = `*[_type == "faq"] | order(order asc) { question, answer }`

const FAQ_FALLBACK: FaqItem[] = [
  { q: "Qu'est-ce qui distingue ASTERIA des autres résidences à Alger ?", a: "ASTERIA est la première résidence en Algérie à intégrer l'eau comme matériau architectural : cascades suspendues entre les étages, piscines à débordement privatives et bassins paysagers. S'y ajoutent des plafonds étoilés en fibre optique, une façade sculpturale signée et des espaces communs dignes d'un hôtel cinq étoiles. Ce n'est pas un simple immeuble, c'est une adresse." },
  { q: 'Quelles sont les superficies et typologies disponibles ?', a: "Nous proposons principalement des F3 (3 pièces) de 103 à 110 m², conçus pour offrir un volume généreux et des espaces de vie lumineux. Chaque appartement bénéficie de finitions haut de gamme, d'une terrasse privative et d'une attention architecturale jusque dans les moindres détails." },
  { q: "Comment se déroule le parcours d'acquisition ?", a: "Le processus est fluide et entièrement accompagné : prise de contact avec un conseiller dédié, visite privée sur rendez vous, présentation des plans et des finitions, réservation avec accompagnement administratif complet, puis remise des clés. Un interlocuteur unique vous suit de la première visite à l'emménagement." },
  { q: 'Quelles sont les modalités de paiement ?', a: "Nous proposons des plans de paiement échelonnés, adaptés à votre situation. Les modalités exactes (montant de la réservation, échéancier et conditions) sont présentées lors de votre rendez vous avec un conseiller, en toute confidentialité. Chaque plan est conçu sur mesure." },
  { q: "Puis-je visiter la résidence avant de m’engager ?", a: "Bien sûr. Nous organisons des visites privées sur rendez vous, adaptées à votre emploi du temps. Vous serez accueilli par un conseiller qui vous présentera la résidence, les matériaux, les vues et les espaces communs, sans engagement, dans un cadre confidentiel." },
  { q: 'Comment Elite garantit-elle le respect des délais ?', a: "Le respect des délais est un engagement contractuel, pas une promesse. Les dates de livraison sont inscrites dans le contrat de réservation. Notre historique affiche 100 % de projets livrés dans les temps annoncés, c'est l'un des piliers de notre réputation." },
  { q: 'Quels matériaux et finitions sont utilisés ?', a: "Chaque résidence Elite utilise des matériaux sélectionnés pour leur durabilité et leur esthétique : marbre, bois noble, menuiserie aluminium haut de gamme, robinetterie de marque et isolation thermique et phonique renforcée. Les finitions sont livrées clé en main, prêt à vivre, sans travaux supplémentaires." },
  { q: 'Les résidences sont-elles éligibles aux prêts bancaires ?', a: "Oui. Nos projets sont conformes aux exigences des établissements bancaires algériens pour l'obtention d'un crédit immobilier. Notre équipe peut vous orienter dans les démarches et vous fournir l'ensemble des documents nécessaires au montage de votre dossier." },
]

export async function fetchFaq(): Promise<FaqItem[]> {
  try {
    const data = await client.fetch(FAQ_QUERY)
    if (data?.length) return data.map((d: any) => ({ q: d.question, a: d.answer }))
  } catch { /* fallback */ }
  return FAQ_FALLBACK
}

// ── Univers ──────────────────────────────────────────────────────

const UNIVERS_QUERY = `*[_type == "univers"] | order(order asc) {
  title, "slug": slug.current, num, kicker, tagline,
  hero, intro, variant, show3D, features, gallery, quote, stats
}`

function mapSanityUnivers(u: any): Univers {
  return {
    slug: u.slug,
    num: u.num || '',
    kicker: u.kicker || "L'Univers Elite",
    title: u.title,
    tagline: u.tagline || '',
    hero: sanityImageUrl(u.hero),
    intro: typeof u.intro === 'string' ? u.intro.split('\n\n') : [u.intro || ''],
    features: (u.features || []).map((f: any) => ({ title: f.title, text: f.text })),
    gallery: (u.gallery || []).map((g: any) => ({ src: sanityImageUrl(g.image), caption: g.caption || '' })),
    quote: u.quote || '',
    stats: (u.stats || []).map((s: any) => ({ n: s.number, l: s.label })),
    variant: u.variant || 'gallery',
    show3D: u.show3D || false,
  }
}

export async function fetchUniversList(): Promise<Univers[]> {
  try {
    const data = await client.fetch(UNIVERS_QUERY)
    if (data?.length) return data.map(mapSanityUnivers)
  } catch { /* fallback */ }
  return UNIVERS
}

export async function fetchUnivers(slug: string): Promise<Univers | undefined> {
  try {
    const data = await client.fetch(
      `*[_type == "univers" && slug.current == $slug][0]{ title, "slug": slug.current, num, kicker, tagline, hero, intro, variant, show3D, features, gallery, quote, stats }`,
      { slug }
    )
    if (data) return mapSanityUnivers(data)
  } catch { /* fallback */ }
  return UNIVERS.find((u) => u.slug === slug)
}

// ── Site Settings ────────────────────────────────────────────────

const SETTINGS_QUERY = `*[_type == "siteSettings"][0]`

export async function fetchSettings() {
  try {
    const data = await client.fetch(SETTINGS_QUERY)
    if (data) return data
  } catch { /* fallback */ }
  return null
}

// ── À Propos page ────────────────────────────────────────────────

export async function fetchApropos() {
  try {
    const data = await client.fetch(`*[_type == "apropos"][0]`)
    if (data) return data
  } catch { /* fallback */ }
  return null
}

// ── ASTERIA page ─────────────────────────────────────────────────

const ASTERIA_QUERY = `*[_type == "asteria"][0]{
  heroEyebrow, heroTitle, heroSubtitle, heroImage,
  f3UnitsEyebrow, f3UnitsTitle, f3Units,
  f4UnitsEyebrow, f4UnitsTitle, f4Units,
  villasEyebrow, villasTitle, villas,
  ctaTitle, ctaLabel, ctaLink
}`

export async function fetchAsteria() {
  try {
    const data = await client.fetch(ASTERIA_QUERY)
    if (data) return data
  } catch { /* fallback */ }
  return null
}
