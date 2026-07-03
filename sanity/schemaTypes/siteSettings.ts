import { defineType, defineField } from 'sanity'

/** Singleton — all the global, editable content (one document). */
export default defineType({
  name: 'siteSettings',
  title: 'Paramètres du site',
  type: 'document',
  fields: [
    defineField({ name: 'brandName', title: 'Nom de la marque', type: 'string', initialValue: 'Elite Promotion Immobilière' }),
    defineField({ name: 'tagline', title: 'Slogan', type: 'string' }),

    // Hero / accueil
    defineField({ name: 'heroHeadline', title: 'Titre du hero (accueil)', type: 'string' }),
    defineField({ name: 'heroSubtext', title: 'Sous-titre du hero', type: 'text', rows: 2 }),

    // À propos
    defineField({ name: 'aboutText', title: 'Texte « À Propos »', type: 'array', of: [{ type: 'block' }] }),
    defineField({
      name: 'stats', title: 'Chiffres clés', type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'number', title: 'Nombre (ex: 10+, 100%)', type: 'string' },
        { name: 'label', title: 'Libellé', type: 'string' },
      ], preview: { select: { title: 'number', subtitle: 'label' } } }],
    }),

    // Contact
    defineField({ name: 'phone', title: 'Téléphone', type: 'string' }),
    defineField({ name: 'phone2', title: 'Téléphone 2', type: 'string' }),
    defineField({ name: 'whatsapp', title: 'Numéro WhatsApp (chiffres seuls)', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'address', title: 'Adresse', type: 'string' }),
    defineField({ name: 'instagram', title: 'Instagram (URL)', type: 'url' }),
    defineField({ name: 'facebook', title: 'Facebook (URL)', type: 'url' }),

    // SEO defaults
    defineField({ name: 'seoTitle', title: 'Titre SEO par défaut', type: 'string' }),
    defineField({ name: 'seoDescription', title: 'Description SEO par défaut', type: 'text', rows: 3 }),
    defineField({ name: 'ogImage', title: 'Image de partage (OpenGraph)', type: 'image' }),
  ],
  preview: { prepare: () => ({ title: 'Paramètres du site' }) },
})
