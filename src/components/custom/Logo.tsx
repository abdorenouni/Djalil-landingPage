/**
 * Brand logo that adapts to the surface:
 *  - light theme on a light surface  → dark-text version
 *  - dark theme OR a .force-dark scope (over a photo) → white-text version
 * Visibility is driven purely by CSS (see index.css) so it follows the theme
 * toggle and the force-dark wrappers without JS. Do NOT set `display` in `style`.
 */
export default function Logo({ style, alt = 'Elite Promotion Immobilière' }: { style?: React.CSSProperties; alt?: string }) {
  return (
    <span className="logo-wrap" style={{ display: 'inline-flex', alignItems: 'center' }}>
      <img src="/images/elite-logo-light.png" alt={alt} className="logo-on-light" style={{ width: 'auto', ...style }} />
      <img src="/images/elite-logo.png" alt="" aria-hidden="true" className="logo-on-dark" style={{ width: 'auto', ...style }} />
    </span>
  )
}
