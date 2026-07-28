# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — dev server (with `--host`). **Requires the local PocketBase running** (`docker compose up -d`).
- `npm run build` — runs `astro check` (type-checking, must stay at 0 errors) then builds for the Vercel serverless adapter
- `npx astro check` — type-check only
- `docker compose up -d` — local PocketBase at http://127.0.0.1:8090 (dashboard at `/_/`, superuser `thomas@gysemans.dev` / `thomasgysemans`). Schema migrations are versioned in `db/pb_migrations/` (excluded from tsconfig).
- `node scripts/seed-pocketbase.mjs` — wipes and re-seeds the content collections (target/credentials via `POCKETBASE_URL`, `PB_SUPERUSER_EMAIL`, `PB_SUPERUSER_PASSWORD`). The seed content itself lives in `scripts/seed-data.mjs`.
- `npm run test` / `npm run test:unit` — Vitest unit tests (`tests/unit/`), configured via `getViteConfig` in `vitest.config.ts` so the `@i18n`/`@data` aliases and the `astro:i18n` virtual module resolve. Pure logic only (no DB).
- `npm run test:e2e` — Playwright e2e tests (`tests/e2e/`). **Requires the local PocketBase running with seeded content.** Playwright's `webServer` starts the dev server via `dev:e2e` (`astro dev` daemonises when stdout is not a TTY, so it starts the daemon then tails its logs to stay foreground).

Running a subset:
- `npx vitest run tests/unit/projects.test.ts` — one unit file; `-t "pattern"` narrows to matching test names; `npm run test:unit:watch` for watch mode.
- `npx playwright test tests/e2e/i18n.spec.ts` — one e2e file; `-g "pattern"` by title, `--headed` / `--ui` / `--debug` to watch it run.

**The tests must never alter the data.** They hit a real PocketBase but strictly read-only: only `GET` requests, with the sole exception of the login-specific requests (which authenticate, they don't mutate content). Never write a test that creates, edits or deletes a project, review, technology or any other record.

`tests/unit/schema-sync.test.ts` is the one to know about: it **replays every migration in `db/pb_migrations/` in a stub PocketBase runtime** (no database) and asserts the `select` fields still match the typed dictionaries. A value added through the PocketBase dashboard without its fr/en labels would otherwise render as a raw identifier on the live site — so a schema change made in the dashboard means updating `categories.ts` / `technologies.ts` / `models.ts` in the same commit.

No linter is configured. Node 24.x (`engines`). The only required environment variable is `POCKETBASE_URL` (`pb.ts` throws on import without it); the `SUPABASE_*` keys still sitting in `.env` are leftovers from a previous storage backend and are referenced nowhere.

## Conventions

- Answer in French, keep technical terms in English. Explain your changes simply.
- Code and comments in English. The owner does git commits himself — never commit for him.
- Project slugs must stay stable: they match the URLs of the production site (SEO).
- **Never delete or modify `public/cv.pdf` or `public/header.png`**, even if they look unreferenced. `header.png` is the untouched original of the social-share card (`og-default.png` is generated from it).

## Architecture

Astro 7 in SSR mode (`output: "server"`, Vercel serverless adapter imported from `@astrojs/vercel`) + Svelte 5 islands + Tailwind 4/SCSS. The design comes from the "Portfolio Prototype v2" Claude Design project.

### Middleware pipeline (`src/middleware.ts`)

`sequence(clientIPMiddleware, userMiddleware, adminMiddleware)` — Astro's own i18n middleware runs around this automatically (see below).

- **`clientIPMiddleware` runs first and must stay first.** Every PocketBase call leaves from the server, so PocketBase's per-IP rate limiting would see all visitors as one bucket. The visitor's IP is stashed in an `AsyncLocalStorage` (`src/data/client-ip.ts`) and every PB client forwards it as `X-Forwarded-For` via a `beforeSend` hook. **`AsyncLocalStorage`, not a variable or a `locals` field**, because Astro streams: the data fetching in a page's frontmatter happens *after* the middleware chain has returned, and the public `pb` client is a module-level singleton shared by concurrent requests — so the IP must be resolved at send time, not captured eagerly. PocketBase only trusts the header once it is listed in Settings → Application → user IP proxy headers.
- `userMiddleware` resolves theme + locale (below); `adminMiddleware` gates `/admin*`.
- `security: { checkOrigin: true }` in `astro.config.ts` — the back-office form POSTs depend on it.

### i18n (unusual setup — read before touching routing)

- **There is no `src/pages/en/` folder.** Pages exist once, without locale prefix. `/en/*` URLs work through Astro's **native** i18n: `astro.config.ts` sets `routing: { prefixDefaultLocale: false, fallbackType: "rewrite" }` with `fallback: { en: "fr" }`, so Astro renders the shared (fr) pages in place at the `/en/*` URLs while `Astro.currentLocale`/`locals.lang` stay `en`. **This is not `routing: "manual"`** — Astro's i18n middleware runs automatically and is no longer added to the `sequence()` by hand.
- **Language redirection** (in `userMiddleware`): only the prefix-less URLs are ambiguous entry points that may be redirected. A first-time visitor on a default URL is sent to their preferred locale — the `lang` cookie (their past explicit choice) first, else the browser's `Accept-Language` (parsed by `preferredLocale` in `config.ts`). A `/en/*` URL is an explicit request and is **never** redirected (crawlers included → both versions stay indexable). `/admin`, non-GET, non-HTML and `/_*` requests are skipped. The `if (context.locals.lang) return next()` guard avoids re-processing when the fallback rewrite re-runs the chain.
- **The `lang` cookie is the explicit choice**, set for a year: written by the language switch client-side (`[data-set-lang]` in `Header.astro`, before navigation) so the switch is authoritative and never bounced, and mirrored server-side to the locale actually served.
- Everything i18n lives in `src/i18n/`: `config.ts` is the single source of truth for locales + `preferredLocale` (imported by `astro.config.ts`, the middleware, and `App.LangCode` in `env.d.ts`); copy is split per page namespace in `translations/` and consumed as `trans.section.key[lang]` via `import trans from "@i18n"`.
- Data files must import from the `@i18n/text` subpath (not `@i18n`), because the index re-exports `paths.ts` which depends on the `astro:i18n` virtual module.
- `Astro.locals.lang` is the only way pages know the language.

### Theming

Dark by default, light via a `theme` cookie read by the middleware and rendered as `data-theme` on `<html>` (no FOUC — no client-side detection). All colors are CSS variables declared in `src/styles/tailwind.css` (Tailwind 4 loads the v3-style `tailwind.config.mjs` via `@config` — that file stays the source of truth for the token mapping): always style with token classes (`text-heading`, `bg-card`, `border-edge`, `text-accent`…), never hardcode theme colors. Fixed-color surfaces (showcase, over-image UI) intentionally use `night`/`accent-strong`/literal values. A few components still use `lang="scss"` in their `<style>` blocks; the back-office has its own plain stylesheet (`src/styles/admin.css`).

### Data

`src/data/` is the **PocketBase-backed data layer** (dev and prod both hit a real database; `POCKETBASE_URL` is mandatory). `pb.ts` holds the client (`autoCancellation(false)` for SSR) and the cache; the async functions (`getAllProjects`, `findProject`, `getFeaturedProjects`, `getProfessionalProjects`…) map records to the models of `models.ts`, building `Localized` fields from the `project_translations` rows (en falls back to fr) and image URLs through PocketBase's thumb API (`800x0` for cards, `1200x0` for detail — only sizes declared on the file field work; `pictures` has no declared sizes and is served full-size). The homepage carousel shows the `pictures` of the single project flagged `carousel` (managed in `/admin`, one project at most).

The `cached()` helper is more than a 60s TTL, and the extras are load-bearing: **single flight** (one in-flight promise per key — the homepage needs featured/carousel/count, all derived from the same list, so a cold cache would otherwise fire several identical queries) and an **epoch counter** bumped by `invalidateCache()`, so a load started before an admin mutation cannot write its stale result into the freshly-cleared cache when it resolves.

**`getAllProjects()` is the single choke point of every public read**: it filters `hidden != true` once, so a hidden project disappears from the cards, showcase, carousel, sitemap and its own detail page (404) at the same time. Derive from it rather than querying the `projects` collection directly.

The `pictures` field **mixes images and videos**, told apart by extension via `isVideo()` in `data/media.ts` — that module must stay free of PocketBase imports because it is also bundled client-side by the `MediaUploader` island. Per-picture fr/en captions live in a `picture_captions` JSON column keyed by filename (pages fall back to the project's `caption`).

Collections: `projects` (+ selects `categories` — **multi-select**, a project may belong to several ones —, `context` = `personal|school|professional`, `languages`), `project_translations` (unique per project+locale), `project_techs` (junction with `role` and 1-based `position` — PB treats 0 as blank on required numbers), `technologies` (lowercase hex `color` enforced by pattern, `group` select), `reviews` (flat `_fr`/`_en` columns). Select identifiers are stored in the DB; their fr/en labels live in `categories.ts` (`CATEGORIES`, `CONTEXTS`, `TECH_ROLES`) and `technologies.ts` (`GROUP_TITLES`).

### Page pattern

`src/pages/*.astro` are thin wrappers; real pages live in `src/components/pages/*.astro`; interactive parts are Svelte islands in `src/components/svelte/` (SSR'd then hydrated with `client:idle`/`client:visible`/`client:load`). Islands receive **pre-localized strings** as props — locale resolution always happens server-side. `ProjectCard`, `StatCard`, `AvailabilityBadge` and `Logo` are the cross-page components.

Layouts nest: `PageLayout` is the `<html>` shell (all the SEO), `MainLayout` wraps it with the shared `Header`/`Footer` and is what public pages use.

Two islands use Threlte/Three.js, not just the homepage Earth: `Earth.svelte` (`client:idle`, orbit-controllable via `Grabbable`/`Planet`) and `ShowcaseViewer.svelte` (`client:load`, the fullscreen immersive viewer behind `/showcase`, with its own `Nebula` background — deliberately fixed-dark, independent of the light/dark theme). `FeaturedCarousel.svelte` (homepage) cycles through the pictures of the single `carousel`-flagged project; `ProjectsExplorer.svelte` drives the filter/search/sort UI of `/projects`.

`/freelance` (`FreelancePage.astro`) is the freelance pitch page: availability badge, process timeline, client reviews (`getReviews`) and professional projects (`getProfessionalProjects`). `ImageLightbox.svelte` is the zoom overlay on the project detail pictures.

### SEO

All of it is centralised in `PageLayout.astro` (canonical, OG/Twitter, hreflang, JSON-LD `Person`) — pages only pass `title`/`description`/`image`/`noindex`. Two rules the whole setup hangs on, and both are easy to break by accident:

- **Each language version is self-canonical**, so both stay indexable. Under the i18n fallback *rewrite* `Astro.url.pathname` has already lost its `/en` prefix, so the canonical is rebuilt from the served locale with `pathInLocale()` — never from the raw pathname.
- **`pathInLocale()` drops the trailing slash** (except at the root), which is what makes the canonical URLs, the hreflang alternates and the sitemap agree on one single URL form per page. `alternateLinks()` adds `x-default` → default locale.

`src/pages/sitemap.xml.ts` is an **SSR route** (`prerender = false`), so it always reflects the current PocketBase content without a rebuild: one `<url>` per locale variant, each carrying the full hreflang set, with `<lastmod>` from the project's `updated` (listing pages use the most recent one). Social card defaults to `/og-default.png` (1200×630, generated from `header.png`).

Two self-hosted variable fonts (`public/fonts/*.woff2`, raw sources gitignored): **Comfortaa** for headings (`font-display`, auto-applied to `h1`–`h6` in `tailwind.css`) and **Source Sans 3** for body (`font-sans`). Icons are local SVGs in `public/icons/` served through `astro-icon`.

### Back-office (`/admin`)

PocketBase-superuser-only CMS for projects, technologies and reviews — no separate admin app, it's Astro pages under `src/pages/admin/` rendering `src/components/pages/admin/*.astro`, sharing `AdminLayout.astro` (French-only, `noindex`, no SEO tags). Server logic lives in `src/data/admin/`:
- `client.ts` — login exchanges superuser credentials for a token (`adminLogin`); the token is stored in an **httpOnly** cookie (`admin_token`), never in the shared public `pb.ts` client. `adminFromCookies()` rebuilds an authenticated client per-request and validates `isSuperuser`.
- `forms.ts` — shared FormData/PocketBase-error helpers used by the POST handlers.
- `projects.ts` / `reviews.ts` — parse form values, write the project + its French/English translations + tech junctions (or the review), and call `invalidateCache()` from `pb.ts` so the public site reflects the change immediately on that instance.
- There is no `admin/technologies.ts`: that collection is small enough that its CRUD lives inline in `src/pages/admin/technologies.astro`.

**Form convention (no API routes):** each `src/pages/admin/**.astro` handles its own `POST` in the frontmatter — `if (Astro.request.method === "POST")` → parse `formData` → write → `invalidateCache()` → `Astro.redirect("…?saved=1")`, catching `pbErrorMessage(err)` into an `error` prop rendered by the page component. `Astro.locals.admin!` is the authenticated client (the middleware guarantees it is set). Two islands assist the project form: `MediaUploader.svelte` (drag & drop ordering of uploaded + staged files, per-row caption inputs and `picture_order` hidden inputs submitted with the main `<form>`) and `TechsEditor.svelte`.

`adminMiddleware` (in `src/middleware.ts`, runs after `userMiddleware`) gates every `/admin*` route: redirects to `/admin/login` when logged out, and away from the login page when already logged in. English fields are optional and filled in manually in the back-office; when left empty, the public site falls back to the French text (see `localize()` in `src/data/projects.ts` and `getReviews()`).
