import { useEffect, useState } from 'react'
import { fetchSettings } from './queries'

export interface BlockChild { text?: string }
export interface Block { children?: BlockChild[] }
export interface SanityImage { asset?: { _ref?: string } }
export interface Stat { _key?: string; number: string; label: string }
export interface SignatureItem { _key?: string; image?: SanityImage; title?: string; text?: string }
export interface ProcessusStep { _key?: string; icon?: string; title?: string; text?: string }

export interface SiteSettings {
  brandName?: string
  tagline?: string
  heroHeadline?: string
  heroSubtext?: string

  aboutEyebrow?: string
  aboutTitle1?: string
  aboutTitle2?: string
  aboutText?: Block[]
  aboutImage?: SanityImage
  aboutCtaLabel?: string
  stats?: Stat[]

  signatureEyebrow?: string
  signatureTitle?: string
  signatureItems?: SignatureItem[]

  processusEyebrow?: string
  processusTitle?: string
  processusSteps?: ProcessusStep[]
  processusCtaLabel?: string

  projectsIntroEyebrow?: string
  projectsIntroTitle1?: string
  projectsIntroTitle2?: string

  showcase3DEyebrow?: string
  showcase3DTitle1?: string
  showcase3DTitle2?: string
  showcase3DSubtitle?: string

  email?: string
  phone?: string
  phone2?: string
  address?: string
  whatsapp?: string
  instagram?: string
  facebook?: string

  seoTitle?: string
  seoDescription?: string
  ogImage?: SanityImage
}

let cached: SiteSettings | null = null
let cachePromise: Promise<SiteSettings | null> | null = null

function getSettings(): Promise<SiteSettings | null> {
  if (cached) return Promise.resolve(cached)
  if (!cachePromise) {
    cachePromise = fetchSettings().then((data) => {
      if (data) cached = data as SiteSettings
      return cached
    })
  }
  return cachePromise
}

export function useSiteSettings(): SiteSettings | null {
  const [settings, setSettings] = useState<SiteSettings | null>(cached)
  useEffect(() => {
    if (cached) { setSettings(cached); return }
    getSettings().then((s) => s && setSettings(s))
  }, [])
  return settings
}

export function aboutTextToString(blocks?: SiteSettings['aboutText']): string[] {
  if (!blocks) return []
  return blocks
    .map((b) => b.children?.map((c) => c.text || '').join('') || '')
    .filter(Boolean)
}
