import { getCliClient } from 'sanity/cli'
import { createReadStream } from 'fs'
import path from 'path'

const client = getCliClient({ apiVersion: '2024-01-01' })
const publicDir = path.resolve(__dirname, '..', 'public')

const MAGNOLIA_DOC_ID = 'lam0QrU1I74uWM1Y3pgsm4'

const ITEMS = [
  { file: 'FD6EFAB0-B423-4189-8B31-FC866BF7E3E1.png', caption: 'Vue Panoramique', desc: "Face à la mer, MAGNOLIA s'élève comme une sculpture contemporaine — ses volumes épurés dialoguent avec l'horizon méditerranéen.", aspect: '16/9', wide: true },
  { file: '3A2C0AAE-608F-4B79-90BE-6B92E97E4C1F.png', caption: 'Terrasse Balnéaire', desc: 'Des terrasses généreuses ouvertes sur la mer, où chaque lever de soleil devient un privilège quotidien.', aspect: '4/3', wide: false },
  { file: '6A5DB9C9-F082-496D-905F-1142989BEE99.png', caption: 'Espace de Vie', desc: 'Des intérieurs lumineux baignés par la lumière marine, conçus pour sublimer chaque instant du quotidien.', aspect: '4/3', wide: false },
  { file: '484EAAB8-29C3-4D32-8C84-BE2332D58056.png', caption: 'Piscine à Débordement', desc: "Une piscine à débordement suspendue au-dessus de la Méditerranée — l'eau et l'horizon ne font qu'un.", aspect: '3/4', wide: false },
  { file: '96A19E33-DCA6-48AB-A511-6C701D3C9F55.png', caption: 'Architecture Littorale', desc: 'Chaque façade est orientée pour capturer la lumière naturelle du littoral, du lever au coucher du soleil.', aspect: '3/4', wide: false },
  { file: '066FCA3D-8CB6-4F0D-9EBD-82C0CB162806.png', caption: 'Cadre de Vie Exclusif', desc: "Un environnement pensé pour l'exception : matériaux nobles, finitions sur-mesure et vue imprenable sur la mer.", aspect: '16/9', wide: true },
  { file: 'A5585F72-C839-4C50-8250-FCC55FB335B7.png', caption: 'Suite Parentale', desc: "Des suites parentales avec vue directe sur la mer — s'endormir et se réveiller face à l'horizon, chaque jour.", aspect: '4/3', wide: false },
  { file: 'CC978A0A-07F5-485B-947F-CB893B34ABA0.png', caption: 'Espaces Communs', desc: 'Des espaces communs raffinés, entre sérénité et élégance, pour une expérience de vie au plus près de la mer.', aspect: '4/3', wide: false },
  { file: 'F1212258-C210-4667-8F23-233E9A9A0649.png', caption: 'Détails & Finitions', desc: 'Une attention absolue portée au détail — chaque surface, chaque matière, chaque ligne pensée pour durer.', aspect: '16/9', wide: true },
]

function key() {
  return Math.random().toString(36).slice(2, 10)
}

async function run() {
  console.log('── Uploading Magnolia gallery images ──')
  const galleryItems = []
  for (const item of ITEMS) {
    const filePath = path.join(publicDir, 'images', 'magnolia', item.file)
    console.log(`  ↑ ${item.file}`)
    const asset = await client.assets.upload('image', createReadStream(filePath), { filename: item.file })
    galleryItems.push({
      _type: 'galleryItem',
      _key: key(),
      image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
      caption: item.caption,
      desc: item.desc,
      aspect: item.aspect,
      wide: item.wide,
    })
  }

  console.log('── Patching MAGNOLIA document ──')
  await client.patch(MAGNOLIA_DOC_ID).set({ galleryItems }).commit()
  console.log('Done — galleryItems written to MAGNOLIA.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
