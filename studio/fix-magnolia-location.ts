import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-01-01' })

const MAGNOLIA_DOC_ID = 'lam0QrU1I74uWM1Y3pgsm4'

async function run() {
  const doc = await client.getDocument(MAGNOLIA_DOC_ID)
  if (!doc) throw new Error('MAGNOLIA document not found')

  const description = (doc.description as any[]).map((block) => {
    if (block._type !== 'block') return block
    return {
      ...block,
      children: block.children.map((span: any) => ({
        ...span,
        text: typeof span.text === 'string' ? span.text.replace(/Oran/g, 'Boumerdès') : span.text,
      })),
    }
  })

  await client
    .patch(MAGNOLIA_DOC_ID)
    .set({ location: 'Boumerdès', description })
    .commit()
  console.log('Updated MAGNOLIA location and description text: Oran -> Boumerdès.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
