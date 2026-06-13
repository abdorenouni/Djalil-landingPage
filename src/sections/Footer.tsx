import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    const content = contentRef.current
    if (!section || !content) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content.querySelectorAll('.footer-reveal'),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 95%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, section)

    return () => ctx.revert()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setEmail('')
      }, 3000)
    }
  }

  return (
    <footer
      ref={sectionRef}
      id="contact"
      style={{
        background: '#050505',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top gold line */}
      <div
        style={{
          width: '100%',
          height: 1,
          background: 'linear-gradient(to right, transparent, #d4af37, transparent)',
          opacity: 0.3,
        }}
      />

      {/* Marquee */}
      <div
        style={{
          overflow: 'hidden',
          padding: '40px 0',
          borderBottom: '1px solid rgba(243, 244, 241, 0.05)',
        }}
      >
        <div
          style={{
            display: 'flex',
            whiteSpace: 'nowrap',
            animation: 'marquee 30s linear infinite',
          }}
        >
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="font-display"
              style={{
                fontSize: 'clamp(48px, 8vw, 100px)',
                fontWeight: 400,
                color: 'transparent',
                WebkitTextStroke: '1px rgba(243, 244, 241, 0.08)',
                letterSpacing: '0.05em',
                paddingRight: 80,
                flexShrink: 0,
              }}
            >
              HAUT STANDING — ALGER — LUXURY —
            </span>
          ))}
        </div>
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>

      {/* Main content */}
      <div
        ref={contentRef}
        style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: 'clamp(60px, 8vw, 120px) clamp(24px, 5vw, 80px)',
        }}
      >
        {/* CTA heading */}
        <div
          className="footer-reveal"
          style={{
            textAlign: 'center',
            marginBottom: 80,
          }}
        >
          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(32px, 5vw, 64px)',
              fontWeight: 400,
              color: '#f3f4f1',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: 16,
              textShadow: '0 0 60px rgba(212, 175, 55, 0.15)',
            }}
          >
            Démarrons Votre
            <br />
            <span style={{ color: '#d4af37' }}>Projet Ensemble</span>
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 16,
              color: 'rgba(243, 244, 241, 0.5)',
              maxWidth: 480,
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            Contactez-nous dès aujourd'hui pour discuter de votre prochain projet immobilier
          </p>
        </div>

        {/* Info grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 40,
            marginBottom: 80,
          }}
          className="footer-grid"
        >
          {/* Column 1: Localisation */}
          <div className="footer-reveal">
            <h4
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: '#d4af37',
                marginBottom: 24,
              }}
            >
              Localisation
            </h4>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                lineHeight: 1.8,
                color: 'rgba(243, 244, 241, 0.6)',
              }}
            >
              12 Rue Didouche Mourad
              <br />
              Alger Centre, 16000
              <br />
              Alger, Algérie
            </p>
          </div>

          {/* Column 2: Contact */}
          <div className="footer-reveal">
            <h4
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: '#d4af37',
                marginBottom: 24,
              }}
            >
              Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <a
                href="tel:+21323123456"
                className="cursor-hover"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                  color: 'rgba(243, 244, 241, 0.6)',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#d4af37' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(243, 244, 241, 0.6)' }}
              >
                +213 23 12 34 56
              </a>
              <a
                href="mailto:contact@djalilpromotion.dz"
                className="cursor-hover"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                  color: 'rgba(243, 244, 241, 0.6)',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#d4af37' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(243, 244, 241, 0.6)' }}
              >
                contact@djalilpromotion.dz
              </a>
            </div>
          </div>

          {/* Column 3: Réseaux */}
          <div className="footer-reveal">
            <h4
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: '#d4af37',
                marginBottom: 24,
              }}
            >
              Réseaux Sociaux
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Instagram', 'Facebook', 'LinkedIn'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="cursor-hover"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14,
                    color: 'rgba(243, 244, 241, 0.6)',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#d4af37' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(243, 244, 241, 0.6)' }}
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div className="footer-reveal">
            <h4
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: '#d4af37',
                marginBottom: 24,
              }}
            >
              Newsletter
            </h4>
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: 'flex',
                  borderBottom: '1px solid rgba(243, 244, 241, 0.2)',
                  paddingBottom: 8,
                }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre email"
                  required
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14,
                    color: '#f3f4f1',
                    padding: 0,
                  }}
                />
                <button
                  type="submit"
                  className="cursor-hover"
                  style={{
                    background: submitted ? 'transparent' : '#d4af37',
                    color: submitted ? '#d4af37' : '#050505',
                    border: 'none',
                    padding: '8px 20px',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 11,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    borderRadius: 3,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {submitted ? 'Envoyé ✓' : 'Envoyer'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid rgba(243, 244, 241, 0.05)',
            paddingTop: 32,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 8,
            }}
          >
            <span
              className="font-display"
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#f3f4f1',
                letterSpacing: '0.1em',
              }}
            >
              DJALIL
            </span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 8,
                fontWeight: 400,
                letterSpacing: '0.3em',
                color: '#d4af37',
                textTransform: 'uppercase',
              }}
            >
              Promotion
            </span>
          </div>

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              color: 'rgba(243, 244, 241, 0.3)',
            }}
          >
            © 2025 Djalil Promotion. Tous droits réservés.
          </p>

          <div style={{ display: 'flex', gap: 24 }}>
            {['Politique de confidentialité', 'Mentions légales'].map((link) => (
              <a
                key={link}
                href="#"
                className="cursor-hover"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 11,
                  color: 'rgba(243, 244, 241, 0.3)',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(243, 244, 241, 0.6)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(243, 244, 241, 0.3)' }}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  )
}
