import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Reveal, TEAL, EASE } from '@/components/custom/lux'
import { ChevronDown } from 'lucide-react'
import { fetchFaq, type FaqItem } from '@/lib/queries'

const STATIC_QUESTIONS: FaqItem[] = [
  {
    q: "Qu'est-ce qui distingue ASTERIA des autres résidences à Alger ?",
    a: "ASTERIA est la première résidence en Algérie à intégrer l'eau comme matériau architectural : cascades suspendues entre les étages, piscines à débordement privatives et bassins paysagers. S'y ajoutent des plafonds étoilés en fibre optique, une façade sculpturale signée et des espaces communs dignes d'un hôtel cinq étoiles. Ce n'est pas un simple immeuble, c'est une adresse.",
  },
  {
    q: 'Quelles sont les superficies et typologies disponibles ?',
    a: "Nous proposons principalement des F3 (3 pièces) de 103 à 110 m², conçus pour offrir un volume généreux et des espaces de vie lumineux. Chaque appartement bénéficie de finitions haut de gamme, d'une terrasse privative et d'une attention architecturale jusque dans les moindres détails.",
  },
  {
    q: "Comment se déroule le parcours d'acquisition ?",
    a: "Le processus est fluide et entièrement accompagné : prise de contact avec un conseiller dédié, visite privée sur rendez vous, présentation des plans et des finitions, réservation avec accompagnement administratif complet, puis remise des clés. Un interlocuteur unique vous suit de la première visite à l'emménagement.",
  },
  {
    q: 'Quelles sont les modalités de paiement ?',
    a: "Nous proposons des plans de paiement échelonnés, adaptés à votre situation. Les modalités exactes (montant de la réservation, échéancier et conditions) sont présentées lors de votre rendez vous avec un conseiller, en toute confidentialité. Chaque plan est conçu sur mesure.",
  },
  {
    q: "Puis-je visiter la résidence avant de m'engager ?",
    a: "Bien sûr. Nous organisons des visites privées sur rendez vous, adaptées à votre emploi du temps. Vous serez accueilli par un conseiller qui vous présentera la résidence, les matériaux, les vues et les espaces communs, sans engagement, dans un cadre confidentiel.",
  },
  {
    q: 'Comment Elite garantit-elle le respect des délais ?',
    a: "Le respect des délais est un engagement contractuel, pas une promesse. Les dates de livraison sont inscrites dans le contrat de réservation. Notre historique affiche 100 % de projets livrés dans les temps annoncés, c'est l'un des piliers de notre réputation.",
  },
  {
    q: 'Quels matériaux et finitions sont utilisés ?',
    a: "Chaque résidence Elite utilise des matériaux sélectionnés pour leur durabilité et leur esthétique : marbre, bois noble, menuiserie aluminium haut de gamme, robinetterie de marque et isolation thermique et phonique renforcée. Les finitions sont livrées clé en main, prêt à vivre, sans travaux supplémentaires.",
  },
  {
    q: 'Les résidences sont-elles éligibles aux prêts bancaires ?',
    a: "Oui. Nos projets sont conformes aux exigences des établissements bancaires algériens pour l'obtention d'un crédit immobilier. Notre équipe peut vous orienter dans les démarches et vous fournir l'ensemble des documents nécessaires au montage de votre dossier.",
  },
]

function AccordionItem({ item, isOpen, toggle, index }: { item: FaqItem; isOpen: boolean; toggle: () => void; index: number }) {
  return (
    <div
      style={{
        borderBottom: '1px solid rgba(var(--line-rgb),0.07)',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={toggle}
        className="faq-trigger"
        id={`faq-trigger-${index}`}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${index}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          width: '100%',
          padding: 'clamp(22px, 3vw, 32px) 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'clamp(14px, 2vw, 24px)' }}>
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(16px, 2vw, 22px)', fontWeight: 700, color: isOpen ? TEAL : 'rgba(43,189,176,0.4)', lineHeight: 1, transition: 'color 0.3s ease', flexShrink: 0 }}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(16px, 1.6vw, 22px)', fontWeight: 400, color: isOpen ? 'var(--text)' : 'rgba(var(--text-rgb),0.75)', transition: 'color 0.3s ease', lineHeight: 1.35 }}>
            {item.q}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          style={{ flexShrink: 0, color: isOpen ? TEAL : 'rgba(var(--text-rgb),0.3)', transition: 'color 0.3s ease' }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`faq-panel-${index}`}
            role="region"
            aria-labelledby={`faq-trigger-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(14px, 1.1vw, 17px)',
              lineHeight: 1.85,
              color: 'rgba(var(--text-rgb),0.6)',
              margin: 0,
              padding: '0 0 clamp(22px, 3vw, 32px) clamp(30px, 4vw, 46px)',
              maxWidth: 680,
            }}>
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [questions, setQuestions] = useState<FaqItem[]>(STATIC_QUESTIONS)

  useEffect(() => { fetchFaq().then(setQuestions) }, [])

  return (
    <section style={{ background: 'var(--bg)', padding: 'clamp(80px, 12vw, 160px) clamp(24px, 5vw, 80px)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '50%', height: '60%', background: `radial-gradient(ellipse, ${TEAL}08 0%, transparent 70%)`, pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(48px, 7vw, 80px)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
              <div style={{ width: 38, height: 1, background: TEAL }} />
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', color: TEAL }}>Questions fréquentes</span>
              <div style={{ width: 38, height: 1, background: TEAL }} />
            </div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(30px, 5vw, 64px)', fontWeight: 400, color: 'var(--text)', margin: 0 }}>
              Vos Questions
            </h2>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontStyle: 'italic', fontSize: 'clamp(15px, 1.6vw, 20px)', color: 'rgba(var(--text-rgb),0.5)', margin: '18px auto 0', maxWidth: 520, lineHeight: 1.6 }}>
              Tout ce que vous devez savoir avant de franchir le pas.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div style={{ borderTop: '1px solid rgba(var(--line-rgb),0.07)' }}>
            {questions.map((item, i) => (
              <AccordionItem
                key={i}
                item={item}
                index={i}
                isOpen={openIndex === i}
                toggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div style={{ textAlign: 'center', marginTop: 'clamp(40px, 6vw, 64px)' }}>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: 'rgba(var(--text-rgb),0.5)', marginBottom: 20 }}>
              Une autre question ? Nous sommes à votre écoute.
            </p>
            <a
              href="#contact"
              className="faq-cta"
              onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '14px 36px', background: TEAL, color: '#04211e',
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, fontWeight: 600,
                letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none',
                borderRadius: 999, border: 'none', cursor: 'pointer',
                boxShadow: `0 10px 34px ${TEAL}30`,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
            >
              <span>Nous contacter</span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </a>
          </div>
        </Reveal>
      </div>

      <style>{`
        .faq-trigger:hover { opacity: 0.9; }
        .faq-cta:hover { transform: translateY(-2px); box-shadow: 0 14px 42px ${TEAL}44; }
      `}</style>
    </section>
  )
}
