import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-01-01' })

const MAGNOLIA_DOC_ID = 'lam0QrU1I74uWM1Y3pgsm4'
const TARGET_KEY = 'xkrvjj56' // "Vue Panoramique"

async function run() {
  await client
    .patch(MAGNOLIA_DOC_ID)
    .set({
      [`galleryItems[_key=="${TARGET_KEY}"].desc`]: "Face à la mer, MAGNOLIA s'élève comme une sculpture contemporaine. Ses volumes épurés dialoguent avec l'horizon méditerranéen.",
    })
    .commit()
  console.log('Removed em-dash from MAGNOLIA gallery caption.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
