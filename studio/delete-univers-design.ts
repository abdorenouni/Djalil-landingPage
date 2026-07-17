import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-01-01' })

const DESIGN_DOC_ID = 'HipUx4AkhoAVzOqaoK4Cjt'

async function run() {
  await client.delete(DESIGN_DOC_ID)
  console.log('Deleted the "Nos Design" univers document from Sanity.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
