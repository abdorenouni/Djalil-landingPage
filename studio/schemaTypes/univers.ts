import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'univers',
  title: 'Univers (catégorie)',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Titre (ex: Nos Intérieurs)', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug (URL)', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: (r) => r.required() }),
    defineField({ name: 'num', title: 'Numéro (ex: 01)', type: 'string' }),
    defineField({ name: 'kicker', title: 'Surtitre', type: 'string', initialValue: "L'Univers Elite" }),
    defineField({ name: 'tagline', title: 'Sous-titre', type: 'string' }),
    defineField({ name: 'hero', title: 'Image hero', type: 'image', options: { hotspot: true }, validation: (r) => r.required() }),
    defineField({ name: 'intro', title: 'Texte d\'introduction', type: 'text', rows: 5 }),
    defineField({
      name: 'variant', title: 'Mise en page galerie', type: 'string',
      options: { list: [
        { title: 'Galerie classique', value: 'gallery' },
        { title: 'Cinématique', value: 'cinematic' },
        { title: 'Éditorial', value: 'editorial' },
      ] },
      initialValue: 'gallery',
    }),
    defineField({ name: 'show3D', title: 'Afficher bloc 3D', type: 'boolean', initialValue: false }),
    defineField({
      name: 'features', title: 'Points forts', type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'title', title: 'Titre', type: 'string' },
        { name: 'text', title: 'Description', type: 'text', rows: 2 },
      ], preview: { select: { title: 'title', subtitle: 'text' } } }],
    }),
    defineField({
      name: 'gallery', title: 'Galerie', type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
        { name: 'caption', title: 'Légende', type: 'string' },
        { name: 'span', title: 'Largeur (colonnes)', type: 'number', initialValue: 1 },
      ], preview: { select: { title: 'caption', media: 'image' } } }],
    }),
    defineField({ name: 'quote', title: 'Citation', type: 'string' }),
    defineField({
      name: 'stats', title: 'Statistiques', type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'number', title: 'Nombre', type: 'string' },
        { name: 'label', title: 'Libellé', type: 'string' },
        { name: 'suffix', title: 'Suffixe', type: 'string' },
      ], preview: { select: { title: 'number', subtitle: 'label' } } }],
    }),
    defineField({ name: 'order', title: "Ordre d'affichage", type: 'number', initialValue: 0 }),
  ],
  orderings: [{ title: 'Ordre', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'tagline', media: 'hero' } },
})
