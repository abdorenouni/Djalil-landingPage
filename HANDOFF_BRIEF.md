# Elite Promotion Immobilière — Creative Brief & Build Handoff

> **Purpose of this file:** Context handoff so a fresh session (Sonnet 4.5) can continue the
> luxury-expansion work without re-deriving the project. Read this top-to-bottom before coding.
> Last updated by Opus 4.8.

---

## 0. Project facts

- **Client:** Elite Promotion Immobilière (Algerian luxury real-estate promoter).
- **Flagship project:** **ASTERIA** — a single signature residential tower (Alger). Most imagery is ASTERIA renders.
- **Stack:** Vite + React 19 + TypeScript, Framer Motion 12, GSAP 3 (ScrollTrigger), Tailwind, `react-router` v7.
- **Repo root:** `C:\Users\abdou\Downloads\pfeproject\Djalil-landingPage-master`
- **Deploy:** Vercel, auto-deploys from `master`. `vercel.json` → `outputDirectory: "dist/public"`, SPA rewrite to `/index.html`.
- **Build:** `npm run build` (must stay clean — TS strict). Build emits a chunk-size warning (~1.5MB JS) — known, ignore.
- **Logo:** `public/images/elite-logo.png` (real logo: teal+white on pure black). Render with `mixBlendMode: 'screen'` on dark surfaces so the black drops out. NEVER recreate as SVG — the PNG is correct.

---

## 1. Current state — what is ALREADY built (do not rebuild)

| Route | File | What it is |
|---|---|---|
| `/` | `src/pages/Home.tsx` | Home: Preloader, Header, Hero (sticky), About, Projects, Signature, Chiffres, Processus, Contact |
| `/a-propos` | `src/pages/APropos.tsx` | **About Us** — hero, italic story line, mission split, 4 values, stats band, CTA, footer |
| `/projets` | `src/pages/Projets.tsx` | **Portfolio** — filterable grid (Tous / En cours / Livré), animated with `AnimatePresence layout` |
| `/projets/asteria` | `src/pages/Asteria.tsx` | Project showroom — parallax hero, manifesto+stats, signature features, residences gallery, interactive F3 plan selector, CTA |

Home sections live in `src/sections/`: `Hero, About, Projects, Signature, Chiffres, Processus, Contact`.
(`Services`, `Experience`, `Footer` exist in `src/sections/` but are NOT used by Home — legacy.)

**Implication:** About / Portfolio / Contact already exist. The expansion is about DEPTH, CONSISTENCY,
and EDITORIAL STORYTELLING — not duplicating those page types.

---

## 2. Design system (the source of truth)

Shared primitives live in `src/components/custom/lux.tsx`:
- Exports: `TEAL` `#2bbdb0`, `GOLD` `#d4af37`, `EASE` `[0.22, 1, 0.36, 1]`.
- Components: `<Reveal delay y>` (fade+rise on scroll, `whileInView`, `once`), `<Eyebrow color>` (rule + tracked label), `<ParallaxImage src alt aspect range>` (scroll parallax drift), `<CountUp value>` (stat count-up in view).
- Premium UX primitives (taste-skill pass): `<MagneticCTA label to|href variant external>` (pill with nested button-in-button trailing icon + cursor magnetic pull + press physics; CSS in index.css `.magnetic-cta`), `<BezelCard padding>` (double-bezel shell + inner core + cursor spotlight; CSS `.bezel-inner`/`.bezel-spot`), `<ScrollProgress>` + `<BackToTop>` (mounted globally in App.tsx).
- Design skills installed at `.claude/skills/` (taste-skill set: `design-taste-frontend`, `redesign-existing-projects`, `high-end-visual-design`, etc.) — reusable for future UI work. Site follows the **Editorial Luxury** archetype.

### Color doctrine (IMPORTANT — recently changed)
- **TEAL is now the PRIMARY brand accent.** Gold is SECONDARY punctuation only (a single award number, one divider — never the whole UI).
- Homepage was migrated gold→teal (commit `1c950ac`): Preloader subtitle/rule, Header CTA/border/burger, About eyebrow+CTA+border, Chiffres numbers, Processus eyebrow+ghost numbers.
- ⚠️ **`/a-propos` and `/projets` STILL LEAD WITH GOLD** (nav "Contact" button border, eyebrows, stats, filter buttons). They now look off-brand vs. the home page. **Migrating these to teal-primary is task #1 of the expansion.**

### Type
- **Playfair Display** — display headlines (700, large). **Cinzel** — eyebrows / architectural labels (400, uppercase, `0.32em` tracking). **Inter** — body + UI.
- Background `#060606` (ink) / `#0a0a0a` (raised). Text `#f3f4f1` (bone), muted `rgba(243,244,241,0.5–0.7)`.

### Motion rules
- One easing curve: `EASE = [0.22, 1, 0.36, 1]`. Durations 0.5–1.5s. Reveals rise ~44px + fade. Image parallax ±12–14%.
- Page transitions: each page is a `motion.div` with `initial/animate/exit opacity`, wrapped by `<AnimatePresence mode="wait">` in `App.tsx`. `MotionConfig reducedMotion="user"` is set — respect it.
- ScrollManager in `App.tsx` handles scroll-to-top + `/#hash` anchor. Lenis was REMOVED (it fought GSAP ticker → lag). Native `scroll-behavior: smooth` only.

---

## 3. Known debt to fix as part of this work

1. **Color inconsistency** — interior pages still gold-primary (see §2). Migrate to teal.
2. **Duplicated nav** — `APropos.tsx`, `Projets.tsx`, `Asteria.tsx` each hardcode a near-identical `<nav>` + a local `navLink` style const. Extract a shared `<InteriorNav />`.
3. **Duplicated footer** — same `<footer>` copy-pasted. Extract `<SiteFooter />`.
4. **Contact placeholders** — `src/sections/Contact.tsx` email (`contact@elite-immobilier.dz`) and address ("Alger, Algérie") are marked `(à remplacer)`. Real Facebook URL also needed. Get from client.

---

## 4. The storytelling spine (the emotional arc the site should deliver)

Arrival (curtain) → Promise (hero) → Who we are (trust) → Proof (portfolio) →
The flagship: ASTERIA (desire) → How it feels to live here (lifestyle) → Where (neighborhood) →
How we work (reassurance) → Begin (private contact).

Reference brands: **Sotheby's Int'l Realty** (whitespace, photography-first), **Knight Frank**
(the "Intelligence/Journal" authority engine), **Aman / Related 15 Hudson Yards** (cinematic
full-bleed lifestyle scroll), **Foster+Partners / Zaha Hadid** (architectural type restraint).

---

## 5. Build roadmap — phased, in priority order

> Work phase by phase. After each: `npm run build` clean, commit, push. Keep teal-primary doctrine.

### Phase A — Consolidation (do FIRST, unblocks everything)
- Extract `src/components/custom/InteriorNav.tsx` (logo + links + contact pill) and `SiteFooter.tsx`.
- Replace the 3 copy-pasted navs/footers in APropos, Projets, Asteria.
- Migrate `/a-propos` + `/projets` gold→teal primary (keep gold as single accent only).
- Add `Le Journal` to nav once Phase B lands.

### Phase B — `Le Journal` (`/journal` + `/journal/:slug`)  ★ highest impact
- Editorial index: full-bleed featured article + a refined card grid. Categories: Architecture, Art de vivre, Marché, ASTERIA.
- Article template: large hero, generous measure (~680px), pull-quotes in Playfair italic, parallax inline images, "articles liés" footer.
- Content can start as a typed array in a `data/journal.ts` (no CMS needed for delivery). 3–4 seed articles.
- Reference: Knight Frank Intelligence, Aman Journal.

### Phase C — `Le Quartier` / Localisation  ✅ DONE (commit a75c347)
- Built as a SECTION on the ASTERIA page (between Espaces Communs and Les Plans).
- Bespoke radial map graphic (`QuartierMap` in `Asteria.tsx`) — concentric rings + pulsing
  centre marker + gold POI dots, no map API. `POIS` array drives both the map dots and the
  proximity grid.
- ⚠️ Travel times in `POIS` are INDICATIVE placeholders — confirm exact location + times with client.

### Phase D — `Résidences` unit explorer  ✅ DONE (commit aed841c)
- Built in-place on ASTERIA's floor-plans section (not a separate route).
- `PLANS` enriched (ref/pièces/chambres/sdb/étage/orientation/terrasse/exposition); `Spec`
  component renders the panel; `waResidence()` builds the per-unit WhatsApp deep link.
- ⚠️ Étages/orientations are indicative — confirm with client.

### Phase E — Polish & micro-interactions
- Custom cursor refinement (component exists: `CustomCursor.tsx`), magnetic CTAs, link underline sweeps (already on Header), image reveal masks (clip-path), number count-up on Chiffres/stats when in view.
- Performance: lazy-load route chunks (`React.lazy` + `Suspense`) to cut the 1.5MB bundle; lazy `loading="lazy"` on all imagery (mostly done).

---

## 6. Animation cookbook (reuse these patterns)

- **Scroll reveal:** `<Reveal>` from `lux.tsx` — `initial opacity:0,y:44 → whileInView` once.
- **Parallax image:** `<ParallaxImage range={12} />` or inline `useScroll({target,offset:['start end','end start']}) + useTransform`.
- **Hero parallax:** `useScroll({target,offset:['start start','end start']})` → scale 1→1.15, y 0→20%, overlay opacity ramp (see APropos/Asteria heroes).
- **Filterable grid:** `AnimatePresence mode="popLayout"` + `layout` + staggered `delay: i*0.06` (see Projets).
- **Letter/word reveal:** GSAP `fromTo` on `.char` spans staggered (see About title).
- **Eyebrow:** `<Eyebrow color={TEAL}>LABEL</Eyebrow>`.
- **Count-up numbers (to add):** animate number on `whileInView` for Chiffres/stats bands.

---

## 7. Assets

- ASTERIA renders: `public/images/asteria/*.jpg` (building-hero, building-front, building-detail, living-1..3, bedroom-1..2, bathroom-1..2, balcony-1..2, common-pool, common-1..2, plan-103/104/109/110).
- Other project renders: `public/images/carousel-1..3.jpg`.
- Logo: `public/images/elite-logo.png`.
- Image optimization (no sharp): PowerShell .NET `System.Drawing` bicubic resize + JPEG encoder. Keep new images ≤ ~300KB.

---

## 8. Real client data

- WhatsApp / Phone 1: `+213 779 52 79 48` (wa.me id `213779527948`)
- Phone 2: `+213 550 36 36 04`
- Instagram: `https://instagram.com/elite_reallestate`
- ⚠️ Email, physical address, Facebook URL: NOT yet provided — placeholders in `Contact.tsx`.

---

## 9. Conventions / guardrails

- French UI copy throughout. Keep tone editorial, restrained, exclusive.
- Inline-style-object pattern is the house style (matches existing files) — match it, don't introduce a new styling approach mid-codebase.
- Phase by phase. Never rebuild from scratch — the Vite project is the foundation.
- ASTERIA renders are for ASTERIA contexts; don't flood the whole brand with one project's imagery.
- After each phase: `npm run build` must pass, then commit + push to `master` (triggers Vercel).
- Co-author trailer on commits: `Co-Authored-By: Claude <noreply@anthropic.com>`.

---

## 10. Session log (condensed)

- Phases 1–3 (prior sessions): preloader/curtain, logo fix (real PNG + screen blend), Lenis removed
  (scroll lag fix), ASTERIA showroom, luxury Contact section, interior pages APropos + Projets.
- This session: (a) migrated homepage accent gold→teal (`1c950ac`); (b) authored this brief;
  (c) Phase A consolidation + interior-page teal migration; (d) Phase B `Le Journal`
  (`/journal` + `/journal/:slug`, `data/journal.ts`, 4 articles); (e) Phase E `CountUp`
  on stat bands — all in commit `f012173`; (f) Phase C `Le Quartier` on ASTERIA (`a75c347`).
- Phase D `Résidences` explorer shipped (`aed841c`). **All roadmap phases A–E complete.**
- Blockers for final delivery (need client): real email/address/Facebook URL; confirm ASTERIA
  location + POI travel times (`POIS` in Asteria.tsx); confirm unit étages/orientations (`PLANS`).
- Possible future polish (not yet requested): route code-splitting to cut the ~1.5MB bundle
  (`React.lazy` per route), magnetic CTAs, image reveal masks.
