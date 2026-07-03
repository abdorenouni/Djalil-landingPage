# Sanity CMS — setup (free, ~5 min)

The schemas in `sanity/schemaTypes/` define **everything the client will be able to edit**:
- **Paramètres du site** — phone, email, address, WhatsApp, Instagram, hero headline, about text, stats, SEO defaults.
- **Projet** — add/edit/delete projects (name, photos, location, year, status, gallery, description, stats).
- **Article (Le Journal)** — write/edit blog posts.

## What YOU do (your account — I can't sign up for you)

1. Sign up free at **https://sanity.io** (Google/GitHub login).
2. In this repo, create the Studio:
   ```bash
   npm create sanity@latest -- --dataset production --template clean
   ```
   - Choose **"Create new project"**, name it `Elite Immobilier`, dataset `production`, output path: `./studio`.
3. Replace the generated `studio/schemaTypes/index.ts` (and schema files) with the ones in **this repo's `sanity/schemaTypes/`** (siteSettings.ts, project.ts, article.ts, index.ts).
4. Run the Studio locally to confirm:
   ```bash
   cd studio && npm run dev    # opens http://localhost:3333
   ```
5. Deploy the editing dashboard (free hosting) so the client gets a URL:
   ```bash
   cd studio && npx sanity deploy   # → https://<name>.sanity.studio
   ```

## What to send me

- **Project ID** (Sanity → manage.sanity.io → your project → it's in the URL / Settings → API).
- **Dataset** name (`production`).

## Then I will (next step)

- Install `@sanity/client` + `@sanity/image-url` in the site.
- Add `VITE_SANITY_PROJECT_ID` to env (local + Vercel).
- Write the GROQ queries + image helper.
- Switch the site to read **projects, articles, and contact/site settings** from Sanity
  (with the current static content as the fallback until the dataset is filled).
- Migrate the existing content (ASTERIA, MAGNOLIA, the 4 articles, contact info) into Sanity.
- Later: invite the client (his email) as an editor.

## Notes
- These `sanity/` files are **not** part of the website build — they're a drop-in for the Studio.
- Free tier covers this entirely ($0): 3 users, generous API + bandwidth.
