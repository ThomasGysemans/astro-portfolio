<script lang="ts">
    // Interactive explorer of the projects page: category pills, search, year
    // sorting, technology filter and the tech skills section. It is
    // server-rendered by Astro with the state of the URL, then hydrated.
    import { untrack } from "svelte";
    import ProjectThumb from "./ProjectThumb.svelte";
    import PhIcon from "./PhIcon.svelte";

    type ExplorerProject = {
        slug: string,
        href: string,
        name: string,
        year: number,
        date: string,
        desc: string,
        thumb: string,
        thumbVideo?: string,
        categories: string[],
        featured: boolean,
        solo: boolean, // built alone: picks the single or multiple person icon
        teamLabel: string,
        contextLabel: string,
        techs: string[], // technology names, only used by the tech filter
        cats: { key: string, label: string, dot: string }[], // singular category labels shown as chips on the card
    };

    type Pill = {
        key: string,
        label: string,
        dot: string,
        count: number,
    };

    type SkillGroup = {
        title: string,
        countLabel: string,
        items: { n: string, c: string, count: number, countLabel: string }[],
    };

    type Labels = {
        eyebrow: string,
        filters: string,
        searchPlaceholder: string,
        sortLabel: string,
        sortNewest: string,
        sortOldest: string,
        result: string,
        results: string,
        builtWith: string,
        clickToFilter: string,
        removeTechFilter: string,
        noProject: string,
        showAll: string,
        details: string,
        skillsEyebrow: string,
        techSkillsTitle: string,
        techSkillsIntro: string,
        showcase: string,
        showcaseHint: string,
    };

    interface Props {
        projects: ExplorerProject[];
        pills: Pill[];
        // Page heading per filter pill key; falls back to the "all" title.
        titles: Record<string, string>;
        subtitle: string;
        techColors: Record<string, string>;
        skillHighlights: string[];
        skillGroups: SkillGroup[];
        labels: Labels;
        showcaseHref: string;
        initialFilter?: string;
        initialTech?: string | null;
        initialQuery?: string;
    }

    let {
        projects,
        pills,
        titles,
        subtitle,
        techColors,
        skillHighlights,
        skillGroups,
        labels,
        showcaseHref,
        initialFilter = "featured",
        initialTech = null,
        initialQuery = "",
    }: Props = $props();

    // The URL's state seeds the explorer once; from then on the visitor drives
    // it, so the props are read on purpose without tracking them
    let filter = $state(untrack(() => initialFilter));
    let title = $derived(titles[filter] ?? titles.all);
    let tech = $state<string | null>(untrack(() => initialTech));
    let query = $state(untrack(() => initialQuery));
    let sort = $state<"recent" | "oldest">("recent");

    let q = $derived(query.trim().toLowerCase());
    let filtered = $derived(
        projects
            .filter(p =>
                (filter === "all" || (filter === "featured" ? p.featured : p.categories.includes(filter))) &&
                (!tech || p.techs.includes(tech)) &&
                (!q || p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)))
            .sort((a, b) => sort === "oldest" ? a.year - b.year : b.year - a.year)
    );
    let techDot = $derived(tech ? (techColors[tech] ?? "var(--accent-text)") : "var(--accent-text)");

    // Keep the URL shareable without polluting the history.
    // `$effect` only runs in the browser, so no explicit `window` guard is needed.
    $effect(() => {
        const params = new URLSearchParams();
        // "featured" is the default state: keep it out of the URL.
        if (filter !== "featured") params.set("filter", filter);
        if (tech) params.set("tech", tech);
        // Share the query as typed (case preserved); `q` is only lowercased
        // for matching, not for the URL.
        const typedQuery = query.trim();
        if (typedQuery) params.set("q", typedQuery);
        const search = params.toString();
        history.replaceState(null, "", `${location.pathname}${search ? `?${search}` : ""}`);
    });

    function scrollToToolbar() {
        const motion = document.documentElement.dataset.motion !== "reduce";
        document.getElementById("projects-toolbar")?.scrollIntoView({ behavior: motion ? "smooth" : "auto", block: "start" });
    }

    function pickTech(name: string) {
        tech = name;
        filter = "all";
        scrollToToolbar();
    }

    function pickCategory(key: string) {
        filter = key;
        scrollToToolbar();
    }
</script>

<!-- heading following the active filter -->
<header class="wrap head" id="projects-head">
    <p class="eyebrow caption-3">{labels.eyebrow}</p>
    <div class="head-text">
        <h1 class="heading-2">{title}</h1>
        <p class="body-7 text-muted">{subtitle}</p>
        <a class="text-link button-sm" href={showcaseHref}>
            {labels.showcase}<span class="sr-only">, {labels.showcaseHint}</span>
            <PhIcon name="arrow-right" class="size-4" />
        </a>
    </div>

    <!-- filter pills -->
    <div class="pills" role="group" aria-label={labels.filters}>
        {#each pills as pill (pill.key)}
            <button type="button" class="pill body-5" aria-pressed={filter === pill.key} onclick={() => filter = pill.key}>
                <span class="dot" style="background:{pill.dot}"></span>
                {pill.label}
                <span class="count caption-5">{pill.count}</span>
            </button>
        {/each}
    </div>

    <!-- search + sort; `flex-wrap` keeps the sort button reachable on small
         screens: it drops to a second row instead of crushing the search -->
    <div id="projects-toolbar" class="toolbar">
        <PhIcon name="magnifying-glass" class="size-5 shrink-0 text-muted" />
        <input
            type="search"
            bind:value={query}
            aria-label={labels.searchPlaceholder}
            placeholder={labels.searchPlaceholder}
            class="search body-3"
        />
        <button type="button" class="sort caption-1" aria-label="{labels.sortLabel} : {sort === 'oldest' ? labels.sortOldest : labels.sortNewest}" onclick={() => sort = sort === "oldest" ? "recent" : "oldest"}>
            {sort === "oldest" ? labels.sortOldest : labels.sortNewest}
            <PhIcon name="arrows-down-up" class="size-4" />
        </button>
        <span class="caption-2 text-muted whitespace-nowrap" role="status">{filtered.length} {filtered.length === 1 ? labels.result : labels.results}</span>
    </div>

    <!-- active technology filter -->
    {#if tech}
        <div class="tech-filter body-6">
            <span>{labels.builtWith}</span>
            <button type="button" class="tech-chip body-5" aria-label="{labels.removeTechFilter} {tech}" onclick={() => tech = null}>
                <span class="dot" style="background:{techDot}"></span>
                {tech}
                <PhIcon name="x" class="size-3.5 opacity-70" />
            </button>
            <span class="text-muted">{labels.clickToFilter}</span>
        </div>
    {/if}
</header>

<!-- projects grid -->
<div class="wrap grid-wrap">
    <div class="grid">
        {#each filtered as p (p.slug)}
            <article class="explorer-card">
                <ProjectThumb thumb={p.thumb} video={p.thumbVideo} alt={p.name} class="thumb" />
                <div class="body">
                    <div class="meta">
                        <div class="chips">
                            {#each p.cats as c (c.key)}
                                <button type="button" class="chip caption-4" onclick={() => pickCategory(c.key)}>
                                    <span class="dot" style="background:{c.dot}"></span>
                                    {c.label}
                                </button>
                            {/each}
                        </div>
                        <span class="caption-5 font-mono text-muted whitespace-nowrap">{p.date}</span>
                    </div>
                    <h2 class="heading-6"><a href={p.href} class="card-link">{p.name}</a></h2>
                    <p class="body-6">{p.desc}</p>
                    <div class="foot caption-2">
                        <span class="inline-flex items-center gap-1.5 whitespace-nowrap">
                            <PhIcon name={p.solo ? "user" : "users"} class="size-4" />
                            {p.teamLabel}
                        </span>
                        <span class="whitespace-nowrap">{p.contextLabel}</span>
                        <span class="details" aria-hidden="true">{labels.details} <PhIcon name="arrow-right" class="size-4" /></span>
                    </div>
                </div>
            </article>
        {/each}
    </div>

    {#if filtered.length === 0}
        <p class="empty body-3 text-muted">{labels.noProject}</p>
    {/if}

    {#if filter !== "all" || tech || q}
        <div class="show-all">
            <button type="button" class="btn btn-ghost button-sm" onclick={() => { filter = "all"; tech = null; query = ""; }}>{labels.showAll}</button>
        </div>
    {/if}
</div>

<!-- tech skills -->
<section class="section" id="skills" aria-labelledby="skills-title">
    <div class="wrap stack">
        <div class="split-head">
            <div>
                <p class="eyebrow caption-3">{labels.skillsEyebrow}</p>
                <h2 id="skills-title" class="heading-2">{labels.techSkillsTitle}</h2>
            </div>
            <p class="body-7 text-muted">{labels.techSkillsIntro}</p>
        </div>
        <ul class="highlights">
            {#each skillHighlights as highlight (highlight)}
                <li class="highlight body-5">
                    <PhIcon name="medal" class="size-4 shrink-0 text-accent-text" />
                    {highlight}
                </li>
            {/each}
        </ul>
        <div class="groups">
            {#each skillGroups as group (group.title)}
                <div class="group">
                    <div class="group-head">
                        <h3 class="title-2 text-heading">{group.title}</h3>
                        <span class="caption-5 font-mono text-muted whitespace-nowrap">{group.countLabel}</span>
                    </div>
                    <div class="techs">
                        {#each group.items as item (item.n)}
                            {#if item.count > 0}
                                <button type="button" class="tech body-5" onclick={() => pickTech(item.n)}>
                                    <span class="dot" style="background:{item.c}"></span>
                                    {item.n}
                                    <span class="tech-count caption-5 font-mono">{item.countLabel}</span>
                                </button>
                            {:else}
                                <div class="tech body-5">
                                    <span class="dot" style="background:{item.c}"></span>
                                    {item.n}
                                    <span class="tech-count caption-5 font-mono text-muted">0</span>
                                </div>
                            {/if}
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>

<style>
    .head {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding-top: 144px;
    }

    @media (min-width: 1024px) {
        .head { padding-top: 176px; }
    }

    .head-text {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
        max-width: 760px;
    }

    .pills {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding-top: 16px;
    }

    .pill,
    .chip,
    .tech-chip {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        border-radius: 9999px;
        border: 1px solid var(--line-strong);
        background: var(--fill);
        color: var(--text);
        white-space: nowrap;
        transition: border-color 300ms var(--ease-space), background-color 300ms var(--ease-space), color 300ms var(--ease-space);
    }

    .pill {
        padding: 8px 16px;
    }

    .pill:hover,
    .chip:hover {
        border-color: var(--line-hover);
        color: var(--heading);
    }

    .pill[aria-pressed="true"] {
        border-color: var(--accent-text);
        background: var(--accent-soft);
        color: var(--heading);
    }

    .count {
        color: var(--muted);
    }

    .dot {
        width: 7px;
        height: 7px;
        border-radius: 9999px;
        flex-shrink: 0;
    }

    .toolbar {
        margin-top: 8px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px 12px;
        padding: 8px 8px 8px 16px;
        border-radius: 9999px;
        border: 1px solid var(--line-strong);
        background: var(--panel);
        scroll-margin-top: 112px;
    }

    .search {
        flex: 1;
        min-width: 8rem;
        background: transparent;
        border: none;
        color: var(--heading);
        padding: 4px 0;
    }

    .search::placeholder {
        color: var(--muted);
        opacity: 1;
    }

    .search:focus-visible {
        outline: none;
    }

    .toolbar:focus-within {
        border-color: var(--accent-text);
    }

    .sort {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 12px;
        border-radius: 9999px;
        border: 1px solid var(--line-strong);
        color: var(--text);
        white-space: nowrap;
        transition: border-color 300ms var(--ease-space), color 300ms var(--ease-space);
    }

    .sort:hover {
        border-color: var(--line-hover);
        color: var(--heading);
    }

    .tech-filter {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px 12px;
        color: var(--text);
    }

    .tech-chip {
        padding: 6px 12px;
        border-color: var(--accent-text);
        color: var(--heading);
    }

    .grid-wrap {
        position: relative;
        z-index: 1;
        padding-top: 32px;
    }

    .grid {
        display: grid;
        gap: 24px;
        grid-template-columns: repeat(auto-fill, minmax(min(320px, 100%), 1fr));
    }

    .explorer-card {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 8px;
        border-radius: 24px;
        border: 1px solid var(--line);
        background: var(--panel);
        min-width: 0;
        transition: border-color 300ms var(--ease-space), transform 500ms var(--ease-space);
    }

    .explorer-card:hover {
        border-color: var(--line-strong);
        transform: translateY(-4px);
    }

    .explorer-card:focus-within {
        outline: 2px solid var(--accent-text);
        outline-offset: 2px;
    }

    .explorer-card :global(.thumb) {
        border-radius: 16px;
        border: 1px solid var(--line);
        background: #060E22;
    }

    .body {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 12px 12px 8px;
        flex: 1;
    }

    .meta {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
    }

    /* Above the stretched title link, so they stay clickable */
    .chips {
        position: relative;
        z-index: 1;
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
    }

    .chip {
        padding: 4px 10px;
    }

    /* The title link covers the whole card */
    .card-link::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 24px;
    }

    .card-link:focus-visible {
        outline: none;
    }

    .foot {
        margin-top: auto;
        padding-top: 12px;
        border-top: 1px solid var(--line);
        display: flex;
        align-items: center;
        gap: 16px;
        color: var(--muted);
    }

    .details {
        margin-left: auto;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        color: var(--accent-text);
        white-space: nowrap;
    }

    .empty {
        text-align: center;
        padding: 48px 0;
    }

    .show-all {
        display: flex;
        justify-content: center;
        padding-top: 32px;
    }

    .highlights {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    .highlight {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        border-radius: 9999px;
        border: 1px solid var(--line-strong);
        background: var(--fill);
        color: var(--heading);
    }

    .groups {
        display: grid;
        gap: 16px;
        grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
    }

    .group {
        background: var(--panel);
        border: 1px solid var(--line);
        border-radius: 24px;
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .group-head {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 12px;
    }

    .techs {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .tech {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 6px 8px;
        margin-inline: -8px;
        border-radius: 8px;
        color: var(--heading);
        text-align: left;
    }

    button.tech {
        transition: background-color 300ms var(--ease-space);
    }

    button.tech:hover {
        background: var(--fill-hover);
    }

    .tech-count {
        margin-left: auto;
        color: var(--accent-text);
        white-space: nowrap;
    }

    :global(:root[data-motion="reduce"]) .explorer-card:hover {
        transform: none;
    }
</style>
