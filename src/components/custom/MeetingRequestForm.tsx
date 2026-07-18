import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, MessageCircle, Video } from 'lucide-react'
import { BezelCard, TEAL, EASE } from '@/components/custom/lux'
import { useSiteSettings } from '@/lib/useSiteSettings'

/**
 * "Demander une réunion Zoom" — posts to the Laravel backend
 * (elite-backend). Configure the API origin via VITE_BACKEND_URL;
 * defaults to same-origin so a reverse proxy setup needs no env at all.
 *
 * Shared between /rendez-vous (its own page) and the Contact section
 * (home page) so both offer the exact same meeting-request form.
 */
const BACKEND = ((import.meta.env.VITE_BACKEND_URL as string | undefined) || '').replace(/\/$/, '')

type FormState = {
  full_name: string
  email: string
  phone: string
  preferred_date: string
  preferred_time: string
  message: string
}

const EMPTY: FormState = {
  full_name: '', email: '', phone: '',
  preferred_date: '', preferred_time: '10:00', message: '',
}

const FALLBACK_WHATSAPP = '213550363604'

const cleanWaNumber = (n: string) => {
  const d = n.replace(/\D/g, '')
  return (d.startsWith('0') && d.length === 10) ? '213' + d.slice(1) : d
}

/** Pre-filled WhatsApp message used when the backend is unreachable. */
function buildWaUrl(whatsapp: string, f: FormState): string {
  const lines = [
    'Bonjour Elite Promotion, je souhaite planifier une réunion Zoom.',
    '',
    `Nom : ${f.full_name.trim()}`,
    `Téléphone : ${f.phone.trim()}`,
    `Email : ${f.email.trim()}`,
    `Date souhaitée : ${f.preferred_date} à ${f.preferred_time}`,
    f.message.trim() ? `Message : ${f.message.trim()}` : '',
  ].filter(Boolean)
  return `https://wa.me/${cleanWaNumber(whatsapp)}?text=${encodeURIComponent(lines.join('\n'))}`
}

const inputStyle: React.CSSProperties = {
  width: '100%', minWidth: 0, boxSizing: 'border-box', padding: '13px 16px', background: 'rgba(var(--line-rgb),0.03)',
  border: '1px solid rgba(var(--line-rgb),0.12)', borderRadius: 8,
  color: 'var(--text)', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14.5,
  outline: 'none', transition: 'border-color 0.3s ease',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11,
  letterSpacing: '0.14em', textTransform: 'uppercase',
  color: 'rgba(var(--text-rgb),0.55)', marginBottom: 8,
}

export default function MeetingRequestForm() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'fallback'>('idle')
  const [reference, setReference] = useState('')

  const settings = useSiteSettings()
  const waUrl = buildWaUrl(settings?.whatsapp || FALLBACK_WHATSAPP, form)

  const update = (k: keyof FormState, v: string) => {
    setForm((f) => ({ ...f, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: [] }))
  }

  /** Client-side required check so the WhatsApp fallback never fires on an empty form. */
  const missingRequired = () => {
    const missing: Record<string, string[]> = {}
    if (!form.full_name.trim()) missing.full_name = ['Le nom est requis.']
    if (!form.email.trim()) missing.email = ["L'email est requis."]
    if (!form.phone.trim()) missing.phone = ['Le téléphone est requis.']
    if (!form.preferred_date) missing.preferred_date = ['La date est requise.']
    if (!form.preferred_time) missing.preferred_time = ["L'heure est requise."]
    return missing
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    const missing = missingRequired()
    if (Object.keys(missing).length) { setErrors(missing); return }
    setStatus('sending')
    setErrors({})
    try {
      const res = await fetch(`${BACKEND}/api/meeting-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...form, message: form.message || null }),
      })
      const body = await res.json().catch(() => null)
      if (res.status === 201) {
        setReference(body?.reference || '')
        setStatus('sent')
      } else if (res.status === 422 && body?.errors) {
        setErrors(body.errors)
        setStatus('idle')
      } else {
        // Backend absent ou réponse inattendue (ex. SPA hébergée sans API) :
        // on bascule sur WhatsApp pour que la demande aboutisse toujours.
        openWhatsAppFallback()
      }
    } catch {
      openWhatsAppFallback()
    }
  }

  const openWhatsAppFallback = () => {
    window.open(waUrl, '_blank', 'noopener,noreferrer')
    setStatus('fallback')
  }

  const err = (k: string) => errors[k]?.[0]

  const field = (k: keyof FormState, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div style={{ minWidth: 0 }}>
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
    <BezelCard padding="clamp(26px, 4vw, 44px)">
      {status === 'fallback' ? (
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: EASE }} style={{ textAlign: 'center', padding: 'clamp(20px, 4vw, 40px) 0' }}>
          <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1], delay: 0.1 }}
            style={{ width: 72, height: 72, borderRadius: '50%', border: `1.5px solid ${TEAL}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: TEAL, boxShadow: `0 0 30px ${TEAL}33` }}>
            <MessageCircle size={30} />
          </motion.div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 26, fontWeight: 400, margin: '0 0 12px' }}>Finalisez sur WhatsApp</h2>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, color: 'rgba(var(--text-rgb),0.6)', lineHeight: 1.7, maxWidth: 440, margin: '0 auto' }}>
            WhatsApp s'est ouvert avec votre demande pré-remplie — il ne reste qu'à appuyer sur <strong style={{ color: 'var(--text)' }}>Envoyer</strong>.
            Si rien ne s'est ouvert, utilisez le bouton ci-dessous.
          </p>
          <a
            href={waUrl} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 24, padding: '13px 30px', background: TEAL, color: '#04211e', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: 999, boxShadow: `0 10px 34px ${TEAL}30` }}
          >
            <MessageCircle size={16} /> Ouvrir WhatsApp
          </a>
          <div>
            <button
              onClick={() => setStatus('idle')}
              style={{ marginTop: 20, background: 'none', border: 'none', color: 'rgba(var(--text-rgb),0.45)', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}
            >
              Revenir au formulaire
            </button>
          </div>
        </motion.div>
      ) : status === 'sent' ? (
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

            <button
              type="submit" disabled={status === 'sending'} className="magnetic-cta is-solid"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '15px 28px', background: TEAL, color: '#04211e', border: 'none', borderRadius: 999, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13.5, fontWeight: 600, letterSpacing: '0.06em', cursor: status === 'sending' ? 'wait' : 'pointer', opacity: status === 'sending' ? 0.7 : 1, boxShadow: `0 10px 34px ${TEAL}30` }}
            >
              <Video size={17} />
              {status === 'sending' ? 'Envoi en cours…' : 'Demander la réunion'}
            </button>
          </div>

          <style>{`
            @media (max-width: 640px){ .rv-row{ grid-template-columns:1fr !important; } }
            /* Native iOS date/time inputs ignore width:100% + box-sizing and
               keep an intrinsic width, so they overflow the container on
               mobile. Stripping the native appearance turns them into normal
               boxes that respect the field width; the tap-to-open picker still
               works. */
            input[type="date"], input[type="time"] {
              -webkit-appearance: none; appearance: none;
              color-scheme: dark; min-height: 48px; min-width: 0; max-width: 100%;
            }
            html:not([data-theme="dark"]) input[type="date"], html:not([data-theme="dark"]) input[type="time"] { color-scheme: light; }
            /* iOS centres the value and renders it (and the empty jj/mm/aaaa
               placeholder) in a faint tone — left-align it and force the theme
               text colour so the boxes read like the other fields. */
            input[type="date"]::-webkit-date-and-time-value,
            input[type="time"]::-webkit-date-and-time-value { text-align: left; margin: 0; }
            input[type="date"]::-webkit-datetime-edit,
            input[type="time"]::-webkit-datetime-edit { color: var(--text); padding: 0; line-height: 1.2; }
          `}</style>
        </form>
      )}
    </BezelCard>
  )
}
