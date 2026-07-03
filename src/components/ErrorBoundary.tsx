import { Component, type ReactNode } from 'react'
import { TEAL } from '@/components/custom/lux'

interface Props { children: ReactNode }
interface State { hasError: boolean; error: Error | null }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', border: `1.5px solid ${TEAL}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', color: TEAL, fontSize: 28 }}>!</div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 28, fontWeight: 400, margin: '0 0 16px' }}>Une erreur est survenue</h1>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, color: 'rgba(var(--text-rgb),0.6)', lineHeight: 1.7, margin: '0 0 32px' }}>
            Nous nous excusons pour ce désagrément. Veuillez rafraîchir la page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: '12px 32px', background: TEAL, color: '#04211e', border: 'none', borderRadius: 999, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', cursor: 'pointer' }}
          >
            Rafraîchir la page
          </button>
        </div>
      </div>
    )
  }
}
