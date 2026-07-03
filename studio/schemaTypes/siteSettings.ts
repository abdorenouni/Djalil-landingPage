import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Paramètres du site',
  type: 'document',
  groups: [
    { name: 'brand', title: 'Marque' },
    { name: 'hero', title: 'Hero (Accueil)' },
    { name: 'about', title: 'Section À Propos (Accueil)' },
    { name: 'signature', title: 'Section Signature' },
    { name: 'processus', title: 'Section Parcours' },
    { name: 'projectsIntro', title: 'Section Univers (intro)' },
    { name: 'showcase3D', title: 'Section 3D' },
    { name: 'contact', title: 'Contact & Réseaux' },
    { name: 'seo', title: 'SEO par défaut' },
  ],
  fields: [
    // ── BRAND ──
    defineField({ name: 'brandName', title: 'Nom de la marque', type: 'string', group: 'brand', initialValue: 'Elite Promotion Immobilière' }),
    defineField({ name: 'tagline', title: 'Slogan court', type: 'string', group: 'brand' }),

    // ── HERO ──
    defineField({ name: 'heroHeadline', title: 'Titre du hero', type: 'string', group: 'hero' }),
    defineField({ name: 'heroSubtext', title: 'Sous-titre du hero', type: 'text', rows: 2, group: 'hero' }),

    // ── ABOUT (home) ──
    defineField({ name: 'aboutEyebrow', title: 'Éyebrow (ex: À Propos)', type: 'string', group: 'about' }),
    defineField({ name: 'aboutTitle1', title: 'Titre — Ligne 1', type: 'string', group: 'about' }),
    defineField({ name: 'aboutTitle2', title: 'Titre — Ligne 2 (accent)', type: 'string', group: 'about' }),
    defineField({ name: 'aboutText', title: 'Paragraphes', type: 'array', of: [{ type: 'block' }], group: 'about' }),
    defineField({ name: 'aboutImage', title: 'Image', type: 'image', group: 'about' }),
    defineField({ name: 'aboutCtaLabel', title: 'Libellé du bouton', type: 'string', group: 'about' }),
    defineField({
      name: 'stats', title: 'Chiffres clés (bandeau Chiffres)', type: 'array', group: 'about',
      of: [{ type: 'object', fields: [
        { name: 'number', title: 'Nombre (ex: 10+, 100%)', type: 'string' },
        { name: 'label', title: 'Libellé', type: 'string' },
      ], preview: { select: { title: 'number', subtitle: 'label' } } }],
    }),

    // ── SIGNATURE ──
    defineField({ name: 'signatureEyebrow', title: 'Éyebrow', type: 'string', group: 'signature' }),
    defineField({ name: 'signatureTitle', title: 'Titre', type: 'string', group: 'signature' }),
    defineField({
      name: 'signatureItems', title: 'Cartes (3 recommandées)', type: 'array', group: 'signature',
      of: [{ type: 'object', fields: [
        { name: 'image', title: 'Image', type: 'image' },
        { name: 'title', title: 'Titre', type: 'string' },
        { name: 'text', title: 'Texte', type: 'text', rows: 3 },
      ], preview: { select: { title: 'title', media: 'image' } } }],
    }),

    // ── PROCESSUS ──
    defineField({ name: 'processusEyebrow', title: 'Éyebrow', type: 'string', group: 'processus' }),
    defineField({ name: 'processusTitle', title: 'Titre', type: 'string', group: 'processus' }),
    defineField({
      name: 'processusSteps', title: 'Étapes (4 recommandées)', type: 'array', group: 'processus',
      of: [{ type: 'object', fields: [
        { name: 'icon', title: 'Icône', type: 'string', options: { list: [
          { title: 'Message (Contact)', value: 'message' },
          { title: 'Clé (Visite)', value: 'key' },
          { title: 'Signature (Réservation)', value: 'signature' },
          { title: 'Porte (Remise)', value: 'door' },
        ] } },
        { name: 'title', title: 'Titre', type: 'string' },
        { name: 'text', title: 'Texte', type: 'text', rows: 3 },
      ], preview: { select: { title: 'title', subtitle: 'icon' } } }],
    }),
    defineField({ name: 'processusCtaLabel', title: 'Libellé du bouton', type: 'string', group: 'processus' }),

    // ── PROJECTS INTRO ──
    defineField({ name: 'projectsIntroEyebrow', title: 'Éyebrow', type: 'string', group: 'projectsIntro' }),
    defineField({ name: 'projectsIntroTitle1', title: 'Titre — Ligne 1', type: 'string', group: 'projectsIntro' }),
    defineField({ name: 'projectsIntroTitle2', title: 'Titre — Ligne 2 (accent)', type: 'string', group: 'projectsIntro' }),

    // ── SHOWCASE 3D ──
    defineField({ name: 'showcase3DEyebrow', title: 'Éyebrow', type: 'string', group: 'showcase3D' }),
    defineField({ name: 'showcase3DTitle1', title: 'Titre — Ligne 1', type: 'string', group: 'showcase3D' }),
    defineField({ name: 'showcase3DTitle2', title: 'Titre — Ligne 2 (accent)', type: 'string', group: 'showcase3D' }),
    defineField({ name: 'showcase3DSubtitle', title: 'Sous-titre', type: 'text', rows: 2, group: 'showcase3D' }),

    // ── CONTACT ──
    defineField({ name: 'phone', title: 'Téléphone', type: 'string', group: 'contact' }),
    defineField({ name: 'phone2', title: 'Téléphone 2', type: 'string', group: 'contact' }),
    defineField({ name: 'whatsapp', title: 'WhatsApp (chiffres seuls)', type: 'string', group: 'contact' }),
    defineField({ name: 'email', title: 'Email', type: 'string', group: 'contact' }),
    defineField({ name: 'address', title: 'Adresse', type: 'string', group: 'contact' }),
    defineField({ name: 'instagram', title: 'Instagram (URL)', type: 'url', group: 'contact' }),
    defineField({ name: 'facebook', title: 'Facebook (URL)', type: 'url', group: 'contact' }),

    // ── SEO ──
    defineField({ name: 'seoTitle', title: 'Titre SEO par défaut', type: 'string', group: 'seo' }),
    defineField({ name: 'seoDescription', title: 'Description SEO par défaut', type: 'text', rows: 3, group: 'seo' }),
    defineField({ name: 'ogImage', title: 'Image de partage (OpenGraph)', type: 'image', group: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Paramètres du site' }) },
})
