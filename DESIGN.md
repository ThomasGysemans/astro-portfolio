---
name: Thomas Gysemans — Portfolio
description: A calm, atmospheric night-sky system where translucent surfaces, a single blue light source and real-time 3D carry a self-taught developer's freelance storefront.
colors:
  night: "#030F20"
  heading: "#ffffff"
  body: "#a9b8d8"
  muted: "#8fa2c6"
  faint: "#7b8fb5"
  card: "rgba(255, 255, 255, .045)"
  card-solid: "#0A1D38"
  edge: "rgba(255, 255, 255, .1)"
  edge-strong: "rgba(255, 255, 255, .18)"
  outline: "rgba(255, 255, 255, .3)"
  accent: "#87b3f6"
  accent-strong: "#619cf3"
  chip: "rgba(255, 255, 255, .05)"
  chip-text: "#c9d6ef"
  avail: "#7fe0a7"
  avail-bg: "rgba(47, 168, 102, .12)"
  avail-bd: "rgba(47, 168, 102, .4)"
  malt: "#FC5757"
  showcase-teal: "#9ad1d4"
  showcase-night: "#04141c"
  light-bg: "#F4F7FB"
  light-heading: "#062451"
  light-text: "#030F20"
  light-body: "#4d5e82"
  light-muted: "#5f6f93"
  light-card: "#ffffff"
  light-edge: "rgba(6, 36, 81, .1)"
  light-edge-strong: "rgba(6, 36, 81, .15)"
  light-accent: "#2f66c4"
  light-btn: "#062451"
typography:
  display:
    fontFamily: "Comfortaa, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(34px, 3.4vw, 60px)"
    fontWeight: 700
    lineHeight: 1.16
    letterSpacing: "normal"
  headline:
    fontFamily: "Comfortaa, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.625rem"
    fontWeight: 700
    lineHeight: 1.3
  title:
    fontFamily: "Comfortaa, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.5
  body:
    fontFamily: "Source Sans 3, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Source Sans 3, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "0.1em"
rounded:
  sm: "8px"
  md: "10px"
  card: "13px"
  full: "9999px"
spacing:
  gutter: "clamp(20px, 3.5vw, 44px)"
  card-inset: "20px"
  grid-gap: "20px"
  section-rhythm: "40px"
components:
  button-primary:
    backgroundColor: "{colors.accent-strong}"
    textColor: "{colors.night}"
    rounded: "{rounded.sm}"
    padding: "10px 20px"
    typography: "{typography.label}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.heading}"
    rounded: "{rounded.sm}"
    padding: "12px 22px"
    typography: "{typography.label}"
  button-malt:
    backgroundColor: "transparent"
    textColor: "{colors.heading}"
    rounded: "{rounded.md}"
    padding: "12px 22px"
  surface-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.body}"
    rounded: "{rounded.card}"
    padding: "20px"
  project-card:
    backgroundColor: "{colors.card-solid}"
    textColor: "{colors.body}"
    rounded: "{rounded.card}"
    padding: "20px"
  token-chip:
    backgroundColor: "{colors.chip}"
    textColor: "{colors.heading}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
  availability-badge:
    backgroundColor: "{colors.avail-bg}"
    textColor: "{colors.avail}"
    rounded: "{rounded.full}"
    padding: "6px 14px"
    typography: "{typography.label}"
---

# Design System: Thomas Gysemans — Portfolio

## Overview

**Creative North Star: "The Observation Deck"**

The visitor is standing on a lit deck at night, looking out. Behind them the interior is calm and low-lit — deep navy surfaces, glass-thin panels, text that never shouts. In front of them, through the glass, something real is turning: a 3D Earth on the homepage, a fullscreen showcase further in. The interface is the deck, not the view. Its job is to stay quiet, hold its lines, and let what is outside do the impressing.

Atmosphere is a permanent material here, not an effect reserved for hover. Radial gradients wash the top of every hero, surfaces are translucent white over navy rather than opaque blocks, and light behaves like light: it pools, it falls off, it comes from somewhere. This is what separates the system from a flat dark theme — the depth is ambient and always on, and the interactive glow layered on top of it reads as a response rather than as the only source of dimension.

The register is calm, spacious and human. A single person speaks in the first person; nothing here should read as an agency. That warmth lives in the geometry — rounded, generous corners, a display face with soft terminals — not in decoration. The rejection is explicit: no dense dashboard grids, no aggressive contrast, no rainbow of accents, no ornament that competes with a project screenshot.

**Key Characteristics:**
- Deep navy night ground with translucent white surfaces, never opaque grey cards
- One blue light source, used sparingly and always as light rather than as fill
- Two faces only: geometric Comfortaa for headings, humanist Source Sans 3 for everything read
- A deliberately short type scale with a hard 13px floor
- Intrinsic layouts (`auto-fit` + `clamp()`); media queries only where a component truly changes shape
- Full light-theme parity, rendered server-side, with zero flash
- Real-time 3D as demonstration, sealed inside its own fixed-color world

## Colors

A single blue light source moving across a deep navy night, with translucent white as the only surface material and one green reserved entirely for availability.

### Primary

- **Pale Luminous Blue** (`#87b3f6` dark / `#2f66c4` light): the accent. Text-level light — statistics figures, inline links, the "Details →" affordance, the highlighted words inside hero headlines, icon strokes. It is a colour that is *emitted*, never a colour that fills a panel.
- **Clear Blue** (`#619cf3`): the only fill. Primary buttons, the active navigation underline, every glow and radial wash in the system. Fixed across both themes (exposed as `accent-strong`), which is why the glows stay identical when the theme flips while the button surface itself becomes deep navy in light mode.

### Secondary

- **Signal Green** (`#7fe0a7` on `rgba(47,168,102,.12)`, dark / `#2c7a4b` on `#e9f7ef`, light): availability, and nothing else. It appears on the availability badge and on the one-year-guarantee panel. Reusing it for a generic success state would spend the one colour on the site that currently means "you can hire me today".
- **Malt Coral** (`#FC5757`): the Malt platform's own colour, used only on the Malt icon and the Malt outline button. It is a borrowed brand colour, not a palette member.

### Tertiary

- **Iced Teal** (`#9ad1d4` on `#04141c` / `#020a10`): the showcase world only. `/showcase` and its viewer are a sealed sub-world with a fixed dark palette, deliberately independent of the light/dark theme. Its ladder runs `#c4dfe2` → `#b8d6da` → `#9fc3c9` → `#8fb4ba` → `#7da3ab` for label and inactive states.

### Neutral

- **Deep Night Navy** (`#030F20` dark / `#F4F7FB` light): the page ground. Also fixed as `night`, used literally on over-image UI where the surface must stay dark whatever the theme.
- **Solid Panel** (`#0A1D38` dark / `#ffffff` light): the opaque card body — project cards, the mobile drawer, timeline step icons. Used when content must sit on something readable rather than on glass.
- **Glass Surface** (`rgba(255,255,255,.045)` dark / `#ffffff` light): the translucent card material. In dark mode it is white at 4.5%; in light mode the whole idea inverts to plain white on a tinted page.
- **Text ladder**: pure white headings → **Cool Body Blue** (`#a9b8d8`) for running copy → **Muted** (`#8fa2c6`) for secondary lines → **Faint** (`#7b8fb5`) for the quietest meta. Light theme mirrors it with `#062451` → `#4d5e82` → `#5f6f93`.
- **Edges**: `rgba(255,255,255,.1)` for resting borders, `.18` for controls that need to be findable, `.3` for outline buttons. Light theme uses the same three steps in navy.

### Named Rules

**The One Lit Button Rule.** At most one filled Clear Blue button is visible per viewport. Every other action is an outline button, a chip or a plain accent link. The filled button is the only place the accent becomes a surface, and that scarcity is what makes it read as the primary action.

**The Token-Only Rule.** Never write a theme colour literally. Every surface, text and border colour comes from a token class (`bg-card`, `text-body`, `border-edge`, `text-accent`), because both themes must be satisfied by the same markup. The three sanctioned exceptions are the fixed tokens (`night`, `accent-strong`, `malt`), over-image UI that must stay dark in both themes, and the showcase sub-world.

**The Green Means Available Rule.** Signal Green is reserved for availability and the guarantee. It is not the system's success colour, and there is currently no error, warning or info colour — a status palette must be introduced deliberately, not improvised from this green.

## Typography

**Display Font:** Comfortaa (variable, weight 300–700, self-hosted)
**Body Font:** Source Sans 3 (variable, weight 300–700, self-hosted)

**Character:** Comfortaa is geometric and rounded with a low x-height — warm, slightly informal, unmistakable, and completely unsuited to running text. Source Sans 3 sits underneath it as a humanist workhorse that stays quiet instead of competing. The pairing is the whole personality of the system: friendly at heading level, unremarkable and legible everywhere the visitor actually reads.

Both faces are self-hosted as single variable WOFF2 files, subset to latin + latin-ext plus the arrow glyphs the UI uses. No request ever leaves for Google Fonts — that is a GDPR commitment, not a performance preference.

### Hierarchy

- **Display** (Comfortaa 700, `clamp(34px, 3.4vw, 60px)`, line-height 1.16): hero headlines only. The freelance hero uses a slightly smaller ramp (`clamp(30px, 3vw, 48px)`), the project detail hero `clamp(32px, 4.8vw, 46px)`.
- **Headline** (Comfortaa 700, 26px `text-2xl`, line-height 1.3): section headings. The most common heading on the site.
- **Title** (Comfortaa 700, 18px `text-lg`, line-height 1.5): card titles, project names, lead-ins. `h1`–`h3` receive the display face automatically from the base layer, so a new heading is on-brand without a `font-display` class.
- **Body** (Source Sans 3 400, 16px, line-height 1.7): running copy. 15px `text-sm` for dense card copy and secondary text.
- **Label** (Source Sans 3 700, 13px, line-height 1.5): meta lines, chips, captions, badges. Uppercase with `0.1em` tracking only on the availability badge and the showcase label.

### Named Rules

**The Two Faces Rule.** Comfortaa appears on `h1`–`h3`, the logo wordmark and statistic figures. Everything else — every paragraph, label, button, chip, input — is Source Sans 3. A third family is never introduced, and there is no monospace face in this system.

**The Seven Steps Rule.** The type scale has exactly seven steps (13 / 15 / 16 / 18 / 21 / 26 / 34px) and the 13px floor is deliberate: sizes below `text-xs` were removed from the config so they cannot be reached by accident. A new size must be one of the seven, or a `clamp()` — and `clamp()` is reserved for hero-level display type.

**The Emphasis Rule.** `<strong>` is styled globally as heading-coloured and bold, which is how key phrases are lifted out of the hero intro and the freelance copy. Emphasis is a brightness step, never a colour change — accent-coloured spans inside headlines are the one exception and are authored explicitly in the translation strings.

## Layout

A single centred column capped at `max-w-415` (1660px), with a horizontal gutter that breathes: `clamp(20px, 3.5vw, 44px)`, applied through the `.px-page` utility (and `.mx-page-margin` for elements that need it as a margin). Every public page section uses it, so all content shares one vertical edge from header to footer.

Grids are intrinsic rather than breakpoint-driven. The recurring pattern is `repeat(auto-fit, minmax(<floor>, 1fr))` with a 20px gap, where the floor states the content's real minimum: 300px for the hero split, 210px for the statistics row, 260px for the about cards, `min(380px, 100%)` for project cards, 340px for the freelance split. Columns collapse when the content demands it, not at an arbitrary width.

Vertical rhythm is loose and asymmetric by design: sections carry roughly 40–48px of separation, with `clamp()` on the tall ones (hero padding `clamp(32px, 7vh, 110px)`, freelance section gap `clamp(28px, 4vw, 72px)`). The hero holds a `min-h` of `min(660px, calc(100vh - 320px))` so it fills the first viewport without ever trapping a short screen.

Only two real breakpoints exist, and both mark a genuine change of shape rather than a resize: **900px**, where the header nav and actions collapse into a right-side drawer and the freelance timeline turns from a vertical rail into a horizontal strip, and **520px**, where that strip stacks vertically again.

### Named Rules

**The Intrinsic-First Rule.** Reach for `auto-fit` + `minmax()` and `clamp()` before a media query. A media query is justified only when a component changes structure — a nav becoming a drawer, a rail becoming a strip — never to nudge a size.

## Elevation & Depth

This system is **atmospheric, not shadowed**. Depth is a permanent material property: radial gradients wash light across the top of every hero (`.hero-scene`, layered ellipses of `rgba(97,156,243,.17)` and `.07` fading into the page ground), surfaces are translucent white over navy so the ground shows through, and a hairline edge separates planes. Together these do the work that a shadow scale does in other systems.

Box-shadows exist on top of that atmosphere as a **response** — hover, focus, elevation — never as a resting decoration. The one exception is the mobile drawer, which casts a real shadow because it genuinely floats above the page.

Notably, `.hero-scene` is driven by the `--hero-scene` token: it is `1` in dark mode and `0` in light mode. The atmosphere is a night-time material, and the light theme drops it entirely rather than washing out a pale approximation.

### Shadow Vocabulary

- **Button glow** (`box-shadow: 0 0 26px rgba(97,156,243,.45)`, token `--btn-glow`): resting halo under the primary button in dark mode. `none` in light mode.
- **Card lift** (`box-shadow: 0 0 0 1px rgba(97,156,243,.7), 0 14px 40px rgba(97,156,243,.2)` with `translateY(-3px)`): project card hover. The first layer is a ring that replaces the border, the second is the cast light.
- **Explorer lift** (`0 0 0 1px rgba(97,156,243,.7), 0 16px 44px rgba(97,156,243,.22)`): the same idea, one step stronger, on the projects explorer cards.
- **Timeline pulse** (`0 0 0 0 → 0 0 0 14px rgba(97,156,243,.55 → 0)`, 1.4s): a one-shot expanding ring on freelance step icons as they enter.
- **Drawer** (`-20px 0 60px rgba(2,8,18,.45)`): the only structural shadow in the system.
- **Showcase text shadows** (`0 0 44px rgba(154,209,212,.55)` on the title, `0 2px 12px rgba(0,0,0,.5)` on names over imagery): legibility over unpredictable images, inside the showcase world only.

### Named Rules

**The Ambient-Then-Reactive Rule.** Ambient depth (gradients, translucency, edges) is always on. Cast shadows are always a state. If a new surface needs a resting `box-shadow` to look finished, its background and border are wrong.

**The Blue Light Rule.** Every glow in the system is Clear Blue at low alpha. There are no black drop shadows on public surfaces — the light in this world has a colour, and neutral grey shadows read as a different system.

## Shapes

Corners are generously rounded but never pill-shaped except where a shape means something. The ladder is short and each step has a job: **13px** for every card and content surface (project cards, `.surface-card`, panels, the freelance highlight blocks), **8–10px** for controls (buttons, the burger, the toolbar at 11px, the malt button at 9px), **fully round** for badges, chips, the theme toggle, the language switch and social circles.

Borders are hairlines: 1px at `--edge` on resting surfaces, 1.5px on outline buttons where the border *is* the button, and 2px only on the freelance timeline step icons where the ring carries the progress state.

Media is uniformly `aspect-video` and clipped by the card's own radius via `overflow-hidden`. Project thumbnails use a signature two-layer treatment: the same image blurred, scaled to 110% and dimmed to 70% opacity as a background fill, with the sharp image `object-contain` on top. Screenshots of any aspect ratio therefore fill a 16:9 frame without cropping or letterboxing — the blur *is* the letterbox.

### Named Rules

**The Thirteen Rule.** Anything that holds content is 13px. Anything you click is 8–10px. Anything that labels a state is fully round. A new radius value needs a reason that these three do not already cover.

## Components

Components are **soft but crisp**: generous radii and a warm silhouette, held by hairline borders and short transitions. The softness comes from the geometry, the precision from the edges. Nothing is blurred, nothing is heavy.

### Buttons

- **Shape:** rounded (8px `rounded-lg`; the hero CTA takes 10px, the Malt button 9px).
- **Primary** (`.btn-primary`): Clear Blue fill, deep-navy text, bold, with the resting button glow. Padding varies by placement — 10px/20px in the header, 15px/30px on the hero.
- **Hover:** `filter: brightness(1.12)` and `translateY(-2px)` over 200ms. The colour is never swapped; it is lit.
- **Outline** (`.btn-outline`): transparent with a 1.5px `--outline-bd` border and heading-coloured text; on hover the border and text both become accent and the button lifts 2px.
- **Malt** (`.malt-btn`): outline in Malt Coral with a `rgba(252,87,87,.12)` wash on hover. The one place a foreign brand colour is allowed.
- **Focus:** all interactive elements share a global `outline: 3px solid var(--accent)` at 3px offset with a 4px radius — an RGAA commitment, never to be removed per-component.

### Chips

- **Token chip** (`.token-chip`): fully round, `--chip` background, 1px `--edge-strong` border, semibold heading text at 13–15px, often with a leading accent-strong icon. Used for skills on the hero and technologies on project pages.
- **Filter chips** (projects explorer): same silhouette, plus a category dot in the category's own colour (`web #566CF5`, `games #EC323B`, `apps #F09953`, `software #45D483`, `languages #24D5FB`, `challenges #F9DA08`, `other #F983E7`). These seven dots are the only place category colour appears; it never spreads to the card or the page.
- **Selected state:** the chip fills with the button colour and takes the button's text colour, matching the language switch's active pill.

### Cards / Containers

- **Corner style:** 13px, with `overflow-hidden` so media is clipped by the same curve.
- **Glass card** (`.surface-card`): translucent surface + 1px `--edge`, 20px inset. The default container for text content.
- **Project card**: opaque `--card-solid` body under an `aspect-video` media frame, 14–20px inset, hairline border, card-lift shadow on hover. The compact variant is a single title/subtitle bar with `context · year` in accent; the freelance variant adds a dark uppercase badge over the image and a description.
- **Statistic card** (`StatCard`): glass card, Comfortaa 26px accent figure over a 15px body line. The figure is one of the few non-heading uses of the display face.
- **Tinted panels:** highlight blocks tint the surface with their own subject colour at ~10–12% over a matching 35–40% border — blue for related projects, green for the guarantee. The tint replaces the glass, it does not stack on it.

### Inputs / Fields

The public site's only input is the projects search field, which follows the toolbar's language: `--card` background, 1px `--edge`, 11px radius, body-coloured text, and the global 3px accent focus outline. There is no bordered-input tradition to inherit here; anything new should stay on the same glass-and-hairline material rather than introducing a filled field style. Back-office forms use their own plain stylesheet (`src/styles/admin.css`) and are deliberately outside this system.

### Navigation

- **Desktop header:** transparent in dark mode, white in light mode, with a bottom `--edge` hairline. Links are 15px semibold in `--muted`; the active link is heading-coloured with a 2px Clear Blue bottom border. Gaps flex with `clamp(14px, 2.5vw, 30px)`.
- **Header actions:** a round theme toggle, a round language pill where the active locale fills with the button colour, and one primary button. All three share the fully-round shape language.
- **Mobile (≤900px):** everything collapses into a right-side drawer over a blurred backdrop, animated in with `cubic-bezier(.25,.8,.35,1)` over 300ms. It traps focus, restores it on close, locks page scroll with scrollbar compensation, and closes on Escape or on a scroll gesture outside the panel.

### Signature: the Showcase world

`/showcase` is a sealed fullscreen sub-world and the one place the system's rules are suspended on purpose. It is always dark regardless of the theme, runs on Iced Teal instead of blue, adds its own nebula background, and uses translucent `rgba(3,17,26,.78)` panels with 15px radii and `backdrop-blur-xl`. Its title carries a teal text-glow. Treat it as a separate design language that happens to live in the same repository: do not migrate its colours onto the token system, and do not import its treatments into ordinary pages.

### Signature: the atmospheric hero

Each landing surface opens with a `.hero-scene` layer — stacked radial ellipses of Clear Blue fading into the page ground, driven by `--hero-scene` so it disappears entirely in light mode — and pairs a `clamp()` display headline with a live 3D object or a real artefact on the right. It is the system's opening move and the reason the first viewport never looks like a template.

## Do's and Don'ts

### Do:

- **Do** style every surface, text and border through token classes (`bg-card`, `text-body`, `border-edge`, `text-accent`) so both themes stay correct from one markup.
- **Do** pick from the seven type steps, and reach for `clamp()` only at hero display level.
- **Do** build layouts with `repeat(auto-fit, minmax(<real minimum>, 1fr))` and `clamp()` before considering a media query.
- **Do** keep exactly one filled Clear Blue button per viewport; make every other action an outline, a chip or an accent link.
- **Do** carry depth with gradients, translucency and hairline edges, and reserve `box-shadow` for hover, focus and true floating layers.
- **Do** use 13px for content surfaces, 8–10px for controls, fully round for state labels.
- **Do** put project media in an `aspect-video` frame with the blurred-duplicate backdrop, so any screenshot ratio fills it without cropping.
- **Do** keep the global 3px accent focus outline and the `prefers-reduced-motion` reset intact on anything new — `/freelance` claims RGAA conformity in both languages.
- **Do** design every string for both French and English, and assume the French is 15–20% longer.

### Don't:

- **Don't** hardcode a theme colour. The only literal values allowed are `night`, `accent-strong`, `malt`, over-image UI that must stay dark in both themes, and the showcase world.
- **Don't** introduce a third font family, a monospace face, or any size below 13px.
- **Don't** put a resting drop shadow on a card. If it needs one to look finished, its background or border is wrong.
- **Don't** use black or neutral-grey shadows on public surfaces; every glow is Clear Blue at low alpha.
- **Don't** spend Signal Green on a generic success state — it currently means "available for freelance", and there is no status palette yet.
- **Don't** let category dot colours spread beyond the filter chips onto cards, headings or backgrounds.
- **Don't** migrate the showcase's Iced Teal into the token system, or import its glass-and-glow treatments into ordinary pages.
- **Don't** apply this system to `/admin`: the back-office runs on its own plain stylesheet and is intentionally outside the brand.
- **Don't** let a decorative layer sit above content in the tab order or intercept pointer events — atmosphere layers are `pointer-events-none` and `aria-hidden`.
