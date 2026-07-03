import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'

export default defineConfig({
  name: 'elite-promotion',
  title: 'Elite Promotion Immobilière',
  projectId: '4ovc1jum',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenu')
          .items([
            S.listItem()
              .title('Paramètres du site')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.listItem()
              .title('Page À Propos')
              .child(S.document().schemaType('apropos').documentId('apropos')),
            S.listItem()
              .title('Page ASTERIA')
              .child(S.document().schemaType('asteria').documentId('asteria')),
            S.divider(),
            S.documentTypeListItem('project').title('Projets'),
            S.documentTypeListItem('univers').title('Univers (catégories)'),
            S.divider(),
            S.documentTypeListItem('article').title('Le Journal'),
            S.documentTypeListItem('faq').title('FAQ'),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
})
