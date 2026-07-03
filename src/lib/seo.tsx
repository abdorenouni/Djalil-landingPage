/**
 * SEO foundation — per-page metadata + JSON-LD structured data.
 * Uses React 19 native metadata hoisting (<title>/<meta>/<link> render anywhere
 * and React lifts them into <head>). No external dependency.
 *
 * NOTE: update SITE_URL once a custom domain is connected.
 */

export const SITE_URL = 'https://djalil-landing-page.vercel.app'
export const SITE_NAME = 'Elite Promotion Immobilière'
export const DEFAULT_TITLE = 'Elite Promotion Immobilière — Résidences de Prestige en Algérie'
export const DEFAULT_DESC =
  "Promoteur immobilier de luxe en Algérie. Découvrez ASTERIA et nos résidences de prestige — architecture d'exception, finitions haut standing, art de vivre."
export const DEFAULT_OG = '/images/asteria/building-hero.jpg'
export const INSTAGRAM = 'https://instagram.com/elite_reallestate'

const abs = (path: string) => (path.startsWith('http') ? path : SITE_URL + path)

import { useSiteSettings } from './useSiteSettings'
import { urlFor } from './sanity'

export function Seo({
  title,
  description,
  path = '/',
  image,
  type = 'website',
  jsonLd,
}: {
  title?: string
  description?: string
  path?: string
  image?: string
  type?: 'website' | 'article'
  jsonLd?: object | object[]
}) {
  const settings = useSiteSettings()
  const siteName = settings?.brandName || SITE_NAME
  const defaultTitle = settings?.seoTitle || DEFAULT_TITLE
  const defaultDesc = settings?.seoDescription || DEFAULT_DESC
  const defaultOg = settings?.ogImage?.asset ? urlFor(settings.ogImage).width(1200).url() : DEFAULT_OG

  const finalDesc = description || defaultDesc
  const finalImg = image || defaultOg
  const fullTitle = title ? `${title} — ${siteName}` : defaultTitle
  const url = abs(path)
  const img = abs(finalImg)
  const blocks = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : []

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={finalDesc} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalDesc} />
      <meta name="twitter:image" content={img} />

      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }} />
      ))}
    </>
  )
}

/* ── JSON-LD builders ── */

// Pass the live siteSettings so the structured-data phone/socials track the CMS
// single source of truth instead of drifting from a hardcoded literal.
export const organizationLd = (s?: { phone?: string; instagram?: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: SITE_NAME,
  url: SITE_URL,
  logo: abs('/images/elite-logo.png'),
  image: abs(DEFAULT_OG),
  description: DEFAULT_DESC,
  areaServed: 'Algérie',
  address: { '@type': 'PostalAddress', addressLocality: 'Alger', addressCountry: 'DZ' },
  telephone: (s?.phone || '+213 779 52 79 48').replace(/\s/g, ''),
  sameAs: [s?.instagram || INSTAGRAM],
})

export const residenceLd = (p: { name: string; description: string; image: string; location: string; path: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'ApartmentComplex',
  name: p.name,
  description: p.description,
  image: abs(p.image),
  url: abs(p.path),
  address: { '@type': 'PostalAddress', addressLocality: p.location, addressCountry: 'DZ' },
  developer: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
})

export const articleLd = (a: { title: string; description: string; image: string; date: string; author: string; path: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: a.title,
  description: a.description,
  image: abs(a.image),
  datePublished: a.date,
  author: { '@type': 'Organization', name: a.author },
  publisher: { '@type': 'Organization', name: SITE_NAME, logo: { '@type': 'ImageObject', url: abs('/images/elite-logo.png') } },
  mainEntityOfPage: abs(a.path),
})

export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path) })),
})
