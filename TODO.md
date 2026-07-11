# TODO

## Unguarded PocketBase select lookups on the public pages

*Documented 2026-07-11 — deliberately left as-is for now.*

The PocketBase selects (`categories`, `context`, `project_techs.role`,
`technologies.group`) store identifiers whose fr/en labels live in typed
dictionaries in the code (`CATEGORIES`, `CONTEXTS`, `TECH_ROLES` in
`src/data/categories.ts`, `GROUP_TITLES` in `src/data/technologies.ts`).
Schema and dictionaries are two parallel lists that must stay in sync.

The public pages index those dictionaries directly — e.g.
`CATEGORIES[c].single[lang]` in `SingleProjectPage.astro`, `CONTEXTS[p.context]`
in `ProjectsPage.astro`/`ProjectCard.astro`, `TECH_ROLES[tech.role]` in the
tech stack — without any fallback. If a select value is added in the
PocketBase dashboard (or a migration) and assigned to a record **before** the
matching dictionary entry is deployed, `CATEGORIES[id]` is `undefined` and the
page throws: **500 for every visitor** on the affected pages. The admin pages
already guard against this (`CATEGORIES[id]?.label.fr ?? id`) and would
survive, showing the raw identifier.

Options when we decide to address it:

1. Apply the same defensive fallback on the public pages (show the raw
   identifier instead of crashing), or
2. Keep the strict coupling and make the workflow rule explicit in CLAUDE.md:
   never add a select value in the PocketBase dashboard before the code that
   knows its labels is deployed.
