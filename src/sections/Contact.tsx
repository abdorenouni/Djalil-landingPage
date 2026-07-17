import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, MessageCircle, Instagram, Facebook, Check, ArrowUpRight, Video } from 'lucide-react'
import { WordReveal, TEAL, GOLD, EASE } from '@/components/custom/lux'
import { useSiteSettings } from '@/lib/useSiteSettings'
import SiteFooter from '@/components/custom/SiteFooter'
import MeetingRequestForm from '@/components/custom/MeetingRequestForm'

const FALLBACK_WHATSAPP = '213550363604'
const FALLBACK_PHONE_1 = '0550 36 36 04'
const FALLBACK_PHONE_2 = ''
const FALLBACK_EMAIL = 'mar.elitee@gmail.com'
const FALLBACK_ADDRESS = 'Alger, Algérie'
const FALLBACK_INSTAGRAM = 'https://instagram.com/elite_reallestate'

const cleanWaNumber = (n: string) => {
  const d = n.replace(/\D/g, '')
  // Local Algerian format 0XXXXXXXXX → international 213XXXXXXXXX
  if (d.startsWith('0') && d.length === 10) return '213' + d.slice(1)
  return d
}

export default function Contact() {
  const settings = useSiteSettings()
  // Once settings has loaded, an empty CMS field means the client intentionally
  // cleared it — respect that instead of silently falling back to a hardcoded
  // value. The fallback only applies before the fetch resolves (settings === null).
  const loaded = settings !== null
  const WHATSAPP = loaded ? settings.whatsapp : FALLBACK_WHATSAPP
  const PHONE_1 = loaded ? settings.phone : FALLBACK_PHONE_1
  const PHONE_2 = loaded ? settings.phone2 : FALLBACK_PHONE_2
  const EMAIL = loaded ? settings.email : FALLBACK_EMAIL
  const ADDRESS = loaded ? settings.address : FALLBACK_ADDRESS
  const INSTAGRAM = loaded ? settings.instagram : FALLBACK_INSTAGRAM

  return (
    <>
      <section id="contact" style={{ position: 'relative', padding: 'clamp(90px, 13vw, 180px) clamp(24px, 5vw, 80px)', overflow: 'hidden', background: 'var(--bg)' }}>
        {/* Uniform themed background — subtle brand glows only, no photo filigrane */}
        <div className="ct-glow" style={{ position: 'absolute', top: '-10%', left: '-5%', width: '55%', height: '70%', background: `radial-gradient(circle, ${TEAL}12 0%, transparent 62%)`, pointerEvents: 'none' }} />
        <div className="ct-glow" style={{ position: 'absolute', bottom: '-12%', right: '-6%', width: '48%', height: '60%', background: `radial-gradient(circle, ${GOLD}0e 0%, transparent 65%)`, pointerEvents: 'none' }} />

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
              {WHATSAPP && (
                <a
                  className="ct-whatsapp"
                  href={`https://wa.me/${cleanWaNumber(WHATSAPP)}?text=${encodeURIComponent('Bonjour Elite')}`}
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
              )}

              {(PHONE_1 || PHONE_2) && (
                <ContactRow icon={<Phone size={18} />} label="Téléphone">
                  {PHONE_1 && <a href={`tel:${PHONE_1.replace(/\s/g, '')}`} style={infoLink}>{PHONE_1}</a>}
                  {PHONE_2 && <a href={`tel:${PHONE_2.replace(/\s/g, '')}`} style={infoLink}>{PHONE_2}</a>}
                </ContactRow>
              )}

              {EMAIL && (
                <ContactRow icon={<Mail size={18} />} label="Email">
                  <a href={`mailto:${EMAIL}`} style={infoLink}>{EMAIL}</a>
                </ContactRow>
              )}

              {ADDRESS && (
                <ContactRow icon={<MapPin size={18} />} label="Adresse">
                  <span style={{ ...infoLink, cursor: 'default' }}>{ADDRESS}</span>
                </ContactRow>
              )}

              <div style={{ display: 'flex', gap: 14, marginTop: 'auto', paddingTop: 12 }}>
                {INSTAGRAM && <SocialIcon href={INSTAGRAM} label="Instagram"><Instagram size={18} /></SocialIcon>}
                <SocialIcon href="https://www.facebook.com/" label="Facebook"><Facebook size={18} /></SocialIcon>
              </div>
            </motion.div>

            {/* ── RIGHT: meeting request form ── */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                <Video size={18} color={TEAL} />
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: TEAL }}>Planifier une réunion Zoom</span>
              </div>
              <MeetingRequestForm />
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
        .ct-whatsapp:hover { transform: translateY(-2px); border-color: ${TEAL}88 !important; box-shadow: 0 12px 36px ${TEAL}22; }
        .ct-row { transition: border-color 0.3s ease, background 0.3s ease; }
        .ct-row:hover { border-color: rgba(43,189,176,0.3) !important; background: rgba(var(--line-rgb),0.02) !important; }
        .ct-row:hover .ct-icon { background: ${TEAL}1f !important; color: ${TEAL} !important; border-color: ${TEAL}66 !important; }
        @media (max-width: 880px) { .contact-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 768px) { .ct-glow { display: none !important; } }
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
