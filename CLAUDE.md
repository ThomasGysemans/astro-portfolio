# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — dev server (with `--host`). **Requires the local PocketBase running** (`docker compose up -d`).
- `npm run build` — runs `astro check` (type-checking, must stay at 0 errors) then builds for the Vercel serverless adapter
- `npx astro check` — type-check only
- `docker compose up -d` — local PocketBase at http://127.0.0.1:8090 (dashboard at `/_/`, superuser `thomas@gysemans.dev` / `thomasgysemans`). Schema migrations are versioned in `db/pb_migrations/` (excluded from tsconfig).
- `node scripts/seed-pocketbase.mjs` — wipes and re-seeds the content collections (target/credentials via `POCKETBASE_URL`, `PB_SUPERUSER_EMAIL`, `PB_SUPERUSER_PASSWORD`).

There is no test suite or linter configured.

## Conventions

- Answer in French, keep technical terms in English. Explain your changes simply.
- Code and comments in English. The owner does git commits himself — never commit for him.
- Project slugs must stay stable: they match the URLs of the production site (SEO).
- **Never delete or modify `public/cv.pdf`**, even if it looks unreferenced.

## Architecture

Astro 4 in SSR mode (`output: "server"`, Vercel serverless) + Svelte 4 islands + Tailwind 3/SCSS. The design comes from the "Portfolio Prototype v2" Claude Design project.

### i18n (unusual setup — read before touching routing)

- **There is no `src/pages/en/` folder.** Pages exist once, without locale prefix. `/en/*` URLs work because `src/middleware.ts` computes the locale from the URL and calls `context.rewrite()` for non-default locales. The `if (!context.locals.lang)` guard is required because the rewrite re-runs the middleware chain. Astro's native i18n `fallback` does **not** work with `routing: "manual"` (returns 404s) — this custom rewrite replaces it.
- Everything i18n lives in `src/i18n/`: `config.ts` is the single source of truth for locales (imported by `astro.config.ts`, the middleware, and `App.LangCode` in `env.d.ts`); copy is split per page namespace in `translations/` and consumed as `trans.section.key[lang]` via `import trans from "@i18n"`.
- Data files must import from the `@i18n/text` subpath (not `@i18n`), because the index re-exports `paths.ts` which depends on the `astro:i18n` virtual module.
- The `lang` cookie mirrors the URL locale; `Astro.locals.lang` is the only way pages know the language.

### Theming

Dark by default, light via a `theme` cookie read by the middleware and rendered as `data-theme` on `<html>` (no FOUC — no client-side detection). All colors are CSS variables declared in `src/styles/tailwind.scss` and mapped to Tailwind tokens in `tailwind.config.mjs`: always style with token classes (`text-heading`, `bg-card`, `border-edge`, `text-accent`…), never hardcode theme colors. Fixed-color surfaces (showcase, over-image UI) intentionally use `night`/`accent-strong`/literal values.

### Data

`src/data/` is the **PocketBase-backed data layer** (dev and prod both hit a real database; `POCKETBASE_URL` is mandatory). `pb.ts` holds the client (`autoCancellation(false)` for SSR) and a 60s in-memory cache; the async functions (`getAllProjects`, `findProject`, `getFeaturedProjects`, `getProfessionalProjects`…) map records to the models of `models.ts`, building `Localized` fields from the `project_translations` rows (en falls back to fr) and image URLs through PocketBase's thumb API (`800x0` for cards, `1200x0` for detail — only sizes declared on the file field work; `pictures` has no declared sizes and is served full-size). The homepage carousel shows the `pictures` of the single project flagged `carousel` (managed in `/admin`, one project at most).

Collections: `projects` (+ selects `category`, `type`, `context` = `personal|school|professional`, `languages`), `project_translations` (unique per project+locale), `project_techs` (junction with `role` and 1-based `position` — PB treats 0 as blank on required numbers), `technologies` (lowercase hex `color` enforced by pattern, `group` select), `reviews` (flat `_fr`/`_en` columns). Select identifiers are stored in the DB; their fr/en labels live in `categories.ts` (`CATEGORIES`, `CONTEXTS`, `PROJECT_TYPES`, `TECH_ROLES`) and `technologies.ts` (`GROUP_TITLES`).

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
