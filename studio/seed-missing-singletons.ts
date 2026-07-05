import { createClient } from '@sanity/client'
import { createReadStream } from 'fs'
import path from 'path'

const token = process.env.SANITY_AUTH_TOKEN
if (!token) {
  console.error('Set SANITY_AUTH_TOKEN before running this script.')
  process.exit(1)
}

const client = createClient({
  projectId: '4ovc1jum',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})
const publicDir = path.resolve(__dirname, '..', 'public')

const imageCache: Record<string, any> = {}

async function img(relativePath: string) {
  if (imageCache[relativePath]) return imageCache[relativePath]
  const filePath = path.join(publicDir, relativePath)
  console.log(`  ↑ uploading ${relativePath}`)
  const asset = await client.assets.upload('image', createReadStream(filePath), {
    filename: path.basename(filePath),
  })
  const ref = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
  imageCache[relativePath] = ref
  return ref
}

async function seed() {
  console.log('\n── À Propos (page) ──')
  const heroImage = await img('/images/asteria/building-hero.jpg')
  const missionImage = await img('/images/asteria/common-1.jpg')
  const philosophyImg1 = await img('/images/asteria/common-2.jpg')
  const philosophyImg2 = await img('/images/asteria/bathroom-1.jpg')
  const ctaImage = await img('/images/asteria/balcony-1.jpg')

  await client.createOrReplace({
    _id: 'apropos',
    _type: 'apropos',
    heroEyebrow: 'À Propos',
    heroTitle: ['Elite', 'Promotion'],
    heroSubtitle: 'Immobilière',
    heroImage,
    marqueeKeywords: ['Excellence', 'Vision', 'Confiance', 'Prestige', 'Architecture', 'Art de vivre', 'Sur-mesure'],

    storyText: 'Nous ne construisons pas seulement des résidences. Nous façonnons des adresses qui reflètent la réussite de ceux qui les habitent.',

    missionIndex: '01',
    missionEyebrow: 'Notre Mission',
    missionTitle1: "Redéfinir l'art",
    missionTitle2: 'de vivre',
    missionImage,
    missionParagraphs: [
      "Elite Promotion Immobilière est née d'une conviction : l'Algérie mérite un standing à la hauteur des plus grandes capitales. De la conception architecturale à la livraison clé en main, chaque détail est pensé pour l'exception.",
      "Avec ASTERIA, nous signons une première : une résidence où l'eau, la lumière et la végétation composent un paysage vertical inédit.",
    ],

    philosophy: [
      {
        _key: 'p1', index: '02', eyebrow: 'Notre Signature',
        title1: "L'eau, la lumière,", title2: 'le vivant',
        text: "Chez Elite, l'architecture ne s'arrête pas à la structure. Cascades suspendues, bassins à débordement et voûtes étoilées transforment chaque résidence en un paysage sensoriel, une expérience qui se vit autant qu'elle se regarde.",
        image: philosophyImg1, reverse: false,
      },
      {
        _key: 'p2', index: '03', eyebrow: "L'Exigence",
        title1: 'Le détail comme', title2: 'obsession',
        text: "Une adresse d'exception se reconnaît à ce qui ne se voit pas au premier regard : la justesse d'une jonction, la noblesse d'un matériau, la lumière pensée pièce par pièce. Rien n'est laissé au hasard, du premier plan à la remise des clés.",
        image: philosophyImg2, reverse: true,
      },
    ],

    valuesEyebrow: 'Nos Valeurs',
    valuesTitle: 'Ce qui nous distingue',
    values: [
      { _key: 'v1', icon: 'gem', title: 'Excellence', text: 'Des finitions et matériaux sélectionnés sans compromis, du gros œuvre à la dernière poignée de porte.' },
      { _key: 'v2', icon: 'compass', title: 'Recherche et développement', text: "L'excellence n'est jamais le fruit du hasard. Elle est le résultat d'une vision, d'une exigence et d'une quête permanente de perfection." },
      { _key: 'v3', icon: 'shield', title: 'Confiance', text: 'Des délais respectés et une transparence totale, de la réservation à la remise des clés.' },
      { _key: 'v4', icon: 'handshake', title: 'Accompagnement', text: 'Un conseiller dédié à chaque étape de votre projet, pour une expérience sereine et privée.' },
    ],

    founderQuote: 'Nous ne livrons pas des appartements. Nous remettons des clés de vie, une promesse tenue, pierre après pierre.',
    founderQuoteAccent: '',
    founderName: 'La Direction',
    founderOrg: 'Elite Promotion Immobilière',

    ctaTitle: 'Découvrez nos projets',
    ctaLabel: 'Explorer nos résidences',
    ctaLink: '/projets',
    ctaImage,
  })
  console.log('  ✓ apropos')

  console.log('\n── Page ASTERIA ──')
  const asteriaHero = await img('/images/asteria/building-hero.jpg')

  const f3Images = await Promise.all([
    img('/images/asteria/plan-103.jpg'),
    img('/images/asteria/plan-104.jpg'),
    img('/images/asteria/plan-109.jpg'),
    img('/images/asteria/plan-110.jpg'),
  ])
  const f4Images = await Promise.all([
    img('/images/asteria/plan-f4-154.png'),
    img('/images/asteria/plan-f4-171.png'),
  ])
  const villaImages = await Promise.all([
    Promise.all([img('/images/asteria/plan-villa-1-n8.png'), img('/images/asteria/plan-villa-1-n9.png'), img('/images/asteria/plan-villa-1-terrasse.png')]),
    Promise.all([img('/images/asteria/plan-villa-2-n8.jpg'), img('/images/asteria/plan-villa-2-n9.png'), img('/images/asteria/plan-villa-2-terrasse.png')]),
    Promise.all([img('/images/asteria/plan-villa-3-n8.png'), img('/images/asteria/plan-villa-3-n9.png'), img('/images/asteria/plan-villa-3-terrasse.png')]),
    Promise.all([img('/images/asteria/plan-villa-4-n8.png'), img('/images/asteria/plan-villa-4-n9.png'), img('/images/asteria/plan-villa-4-terrasse.png')]),
  ])

  await client.createOrReplace({
    _id: 'asteria',
    _type: 'asteria',
    heroEyebrow: 'Élite Promotion Immobilière présente',
    heroTitle: 'ASTERIA',
    heroSubtitle: 'Luxury Living',
    heroImage: asteriaHero,

    f3UnitsEyebrow: 'Les Résidences F3',
    f3UnitsTitle: 'Choisissez votre F3',
    f3Units: [
      { _key: 'f3-1', ref: 'A-103', surface: '103.88', image: f3Images[0], chambres: 2, sdb: 2, etage: '3ᵉ au 6ᵉ étage', orientation: "Sud · Baie d'Alger", terrasse: '16 m²', exposition: 'Double exposition' },
      { _key: 'f3-2', ref: 'A-104', surface: '104.93', image: f3Images[1], chambres: 2, sdb: 2, etage: '4ᵉ au 7ᵉ étage', orientation: 'Sud-Est', terrasse: '18 m²', exposition: 'Traversant' },
      { _key: 'f3-3', ref: 'A-109', surface: '109.42', image: f3Images[2], chambres: 2, sdb: 2, etage: '8ᵉ au 10ᵉ étage', orientation: 'Sud-Ouest · Couchant', terrasse: '22 m²', exposition: 'Traversant' },
      { _key: 'f3-4', ref: 'A-110', surface: '110.48', image: f3Images[3], chambres: 3, sdb: 2, etage: '11ᵉ au 12ᵉ étage', orientation: 'Panoramique · Baie et ville', terrasse: '26 m²', exposition: 'Angle premium' },
    ],

    f4UnitsEyebrow: 'Les Résidences F4',
    f4UnitsTitle: 'Choisissez votre F4',
    f4Units: [
      { _key: 'f4-1', ref: 'A-154', surface: '154.55', image: f4Images[0], chambres: 3, sdb: 2, etage: '2ᵉ au 6ᵉ étage', orientation: "Sud · Baie d'Alger", terrasse: '30 m²', exposition: 'Double exposition' },
      { _key: 'f4-2', ref: 'A-171', surface: '171.76', image: f4Images[1], chambres: 3, sdb: 2, etage: '7ᵉ au 11ᵉ étage', orientation: 'Panoramique · Baie et ville', terrasse: '40 m²', exposition: 'Angle premium' },
    ],

    villasEyebrow: 'Exclusivité Totale',
    villasTitle: 'Les Villas ASTERIA',
    villas: [
      {
        _key: 'v-1', ref: 'V-01', chambres: 4, sdb: 3, piscine: 'Piscine privée 36 m²', exposition: 'Plein sud',
        levels: [
          { _key: 'v1-n8', label: 'Niveau 8', sub: 'Séjour · Cuisine · Piscine', image: villaImages[0][0] },
          { _key: 'v1-n9', label: 'Niveau 9', sub: 'Chambres · Dressing · Hammam', image: villaImages[0][1] },
          { _key: 'v1-t', label: 'Terrasse', sub: 'Toit-terrasse · Piscine · Jardin', image: villaImages[0][2] },
        ],
      },
      {
        _key: 'v-2', ref: 'V-02', chambres: 4, sdb: 3, piscine: 'Piscine privée 15 m²', exposition: 'Plein ouest',
        levels: [
          { _key: 'v2-n8', label: 'Niveau 8', sub: 'Séjour · Cuisine · Aquarium mural', image: villaImages[1][0] },
          { _key: 'v2-n9', label: 'Niveau 9', sub: 'Chambres · Dressing · Home Cinéma', image: villaImages[1][1] },
          { _key: 'v2-t', label: 'Terrasse', sub: 'Toit-terrasse · Piscine · Sport', image: villaImages[1][2] },
        ],
      },
      {
        _key: 'v-3', ref: 'V-03', chambres: 4, sdb: 3, piscine: 'Piscine privée panoramique', exposition: 'Multi-exposition',
        levels: [
          { _key: 'v3-n8', label: 'Niveau 8', sub: 'Séjour · Cuisine · Cheminée', image: villaImages[2][0] },
          { _key: 'v3-n9', label: 'Niveau 9', sub: 'Chambres · Sauna · Hammam · Home Cinéma', image: villaImages[2][1] },
          { _key: 'v3-t', label: 'Terrasse', sub: 'Toit-terrasse · Piscine · Sport', image: villaImages[2][2] },
        ],
      },
      {
        _key: 'v-4', ref: 'V-04', chambres: 4, sdb: 3, piscine: "Piscine privée Baie d'Alger", exposition: 'Angle premium',
        levels: [
          { _key: 'v4-n8', label: 'Niveau 8', sub: 'Séjour · Cuisine · Aquarium mural', image: villaImages[3][0] },
          { _key: 'v4-n9', label: 'Niveau 9', sub: 'Chambres · Sauna · Hammam · Home Cinéma', image: villaImages[3][1] },
          { _key: 'v4-t', label: 'Terrasse', sub: 'Toit-terrasse · Piscine · Sport', image: villaImages[3][2] },
        ],
      },
    ],

    ctaTitle: 'Vivez ASTERIA',
    ctaLabel: 'Réserver une visite privée',
    ctaLink: '/#contact',
  })
  console.log('  ✓ asteria')

  console.log('\n✅ Seed complete! Refresh the Studio to see all content.\n')
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
