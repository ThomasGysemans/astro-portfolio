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

**The tests must never alter the data.** They hit a real PocketBase but strictly read-only: only `GET` requests, with the sole exception of the login-specific requests (which authenticate, they don't mutate content). Never write a test that creates, edits or deletes a project, review, technology or any other record.

No linter is configured.

## Conventions

- Answer in French, keep technical terms in English. Explain your changes simply.
- Code and comments in English. The owner does git commits himself — never commit for him.
- Project slugs must stay stable: they match the URLs of the production site (SEO).
- **Never delete or modify `public/cv.pdf` or `public/header.png`**, even if they look unreferenced. `header.png` is the untouched original of the social-share card (`og-default.png` is generated from it).

## Architecture

Astro 7 in SSR mode (`output: "server"`, Vercel serverless adapter imported from `@astrojs/vercel`) + Svelte 5 islands + Tailwind 4/SCSS. The design comes from the "Portfolio Prototype v2" Claude Design project.

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

`src/data/` is the **PocketBase-backed data layer** (dev and prod both hit a real database; `POCKETBASE_URL` is mandatory). `pb.ts` holds the client (`autoCancellation(false)` for SSR) and a 60s in-memory cache; the async functions (`getAllProjects`, `findProject`, `getFeaturedProjects`, `getProfessionalProjects`…) map records to the models of `models.ts`, building `Localized` fields from the `project_translations` rows (en falls back to fr) and image URLs through PocketBase's thumb API (`800x0` for cards, `1200x0` for detail — only sizes declared on the file field work; `pictures` has no declared sizes and is served full-size). The homepage carousel shows the `pictures` of the single project flagged `carousel` (managed in `/admin`, one project at most).

Collections: `projects` (+ selects `categories` — **multi-select**, a project may belong to several ones —, `context` = `personal|school|professional`, `languages`), `project_translations` (unique per project+locale), `project_techs` (junction with `role` and 1-based `position` — PB treats 0 as blank on required numbers), `technologies` (lowercase hex `color` enforced by pattern, `group` select), `reviews` (flat `_fr`/`_en` columns). Select identifiers are stored in the DB; their fr/en labels live in `categories.ts` (`CATEGORIES`, `CONTEXTS`, `TECH_ROLES`) and `technologies.ts` (`GROUP_TITLES`).

### Page pattern

`src/pages/*.astro` are thin wrappers; real pages live in `src/components/pages/*.astro`; interactive parts are Svelte islands in `src/components/svelte/` (SSR'd then hydrated with `client:idle`/`client:visible`/`client:load`). Islands receive **pre-localized strings** as props — locale resolution always happens server-side. `MainLayout` wraps every public page with the shared `Header`/`Footer`; `ProjectCard`, `StatCard`, `AvailabilityBadge` and `Logo` are the other cross-page components.

Two islands use Threlte/Three.js, not just the homepage Earth: `Earth.svelte` (`client:idle`, orbit-controllable via `Grabbable`/`Planet`) and `ShowcaseViewer.svelte` (`client:load`, the fullscreen immersive viewer behind `/showcase`, with its own `Nebula` background — deliberately fixed-dark, independent of the light/dark theme). `FeaturedCarousel.svelte` (homepage) cycles through the pictures of the single `carousel`-flagged project; `ProjectsExplorer.svelte` drives the filter/search/sort UI of `/projects`.

`/freelance` (`FreelancePage.astro`) is the freelance pitch page: availability badge, process timeline, client reviews (`getReviews`) and professional projects (`getProfessionalProjects`).

### Back-office (`/admin`)

PocketBase-superuser-only CMS for projects, technologies and reviews — no separate admin app, it's Astro pages under `src/pages/admin/` rendering `src/components/pages/admin/*.astro`, sharing `AdminLayout.astro` (French-only, `noindex`, no SEO tags). Server logic lives in `src/data/admin/`:
- `client.ts` — login exchanges superuser credentials for a token (`adminLogin`); the token is stored in an **httpOnly** cookie (`admin_token`), never in the shared public `pb.ts` client. `adminFromCookies()` rebuilds an authenticated client per-request and validates `isSuperuser`.
- `forms.ts` — shared FormData/PocketBase-error helpers used by the POST handlers.
- `projects.ts` / `reviews.ts` — parse form values, write the project + its French/English translations + tech junctions (or the review), and call `invalidateCache()` from `pb.ts` so the public site reflects the change immediately on that instance.

`adminMiddleware` (in `src/middleware.ts`, runs after `userMiddleware`) gates every `/admin*` route: redirects to `/admin/login` when logged out, and away from the login page when already logged in. English fields are optional and filled in manually in the back-office; when left empty, the public site falls back to the French text (see `localize()` in `src/data/projects.ts` and `getReviews()`).
