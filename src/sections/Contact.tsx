import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, MessageCircle, Instagram, Facebook, Send, Check } from 'lucide-react'

const TEAL = '#2bbdb0'
const GOLD = '#d4af37'
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const WHATSAPP = '213779527948'
const PHONE_1 = '+213 779 52 79 48'
const PHONE_2 = '+213 550 36 36 04'

type Errors = Partial<Record<'nom' | 'telephone' | 'email' | 'message', string>>

export default function Contact() {
  const [form, setForm] = useState({ nom: '', telephone: '', email: '', sujet: 'Information ASTERIA', message: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)

  const update = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }))
    if (errors[k as keyof Errors]) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const validate = (): boolean => {
    const e: Errors = {}
    if (!form.nom.trim()) e.nom = 'Veuillez indiquer votre nom'
    if (!/^[0-9+\s().-]{8,}$/.test(form.telephone.trim())) e.telephone = 'Numéro de téléphone invalide'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Adresse email invalide'
    if (!form.message.trim()) e.message = 'Votre message est vide'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    if (validate()) setSent(true)
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: '0.18em',
    textTransform: 'uppercase', color: 'rgba(243,244,241,0.55)', marginBottom: 8, display: 'block',
  }
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3, color: '#f3f4f1',
    fontFamily: "'Inter', sans-serif", fontSize: 15, outline: 'none',
    transition: 'border-color 0.25s ease, background 0.25s ease', boxSizing: 'border-box',
  }
  const focusOn = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = GOLD
    e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
  }
  const focusOff = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
    e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
  }
  const errText = (msg?: string) =>
    msg ? <span style={{ color: '#e06a6a', fontFamily: "'Inter', sans-serif", fontSize: 12, marginTop: 6, display: 'block' }}>{msg}</span> : null

  return (
    <>
      <section
        id="contact"
        style={{
          position: 'relative',
          background: '#060606',
          padding: 'clamp(80px, 12vw, 160px) clamp(24px, 5vw, 80px)',
          overflow: 'hidden',
        }}
      >
        {/* Ambient glows */}
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '50%', height: '60%', background: `radial-gradient(circle, ${TEAL}14 0%, transparent 65%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '45%', height: '55%', background: `radial-gradient(circle, ${GOLD}12 0%, transparent 65%)`, pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1300, margin: '0 auto', position: 'relative' }}>
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: EASE }}
            style={{ marginBottom: 'clamp(48px, 7vw, 80px)', maxWidth: 680 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <div style={{ width: 38, height: 1, background: GOLD }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', color: GOLD }}>Contact</span>
            </div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(32px, 5.5vw, 72px)', fontWeight: 400, lineHeight: 1.08, margin: '0 0 22px', color: '#f3f4f1', letterSpacing: '-0.01em' }}>
              Réservez votre<br /><span style={{ color: TEAL }}>rendez-vous privé</span>
            </h2>
            <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 'clamp(16px, 2vw, 22px)', color: 'rgba(243,244,241,0.6)', margin: 0, lineHeight: 1.5 }}>
              « ASTERIA — Une adresse qui reflète votre réussite. »
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: 'clamp(32px, 5vw, 80px)', alignItems: 'start' }} className="contact-grid">
            {/* ── LEFT: info ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 28 }}
            >
              <ContactRow icon={<Phone size={18} />} label="Téléphone">
                <a href={`tel:${PHONE_1.replace(/\s/g, '')}`} style={infoLink}>{PHONE_1}</a>
                <a href={`tel:${PHONE_2.replace(/\s/g, '')}`} style={infoLink}>{PHONE_2}</a>
              </ContactRow>

              <ContactRow icon={<Mail size={18} />} label="Email">
                {/* PLACEHOLDER — replace with the real address */}
                <a href="mailto:contact@elite-immobilier.dz" style={infoLink}>contact@elite-immobilier.dz</a>
                <span style={{ fontSize: 11, color: 'rgba(243,244,241,0.3)', fontFamily: "'Inter', sans-serif" }}>(à remplacer)</span>
              </ContactRow>

              <ContactRow icon={<MapPin size={18} />} label="Adresse">
                {/* PLACEHOLDER — replace with the real office address */}
                <span style={{ ...infoLink, cursor: 'default' }}>Alger, Algérie</span>
                <span style={{ fontSize: 11, color: 'rgba(243,244,241,0.3)', fontFamily: "'Inter', sans-serif" }}>(à remplacer)</span>
              </ContactRow>

              {/* WhatsApp CTA */}
              <a
                href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Bonjour Elite, je suis intéressé par ASTERIA.')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 12, alignSelf: 'flex-start',
                  marginTop: 4, padding: '15px 28px', background: TEAL, color: '#04211e',
                  fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
                  letterSpacing: '0.06em', textDecoration: 'none', borderRadius: 3,
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  boxShadow: `0 8px 30px ${TEAL}33`,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 12px 38px ${TEAL}55` }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 8px 30px ${TEAL}33` }}
              >
                <MessageCircle size={18} />
                Discuter sur WhatsApp
              </a>

              {/* Socials */}
              <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
                <SocialIcon href="https://instagram.com/elite_reallestate" label="Instagram"><Instagram size={18} /></SocialIcon>
                <SocialIcon href="https://www.facebook.com/" label="Facebook"><Facebook size={18} /></SocialIcon>
              </div>
            </motion.div>

            {/* ── RIGHT: form ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(20px)',
                borderRadius: 6,
                padding: 'clamp(24px, 4vw, 48px)',
              }}
            >
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  style={{ textAlign: 'center', padding: '40px 0' }}
                >
                  <div style={{ width: 64, height: 64, borderRadius: '50%', border: `1.5px solid ${TEAL}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: TEAL }}>
                    <Check size={30} />
                  </div>
                  <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 26, fontWeight: 400, color: '#f3f4f1', margin: '0 0 12px' }}>Merci, {form.nom.split(' ')[0]}</h3>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: 'rgba(243,244,241,0.6)', lineHeight: 1.7, maxWidth: 360, margin: '0 auto' }}>
                    Votre demande a bien été enregistrée. Notre équipe vous recontactera dans les plus brefs délais.
                  </p>
                  <button
                    onClick={() => { setSent(false); setForm({ nom: '', telephone: '', email: '', sujet: 'Information ASTERIA', message: '' }) }}
                    style={{ marginTop: 28, background: 'none', border: 'none', color: GOLD, fontFamily: "'Inter', sans-serif", fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}
                  >
                    Envoyer une autre demande
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={onSubmit} noValidate>
                  <div style={{ marginBottom: 22 }}>
                    <label style={labelStyle}>Nom complet</label>
                    <input style={inputStyle} value={form.nom} onChange={(e) => update('nom', e.target.value)} onFocus={focusOn} onBlur={focusOff} placeholder="Votre nom" />
                    {errText(errors.nom)}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 22 }} className="contact-form-row">
                    <div>
                      <label style={labelStyle}>Téléphone</label>
                      <input style={inputStyle} value={form.telephone} onChange={(e) => update('telephone', e.target.value)} onFocus={focusOn} onBlur={focusOff} placeholder="+213 ..." />
                      {errText(errors.telephone)}
                    </div>
                    <div>
                      <label style={labelStyle}>Email</label>
                      <input style={inputStyle} type="email" value={form.email} onChange={(e) => update('email', e.target.value)} onFocus={focusOn} onBlur={focusOff} placeholder="vous@email.com" />
                      {errText(errors.email)}
                    </div>
                  </div>

                  <div style={{ marginBottom: 22 }}>
                    <label style={labelStyle}>Sujet</label>
                    <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.sujet} onChange={(e) => update('sujet', e.target.value)} onFocus={focusOn} onBlur={focusOff}>
                      <option style={{ background: '#0a0a0a' }}>Information ASTERIA</option>
                      <option style={{ background: '#0a0a0a' }}>Visite privée</option>
                      <option style={{ background: '#0a0a0a' }}>Réservation d'une résidence</option>
                      <option style={{ background: '#0a0a0a' }}>Autre demande</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: 28 }}>
                    <label style={labelStyle}>Message</label>
                    <textarea style={{ ...inputStyle, minHeight: 120, resize: 'vertical' }} value={form.message} onChange={(e) => update('message', e.target.value)} onFocus={focusOn} onBlur={focusOff} placeholder="Parlez-nous de votre projet..." />
                    {errText(errors.message)}
                  </div>

                  <button
                    type="submit"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 12, width: '100%', justifyContent: 'center',
                      padding: '16px 32px', background: GOLD, color: '#060606', border: 'none',
                      fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
                      letterSpacing: '0.16em', textTransform: 'uppercase', borderRadius: 3, cursor: 'pointer',
                      transition: 'opacity 0.25s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.88' }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
                  >
                    Envoyer la demande
                    <Send size={16} />
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#040404', borderTop: '1px solid rgba(212,175,55,0.08)', padding: 'clamp(40px, 6vw, 70px) clamp(24px, 5vw, 80px)' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', justifyContent: 'space-between' }}>
          <img src="/images/elite-logo.png" alt="Elite Promotion Immobilière" style={{ height: 46, width: 'auto', mixBlendMode: 'screen', opacity: 0.85 }} />
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: '0.18em', color: 'rgba(243,244,241,0.3)', textTransform: 'uppercase', margin: 0 }}>
            © {new Date().getFullYear()} Elite Promotion Immobilière — Tous droits réservés
          </p>
        </div>
      </footer>
    </>
  )
}

const infoLink: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif", fontSize: 16, color: 'rgba(243,244,241,0.85)',
  textDecoration: 'none', display: 'block', lineHeight: 1.6,
}

function ContactRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <div style={{ width: 42, height: 42, flexShrink: 0, borderRadius: '50%', border: '1px solid rgba(212,175,55,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: GOLD }}>
        {icon}
      </div>
      <div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(243,244,241,0.4)', marginBottom: 6 }}>{label}</div>
        {children}
      </div>
    </div>
  )
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(243,244,241,0.7)', transition: 'all 0.25s ease' }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = TEAL; e.currentTarget.style.color = TEAL }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(243,244,241,0.7)' }}
    >
      {children}
    </a>
  )
}
