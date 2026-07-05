import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, MessageCircle, Instagram, Facebook, Send, Check, ArrowUpRight } from 'lucide-react'
import { WordReveal, BezelCard, TEAL, GOLD, EASE } from '@/components/custom/lux'
import { checkRateLimit } from '@/lib/security'
import { useSiteSettings } from '@/lib/useSiteSettings'
import SiteFooter from '@/components/custom/SiteFooter'

const FALLBACK_WHATSAPP = '213779527948'
const FALLBACK_PHONE_1 = '+213 779 52 79 48'
const FALLBACK_PHONE_2 = '+213 550 36 36 04'
const FALLBACK_EMAIL = 'mar.elitee@gmail.com'
const FALLBACK_ADDRESS = 'Alger, Algérie'
const FALLBACK_INSTAGRAM = 'https://instagram.com/elite_reallestate'

// Email endpoint (Google Apps Script web-app /exec URL). When set, the form
// sends the lead by email to the agency; when empty, it falls back to the
// WhatsApp pre-filled message so the form always works out of the box.
// Set it via the VITE_CONTACT_ENDPOINT env var OR paste it in the fallback
// below (committed value — no Vercel dashboard needed).
const CONTACT_ENDPOINT_FALLBACK = 'https://script.google.com/macros/s/AKfycbyu73h_rWwlJ5awC8dojsDW1CSoQ8xK561OamZYuPe4UTRlDWDBjdoVYG4tKTPIhPBp/exec'
const CONTACT_ENDPOINT = ((import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined)?.trim()) || CONTACT_ENDPOINT_FALLBACK

type FormState = { nom: string; telephone: string; email: string; sujet: string; message: string }
type Status = 'idle' | 'sending' | 'sent' | 'error'
type Errors = Partial<Record<'nom' | 'telephone' | 'email' | 'message', string>>

const cleanWaNumber = (n: string) => {
  const d = n.replace(/\D/g, '')
  // Local Algerian format 0XXXXXXXXX → international 213XXXXXXXXX
  if (d.startsWith('0') && d.length === 10) return '213' + d.slice(1)
  return d
}

function buildWhatsAppUrl(whatsapp: string, f: FormState): string {
  const lines = [
    'Bonjour Elite Promotion Immobilière,',
    '',
    `Nom : ${f.nom.trim()}`,
    `Téléphone : ${f.telephone.trim()}`,
    `Email : ${f.email.trim()}`,
    `Sujet : ${f.sujet}`,
    '',
    `Message : ${f.message.trim()}`,
  ]
  return `https://wa.me/${cleanWaNumber(whatsapp)}?text=${encodeURIComponent(lines.join('\n'))}`
}

export default function Contact() {
  const settings = useSiteSettings()
  const WHATSAPP = settings?.whatsapp || FALLBACK_WHATSAPP
  const PHONE_1 = settings?.phone || FALLBACK_PHONE_1
  const PHONE_2 = settings?.phone2 || FALLBACK_PHONE_2
  const EMAIL = settings?.email || FALLBACK_EMAIL
  const ADDRESS = settings?.address || FALLBACK_ADDRESS
  const INSTAGRAM = settings?.instagram || FALLBACK_INSTAGRAM

  const [form, setForm] = useState<FormState>({ nom: '', telephone: '', email: '', sujet: 'Visite privée', message: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')
  const sent = status === 'sent'
  const waUrl = buildWhatsAppUrl(WHATSAPP, form)

  const update = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }))
    if (errors[k as keyof Errors]) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const validate = (): Errors => {
    const e: Errors = {}
    if (!form.nom.trim()) e.nom = 'Veuillez indiquer votre nom'
    if (!/^[0-9+\s().-]{8,}$/.test(form.telephone.trim())) e.telephone = 'Numéro de téléphone invalide'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Adresse email invalide'
    if (!form.message.trim()) e.message = 'Votre message est vide'
    setErrors(e)
    return e
  }

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (status === 'sending') return
    const e = validate()
    const firstInvalid = (['nom', 'telephone', 'email', 'message'] as const).find((k) => e[k])
    if (firstInvalid) {
      document.getElementById('cf-' + firstInvalid)?.focus()
      return
    }
    if (!checkRateLimit('contact-form', 3, 60_000)) {
      setErrors({ message: 'Trop de soumissions. Veuillez réessayer dans une minute.' })
      return
    }

    // Preferred path: send the lead by email through the configured endpoint
    // (Google Apps Script web app → Gmail). Success is shown ONLY after the
    // server confirms — no fake success. If no endpoint is configured, fall
    // back to opening WhatsApp with the pre-filled message.
    if (!CONTACT_ENDPOINT) {
      window.open(waUrl, '_blank', 'noopener,noreferrer')
      setStatus('sent')
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        // text/plain avoids a CORS preflight against Apps Script web apps.
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          nom: form.nom.trim(),
          telephone: form.telephone.trim(),
          email: form.email.trim(),
          sujet: form.sujet,
          message: form.message.trim(),
          source: 'site web — Elite Promotion',
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.18em',
    textTransform: 'uppercase', color: 'rgba(var(--text-rgb),0.55)', marginBottom: 9, display: 'block',
  }
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '15px 16px', background: 'rgba(var(--line-rgb),0.03)',
    border: '1px solid rgba(var(--line-rgb),0.1)', borderRadius: 4, color: 'var(--text)',
    fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, outline: 'none',
    transition: 'border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease', boxSizing: 'border-box',
  }
  const focusOn = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = TEAL
    e.currentTarget.style.background = 'rgba(var(--line-rgb),0.05)'
    e.currentTarget.style.boxShadow = `0 0 0 3px ${TEAL}1f`
  }
  const focusOff = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = 'rgba(var(--line-rgb),0.1)'
    e.currentTarget.style.background = 'rgba(var(--line-rgb),0.03)'
    e.currentTarget.style.boxShadow = 'none'
  }
  const errText = (id: string, msg?: string) =>
    msg ? <span id={id} role="alert" style={{ color: '#e06a6a', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, marginTop: 6, display: 'block' }}>{msg}</span> : null

  return (
    <>
      <section id="contact" style={{ position: 'relative', padding: 'clamp(90px, 13vw, 180px) clamp(24px, 5vw, 80px)', overflow: 'hidden', background: 'var(--bg)' }}>
        {/* Uniform themed background — subtle brand glows only, no photo filigrane */}
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '55%', height: '70%', background: `radial-gradient(circle, ${TEAL}12 0%, transparent 62%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-12%', right: '-6%', width: '48%', height: '60%', background: `radial-gradient(circle, ${GOLD}0e 0%, transparent 65%)`, pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1300, margin: '0 auto', position: 'relative' }}>
          {/* Heading */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9, ease: EASE }} style={{ marginBottom: 'clamp(48px, 7vw, 80px)', maxWidth: 720 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <div style={{ width: 38, height: 1, background: TEAL }} />
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', color: TEAL }}>Contact · Sur rendez vous</span>
            </div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(26px, 6vw, 80px)', fontWeight: 400, lineHeight: 1.06, margin: '0 0 22px', color: 'var(--text)', letterSpacing: '-0.01em' }}>
              <WordReveal segments={[{ t: 'Réservez votre ' }, { t: 'rendez vous privé', accent: true, nowrap: true }]} />
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 'clamp(32px, 5vw, 72px)', alignItems: 'stretch' }} className="contact-grid">
            {/* ── LEFT: channels ── */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9, ease: EASE, delay: 0.1 }} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Prominent WhatsApp — the fastest channel */}
              <a
                className="ct-whatsapp"
                href={`https://wa.me/${cleanWaNumber(WHATSAPP)}?text=${encodeURIComponent('Bonjour Elite, je suis intéressé par ASTERIA.')}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 'clamp(18px, 2vw, 24px)', background: `linear-gradient(120deg, ${TEAL}1c, ${TEAL}08)`, border: `1px solid ${TEAL}44`, borderRadius: 12, textDecoration: 'none', transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease' }}
              >
                <span style={{ width: 50, height: 50, flexShrink: 0, borderRadius: '50%', background: TEAL, color: '#04211e', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 20px ${TEAL}44` }}><MessageCircle size={22} /></span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: 'block', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 17, color: 'var(--text)' }}>Discuter sur WhatsApp</span>
                  <span style={{ display: 'block', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12.5, color: 'rgba(var(--text-rgb),0.55)', marginTop: 3 }}>Réponse en quelques minutes</span>
                </span>
                <ArrowUpRight size={20} color={TEAL} />
              </a>

              <ContactRow icon={<Phone size={18} />} label="Téléphone">
                <a href={`tel:${PHONE_1.replace(/\s/g, '')}`} style={infoLink}>{PHONE_1}</a>
                <a href={`tel:${PHONE_2.replace(/\s/g, '')}`} style={infoLink}>{PHONE_2}</a>
              </ContactRow>

              <ContactRow icon={<Mail size={18} />} label="Email">
                <a href={`mailto:${EMAIL}`} style={infoLink}>{EMAIL}</a>
              </ContactRow>

              <ContactRow icon={<MapPin size={18} />} label="Adresse">
                <span style={{ ...infoLink, cursor: 'default' }}>{ADDRESS}</span>
              </ContactRow>

              <div style={{ display: 'flex', gap: 14, marginTop: 'auto', paddingTop: 12 }}>
                <SocialIcon href={INSTAGRAM} label="Instagram"><Instagram size={18} /></SocialIcon>
                <SocialIcon href="https://www.facebook.com/" label="Facebook"><Facebook size={18} /></SocialIcon>
              </div>
            </motion.div>

            {/* ── RIGHT: form in a bezel card ── */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}>
              <BezelCard padding="clamp(26px, 3.4vw, 48px)">
                {sent ? (
                  <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: EASE }} style={{ textAlign: 'center', padding: 'clamp(24px, 4vw, 48px) 0' }}>
                    <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1], delay: 0.1 }} style={{ width: 72, height: 72, borderRadius: '50%', border: `1.5px solid ${TEAL}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 26px', color: TEAL, boxShadow: `0 0 30px ${TEAL}33` }}>
                      <Check size={32} />
                    </motion.div>
                    <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 28, fontWeight: 400, color: 'var(--text)', margin: '0 0 12px' }}>Merci, {form.nom.split(' ')[0] || 'à vous'}</h3>
                    <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, color: 'rgba(var(--text-rgb),0.6)', lineHeight: 1.7, maxWidth: 400, margin: '0 auto' }}>
                      {CONTACT_ENDPOINT ? (
                        <>Votre demande a bien été envoyée à notre équipe. Nous vous recontacterons dans les plus brefs délais. Vous pouvez aussi nous joindre directement sur WhatsApp.</>
                      ) : (
                        <>WhatsApp s'est ouvert avec votre demande pré-remplie. Il vous suffit d'appuyer sur <strong style={{ color: 'rgba(var(--text-rgb),0.85)' }}>Envoyer</strong> pour finaliser. Si rien ne s'est ouvert, utilisez le lien ci-dessous.</>
                      )}
                    </p>
                    <a
                      href={waUrl}
                      target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 24, padding: '12px 28px', background: TEAL, color: '#04211e', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: 999 }}
                    >
                      {CONTACT_ENDPOINT ? 'Discuter sur WhatsApp' : 'Ouvrir WhatsApp'}
                    </a>
                    <div>
                      <button onClick={() => { setStatus('idle'); setForm({ nom: '', telephone: '', email: '', sujet: 'Visite privée', message: '' }) }} style={{ marginTop: 20, background: 'none', border: 'none', color: 'rgba(var(--text-rgb),0.5)', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}>
                        Envoyer une autre demande
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={onSubmit} noValidate>
                    <div style={{ marginBottom: 22 }}>
                      <label htmlFor="cf-nom" style={labelStyle}>Nom complet <span style={{ color: TEAL }}>*</span></label>
                      <input id="cf-nom" name="name" autoComplete="name" required aria-required="true" aria-invalid={!!errors.nom} aria-describedby={errors.nom ? 'cf-nom-err' : undefined} style={inputStyle} value={form.nom} onChange={(e) => update('nom', e.target.value)} onFocus={focusOn} onBlur={focusOff} placeholder="Votre nom" />
                      {errText('cf-nom-err', errors.nom)}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 22 }} className="contact-form-row">
                      <div>
                        <label htmlFor="cf-telephone" style={labelStyle}>Téléphone <span style={{ color: TEAL }}>*</span></label>
                        <input id="cf-telephone" name="tel" type="tel" inputMode="tel" autoComplete="tel" required aria-required="true" aria-invalid={!!errors.telephone} aria-describedby={errors.telephone ? 'cf-telephone-err' : undefined} style={inputStyle} value={form.telephone} onChange={(e) => update('telephone', e.target.value)} onFocus={focusOn} onBlur={focusOff} placeholder="+213 ..." />
                        {errText('cf-telephone-err', errors.telephone)}
                      </div>
                      <div>
                        <label htmlFor="cf-email" style={labelStyle}>Email <span style={{ color: TEAL }}>*</span></label>
                        <input id="cf-email" name="email" type="email" inputMode="email" autoComplete="email" required aria-required="true" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'cf-email-err' : undefined} style={inputStyle} value={form.email} onChange={(e) => update('email', e.target.value)} onFocus={focusOn} onBlur={focusOff} placeholder="vous@email.com" />
                        {errText('cf-email-err', errors.email)}
                      </div>
                    </div>

                    <div style={{ marginBottom: 22 }}>
                      <label htmlFor="cf-sujet" style={labelStyle}>Sujet</label>
                      <select id="cf-sujet" name="subject" style={{ ...inputStyle, cursor: 'pointer' }} value={form.sujet} onChange={(e) => update('sujet', e.target.value)} onFocus={focusOn} onBlur={focusOff}>
                        <option style={{ background: 'var(--bg-2)' }}>Visite privée</option>
                      </select>
                    </div>

                    <div style={{ marginBottom: 28 }}>
                      <label htmlFor="cf-message" style={labelStyle}>Message <span style={{ color: TEAL }}>*</span></label>
                      <textarea id="cf-message" name="message" required aria-required="true" aria-invalid={!!errors.message} aria-describedby={errors.message ? 'cf-message-err' : undefined} style={{ ...inputStyle, minHeight: 120, resize: 'vertical' }} value={form.message} onChange={(e) => update('message', e.target.value)} onFocus={focusOn} onBlur={focusOff} placeholder="Parlez-nous de votre projet..." />
                      {errText('cf-message-err', errors.message)}
                    </div>

                    {status === 'error' && (
                      <div role="alert" style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 8, border: '1px solid rgba(224,106,106,0.4)', background: 'rgba(224,106,106,0.08)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: '#e9a4a4', lineHeight: 1.5 }}>
                          L'envoi a échoué. Réessayez, ou contactez-nous directement sur WhatsApp ci-dessous.
                        </span>
                        <a href={waUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: TEAL, textDecoration: 'none' }}>
                          Envoyer sur WhatsApp →
                        </a>
                      </div>
                    )}

                    <button type="submit" disabled={status === 'sending'} aria-busy={status === 'sending'} className="magnetic-cta is-solid" style={{ display: 'inline-flex', alignItems: 'center', gap: 14, width: '100%', justifyContent: 'space-between', padding: '11px 11px 11px 28px', background: TEAL, color: '#04211e', border: 'none', borderRadius: 999, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: '0.08em', cursor: status === 'sending' ? 'wait' : 'pointer', opacity: status === 'sending' ? 0.75 : 1, boxShadow: `0 10px 34px ${TEAL}30` }}>
                      <span>{status === 'sending' ? 'Envoi en cours…' : 'Envoyer la demande'}</span>
                      <span className="cta-ico" style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(4,33,30,0.16)', color: '#04211e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {status === 'sending'
                          ? <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(4,33,30,0.3)', borderTopColor: '#04211e', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                          : <Send size={16} />}
                      </span>
                    </button>
                  </form>
                )}
              </BezelCard>
            </motion.div>
          </div>

          {/* Quick reassurance strip */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }} style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(20px, 4vw, 56px)', justifyContent: 'center', marginTop: 'clamp(56px, 7vw, 90px)', paddingTop: 'clamp(32px, 4vw, 48px)', borderTop: '1px solid rgba(var(--line-rgb),0.07)' }}>
            {['Conseiller dédié', 'Visite privée sur-mesure', 'Confidentialité garantie'].map((t) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Check size={15} color={TEAL} />
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, letterSpacing: '0.04em', color: 'rgba(var(--text-rgb),0.6)' }}>{t}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── shared SiteFooter so it's identical on every page ── */}
      <SiteFooter />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .ct-whatsapp:hover { transform: translateY(-2px); border-color: ${TEAL}88 !important; box-shadow: 0 12px 36px ${TEAL}22; }
        .ct-row { transition: border-color 0.3s ease, background 0.3s ease; }
        .ct-row:hover { border-color: rgba(43,189,176,0.3) !important; background: rgba(var(--line-rgb),0.02) !important; }
        .ct-row:hover .ct-icon { background: ${TEAL}1f !important; color: ${TEAL} !important; border-color: ${TEAL}66 !important; }
        @media (max-width: 880px) { .contact-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 520px) { .contact-form-row { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  )
}

const infoLink: React.CSSProperties = {
  fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, color: 'rgba(var(--text-rgb),0.85)',
  textDecoration: 'none', display: 'block', lineHeight: 1.6,
}

function ContactRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="ct-row" style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: 'clamp(14px, 1.6vw, 18px)', border: '1px solid rgba(var(--line-rgb),0.07)', borderRadius: 12 }}>
      <div className="ct-icon" style={{ width: 42, height: 42, flexShrink: 0, borderRadius: '50%', border: '1px solid rgba(43,189,176,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: TEAL, transition: 'all 0.3s ease' }}>
        {icon}
      </div>
      <div>
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(var(--text-rgb),0.4)', marginBottom: 6 }}>{label}</div>
        {children}
      </div>
    </div>
  )
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid rgba(var(--line-rgb),0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(var(--text-rgb),0.7)', transition: 'all 0.25s ease' }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = TEAL; e.currentTarget.style.color = TEAL; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(var(--line-rgb),0.12)'; e.currentTarget.style.color = 'rgba(var(--text-rgb),0.7)'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {children}
    </a>
  )
}
