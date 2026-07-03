import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

type Theme = 'light' | 'dark'
const KEY = 'elite-theme'

function getInitial(): Theme {
  if (typeof window === 'undefined') return 'light'
  try {
    const s = localStorage.getItem(KEY)
    if (s === 'light' || s === 'dark') return s
  } catch { /* ignore */ }
  return 'light' // white by default
}

function applyTheme(theme: Theme) {
  const el = document.documentElement
  if (theme === 'dark') el.setAttribute('data-theme', 'dark')
  else el.removeAttribute('data-theme')
}

/**
 * Light/dark theme switch. Light is the default; choice persists in
 * localStorage. The matching no-flash init lives inline in index.html.
 */
export default function ThemeToggle({ size = 38, light = false }: { size?: number; light?: boolean }) {
  const [theme, setTheme] = useState<Theme>(getInitial)

  useEffect(() => {
    applyTheme(theme)
    try { localStorage.setItem(KEY, theme) } catch { /* ignore */ }
  }, [theme])

  const isDark = theme === 'dark'
  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Passer au thème clair' : 'Passer au thème sombre'}
      title={isDark ? 'Thème clair' : 'Thème sombre'}
      style={{
        width: size, height: size, flexShrink: 0,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: '50%', cursor: 'pointer',
        background: 'transparent',
        border: `1px solid ${light ? 'rgba(255,255,255,0.22)' : 'rgba(var(--line-rgb),0.18)'}`,
        color: light ? 'rgba(255,255,255,0.85)' : 'rgba(var(--text-rgb),0.75)',
        transition: 'border-color 0.3s ease, color 0.3s ease, background 0.3s ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2bbdb0'; e.currentTarget.style.color = '#2bbdb0' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = light ? 'rgba(255,255,255,0.22)' : 'rgba(var(--line-rgb),0.18)'; e.currentTarget.style.color = light ? 'rgba(255,255,255,0.85)' : 'rgba(var(--text-rgb),0.75)' }}
    >
      {isDark ? <Sun size={size * 0.45} /> : <Moon size={size * 0.45} />}
    </button>
  )
}
