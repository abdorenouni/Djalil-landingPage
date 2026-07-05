# Elite Promotion Immobilière

Site vitrine haut de gamme pour **Elite Promotion Immobilière** — promoteur immobilier de luxe à Alger — et sa résidence signature **ASTERIA**.

Production : [djalil-landing-page.vercel.app](https://djalil-landing-page.vercel.app) · CMS : [elite-promotion.sanity.studio](https://elite-promotion.sanity.studio)

---

## Stack

| Couche | Technologie |
| --- | --- |
| Front-end | React 19 · TypeScript · Vite 7 |
| Animation | Framer Motion 12 · GSAP (ScrollTrigger) |
| Styles | Tailwind CSS 3 + design tokens CSS (thème clair/sombre) |
| Routing | React Router 7 (SPA) |
| CMS | Sanity v3 (Studio hébergé dans `studio/`) |
| Leads | Google Apps Script → Gmail, repli WhatsApp pré-rempli |
| Hébergement | Vercel (build statique) |

## Démarrage

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement (HMR) |
| `npm run build` | Build de production → `dist/public` |
| `npm run preview` | Prévisualisation du build |
| `npm run check` | Vérification TypeScript |
| `npm run lint` / `format` | ESLint / Prettier |

Variables d'environnement : copier `.env.example` → `.env` (toutes optionnelles — le site fonctionne avec des valeurs par défaut intégrées).

## Architecture

```
├── src/
│   ├── pages/            # Une page par route (Home, Asteria, Projets, Journal, …)
│   ├── sections/         # Sections composables de la page d'accueil
│   ├── components/
│   │   └── custom/       # Design system maison (lux.tsx), Header, Footer, …
│   ├── data/             # Contenu statique de repli (utilisé si le CMS est vide)
│   └── lib/              # Client Sanity, requêtes GROQ, SEO/JSON-LD, sécurité
├── studio/               # Sanity Studio (schémas + déploiement)
├── public/               # Images, vidéos, plans
├── docs/                 # Guides de livraison client
└── google-apps-script/   # Relais email du formulaire de contact
```

**Modèle de données** : chaque page charge son contenu depuis Sanity et retombe sur le contenu statique de `src/data/` si le document n'existe pas — le site ne peut jamais afficher une page vide.

**Contenu éditable dans le Studio** : paramètres du site (coordonnées, réseaux, SEO), projets, page ASTERIA (héro, unités F3/F4, villas et plans), page À Propos, univers Design/Intérieurs, articles du Journal, FAQ.

## CMS — Sanity Studio

```bash
cd studio
npm install
npm run dev        # Studio local → http://localhost:3333
npm run deploy     # Publie sur https://elite-promotion.sanity.studio
```

Le guide d'utilisation destiné au client se trouve dans [docs/Guide-Client-Elite-CMS.pdf](docs/Guide-Client-Elite-CMS.pdf).

## Déploiement

Poussez sur `master` : Vercel exécute `vite build` et sert `dist/public` (configuration dans `vercel.json`, avec en-têtes de sécurité HSTS/CSP/anti-clickjacking et cache immuable des assets).
