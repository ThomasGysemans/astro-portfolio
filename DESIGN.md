---
name: Thomas Gysemans — Portfolio
description: A deep-space star chart. Hairline drawings, one blue to act on, real planets drifting behind the page, for a freelance developer whose other passion is astronomy.
colors:
  space: "#030713"
  space-2: "#050B1A"
  panel: "rgb(8 15 33 / 0.86)"
  panel-solid: "#0A1328"
  line: "rgb(140 170 255 / 0.13)"
  line-strong: "rgb(140 170 255 / 0.26)"
  line-hover: "rgb(140 170 255 / 0.4)"
  fill: "rgb(140 170 255 / 0.06)"
  fill-hover: "rgb(140 170 255 / 0.12)"
  fill-active: "rgb(140 170 255 / 0.14)"
  heading: "#F4F7FF"
  text: "#AEBBD6"
  muted: "#7F8DAD"
  accent: "#2563EB"
  accent-hover: "#1D4ED8"
  accent-text: "#78A8FF"
  accent-text-hover: "#A9C7FF"
  accent-soft: "rgb(37 99 235 / 0.14)"
  accent-line: "rgb(94 155 255 / 0.4)"
  accent-glow: "rgb(37 99 235 / 0.55)"
  chart: "#5E9BFF"
  chart-light: "#8DB4FF"
  chart-pale: "#B4CEFF"
  star: "#FFE3B0"
  star-warm: "#FFC08A"
  star-white: "#EAF1FF"
  pass: "#5FD394"
  warn: "#E9B866"
  danger: "#FF8F87"
  plan-deep: "#172F85"
  plan-ink: "#1D3FAF"
  showcase-teal: "#9ad1d4"
  showcase-night: "#04141c"
typography:
  heading-1:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem → 3rem (640px) → 3.75rem (1200px)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.03em"
  heading-2:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem → 3rem (640px)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.03em"
  heading-3:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: "2.5rem"
  heading-4:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: "2.25rem"
  heading-5:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: "2rem"
  heading-6:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: "1.75rem"
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem / 1.125rem / 1rem / 0.875rem"
    fontWeight: 500
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem / 1rem / 0.875rem"
    fontWeight: 400
  caption:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem / 0.75rem"
    fontWeight: "400–600"
  mono:
    fontFamily: "Geist Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.08em"
  chart-label:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "12px"
    fontWeight: 400
rounded:
  md: "6px"
  lg: "8px"
  xl: "12px"
  2xl: "16px"
  3xl: "24px"
  full: "9999px"
spacing:
  scale: "2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96px"
  gutter: "16px (phones) → 24px (640px)"
  container: "1248px"
  section: "64px → 96px (1024px)"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#FFFFFF"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-ghost:
    backgroundColor: "{colors.fill}"
    textColor: "{colors.heading}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-light:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.plan-ink}"
    rounded: "{rounded.full}"
  card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.text}"
    rounded: "{rounded.3xl}"
    padding: "8px around a framed picture, 24–32px around text"
  chip:
    backgroundColor: "{colors.fill}"
    textColor: "{colors.text}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
  input:
    backgroundColor: "{colors.fill}"
    textColor: "{colors.heading}"
    rounded: "{rounded.xl}"
    padding: "12px 16px"
---

# Design System: Thomas Gysemans — Portfolio

## Overview

**Creative North Star: "The Star Chart"**

The page is an astronomer's chart laid over the night sky. Real stars sit behind everything, a few of them twinkling; the interface is drawn on top in hairlines, the way a chart traces constellations: thin blue lines, small bright points, corner crosses on the frames, monospace labels. Further back, real planets drift past as the visitor scrolls, from Neptune at the top of the homepage down to the Earth and its Moon, next to the launch pad of the quote form.

Astronomy is the identity of the site, not a decoration added to it: the owner is a developer and designer whose other passion is the sky, and every motif comes from that world (a page layout drawn as a constellation, a speed score drawn as an orbit, the method as a countdown and a trajectory, a rocket that lifts off when the form is sent). Each decoration has a purpose in that story; one that has none is removed.

The register is calm and direct. A single person speaks in the first person, to a small business that wants a site or an app. Copy is plain French and English, without hype.

**Key Characteristics:**
- A near-black blue night ground (`space`), with a fixed starfield and a fixed planets layer behind every public page
- One blue to act on (`accent`), one lighter blue for text and links on the dark (`accent-text`), and the star-chart blues for drawings only
- One family, Geist, with Geist Mono for labels, data and the chart
- Hairline borders, translucent blue fills, large radii (24px cards, full pills)
- Dark only, on purpose: the night sky is the identity
- Everything that moves can be paused (RGAA 13.8), and the system's "reduce motion" setting is honoured from the first paint

## Colors

### Ground and surfaces
- **space** `#030713`: the page and the sky. **space-2** `#050B1A`: the cells of the hairline grids (bento, pricing).
- **panel** `rgb(8 15 33 / 0.86)`: every card. Nearly opaque, so a planet drifting behind never costs the text its contrast.
- **panel-solid** `#0A1328`: floating controls (the pause button, the lightbox buttons).

### Lines and fills
All borders and translucent fills are the same blue at different strengths: **line** (0.13) for hairlines, **line-strong** (0.26) for controls, **line-hover** (0.4) on hover; **fill** (0.06), **fill-hover** (0.12) and **fill-active** (0.14) behind pills, ghost buttons and inputs.

### Text
**heading** `#F4F7FF` for titles and anything important, **text** `#AEBBD6` for reading, **muted** `#7F8DAD` for secondary information.

### Accent
- **accent** `#2563EB`: what you act on (primary buttons, the chosen column of the comparison, the highlighted plan). White on it is 5.2:1.
- **accent-hover** `#1D4ED8`: darker on hover, on purpose (6.7:1), so button text keeps its contrast.
- **accent-text** `#78A8FF` and **accent-text-hover** `#A9C7FF`: links, eyebrows and highlighted labels on the dark ground.
- **accent-soft**, **accent-line**, **accent-glow**: tinted backgrounds, seals and the glow under primary buttons.

### Star chart
**chart** `#5E9BFF`, **chart-light** `#8DB4FF`, **chart-pale** `#B4CEFF` for the drawings (lit constellation lines, the trajectory, the orbit ring, the highlighted words of the hero). Stars use **star-white** `#EAF1FF`, **star** `#FFE3B0` and **star-warm** `#FFC08A`. These colours belong to illustrations only; never use them on controls.

### States
**pass** `#5FD394` (confirmations, the launch pad's lights), **warn** `#E9B866` ("often an extra" in the comparison), **danger** `#FF8F87` (form errors).

### Named Rules
**The One Blue Rule.** There is one blue to press. Other blues are light (links, drawings), never a second kind of button.
**The Dark Only Rule.** The public site has no light theme. The back-office keeps its own.

## Typography

**Geist** for everything, **Geist Mono** for eyebrows, labels, numbers, the language switch and the chart. Both are self-hosted variable WOFF2 files (no font CDN, GDPR).

### Hierarchy
Named text styles, never raw sizes in the markup: `heading-1` to `heading-6` (600, tight tracking), `title-1` to `title-4` (500), `body-3`, `body-5`, `body-6`, `body-7` (reading), `button-lg/md/sm` (600), `caption-1` to `caption-5`. Only the homepage hero's title uses the white-to-grey **grad** text, its key words in the blue **hl** gradient with their orbit ring. Every other heading, page titles included, is plain `heading`.

### Named Rules
**The One Gradient Rule.** A gradient on every heading reads as a template: the hero's title is the only gradient text of the site.
**The Eyebrow Rule.** A section may open with a mono uppercase eyebrow in `accent-text` when the label says something its heading does not (the section's name, a commitment such as "Réponse sous 48 h"). A label that would only repeat the heading is left out: the FAQ and the process open on their heading.
**The Section Head Rule.** A section's head follows what comes after it, so the sections do not all open alike. Before a grid of work, a table or plans, the heading and its introduction stand side by side (`split-head`). Where the heading is the page's thesis (Why me), it takes the full width and the introduction follows under it. Where the section has a drawing, the heading lives in it: the process title sits in the sky above the start of the launch trajectory, which only climbs once past it (from 1024px; below, the trajectory is hidden and the head stacks).
**The No Italics Rule.** Emphasis is weight or colour, never italics.

## Layout

A 1248px container with a 16px gutter (24px from 640px), honouring the phones' safe areas. Sections are 64px apart (96px from 1024px). The spacing scale is 2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96px. Grids are intrinsic (`auto-fill` with `minmax(min(320px, 100%), 1fr)`) or switch columns at 640, 768, 900, 1024 and 1280px.

The fixed navigation bar is a centred pill; on phones it becomes a full-screen menu. Anchored headings are offset by `scroll-padding-top: 96px`.

## Elevation & Depth

Depth comes from the sky, not from shadows: the fixed starfield, the drifting planets (parallax, slower than the page), translucent panels. Shadows are rare: the glow under primary buttons, the drop shadow of the floating pause button, the glow of chart lines.

## Shapes

Radii: 6px (small inner elements), 8px, 12px (inputs, quotes, small windows), 16px (framed pictures), 24px (cards, hairline grids), full (buttons, pills, chips, the navigation bar).

## Components

### Buttons
Pills. **Primary** (accent, white text, glow, the arrow slides on hover), **ghost** (fill + line-strong), **light** (white on the highlighted plan). One primary per view.

### Cards and frames
**card**: panel + line + 24px. A project is shown in a browser frame (address bar with three dots and the host) inside the card, 8px from its edge. **frame**: a hairline rectangle with a cross at each corner, around the bento.

### Chips and pills
Rounded, fill + line-strong; selected = accent-soft + accent-text border.

### Inputs
fill, line-strong, 12px radius; focus = accent-text outline; error = danger border and a message under the field.

### Navigation
A blurred pill: logo and name, four links (Work, Process, Pricing, FAQ), the FR / EN switch (current language as a filled pill), the quote button. The homepage marks the section in view (scrollspy).

### Signature: the planets
One WebGL canvas fixed behind the content. Each page places its bodies (`PlanetPlacement`): Neptune, Uranus, Saturn, Jupiter, Mars, the Earth and its Moon on the homepage, two planets on /projects, one on a project page, a lone Moon on the 404. Models are fetched lazily, one at a time, after the page has loaded.

### Signature: the launch pad
The quote form stands next to a line-art launch pad; its lights follow the required fields, and sending the form launches the 3D rocket.

### Signature: the Showcase world
`/showcase` is a sealed fullscreen sub-world that predates the star chart and is kept as is: always dark, Iced Teal (`showcase-teal`) instead of blue, its own nebula, the site's Geist face (`.theme-showcase`), translucent `rgba(3,17,26,.78)` panels with 15px radii. Do not migrate its colours onto the token system, and do not import its treatments into other pages.

## Do's and Don'ts

### Do:
- Give each decoration a purpose in the astronomy story, and remove the ones that have none.
- Keep text on panels, not directly over a planet.
- Respect `data-motion`: animations stop with the pause button and the system setting.
- Load 3D after the page, lazily, without three.js on the public pages.

### Don't:
- Don't add AI-template tropes: eyebrow pills with a pulsing dot above the hero, glowing orange halos, emoji, gradient blobs.
- Don't add a second button colour, or use the chart blues on controls.
- Don't use italics or hyphen/dash-heavy copy.
- Don't change /showcase.

## Back-office: the Editor Workbench

This section records the `/admin` system as built (`src/styles/admin.css`, `AdminLayout.astro`, `src/components/admin/`, the admin page components and islands, `src/lib/admin/runtime.ts`). It is a separate world from the Star Chart: none of the public rules above (Geist, the named text styles, the planets, the 24px cards, dark only) apply here, and none of the rules below apply to public pages. The YAML frontmatter at the top of this file describes the public system only; the admin's tokens live as `--a-*` custom properties on `body.adm` and are normative there.

### Overview

**Creative North Star: "The Editor Workbench"**

The back-office is the owner's own code editor, not a SaaS dashboard: an explorer on the left listing every project and review, the record open as a document in the middle, a problems panel docked under it that points at the faulty field, and a full-width status bar whose fill *is* the save state. Night-shift blue graphite panes, hairline seams instead of cards, the system UI face, monospace only where the content is data. It is French-only, dense, keyboard-first (`/` filters the explorer, ⌘S / Ctrl+S saves), and never loses what was typed or picked.

**Key Characteristics:**
- Panes and seams, not cards: depth is a 1px line and a one-step change of ground.
- One accent (Clear Blue) for cursor, selection, focus and the single primary action; amber means "modified"; red means "problem".
- State is shown where an editor shows it: a dot on the field label, a dot on the title and the explorer entry, the colour of the status bar.

### Colors

Blue graphite neutrals with three signal hues, each tied to one meaning. Every value is redefined under `html[data-theme="light"] body.adm`; style only through the `--a-*` variables.

| Role | Token | Dark | Light |
|---|---|---|---|
| Editor ground | `--a-bg` | #0e1729 | #ffffff |
| Explorer / problems / affix ground | `--a-side` | #0a1222 | #f3f5f9 |
| Raised controls (inputs, chips, rows, dialog) | `--a-raised` | #131f37 | #f6f8fb |
| Hover ground | `--a-hover` | #18263f | #eaeef5 |
| Selection wash | `--a-select` | rgba(97,156,243,.17) | rgba(47,102,196,.12) |
| Hairline seam | `--a-line` | #1f2d48 | #e1e6ee |
| Control stroke | `--a-line-strong` | #2d3f62 | #c9d1de |
| Text | `--a-text` | #dde5f2 | #18202e |
| Secondary text | `--a-dim` | #a3b0c8 | #4f5b70 |
| Tertiary text, icons, placeholders | `--a-faint` | #8593b0 | #5f6b80 |
| Accent (links, focus ring, required asterisk) | `--a-accent` / `--a-focus` | #8ab4f8 | #2f66c4 |
| Primary fill / text on it | `--a-fill` / `--a-on-fill` | #619cf3 / #06101f | #2f66c4 / #ffffff |
| Modified (amber) | `--a-mod` | #e7b85a | #9a6400 |
| Added (green) | `--a-add` | #7fd19c | #1f7a46 |
| Error text / wash / stroke | `--a-err` / `--a-err-bg` / `--a-err-line` | #ff9a9a / rgba(255,110,110,.1) / rgba(255,130,130,.6) | #c3283a / #fdf0f1 / #e7a3ab |

**Status bar fills**, one pair (fill / text) per save state:

| State | Meaning | Dark | Light |
|---|---|---|---|
| `idle` | everything saved | #619cf3 / #06101f | #2f66c4 / #ffffff |
| `dirty` | unsaved changes | #e7b85a / #1f1500 | #f0c463 / #2a1c00 |
| `error` | the save failed | #ff7f7f / #2a0505 | #c9303f / #ffffff |
| `saved` | just saved (reverts to idle after 5s) | #7fd19c / #04170b | #23794a / #ffffff |
| `saving` | in flight | keeps the current fill plus a slow white sweep (1.1s loop) | same |

**The One Meaning Per Hue Rule.** Blue is cursor, selection and the primary action; amber is "modified" (and, by extension, star ratings and the featured mark); red is "problem"; green is only "just saved". Never spend a signal hue on decoration.

**The Mixed Not Literal Rule.** Tinted borders and washes are derived with `color-mix(in srgb, var(--a-…) N%, transparent)` from the tokens, so both themes follow. The only literals are the dialog/drawer backdrop (rgba(4,9,18,.5–.6)) and the status-item hover darkening (rgba(0,0,0,.12)).

### Typography

**Interface Font:** system UI stack (`--a-sans`: system-ui, -apple-system, Segoe UI, Roboto…)
**Data Font:** UI monospace stack (`--a-mono`: ui-monospace, SF Mono, Menlo, Consolas…), with tabular numerals

Base is 14px / 1.5. Headings inherit the system face (the public Geist is overridden). Steps actually used:

- **Page title** (650, 19px, 1.3, -0.01em): the editor header `h1`.
- **Section title** (650, 15px, 1.4): settings-section and dialog titles.
- **Body / inputs** (14px): field values, row titles.
- **Control text** (13–13.5px; 600 for labels and buttons): labels, chips, tabs, tree items, table cells.
- **Help / secondary** (12.5px): help text, inline errors, crumbs, explorer foot.
- **Group labels** (700, 11.5–12px, uppercase, 0.05–0.06em tracking): explorer group heads, table headers, problems title, FR/EN column heads.
- **Data** (mono, 11–13px): slugs, filenames, years, counts, usage numbers, keycaps, the ⌘S hint.

**The Data-Only Monospace Rule.** Monospace marks content that is data (identifiers, counts, years, colours, field names in the problems panel), never labels or prose.

### Layout

The shell is a full-viewport grid (`100dvh`): a 264px explorer column on the left; the editor (`main`, scrolls on its own) on the right; the problems panel docked under the editor (max 34vh, only when there are problems); a 26px status bar spanning the full width at the bottom.

The editor header is sticky (blurred 92% editor ground, hairline below): breadcrumb, title with count/dirty dot/badges, actions on the right (the one Save button), and on long forms a row of in-page section links. Documents are capped at 1120px with 28px side padding. A form is a stack of settings sections: a 180–240px intro column (title and explanation) beside the controls, separated by hairlines, 28px vertical rhythm; fields stack with 18px gaps, grids use `auto-fill/auto-fit minmax(190px | 260px, 1fr)`.

Responsive: at 1100px the section intro stacks above its controls; at 900px the explorer becomes an off-canvas drawer (min(300px, 86vw), slides in over a backdrop, opened from a menu button in the header and in the status bar), padding drops to 16px, tables restack into grid rows, technology rows stack beside their swatch, the FR/EN grid becomes one column, and the status bar hides its secondary items. At 520px long button labels are dropped.

### Elevation & Depth

Flat panes. Depth is the ground step (`--a-side` < `--a-bg` < `--a-raised`) plus a 1px seam. The only shadow is `--a-shadow` (dark: 0 12px 32px rgba(2,6,14,.5); light: 0 12px 32px rgba(20,32,54,.16)), reserved for layers that truly float: the confirm dialog, the login panel and the mobile explorer drawer. Focus is a 2px `--a-focus` outline (offset 2px); inputs additionally get a 3px Clear Blue halo (`--a-fill` at 25%).

### Shapes

Small, tight corners: 3px for keycaps and colour swatches, 4px for small hit targets (icon buttons, tree actions, badges, thumbnails, segment buttons), 5px for controls (inputs, buttons, chips, affix), 6px for grouped containers (row lists, switch groups, segmented control, notes, media cards), 8px only for floating layers (dialog, login panel). Full circles only for status dots (7–9px). Dashed strokes mean "drop a file here" or "hidden".

### Components

- **Settings sections and switch rows:** title + explanation on the left, controls on the right. Boolean flags are hairline-separated rows in a 6px-rounded group (checkbox, bold title, dim explanation); a checked row takes the selection wash.
- **Fields:** 13px semibold label above the control; required controls get a Clear Blue asterisk automatically; a field changed since load shows a 7px amber dot before its label. Inputs are 34px high, `--a-raised` ground, `--a-line-strong` stroke, 5px radius, Clear Blue border + halo on focus. Invalid fields take the error wash and stroke, with a 12.5px semibold red message (prefixed ✕) under the control. Slug-type inputs carry a monospace prefix affix; file inputs are dashed drop zones with a small native button.
- **Chips (multi-select):** 32px, 5px radius, dim text on `--a-raised`; checked becomes the selection wash, a 60% blue stroke and a trailing ✓; optional 8px colour dot.
- **Badges:** 22px outlined labels, 4px radius: featured in amber, carousel in blue, hidden dashed and faint.
- **Buttons:** 32px (28px small, square icon variants), 5px radius, 13px semibold. Primary = Clear Blue fill (one per page, the Save); outline = raised ground with strong stroke, blue stroke on hover; ghost = text only, hover ground; danger = red text and 40% red stroke, error wash on hover.
- **Tables:** uppercase faint 11.5px sticky headers, hairline rows, 28px outer padding, 72px 16:9 thumbnails, actions right-aligned; hidden records read like ignored files (faint italic), as in the explorer.
- **Editable rows:** row lists (media, techs) are hairline-separated rows in a 6px group with a grip handle; a dragged row dims to 55% over the selection wash. Technology rows save individually: their Save button stays invisible until the row is dirty, then takes the amber dirty fill.
- **Parallel FR / EN grid:** two equal columns with uppercase flag-headed column labels; the English head notes that empty falls back to French.
- **Problems panel:** `--a-side` ground with a 2px red top edge, red uppercase title, one row per problem (✕, message, monospace field name on the right); clicking a row scrolls to the field. Section links in the header show a red count badge and turn red when their section has problems.
- **Status bar:** 26px, 12px text, fill per save state (see Colors), items are flat buttons darkening on hover; holds the explorer toggle, the state text, the problems count, the ⌘S hint, a site link and the theme toggle.
- **Explorer:** sticky uppercase group heads with monospace counts and a + action, collapsible; 28px items with icon, ellipsised name and trailing decorations (amber star, blue carousel, faint eye-off). The open record takes the selection wash with a blue inset ring, gains an amber ● while unsaved and turns red after a failed save.
- **Login frame:** the same workbench with an empty explorer pane and a status bar ("Non connecté" / red "Connexion refusée"); a 360px floating panel in the editor area that names nothing about what it protects. The drawer pane disappears at 900px.
- **Confirm dialog:** native `<dialog>`, 440px, raised ground, 8px radius, `--a-shadow`, red titled with a trash icon, outline Cancel beside danger Delete; enters with a 0.18s rise.

### Do's and Don'ts

#### Do:

- **Do** style admin surfaces only through `--a-*` tokens (or `color-mix` of them) so the light theme follows.
- **Do** keep exactly one filled primary button per page (the Save), everything else outline, ghost or danger.
- **Do** show unsaved, saving, saved and failed states through the existing channels: amber field dot, title dot, explorer ●, status bar fill.
- **Do** report errors twice: inline under the field and as a row in the problems panel pointing at it.
- **Do** use monospace for data values only, and the uppercase 11.5px label for group heads.
- **Do** build new forms as settings sections, with French and English side by side in the parallel grid.

#### Don't:

- **Don't** wrap admin content in cards, resting shadows or the public glass treatments; separate with hairlines and ground steps.
- **Don't** use a radius above 6px except on floating layers (8px).
- **Don't** use amber, red or green for anything but modified, problem and just-saved.
- **Don't** add looping motion beyond the status bar's saving sweep.
- **Don't** let a new admin element set a `display` that defeats `[hidden]`; the filters and problems panel depend on it.
