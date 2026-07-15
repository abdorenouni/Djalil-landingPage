/**
 * Single source of truth for the global site navigation.
 * Used by the home Header, the interior-page InteriorNav, and SiteFooter so the
 * menu is identical everywhere (fixes the "menu incohérent selon les pages"
 * issue from the QA report). All entries are real routes — Contact points to
 * the dedicated /contact page, not the #contact hash.
 */
export interface GlobalNavItem {
  label: string
  to: string
}

export const GLOBAL_NAV: GlobalNavItem[] = [
  { label: 'Accueil', to: '/' },
  { label: 'À Propos', to: '/a-propos' },
  { label: 'Projets', to: '/projets' },
  { label: 'Le Journal', to: '/journal' },
  { label: 'Meeting And Zoom', to: '/rendez-vous' },
  { label: 'Contact', to: '/contact' },
]

/** True when `to` is the active route for the given pathname. */
export function isActive(to: string, pathname: string): boolean {
  if (to === '/') return pathname === '/'
  return pathname === to || pathname.startsWith(to + '/')
}
