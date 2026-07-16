import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-01-01' })

const MAGNOLIA_DOC_ID = 'lam0QrU1I74uWM1Y3pgsm4'

const KEYS_TO_REMOVE = [
  'ecd38pvs', // Terrasse Balnéaire
  'i64srtx4', // Espace de Vie
  'lynwfhq9', // Piscine à Débordement
  '4odc5q63', // Architecture Littorale
  'uvxaxffy', // Suite Parentale
  'fz2hq7fg', // Espaces Communs
]

async function run() {
  const unset = KEYS_TO_REMOVE.map((k) => `galleryItems[_key=="${k}"]`)
  await client.patch(MAGNOLIA_DOC_ID).unset(unset).commit()
  console.log(`Removed ${KEYS_TO_REMOVE.length} gallery items from MAGNOLIA.`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
