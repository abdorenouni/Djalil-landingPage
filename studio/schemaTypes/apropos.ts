import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'apropos',
  title: 'À Propos (page)',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'story', title: 'Histoire' },
    { name: 'mission', title: 'Mission' },
    { name: 'philosophy', title: 'Philosophie' },
    { name: 'values', title: 'Valeurs' },
    { name: 'founder', title: 'Citation' },
    { name: 'cta', title: 'CTA final' },
  ],
  fields: [
    // ── HERO ──
    defineField({ name: 'heroEyebrow', title: 'Éyebrow', type: 'string', group: 'hero', initialValue: 'À Propos' }),
    defineField({ name: 'heroTitle', title: 'Titre (1 mot par ligne)', type: 'array', of: [{ type: 'string' }], group: 'hero' }),
    defineField({ name: 'heroSubtitle', title: 'Sous-titre', type: 'string', group: 'hero' }),
    defineField({ name: 'heroImage', title: 'Image', type: 'image', group: 'hero' }),
    defineField({ name: 'marqueeKeywords', title: 'Mots-clés (marquee)', type: 'array', of: [{ type: 'string' }], group: 'hero' }),

    // ── STORY ──
    defineField({ name: 'storyText', title: 'Phrase d\'introduction', type: 'text', rows: 4, group: 'story' }),

    // ── MISSION ──
    defineField({ name: 'missionIndex', title: 'Index (ex: 01)', type: 'string', group: 'mission', initialValue: '01' }),
    defineField({ name: 'missionEyebrow', title: 'Éyebrow', type: 'string', group: 'mission' }),
    defineField({ name: 'missionTitle1', title: 'Titre — Ligne 1', type: 'string', group: 'mission' }),
    defineField({ name: 'missionTitle2', title: 'Titre — Ligne 2 (accent)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionParagraphs', title: 'Paragraphes', type: 'array', of: [{ type: 'text', rows: 3 }], group: 'mission' }),
    defineField({ name: 'missionImage', title: 'Image', type: 'image', group: 'mission' }),

    // ── PHILOSOPHY ──
    defineField({
      name: 'philosophy', title: 'Blocs philosophie', type: 'array', group: 'philosophy',
      of: [{ type: 'object', fields: [
        { name: 'index', title: 'Index (ex: 02)', type: 'string' },
        { name: 'eyebrow', title: 'Éyebrow', type: 'string' },
        { name: 'title1', title: 'Titre — Ligne 1', type: 'string' },
        { name: 'title2', title: 'Titre — Ligne 2 (accent)', type: 'string' },
        { name: 'text', title: 'Texte', type: 'text', rows: 4 },
        { name: 'image', title: 'Image', type: 'image' },
        { name: 'reverse', title: 'Inverser le sens (texte à gauche)', type: 'boolean', initialValue: false },
      ], preview: { select: { title: 'title1', subtitle: 'eyebrow', media: 'image' } } }],
    }),

    // ── VALUES ──
    defineField({ name: 'valuesEyebrow', title: 'Éyebrow', type: 'string', group: 'values', initialValue: 'Nos Valeurs' }),
    defineField({ name: 'valuesTitle', title: 'Titre', type: 'string', group: 'values' }),
    defineField({
      name: 'values', title: 'Valeurs', type: 'array', group: 'values',
      of: [{ type: 'object', fields: [
        { name: 'icon', title: 'Icône', type: 'string', options: { list: [
          { title: 'Gem (Excellence)', value: 'gem' },
          { title: 'Compass (Vision)', value: 'compass' },
          { title: 'Shield (Confiance)', value: 'shield' },
          { title: 'Handshake (Accompagnement)', value: 'handshake' },
        ] } },
        { name: 'title', title: 'Titre', type: 'string' },
        { name: 'text', title: 'Texte', type: 'text', rows: 3 },
      ], preview: { select: { title: 'title', subtitle: 'icon' } } }],
    }),

    // ── FOUNDER QUOTE ──
    defineField({ name: 'founderQuote', title: 'Citation', type: 'text', rows: 3, group: 'founder' }),
    defineField({ name: 'founderQuoteAccent', title: 'Mots à accentuer (en teal)', type: 'string', group: 'founder' }),
    defineField({ name: 'founderName', title: 'Nom / Rôle', type: 'string', group: 'founder' }),
    defineField({ name: 'founderOrg', title: 'Organisation', type: 'string', group: 'founder' }),

    // ── CTA ──
    defineField({ name: 'ctaTitle', title: 'Titre CTA', type: 'string', group: 'cta' }),
    defineField({ name: 'ctaLabel', title: 'Libellé du bouton', type: 'string', group: 'cta' }),
    defineField({ name: 'ctaLink', title: 'Lien du bouton', type: 'string', group: 'cta', initialValue: '/projets' }),
    defineField({ name: 'ctaImage', title: 'Image de fond', type: 'image', group: 'cta' }),
  ],
  preview: { prepare: () => ({ title: 'À Propos (page)' }) },
})
