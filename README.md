# Astro Portfolio

My portfolio and freelance website, live at [thomasgysemans.dev](https://thomasgysemans.dev): a deep-space page with a starfield, planets drifting behind the content and a quote form that launches a rocket.

## Stack

- [Astro](https://astro.build) in SSR mode on Vercel, with a few Svelte islands
- Tailwind CSS 4
- [PocketBase](https://pocketbase.io) for the projects, technologies and reviews, edited through a back-office at `/admin`
- French and English versions of every page

## Running it locally

Requires Node 24 and Docker.

```bash
npm install
docker compose up -d   # local PocketBase at http://127.0.0.1:8090
npm run dev
```

## Environment variables

Set them in `.env` locally and in the Vercel project for production.

| Variable | Used for | Required |
|---|---|---|
| `POCKETBASE_URL` | the PocketBase every page reads from | yes: the site does not start without it |
| `QUOTE_EMAIL_SENDER` | the address the quote form sends its mails from | for the quote form |
| `QUOTE_EMAIL_SENDER_PASSWORD` | that address's SMTP password | for the quote form |
| `QUOTE_EMAIL_SENDER_HOST` | the SMTP server | for the quote form |
| `QUOTE_EMAIL_SENDER_PORT` | the SMTP port (a number) | for the quote form |
| `QUOTE_EMAIL_RECEIVER` | the address the quote requests arrive at | for the quote form |

Without the five `QUOTE_EMAIL_*` variables, only the quote form fails (it answers 503); the rest of the site works.

## Tests

```bash
npm run test:unit   # Vitest
npm run test:e2e    # Playwright, against the local PocketBase and its content
```

## How it is built

Recently moved to AI-accelerated development using Claude Code. Clear instructions are given and are based on my own reviews of the previously generated code, so as to guide the AI through reliable small steps.
