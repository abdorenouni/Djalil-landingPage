import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'article',
  title: 'Article (Le Journal)',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Titre', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug (URL)', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: (r) => r.required() }),
    defineField({
      name: 'category', title: 'Catégorie', type: 'string',
      options: { list: ['Investissement', 'Architecture', 'Art de vivre'] },
    }),
    defineField({ name: 'excerpt', title: 'Extrait', type: 'text', rows: 3 }),
    defineField({ name: 'cover', title: 'Image de couverture', type: 'image', options: { hotspot: true }, validation: (r) => r.required() }),
    defineField({ name: 'date', title: 'Date de publication', type: 'datetime', initialValue: () => new Date().toISOString() }),
    defineField({ name: 'readMinutes', title: 'Durée de lecture (min)', type: 'number', initialValue: 5 }),
    defineField({ name: 'author', title: 'Auteur', type: 'string', initialValue: 'Elite Promotion' }),
    defineField({ name: 'featured', title: 'Article à la une', type: 'boolean', initialValue: false }),
    defineField({
      name: 'body', title: 'Contenu', type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
    }),
  ],
  orderings: [{ title: 'Plus récent', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] }],
  preview: { select: { title: 'title', subtitle: 'category', media: 'cover' } },
})
