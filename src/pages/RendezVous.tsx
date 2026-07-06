import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Video } from 'lucide-react'
import { BezelCard, TEAL, EASE } from '@/components/custom/lux'
import Header from '@/components/custom/Header'
import SiteFooter from '@/components/custom/SiteFooter'
import { Seo, breadcrumbLd } from '@/lib/seo'

/**
 * "Demander une réunion Zoom" — posts to the Laravel backend
 * (elite-backend). Configure the API origin via VITE_BACKEND_URL;
 * defaults to same-origin so a reverse proxy setup needs no env at all.
 */
const BACKEND = ((import.meta.env.VITE_BACKEND_URL as string | undefined) || '').replace(/\/$/, '')

type FormState = {
  full_name: string
  email: string
  phone: string
  company: string
  preferred_date: string
  preferred_time: string
  message: string
}

const EMPTY: FormState = {
  full_name: '', email: '', phone: '', company: '',
  preferred_date: '', preferred_time: '10:00', message: '',
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '13px 16px', background: 'rgba(var(--line-rgb),0.03)',
  border: '1px solid rgba(var(--line-rgb),0.12)', borderRadius: 8,
  color: 'var(--text)', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14.5,
  outline: 'none', transition: 'border-color 0.3s ease',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11,
  letterSpacing: '0.14em', textTransform: 'uppercase',
  color: 'rgba(var(--text-rgb),0.55)', marginBottom: 8,
}

export default function RendezVous() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [reference, setReference] = useState('')

  const update = (k: keyof FormState, v: string) => {
    setForm((f) => ({ ...f, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: [] }))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    setErrors({})
    try {
      const res = await fetch(`${BACKEND}/api/meeting-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...form, company: form.company || null, message: form.message || null }),
      })
      const body = await res.json().catch(() => null)
      if (res.status === 201) {
        setReference(body?.reference || '')
        setStatus('sent')
      } else if (res.status === 422) {
        setErrors(body?.errors || {})
        setStatus('idle')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const err = (k: string) => errors[k]?.[0]

  const field = (k: keyof FormState, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label htmlFor={`rv-${k}`} style={labelStyle}>{label}</label>
      <input
        id={`rv-${k}`} style={{ ...inputStyle, ...(err(k) ? { borderColor: 'rgba(224,106,106,0.6)' } : {}) }}
        value={form[k]} onChange={(e) => update(k, e.target.value)}
        onFocus={(e) => { e.currentTarget.style.borderColor = TEAL }}
        onBlur={(e) => { e.currentTarget.style.borderColor = err(k) ? 'rgba(224,106,106,0.6)' : 'rgba(var(--line-rgb),0.12)' }}
        {...props}
      />
      {err(k) && <div style={{ color: '#e88', fontSize: 12.5, marginTop: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{err(k)}</div>}
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
      style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh', overflowX: 'hidden' }}
    >
      <Seo
        title="Réunion Zoom"
        description="Planifiez une réunion Zoom avec l'équipe Elite Promotion Immobilière : choisissez votre créneau, un conseiller vous confirme le rendez-vous."
        path="/rendez-vous"
        jsonLd={breadcrumbLd([{ name: 'Accueil', path: '/' }, { name: 'Réunion Zoom', path: '/rendez-vous' }])}
      />
      <Header />

      <section style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(130px, 16vw, 200px) clamp(24px, 5vw, 48px) clamp(80px, 10vw, 140px)' }}>
        <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.15 }} style={{ textAlign: 'center', marginBottom: 'clamp(36px, 5vw, 56px)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
            <div style={{ width: 38, height: 1, background: TEAL }} />
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', color: TEAL }}>Réunion Zoom</span>
            <div style={{ width: 38, height: 1, background: TEAL }} />
          </div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(32px, 6vw, 64px)', fontWeight: 700, margin: 0, lineHeight: 1.05 }}>
            Rencontrons-nous
          </h1>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontStyle: 'italic', fontSize: 'clamp(14px, 1.8vw, 18px)', color: 'rgba(var(--text-rgb),0.55)', margin: '18px auto 0', maxWidth: 480, lineHeight: 1.65 }}>
            Choisissez votre créneau : un conseiller accepte votre demande et vous confirme la réunion.
          </p>
        </motion.div>

        <BezelCard padding="clamp(26px, 4vw, 44px)">
          {status === 'sent' ? (
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: EASE }} style={{ textAlign: 'center', padding: 'clamp(20px, 4vw, 40px) 0' }}>
              <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1], delay: 0.1 }}
                style={{ width: 72, height: 72, borderRadius: '50%', border: `1.5px solid ${TEAL}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: TEAL, boxShadow: `0 0 30px ${TEAL}33` }}>
                <Check size={32} />
              </motion.div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 26, fontWeight: 400, margin: '0 0 12px' }}>Demande envoyée</h2>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, color: 'rgba(var(--text-rgb),0.6)', lineHeight: 1.7, maxWidth: 420, margin: '0 auto' }}>
                Un conseiller va prendre en charge votre demande et vous recevrez une confirmation par email avec le lien Zoom.
              </p>
              {reference && (
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12.5, color: 'rgba(var(--text-rgb),0.4)', marginTop: 18 }}>
                  Référence : {reference}
                </p>
              )}
            </motion.div>
          ) : (
            <form onSubmit={submit} noValidate>
              <div style={{ display: 'grid', gap: 20 }}>
                {field('full_name', 'Nom complet *', { placeholder: 'Votre nom', autoComplete: 'name', required: true })}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }} className="rv-row">
                  {field('email', 'Email *', { type: 'email', placeholder: 'vous@email.com', autoComplete: 'email', required: true })}
                  {field('phone', 'Téléphone *', { type: 'tel', placeholder: '+213 ...', autoComplete: 'tel', required: true })}
                </div>
                {field('company', 'Société', { placeholder: 'Optionnel', autoComplete: 'organization' })}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }} className="rv-row">
                  {field('preferred_date', 'Date souhaitée *', { type: 'date', required: true, min: new Date().toISOString().slice(0, 10) })}
                  {field('preferred_time', 'Heure souhaitée *', { type: 'time', required: true })}
                </div>
                <div>
                  <label htmlFor="rv-message" style={labelStyle}>Message</label>
                  <textarea
                    id="rv-message" rows={4} placeholder="Parlez-nous de votre projet…"
                    style={{ ...inputStyle, resize: 'vertical', minHeight: 100 }}
                    value={form.message} onChange={(e) => update('message', e.target.value)}
                    onFocus={(e) => { e.currentTarget.style.borderColor = TEAL }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(var(--line-rgb),0.12)' }}
                  />
                </div>

                {status === 'error' && (
                  <div role="alert" style={{ padding: '12px 16px', borderRadius: 8, border: '1px solid rgba(224,106,106,0.4)', background: 'rgba(224,106,106,0.08)', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: '#e9a4a4' }}>
                    L'envoi a échoué. Vérifiez votre connexion et réessayez.
                  </div>
                )}

                <button
                  type="submit" disabled={status === 'sending'} className="magnetic-cta is-solid"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '15px 28px', background: TEAL, color: '#04211e', border: 'none', borderRadius: 999, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13.5, fontWeight: 600, letterSpacing: '0.06em', cursor: status === 'sending' ? 'wait' : 'pointer', opacity: status === 'sending' ? 0.7 : 1, boxShadow: `0 10px 34px ${TEAL}30` }}
                >
                  <Video size={17} />
                  {status === 'sending' ? 'Envoi en cours…' : 'Demander la réunion'}
                </button>
              </div>
            </form>
          )}
        </BezelCard>
      </section>

      <SiteFooter />

      <style>{`
        @media (max-width: 640px){ .rv-row{ grid-template-columns:1fr !important; } }
        input[type="date"], input[type="time"] { color-scheme: dark; }
        html:not([data-theme="dark"]) input[type="date"], html:not([data-theme="dark"]) input[type="time"] { color-scheme: light; }
      `}</style>
    </motion.div>
  )
}
