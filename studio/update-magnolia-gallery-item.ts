import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-01-01' })

const MAGNOLIA_DOC_ID = 'lam0QrU1I74uWM1Y3pgsm4'
const TARGET_KEY = 'zu0p4h3o' // was "Détails & Finitions"

async function run() {
  await client
    .patch(MAGNOLIA_DOC_ID)
    .set({
      [`galleryItems[_key=="${TARGET_KEY}"].caption`]: 'Chambres avec Vue sur la Méditerranée',
      [`galleryItems[_key=="${TARGET_KEY}"].desc`]: "Des chambres baignées de lumière, où chaque réveil s'ouvre sur l'immensité de la Méditerranée.",
    })
    .commit()
  console.log('Updated MAGNOLIA gallery item caption/desc.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
