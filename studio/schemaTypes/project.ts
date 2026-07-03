import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Projet',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nom', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug (URL)', type: 'slug', options: { source: 'name', maxLength: 96 }, validation: (r) => r.required() }),
    defineField({ name: 'tagline', title: 'Accroche', type: 'string' }),
    defineField({ name: 'location', title: 'Localisation', type: 'string' }),
    defineField({ name: 'year', title: 'Année', type: 'string' }),
    defineField({
      name: 'status', title: 'Statut', type: 'string',
      options: { list: [{ title: 'En cours', value: 'En cours' }, { title: 'Livré', value: 'Livré' }, { title: 'À venir', value: 'À venir' }] },
      initialValue: 'En cours',
    }),
    defineField({ name: 'featured', title: 'Projet phare', type: 'boolean', initialValue: false }),
    defineField({ name: 'cover', title: 'Image principale', type: 'image', options: { hotspot: true }, validation: (r) => r.required() }),
    defineField({ name: 'gallery', title: 'Galerie', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] }),
    defineField({ name: 'description', title: 'Description', type: 'array', of: [{ type: 'block' }] }),
    defineField({
      name: 'stats', title: 'Chiffres', type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'number', title: 'Nombre', type: 'string' },
        { name: 'label', title: 'Libellé', type: 'string' },
      ], preview: { select: { title: 'number', subtitle: 'label' } } }],
    }),
    defineField({ name: 'order', title: "Ordre d'affichage", type: 'number', initialValue: 0 }),
  ],
  orderings: [{ title: 'Ordre', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'location', media: 'cover' } },
})
