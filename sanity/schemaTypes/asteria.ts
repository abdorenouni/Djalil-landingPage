import { defineType, defineField } from 'sanity'

/** ASTERIA page content — hero copy, gallery, CTA. One singleton document. */
export default defineType({
  name: 'asteria',
  title: 'Page ASTERIA',
  type: 'document',

  groups: [
    { name: 'hero',    title: 'Hero' },
    { name: 'intro',   title: 'Intro & stats' },
    { name: 'gallery', title: 'Galerie Villas' },
    { name: 'cta',     title: 'Call to action' },
  ],

  fields: [
    /* ── Hero ── */
    defineField({ name: 'heroEyebrow', title: 'Accroche (petit texte au-dessus)', type: 'string', group: 'hero' }),
    defineField({ name: 'heroTitle',   title: 'Titre principal',                  type: 'string', group: 'hero' }),
    defineField({ name: 'heroSubtitle',title: 'Sous-titre',                       type: 'string', group: 'hero' }),
    defineField({ name: 'heroImage',   title: 'Image hero',                       type: 'image',  group: 'hero', options: { hotspot: true } }),

    /* ── Intro ── */
    defineField({ name: 'introText', title: 'Texte introductif', type: 'array', of: [{ type: 'block' }], group: 'intro' }),
    defineField({
      name: 'stats', title: 'Statistiques (chiffres clés)', type: 'array', group: 'intro',
      of: [{ type: 'object', fields: [
        { name: 'number', title: 'Nombre', type: 'string' },
        { name: 'label',  title: 'Libellé', type: 'string' },
      ], preview: { select: { title: 'number', subtitle: 'label' } } }],
    }),

    /* ── Villa gallery ── */
    defineField({
      name: 'villaGallery',
      title: 'Galerie Villas — Intérieurs',
      description: 'Ajoutez photos et vidéos des intérieurs. Faites glisser pour réordonner.',
      type: 'array',
      group: 'gallery',
      of: [
        {
          type: 'object',
          name: 'galleryItem',
          title: 'Élément',
          fields: [
            defineField({
              name: 'mediaType', title: 'Type de média',
              type: 'string',
              options: { list: [{ title: '📷  Photo', value: 'photo' }, { title: '🎬  Vidéo', value: 'video' }], layout: 'radio' },
              initialValue: 'photo',
              validation: (r) => r.required(),
            }),
            /* Photo fields */
            defineField({
              name: 'image', title: 'Photo',
              type: 'image', options: { hotspot: true },
              hidden: ({ parent }: any) => parent?.mediaType !== 'photo',
            }),
            defineField({
              name: 'alt', title: 'Description de la photo (texte alt)',
              type: 'string',
              hidden: ({ parent }: any) => parent?.mediaType !== 'photo',
            }),
            /* Video fields */
            defineField({
              name: 'videoFile', title: 'Fichier vidéo (MP4)',
              type: 'file', options: { accept: 'video/mp4,video/webm' },
              hidden: ({ parent }: any) => parent?.mediaType !== 'video',
            }),
            defineField({
              name: 'poster', title: 'Miniature vidéo (poster)',
              type: 'image', options: { hotspot: true },
              description: 'Image affichée avant que la vidéo se charge',
              hidden: ({ parent }: any) => parent?.mediaType !== 'video',
            }),
          ],
          preview: {
            select: { mediaType: 'mediaType', image: 'image', alt: 'alt' },
            prepare({ mediaType, image, alt }: { mediaType: string; image: any; alt: string }) {
              return {
                title: mediaType === 'video' ? '🎬 Vidéo' : (alt || '📷 Photo'),
                media: image,
              }
            },
          },
        },
      ],
    }),

    /* ── CTA ── */
    defineField({ name: 'ctaTitle', title: 'CTA — Titre de la section', type: 'string', group: 'cta' }),
    defineField({ name: 'ctaLabel', title: 'CTA — Texte du bouton',     type: 'string', group: 'cta' }),
    defineField({ name: 'ctaLink',  title: 'CTA — Lien',                type: 'string', group: 'cta', initialValue: '/#contact' }),
  ],

  preview: { prepare: () => ({ title: 'Page ASTERIA' }) },
})
