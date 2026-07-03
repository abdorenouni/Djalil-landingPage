import { createClient } from '@sanity/client'
// Named export — the default export of @sanity/image-url is deprecated.
import { createImageUrlBuilder } from '@sanity/image-url'

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || '4ovc1jum',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  perspective: 'published',
})

const builder = createImageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}
