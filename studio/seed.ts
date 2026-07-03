import { getCliClient } from 'sanity/cli'
import { createReadStream } from 'fs'
import path from 'path'

const client = getCliClient({ apiVersion: '2024-01-01' })
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

function block(text: string, style = 'normal') {
  return {
    _type: 'block',
    _key: Math.random().toString(36).slice(2, 10),
    style,
    children: [{ _type: 'span', _key: 'a', text, marks: [] }],
    markDefs: [],
  }
}

async function seed() {
  console.log('\n── Site Settings ──')
  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    brandName: 'Elite Promotion Immobilière',
    tagline: 'Luxury Living',
    heroHeadline: "L'excellence a une nouvelle adresse",
    heroSubtext: 'Résidences haut standing à Alger — conçues pour ceux qui n\'acceptent aucun compromis.',
    phone: '+213 555 123 456',
    phone2: '+213 555 789 012',
    email: 'contact@elite-promotion.dz',
    address: 'Alger, Algérie',
    whatsapp: '213555123456',
    seoTitle: 'Elite Promotion Immobilière — Résidences haut standing à Alger',
    seoDescription: 'Découvrez ASTERIA et les résidences d\'exception signées Elite Promotion. Haut standing, finitions sur-mesure, livraison garantie.',
    aboutText: [
      block("Elite Promotion Immobilière redéfinit le standing résidentiel en Algérie. Chaque projet est pensé comme une adresse d'exception — pas un simple programme immobilier."),
      block("Notre signature : des résidences où l'architecture, les matériaux et le service forment un tout cohérent, du premier coup de crayon à la remise des clés."),
    ],
    stats: [
      { _key: 's1', number: '10+', label: 'Ans d\'expertise' },
      { _key: 's2', number: '100%', label: 'Projets livrés à temps' },
      { _key: 's3', number: 'F3', label: 'Résidences 103–110 m²' },
      { _key: 's4', number: '24/7', label: 'Accompagnement dédié' },
    ],
  })
  console.log('  ✓ siteSettings')

  console.log('\n── Projects ──')
  const asteriaCover = await img('/images/asteria/building-hero.jpg')
  const asteriaGallery = await Promise.all([
    img('/images/asteria/building-front.jpg'),
    img('/images/asteria/living-1.jpg'),
    img('/images/asteria/balcony-1.jpg'),
    img('/images/asteria/common-pool.jpg'),
    img('/images/asteria/bedroom-1.jpg'),
    img('/images/asteria/bathroom-1.jpg'),
  ])
  await client.create({
    _type: 'project',
    name: 'ASTERIA',
    slug: { _type: 'slug', current: 'asteria' },
    tagline: 'Luxury Living',
    location: 'Alger',
    year: '2025',
    status: 'En cours',
    featured: true,
    cover: asteriaCover,
    gallery: asteriaGallery.map((g, i) => ({ ...g, _key: `g${i}` })),
    description: [
      block("Une architecture sculptée par la lumière, où chaque balcon ondule comme une vague et chaque cascade murmure le luxe."),
      block("ASTERIA n'est pas une adresse — c'est une signature. Découvrez la résidence dans son intégralité."),
    ],
    stats: [
      { _key: 's1', number: '12', label: 'Étages signature' },
      { _key: 's2', number: 'F3', label: 'Résidences 103–110 m²' },
      { _key: 's3', number: '∞', label: 'Piscines & cascades' },
      { _key: 's4', number: '24/7', label: 'Conciergerie privée' },
    ],
    order: 1,
  })
  console.log('  ✓ ASTERIA')

  const magnoliaCover = await img('/images/carousel-2.jpg')
  const magnoliaGallery = await Promise.all([
    img('/images/carousel-1.jpg'),
    img('/images/carousel-3.jpg'),
    img('/images/service-1.jpg'),
    img('/images/service-2.jpg'),
    img('/images/service-3.jpg'),
  ])
  await client.create({
    _type: 'project',
    name: 'MAGNOLIA',
    slug: { _type: 'slug', current: 'magnolia' },
    tagline: 'Résidence-Jardin',
    location: 'Oran',
    year: '2026',
    status: 'À venir',
    featured: false,
    cover: magnoliaCover,
    gallery: magnoliaGallery.map((g, i) => ({ ...g, _key: `g${i}` })),
    description: [
      block("MAGNOLIA réinvente la résidence-jardin : des terrasses végétalisées en cascade, des patios suspendus et une lumière qui circule librement entre l'intérieur et le dehors."),
      block("Pensée pour Oran, cette adresse conjugue intimité, verdure et art de vivre méditerranéen — une parenthèse de calme au cœur de la ville."),
    ],
    stats: [
      { _key: 's1', number: '8', label: 'Étages jardin' },
      { _key: 's2', number: 'F4', label: 'Résidences 120–145 m²' },
      { _key: 's3', number: '3', label: 'Patios suspendus' },
      { _key: 's4', number: '2027', label: 'Livraison prévue' },
    ],
    order: 2,
  })
  console.log('  ✓ MAGNOLIA')

  console.log('\n── Articles ──')
  const articles = [
    {
      title: 'ASTERIA : repenser le paysage vertical',
      slug: 'asteria-paysage-vertical',
      category: 'ASTERIA',
      excerpt: "Comment l'eau, la lumière et la végétation se conjuguent pour transformer une tour résidentielle en écosystème vivant au cœur d'Alger.",
      coverPath: '/images/asteria/building-hero.jpg',
      date: '2026-05-28T00:00:00Z',
      readMinutes: 6,
      featured: true,
      body: [
        { style: 'normal', text: "À Alger, la verticalité a longtemps rimé avec densité. ASTERIA propose l'inverse : une tour conçue comme un paysage habité, où chaque étage prolonge le ciel plutôt que de l'occulter." },
        { style: 'h2', text: 'Une façade qui respire' },
        { style: 'normal', text: "Des cascades suspendues glissent entre les niveaux, adoucissant la lumière et rafraîchissant naturellement les terrasses. La façade n'est plus une limite : elle devient une membrane vivante entre l'intérieur et la ville." },
        { style: 'blockquote', text: "Nous ne dessinons pas des appartements empilés. Nous composons un territoire vertical." },
        { style: 'h2', text: "L'eau comme matériau" },
        { style: 'normal', text: "Chaque terrasse supérieure s'ouvre sur son propre bassin à débordement, suspendu au-dessus de la ville. L'eau y est traitée comme un matériau architectural à part entière — réfléchissante le jour, lumineuse la nuit." },
        { style: 'normal', text: "ASTERIA n'est pas une promesse de standing. C'est une démonstration : l'Algérie peut produire une architecture résidentielle de rang international." },
      ],
    },
    {
      title: "L'art de vivre en hauteur",
      slug: 'art-de-vivre-vertical',
      category: 'Art de vivre',
      excerpt: "Lumière, silence, vues dégagées : ce que change réellement la vie à plusieurs dizaines de mètres au-dessus de la ville.",
      coverPath: '/images/asteria/living-1.jpg',
      date: '2026-05-12T00:00:00Z',
      readMinutes: 5,
      featured: false,
      body: [
        { style: 'normal', text: "Vivre en hauteur n'est pas qu'une question de vue. C'est une autre relation au temps, à la lumière et au calme." },
        { style: 'h2', text: 'La lumière comme luxe premier' },
        { style: 'normal', text: "Aux étages supérieurs, la lumière entre plus longtemps, plus pure. Les séjours d'ASTERIA sont orientés pour capter le couchant sur la baie." },
        { style: 'blockquote', text: "Le vrai luxe, c'est l'espace, le silence et la lumière — tout le reste suit." },
        { style: 'normal', text: "Les plafonds étoilés en fibre optique prolongent le jour à la nuit, recréant une voûte nocturne dans chaque pièce de vie." },
      ],
    },
    {
      title: 'Le standing algérien en 2026',
      slug: 'standing-algerien-2026',
      category: 'Marché',
      excerpt: "Le marché du haut de gamme à Alger évolue. Décryptage des attentes d'une clientèle exigeante et de ce qui définit désormais l'exception.",
      coverPath: '/images/asteria/common-1.jpg',
      date: '2026-04-30T00:00:00Z',
      readMinutes: 7,
      featured: false,
      body: [
        { style: 'normal', text: "La demande de résidences d'exception à Alger n'a jamais été aussi affirmée. Mais les critères ont changé." },
        { style: 'h2', text: 'Au-delà des mètres carrés' },
        { style: 'normal', text: "La clientèle ne compare plus seulement des surfaces. Elle évalue des services, des espaces communs, une sécurité, une signature architecturale et une promesse de délais tenus." },
        { style: 'blockquote', text: "L'exception ne se mesure plus en m², mais en qualité d'expérience." },
        { style: 'normal', text: "C'est précisément ce déplacement des attentes qu'ASTERIA anticipe : un projet pensé comme une adresse, pas comme un produit." },
      ],
    },
    {
      title: 'Le détail comme signature',
      slug: 'detail-signature-finitions',
      category: 'Architecture',
      excerpt: "Du choix des matériaux à la dernière poignée de porte, pourquoi l'excellence d'une résidence se joue dans ce qui ne se voit pas au premier regard.",
      coverPath: '/images/asteria/bathroom-1.jpg',
      date: '2026-04-15T00:00:00Z',
      readMinutes: 4,
      featured: false,
      body: [
        { style: 'normal', text: "Une résidence d'exception se reconnaît moins à ses volumes qu'à la constance de ses détails." },
        { style: 'h2', text: 'La cohérence jusqu\'au bout' },
        { style: 'normal', text: "Matériaux nobles, jonctions parfaites, éclairage pensé pièce par pièce : l'excellence est une discipline qui ne s'autorise aucun relâchement, du gros œuvre à la remise des clés." },
        { style: 'blockquote', text: "Le luxe, c'est mille décisions invisibles prises correctement." },
      ],
    },
  ]

  for (const a of articles) {
    const cover = await img(a.coverPath)
    await client.create({
      _type: 'article',
      title: a.title,
      slug: { _type: 'slug', current: a.slug },
      category: a.category,
      excerpt: a.excerpt,
      cover,
      date: a.date,
      readMinutes: a.readMinutes,
      author: 'Elite Promotion',
      featured: a.featured,
      body: a.body.map((b) => block(b.text, b.style)),
    })
    console.log(`  ✓ ${a.title}`)
  }

  console.log('\n── FAQ ──')
  const faqs = [
    { q: 'Quels types de résidences propose Elite Promotion ?', a: "Elite Promotion se spécialise dans les résidences haut standing — principalement des F3 (3 pièces) entre 103 et 110 m². Chaque projet est pensé comme une adresse d'exception, avec des finitions sur-mesure, des espaces communs premium et un accompagnement personnalisé de A à Z." },
    { q: "Comment se déroule le processus d'achat ?", a: "Le parcours est simple et accompagné : 1) Prise de contact avec un conseiller dédié, 2) Visite privée de la résidence, 3) Réservation avec accompagnement administratif complet, 4) Remise des clés de votre bien, prêt à vivre. À chaque étape, vous disposez d'un interlocuteur unique." },
    { q: "Qu'est-ce qui distingue ASTERIA des autres projets ?", a: "ASTERIA est la résidence signature d'Elite : cascades suspendues entre les étages, piscines à débordement privatives, plafonds étoilés en fibre optique, et une façade architecturale qui redéfinit le standing à Alger. C'est le premier projet en Algérie à intégrer l'eau comme matériau architectural à cette échelle." },
    { q: 'Puis-je visiter le projet avant de réserver ?', a: "Absolument. Nous organisons des visites privées sur rendez-vous, adaptées à votre emploi du temps. Chaque visite est conduite par un conseiller qui vous présente la résidence, les finitions et répond à toutes vos questions dans un cadre confidentiel et sans engagement." },
    { q: 'Quels sont les délais de livraison ?', a: "Elite s'engage sur des délais respectés — c'est l'un de nos piliers. Les dates de livraison sont contractuelles et communiquées dès la réservation. Notre historique affiche 100% de projets livrés dans les délais annoncés." },
    { q: 'Proposez-vous des facilités de paiement ?', a: "Oui, nous proposons des plans de paiement échelonnés adaptés à votre situation. Les modalités sont discutées lors de votre rendez-vous avec un conseiller dédié, en toute confidentialité. Contactez-nous pour une étude personnalisée." },
  ]

  for (let i = 0; i < faqs.length; i++) {
    await client.create({
      _type: 'faq',
      question: faqs[i].q,
      answer: faqs[i].a,
      order: i + 1,
    })
    console.log(`  ✓ Q${i + 1}`)
  }

  console.log('\n── Univers ──')
  const universData = [
    {
      title: 'Nos Intérieurs', slug: 'interieurs', num: '01',
      tagline: "L'art de l'espace et de la lumière",
      heroPath: '/images/asteria/living-1.jpg',
      intro: "Chaque intérieur signé Elite est pensé comme une scène de vie : des volumes généreux, une lumière qui circule librement et des matériaux choisis pour vieillir avec grâce.\n\nDu séjour traversant à la suite parentale, rien n'est laissé au hasard — la proportion, la texture et le silence deviennent un luxe.",
      variant: 'gallery', show3D: false,
      features: [
        { title: 'Volumes traversants', text: 'Des séjours baignés de lumière du matin au couchant, ouverts sur la ville.' },
        { title: 'Plafonds étoilés', text: 'Une voûte de fibres optiques qui prolonge le jour à la nuit dans chaque pièce de vie.' },
        { title: 'Matières nobles', text: 'Marbres, bois et laitons sélectionnés pièce par pièce, sans compromis.' },
      ],
      galleryPaths: [
        { src: '/images/asteria/living-2.jpg', caption: 'Séjour traversant' },
        { src: '/images/asteria/bedroom-1.jpg', caption: 'Suite parentale' },
        { src: '/images/asteria/living-3.jpg', caption: 'Espace de vie ouvert' },
        { src: '/images/asteria/bedroom-2.jpg', caption: 'Chambre avec vue' },
      ],
      quote: "Le vrai luxe, c'est l'espace, la lumière et le silence.",
      stats: [
        { number: '103', label: 'm² habitables min.', suffix: '' },
        { number: 'F3', label: '3 pièces signature', suffix: '' },
        { number: '3.2', label: 'm sous plafond', suffix: '' },
      ],
    },
    {
      title: 'Nos Terrasses', slug: 'terrasses', num: '02',
      tagline: 'Suspendues au-dessus de la ville',
      heroPath: '/images/asteria/balcony-1.jpg',
      intro: "Les terrasses Elite ne sont pas des balcons : ce sont des jardins privés suspendus, prolongements naturels du salon vers le ciel.\n\nChaque résidence supérieure s'ouvre sur sa propre piscine à débordement — un horizon d'eau où le coucher de soleil devient un rituel quotidien.",
      variant: 'cinematic', show3D: false,
      features: [
        { title: 'Piscines à débordement', text: "Un bassin infini par terrasse supérieure, suspendu au-dessus de la baie." },
        { title: 'Cascades suspendues', text: "Des rideaux d'eau qui glissent entre les étages et rafraîchissent l'air." },
        { title: 'Salons en plein air', text: 'Un espace de réception extérieur pensé pour recevoir au crépuscule.' },
      ],
      galleryPaths: [
        { src: '/images/asteria/balcony-2.jpg', caption: 'Terrasse au couchant' },
        { src: '/images/asteria/common-pool.jpg', caption: 'Bassin à débordement' },
        { src: '/images/asteria/building-front.jpg', caption: 'Cascades de façade' },
      ],
      quote: 'Le ciel, pour jardin. La ville, pour horizon.',
      stats: [
        { number: '∞', label: 'Piscines privées', suffix: '' },
        { number: '26', label: 'm² de terrasse', suffix: '' },
        { number: '12', label: 'Étages signature', suffix: '' },
      ],
    },
    {
      title: 'Nos Design', slug: 'design', num: '03',
      tagline: 'Le détail comme signature',
      heroPath: '/images/asteria/bathroom-1.jpg',
      intro: "Le design Elite se reconnaît à ce qui ne se voit pas au premier regard : la justesse d'une jonction, la noblesse d'un matériau, la lumière pensée centimètre par centimètre.\n\nDe la façade ondulante à la dernière poignée de porte, une même main, une même exigence — une signature architecturale cohérente du gros œuvre à la finition.",
      variant: 'editorial', show3D: true,
      features: [
        { title: 'Façade vivante', text: 'Des courbes qui défient la ligne droite, sculptées pour capter la lumière.' },
        { title: 'Finitions sur-mesure', text: 'Chaque détail dessiné, prototypé et validé avant la pose.' },
        { title: 'Lumière maîtrisée', text: 'Un éclairage pensé pièce par pièce, du jour artificiel au coucher.' },
      ],
      galleryPaths: [
        { src: '/images/asteria/building-detail.jpg', caption: 'Détail de façade' },
        { src: '/images/asteria/bathroom-2.jpg', caption: 'Salle de bain en marbre' },
        { src: '/images/asteria/common-1.jpg', caption: 'Hall de réception' },
        { src: '/images/asteria/common-2.jpg', caption: 'Lounge résidents' },
      ],
      quote: 'Le luxe, ce sont mille décisions invisibles prises correctement.',
      stats: [
        { number: '100%', label: 'Sur-mesure', suffix: '' },
        { number: '10+', label: "Années d'expertise", suffix: '' },
        { number: '24/7', label: 'Accompagnement', suffix: '' },
      ],
    },
  ]

  for (let i = 0; i < universData.length; i++) {
    const u = universData[i]
    const hero = await img(u.heroPath)
    const gallery = []
    for (let j = 0; j < u.galleryPaths.length; j++) {
      const g = u.galleryPaths[j]
      const image = await img(g.src)
      gallery.push({ _key: `g${j}`, image, caption: g.caption, span: 1 })
    }
    await client.create({
      _type: 'univers',
      title: u.title,
      slug: { _type: 'slug', current: u.slug },
      num: u.num,
      kicker: "L'Univers Elite",
      tagline: u.tagline,
      hero,
      intro: u.intro,
      variant: u.variant,
      show3D: u.show3D,
      features: u.features.map((f, fi) => ({ ...f, _key: `f${fi}` })),
      gallery,
      quote: u.quote,
      stats: u.stats.map((s, si) => ({ ...s, _key: `s${si}` })),
      order: i + 1,
    })
    console.log(`  ✓ ${u.title}`)
  }

  console.log('\n✅ Seed complete! Refresh the Studio to see all content.\n')
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
