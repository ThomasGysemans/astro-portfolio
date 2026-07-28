# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: the freelance prospect.** A business owner, founder or project lead looking for someone to deliver a website or an application. They arrive from word of mouth, from Malt, or from a search, usually already having a project in mind and a budget question they have not dared ask. Their job is to decide, within a few minutes, whether this one person can be trusted to deliver the whole thing on time. Success is a quote request — an email to `contact@thomasgysemans.dev` or a contact through Malt.

**Secondary, real but not prioritised:** recruiters and CTOs (a CV lives at `public/cv.pdf`), and technically curious peers who come for the projects, the GitHub account and the 3D showcase. They must remain served, but no design decision is arbitrated in their favour against the prospect.

## Product Purpose

The personal portfolio and freelance storefront of Thomas Gysemans (`thomasgysemans.dev`, 5th version of the site). It has to do two things at once: prove technical range through real, shipped projects, and convert a prospect into a conversation. The freelance path (`/freelance`) is the one the site is optimised for; the project catalogue (`/projects`, `/projects/[slug]`, `/showcase`) is the evidence that makes the pitch credible.

## Positioning

Three claims the site is entitled to make, confirmed by the owner, that a neighbouring freelance developer could not truthfully copy in the same combination:

1. **A→Z solo.** Mockups, clickable prototype, code, deployment and hosting — one person, no agency, no subcontractor. The client validates screen by screen, then receives the finished product live, with the code and the keys.
2. **Unusual technical depth for a solo freelance.** Self-taught since age 13, 10+ years of code. Able to build an interpreted or compiled language (LLVM), real-time 3D, database work (relational and document-oriented), and to publish to every app store. The breadth is the proof, not a slogan.
3. **Contractual commitments.** One-year guarantee (any bug within a year of delivery fixed free, no questions asked), first reply and free quote within 48 hours, a fixed quote with no mid-project surprises, code and keys handed over.

**AI-accelerated development is a secondary reassurance argument, deliberately not a headline.** It stays where it is (short deadlines, edge cases caught early, every line reviewed by Thomas, automated tests on every delivery) and must not be promoted into the site's main message.

## Operating Context

- Prospects compare a handful of freelances and agencies, often on mobile, often in one sitting. Malt is part of the evaluation path (profile linked from the header/footer and the freelance CTAs).
- The commercial sequence the site describes and must keep coherent: **1 · Design** (validated mockups) → **2 · Prototype** (clickable before it is built) → **3 · Finished project** (live, on deadline, code & keys included).
- Contact happens by email or Malt; there is no form, no booking tool, no chat.
- The catalogue mixes three project contexts — `personal`, `school`, `professional` — and the professional subset is what the freelance page shows as delivered client work.
- The owner runs the content himself from the `/admin` back-office (PocketBase superuser). English fields are typed manually and fall back to French when left empty.

## Capabilities and Constraints

- **Public surfaces:** homepage (`/`), project catalogue with search/filter/sort (`/projects`), project detail with gallery and lightbox (`/projects/[slug]`), immersive 3D showcase (`/showcase`), freelance pitch (`/freelance`), 404, SSR sitemap. Private back-office under `/admin`.
- **Bilingual FR/EN, and both versions must stay indexable** — non-negotiable. French is the default locale and is served without a prefix; English lives at `/en/*` through Astro's native i18n fallback rewrite. Any new surface must exist in both languages, with self-canonical URLs and the full hreflang set.
- **Project slugs are frozen** — they are the production URLs and carry the SEO history.
- **All content is PocketBase-driven** and changes without a redeployment: projects, translations, technologies, reviews, the featured/carousel flags, the hidden flag. Nothing that the owner is expected to edit may be hardcoded in a page.
- Dark theme by default, light theme available via a cookie read server-side (no flash of wrong theme). The showcase and a few fixed-color surfaces are intentionally always dark.
- Real-time 3D is a load-bearing part of the identity, not decoration: the interactive Earth on the homepage and the fullscreen showcase viewer (Threlte / Three.js).
- Technical frame: Astro SSR on Vercel serverless, Svelte 5 islands, Tailwind 4 + SCSS, PocketBase on a VPS. Node 24.
- **Undecided / not established:** no blog, no case-study long form, no pricing page beyond the budget anchor, no client logo wall, no newsletter, no analytics claim.

## Brand Commitments

- Name and voice: **Thomas Gysemans**, first person singular, French-first. Direct, concrete, no agency plural, no corporate jargon. English is a faithful translation of the same voice, not a different register.
- Existing assets that are binding: the logo (`public/logo.png`), the social share card (`public/og-default.png`, generated from `public/header.png` — **never modify or delete `header.png` or `cv.pdf`**), Comfortaa for headings and Source Sans 3 for body text (both self-hosted variable fonts), and the local SVG icon set in `public/icons/`.
- The visual system inherits from the "Portfolio Prototype v2" design direction; colors are CSS variables and must always be used through the token classes rather than hardcoded.
- Public identities: `github.com/ThomasGysemans`, `fr.linkedin.com/in/thomas-gysemans-950536268`, `malt.fr/profile/thomasgysemans`.

## Evidence on Hand

- **Real shipped projects** with pictures, videos, tech stacks, years, team size and per-project fr/en descriptions, stored in PocketBase. The professional subset is genuine delivered client work.
- **Client reviews** (`reviews` collection): the substance comes from real clients, but the wording is the owner's own reformulation (and its English version a translation). They may be used as proof, but **never presented as verbatim quotes**, and no review may ever be invented, extended or embellished.
- **A CV** at `public/cv.pdf`.
- **Real education and experience:** BAC with highest honours, DUT then BUT in Computer Science (IUT de Villeneuve-d'Ascq), internships at Kimple and Tabuléo, one year of apprenticeship at Tabuléo contributing to and redesigning the "Quizéo" educational platform.
- **A published budget anchor:** showcase website from 500 € (`STARTING_PRICE` in `FreelancePage.astro`, block hidden when null), custom applications on quote.
- **What does not exist and must not be fabricated:** client logos, named case studies, press mentions, awards, benchmark figures, satisfaction percentages, headcount, revenue, certifications, and any testimonial beyond those in the database.

## Product Principles

1. **The prospect's decision comes first.** When a design choice serves technical self-expression and the prospect's decision at the same time, keep both; when they conflict, the prospect wins.
2. **Proof over adjectives.** Every claim on the site should be backed by something visible — a real project, a real commitment, a real number. Remove an argument rather than support it with a fabricated fact.
3. **The 3D is the demonstration, not the decoration.** The Earth and the showcase are there because they prove what the owner can build; they must never cost the visitor the ability to read, navigate or contact.
4. **Both languages are first-class.** No English afterthought, no untranslated surface, no locale-dependent SEO loss.
5. **The owner must stay able to run the site alone**, from `/admin`, without touching code.

## Accessibility & Inclusion

**RGAA conformity is claimed on `/freelance` and the site must itself honour that claim** — this is a commitment, not an aspiration. Concretely: contrast held in both the dark and light themes, full keyboard operability including the 3D surfaces and the lightbox, correct language attributes on both locale versions, meaningful alternatives for images and videos, visible focus, and a skip-to-content link (already present). GDPR compliance is claimed on the same page and constrains anything that would collect visitor data.
