import { getCliClient } from 'sanity/cli'
import { createReadStream } from 'fs'
import path from 'path'

const client = getCliClient({ apiVersion: '2024-01-01' })
const publicDir = path.resolve(__dirname, '..', 'public')

const ASTERIA_DOC_ID = 'HipUx4AkhoAVzOqaoK493o'

async function run() {
  const filePath = path.join(publicDir, 'images', 'asteria', 'asteria-hero.png')
  console.log('Uploading asteria-hero.png as the ASTERIA project cover...')
  const asset = await client.assets.upload('image', createReadStream(filePath), { filename: 'asteria-hero.png' })
  await client
    .patch(ASTERIA_DOC_ID)
    .set({ cover: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } } })
    .commit()
  console.log('Updated ASTERIA cover to match the header page photo.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
