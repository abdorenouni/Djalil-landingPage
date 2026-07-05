import { defineType, defineField } from 'sanity'

/**
 * ASTERIA page singleton.
 * Lets the client edit the dedicated /projets/asteria page content without
 * touching code. Mirrors the structure of Asteria.tsx — hero, intro, amenities,
 * lifestyle, plans, gallery, location, CTA.
 */
export default defineType({
  name: 'asteria',
  title: 'Page ASTERIA',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'intro', title: 'Intro' },
    { name: 'stats', title: 'Chiffres' },
    { name: 'amenities', title: 'Prestations' },
    { name: 'lifestyle', title: 'Art de vivre' },
    { name: 'plans', title: 'Plans' },
    { name: 'cta', title: 'CTA final' },
  ],
  fields: [
    // ── HERO ──
    defineField({ name: 'heroEyebrow', title: 'Éyebrow', type: 'string', group: 'hero' }),
    defineField({ name: 'heroTitle', title: 'Titre', type: 'string', group: 'hero' }),
    defineField({ name: 'heroSubtitle', title: 'Sous-titre', type: 'string', group: 'hero' }),
    defineField({ name: 'heroImage', title: 'Image', type: 'image', group: 'hero' }),

    // ── INTRO ──
    defineField({ name: 'introEyebrow', title: 'Éyebrow', type: 'string', group: 'intro' }),
    defineField({ name: 'introTitle', title: 'Titre', type: 'string', group: 'intro' }),
    defineField({ name: 'introText', title: 'Texte', type: 'array', of: [{ type: 'block' }], group: 'intro' }),

    // ── STATS ──
    defineField({
      name: 'stats', title: 'Chiffres clés', type: 'array', group: 'stats',
      of: [{ type: 'object', fields: [
        { name: 'number', title: 'Nombre', type: 'string' },
        { name: 'label', title: 'Libellé', type: 'string' },
      ], preview: { select: { title: 'number', subtitle: 'label' } } }],
    }),

    // ── AMENITIES ──
    defineField({ name: 'amenitiesEyebrow', title: 'Éyebrow', type: 'string', group: 'amenities' }),
    defineField({ name: 'amenitiesTitle', title: 'Titre', type: 'string', group: 'amenities' }),
    defineField({
      name: 'amenities', title: 'Prestations', type: 'array', group: 'amenities',
      of: [{ type: 'object', fields: [
        { name: 'icon', title: 'Icône', type: 'string', options: { list: [
          { title: 'Waves (Piscines / Eau)', value: 'waves' },
          { title: 'Plane (Aéroport)', value: 'plane' },
          { title: 'GraduationCap (École)', value: 'graduation' },
          { title: 'ShoppingBag (Commerces)', value: 'shopping' },
          { title: 'Stethoscope (Santé)', value: 'stethoscope' },
          { title: 'UtensilsCrossed (Restaurants)', value: 'utensils' },
          { title: 'Maximize (Surface)', value: 'maximize' },
          { title: 'BedDouble (Chambres)', value: 'bed' },
          { title: 'Bath (Salles de bain)', value: 'bath' },
          { title: 'Building (Architecture)', value: 'building' },
          { title: 'Compass (Orientation)', value: 'compass' },
          { title: 'Sun (Lumière)', value: 'sun' },
        ] } },
        { name: 'title', title: 'Titre', type: 'string' },
        { name: 'text', title: 'Texte', type: 'text', rows: 2 },
      ], preview: { select: { title: 'title', subtitle: 'icon' } } }],
    }),

    // ── LIFESTYLE ──
    defineField({ name: 'lifestyleEyebrow', title: 'Éyebrow', type: 'string', group: 'lifestyle' }),
    defineField({ name: 'lifestyleTitle', title: 'Titre', type: 'string', group: 'lifestyle' }),
    defineField({
      name: 'lifestyleBlocks', title: 'Blocs', type: 'array', group: 'lifestyle',
      of: [{ type: 'object', fields: [
        { name: 'title', title: 'Titre', type: 'string' },
        { name: 'text', title: 'Texte', type: 'text', rows: 3 },
        { name: 'image', title: 'Image', type: 'image' },
      ], preview: { select: { title: 'title', media: 'image' } } }],
    }),

    // ── F3 UNITS ──
    defineField({ name: 'f3UnitsEyebrow', title: 'Éyebrow F3', type: 'string', group: 'plans', initialValue: 'Les Résidences F3' }),
    defineField({ name: 'f3UnitsTitle', title: 'Titre F3', type: 'string', group: 'plans', initialValue: 'Choisissez votre F3' }),
    defineField({
      name: 'f3Units', title: 'Résidences F3', type: 'array', group: 'plans',
      of: [{ type: 'object', name: 'f3Unit', fields: [
        { name: 'ref', title: 'Référence (ex: A-103)', type: 'string' },
        { name: 'surface', title: 'Surface (m²)', type: 'string' },
        { name: 'image', title: 'Plan (image)', type: 'image' },
        { name: 'chambres', title: 'Chambres', type: 'number' },
        { name: 'sdb', title: 'Salles de bain', type: 'number' },
        { name: 'etage', title: 'Étage', type: 'string' },
        { name: 'orientation', title: 'Orientation', type: 'string' },
        { name: 'terrasse', title: 'Terrasse', type: 'string' },
        { name: 'exposition', title: 'Exposition', type: 'string' },
      ], preview: { select: { title: 'ref', subtitle: 'surface', media: 'image' } } }],
    }),

    // ── F4 UNITS ──
    defineField({ name: 'f4UnitsEyebrow', title: 'Éyebrow F4', type: 'string', group: 'plans', initialValue: 'Les Résidences F4' }),
    defineField({ name: 'f4UnitsTitle', title: 'Titre F4', type: 'string', group: 'plans', initialValue: 'Choisissez votre F4' }),
    defineField({
      name: 'f4Units', title: 'Résidences F4', type: 'array', group: 'plans',
      of: [{ type: 'object', name: 'f4Unit', fields: [
        { name: 'ref', title: 'Référence (ex: A-154)', type: 'string' },
        { name: 'surface', title: 'Surface (m²)', type: 'string' },
        { name: 'image', title: 'Plan (image)', type: 'image' },
        { name: 'chambres', title: 'Chambres', type: 'number' },
        { name: 'sdb', title: 'Salles de bain', type: 'number' },
        { name: 'etage', title: 'Étage', type: 'string' },
        { name: 'orientation', title: 'Orientation', type: 'string' },
        { name: 'terrasse', title: 'Terrasse', type: 'string' },
        { name: 'exposition', title: 'Exposition', type: 'string' },
      ], preview: { select: { title: 'ref', subtitle: 'surface', media: 'image' } } }],
    }),

    // ── VILLAS ──
    defineField({ name: 'villasEyebrow', title: 'Éyebrow Villas', type: 'string', group: 'plans', initialValue: 'Exclusivité Totale' }),
    defineField({ name: 'villasTitle', title: 'Titre Villas', type: 'string', group: 'plans', initialValue: 'Les Villas ASTERIA' }),
    defineField({
      name: 'villas', title: 'Villas', type: 'array', group: 'plans',
      of: [{ type: 'object', name: 'villa', fields: [
        { name: 'ref', title: 'Référence (ex: V-01)', type: 'string' },
        { name: 'chambres', title: 'Chambres', type: 'number' },
        { name: 'sdb', title: 'Salles de bain', type: 'number' },
        { name: 'piscine', title: 'Piscine (ex: Piscine privée 36 m²)', type: 'string' },
        { name: 'exposition', title: 'Exposition', type: 'string' },
        {
          name: 'levels', title: 'Niveaux', type: 'array',
          of: [{ type: 'object', name: 'level', fields: [
            { name: 'label', title: 'Nom du niveau (ex: Niveau 8)', type: 'string' },
            { name: 'sub', title: 'Description courte', type: 'string' },
            { name: 'image', title: 'Plan (image)', type: 'image' },
          ], preview: { select: { title: 'label', subtitle: 'sub', media: 'image' } } }],
        },
      ], preview: { select: { title: 'ref', subtitle: 'piscine' } } }],
    }),

    // ── CTA ──
    defineField({ name: 'ctaTitle', title: 'Titre CTA', type: 'string', group: 'cta' }),
    defineField({ name: 'ctaLabel', title: 'Libellé du bouton', type: 'string', group: 'cta' }),
    defineField({ name: 'ctaLink', title: 'Lien du bouton', type: 'string', group: 'cta', initialValue: '/#contact' }),
  ],
  preview: { prepare: () => ({ title: 'Page ASTERIA' }) },
})
