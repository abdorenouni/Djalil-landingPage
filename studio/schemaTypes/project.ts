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
    defineField({
      name: 'cover', title: 'Image principale', type: 'image', options: { hotspot: true },
      description: 'Utilisée partout : carte de la page Projets, héro et bandeau final de la page du projet. Obligatoire.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'gallery', title: 'Galerie', type: 'array', of: [{ type: 'image', options: { hotspot: true } }],
      description: "Photos de la page du projet : la 1ʳᵉ illustre le texte de présentation, les suivantes composent la section « La Galerie ». Si la galerie est vide, ces sections disparaissent du site.",
      validation: (r) => r.min(3).warning('Recommandé : au moins 3 photos — sinon la section « La Galerie » ne s\'affiche pas sur le site.'),
    }),
    defineField({
      name: 'galleryItems', title: 'Galerie enrichie (avec légendes)', type: 'array',
      description: "Galerie avancée avec légende, description et mise en page par photo — utilisée sur la page du projet à la place de la « Galerie » simple quand elle contient au moins une photo. Laisser vide pour utiliser la « Galerie » simple ci-dessus.",
      of: [{
        type: 'object', name: 'galleryItem',
        fields: [
          { name: 'image', title: 'Photo', type: 'image', options: { hotspot: true }, validation: (r: any) => r.required() },
          { name: 'caption', title: 'Légende', type: 'string', validation: (r: any) => r.required() },
          { name: 'desc', title: 'Description', type: 'text', rows: 2 },
          {
            name: 'aspect', title: 'Format', type: 'string',
            options: { list: [{ title: 'Paysage (16/9)', value: '16/9' }, { title: 'Standard (4/3)', value: '4/3' }, { title: 'Portrait (3/4)', value: '3/4' }, { title: 'Carré (1/1)', value: '1/1' }] },
            initialValue: '4/3',
          },
          { name: 'wide', title: 'Pleine largeur', description: 'La photo occupe les deux colonnes de la grille.', type: 'boolean', initialValue: false },
        ],
        preview: { select: { title: 'caption', media: 'image' } },
      }],
    }),
    defineField({
      name: 'description', title: 'Description', type: 'array', of: [{ type: 'block' }],
      description: 'Le 1ᵉʳ paragraphe devient la grande phrase d\'introduction de la page ; les suivants forment le texte « Le Projet ».',
      validation: (r) => r.min(1).warning('Sans description, la page du projet perd son introduction.'),
    }),
    defineField({
      name: 'stats', title: 'Chiffres', type: 'array',
      description: 'Bandeau de chiffres clés qui défile sur la page du projet (ex. « 12 / Étages »). Laisser vide masque le bandeau.',
      of: [{ type: 'object', fields: [
        { name: 'number', title: 'Nombre', type: 'string' },
        { name: 'label', title: 'Libellé', type: 'string' },
      ], preview: { select: { title: 'number', subtitle: 'label' } } }],
      validation: (r) => r.min(2).warning('Recommandé : au moins 2 chiffres — sinon le bandeau de chiffres disparaît du site.'),
    }),
    defineField({ name: 'order', title: "Ordre d'affichage", type: 'number', initialValue: 0 }),
  ],
  orderings: [{ title: 'Ordre', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'location', media: 'cover' } },
})
