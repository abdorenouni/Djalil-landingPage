# Elite Promotion Immobilière — Site web (livraison)

Site vitrine haut de gamme : Vite + React + TypeScript, contenu géré via Sanity CMS,
déployable sur Vercel ou sur un VPS. Ce document résume tout ce qu'il faut pour
installer, modifier, déployer et maintenir le site.

---

## 1. Démarrage rapide (local)

Prérequis : **Node.js 18+** et npm.

```bash
npm install        # installe les dépendances
npm run dev        # lance le site en local → http://localhost:3000
```

Build de production :

```bash
npm run build      # génère le site statique dans dist/public
npm run preview    # prévisualise le build localement
```

Le dossier **`dist/public`** est ce qui est mis en ligne.

---

## 2. Déploiement

### Option A — Vercel (recommandé, déjà configuré)
- Le fichier `vercel.json` est prêt : build `vite build`, sortie `dist/public`,
  en-têtes de sécurité (HSTS, CSP, X-Frame-Options…) inclus.
- Connectez le dépôt Git à Vercel ; chaque `git push` redéploie automatiquement.
- Framework : **Vite** · Output directory : **dist/public**.

### Option B — VPS / hébergement classique
1. `npm run build`
2. Servez le contenu de **`dist/public`** avec n'importe quel serveur statique
   (Nginx, Apache, Caddy…).
3. **Important (SPA)** : redirigez toutes les routes inconnues vers `index.html`
   (sinon `/contact`, `/projets`, etc. renverront une 404 au rechargement).
   Exemple Nginx :
   ```nginx
   location / { try_files $uri $uri/ /index.html; }
   ```

---

## 3. Variables d'environnement

Copiez `.env.example` → `.env` et renseignez si besoin (voir `.env.example`).
Le site **fonctionne sans configuration** grâce à des valeurs de repli :

| Variable | Rôle | Obligatoire ? |
|----------|------|----------------|
| `VITE_SANITY_PROJECT_ID` | ID du projet Sanity | Non (repli intégré : `4ovc1jum`) |
| `VITE_SANITY_DATASET` | Dataset Sanity | Non (`production`) |
| `VITE_CONTACT_ENDPOINT` | URL de l'envoi d'email du formulaire | Non (repli : WhatsApp) |

> Sur Vercel, ajoutez ces variables dans **Project ▸ Settings ▸ Environment Variables**.

---

## 4. Modifier le contenu (CMS Sanity)

Tout le contenu éditable (textes, images, projets, articles, FAQ, coordonnées…)
se gère **sans toucher au code**, depuis l'interface Sanity :

- **Studio en ligne :** https://elite-promotion.sanity.studio/
- Connexion avec le compte Google/Sanity autorisé sur le projet.
- Les modifications **Publiées** apparaissent sur le site en quelques secondes
  (le cache CDN est désactivé pour un affichage immédiat).

Sections gérables : Paramètres du site (marque, hero, coordonnées, SEO),
Page À Propos, Page ASTERIA, Projets, Univers, Le Journal, FAQ.

Un guide illustré est fourni : **`Guide-Client-Elite-CMS.pdf`**.

> Le code source du studio est dans le dossier **`studio/`** (déjà déployé ;
> à ne modifier que pour ajouter de nouveaux types de contenu).

---

## 5. Formulaire de contact & réception des demandes

Le formulaire fonctionne **immédiatement** : à l'envoi, il ouvre **WhatsApp**
avec la demande pré-remplie vers le numéro de l'agence. Aucune configuration
requise.

### Activer l'envoi par **email** (optionnel, ~5 min)
Pour recevoir aussi chaque demande par email :
1. Ouvrez **`google-apps-script/Code.gs`** et suivez les étapes en haut du
   fichier (déployable depuis **n'importe quel compte Google** ; les emails
   sont relayés vers `mar.elitee@gmail.com`).
2. Copiez l'URL `/exec` du web app obtenu.
3. Mettez-la dans `VITE_CONTACT_ENDPOINT` (Vercel + VPS) et redéployez.

Une fois configuré, le formulaire envoie un email (état chargement → succès,
avec gestion des erreurs) ET garde WhatsApp comme canal alternatif.

---

## 6. Coordonnées — source unique

Téléphone, WhatsApp, email, adresse et réseaux sociaux sont définis **une seule
fois** dans Sanity (Paramètres du site) et utilisés partout (header, footer,
formulaire, CTA, données structurées SEO). Pour les changer : modifiez-les dans
le studio, c'est tout.

Valeurs actuelles : `+213 779 52 79 48` (WhatsApp) · `+213 550 36 36 04` ·
`mar.elitee@gmail.com` · Alger, Algérie.

---

## 7. Ce qui a été optimisé / corrigé

- **Page `/contact`** dédiée + page **404** de marque (plus d'écran blanc).
- **Menu unifié** sur toutes les pages, avec état actif.
- **Formulaire** relié à un vrai envoi (WhatsApp + email optionnel).
- **Vidéo d'accueil (hero)** recompressée : **21 Mo → 1,3 Mo** ; pause hors champ,
  image de remplacement (poster), chargement allégé.
- **Intro / curtain** : ne se rejoue qu'une fois par session, ne bloque jamais
  le menu, respecte « réduire les animations ».
- **Polices** réduites (2 familles, poids essentiels).
- **Accessibilité** : menu mobile (dialog, Échap, piège de focus), FAQ (ARIA),
  respect de `prefers-reduced-motion`.
- **SEO** : métadonnées par page, données structurées Schema.org, sitemap, robots.

---

## 8. Structure du projet

```
src/
  pages/          Pages (Home, Contact, Projets, ASTERIA, Journal, Univers, 404…)
  sections/       Sections de la page d'accueil (Hero, Contact, FAQ…)
  components/     Composants partagés (Header, Footer, nav, UI…)
  lib/            Sanity, requêtes, SEO, navigation, paramètres
  data/           Contenu de repli (si le CMS est indisponible)
public/           Images, vidéos, sitemap, robots
studio/           Code source du CMS Sanity
google-apps-script/  Script d'envoi d'email du formulaire
vercel.json       Config de déploiement + en-têtes de sécurité
```

---

## 9. Notes de maintenance

- Mettre à jour les dépendances : `npm update` (tester ensuite `npm run build`).
- Le site reste fonctionnel même si Sanity est momentanément indisponible
  (contenu de repli intégré dans `src/data/`).
- Pour de nouveaux contenus éditables, ajouter le champ dans `studio/schemaTypes/`
  puis le lire via `src/lib/`.

---

*Livré par Abdou Renouni. Pour toute question technique, se référer également à
`README.md`, `HANDOFF_BRIEF.md` et `SANITY_SETUP.md`.*
