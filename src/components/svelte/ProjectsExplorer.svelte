<script lang="ts">
    // Interactive explorer of the projects page: category pills, search,
    // year sorting, technology filter and the tech skills section.
    // It is server-rendered by Astro with the default state, then hydrated.

    type ExplorerProject = {
        slug: string,
        href: string,
        name: string,
        year: number,
        date: string,
        desc: string,
        thumb: string,
        categories: string[],
        featured: boolean,
        // true when the project was built alone: picks the single/multiple
        // person icon. Astro can't render <Icon> inside this island, so the
        // Lucide paths are inlined below (same set as public/icons/).
        solo: boolean,
        teamLabel: string,
        contextLabel: string,
        techs: string[], // technology names, only used by the tech filter
        cats: { key: string, label: string, dot: string }[], // singular category labels shown as pills on the card
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
        searchPlaceholder: string,
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
        techSkillsTitle: string,
        techSkillsIntro: string,
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
        initialFilter = "featured",
        initialTech = null,
        initialQuery = "",
    }: Props = $props();

    let filter = $state(initialFilter);
    let title = $derived(titles[filter] ?? titles.all);
    let tech = $state<string | null>(initialTech);
    let query = $state(initialQuery);
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
    let techDot = $derived(tech ? (techColors[tech] ?? "var(--accent)") : "var(--accent)");

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

    function pickTech(name: string) {
        tech = name;
        filter = "all";
        document.getElementById("projects-toolbar")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function pickCategory(key: string) {
        filter = key;
        document.getElementById("projects-toolbar")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
</script>

<!-- heading following the active filter -->
<div class="px-page pt-11">
    <h1 class="text-3xl font-bold m-0 text-heading">{title}</h1>
    <p class="text-[13px] text-body mt-1.5">{subtitle}</p>
</div>

<!-- filter pills -->
<div class="flex gap-2 flex-wrap px-page mt-4.5">
    {#each pills as pill (pill.key)}
        <button
            type="button"
            aria-pressed={filter === pill.key}
            onclick={() => filter = pill.key}
            class="inline-flex items-center gap-1.75 text-[11.5px] font-bold rounded-full py-2 px-3.5 whitespace-nowrap border transition-colors {filter === pill.key ? 'bg-btn text-btn-text border-btn' : 'bg-chip text-chip-text border-edge-strong hover:border-accent'}"
        >
            <span class="w-1.75 h-1.75 rounded-full" style="background:{pill.dot}" />
            {pill.label}
            <span class="text-[10px] opacity-65">{pill.count}</span>
        </button>
    {/each}
</div>

<!-- search + sort toolbar -->
<!-- `flex-wrap` keeps the sort button reachable on small screens: it drops
     to a second row instead of being hidden or crushing the search input. -->
<div id="projects-toolbar" class="mx-page-margin bg-card border border-edge rounded-[11px] py-3 px-4 flex gap-2.5 items-center flex-wrap scroll-mt-6">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" class="stroke-muted shrink-0" stroke-width="2.5" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
    <input
        type="search"
        bind:value={query}
        aria-label={labels.searchPlaceholder}
        placeholder={labels.searchPlaceholder}
        class="flex-1 min-w-32 bg-transparent border-none text-text text-[12.5px] font-sans placeholder:text-muted"
    />
    <button
        type="button"
        onclick={() => sort = sort === "oldest" ? "recent" : "oldest"}
        class="text-[11.5px] font-semibold text-chip-text border border-edge-strong rounded-lg py-1.75 px-3 inline-flex items-center gap-1.5 whitespace-nowrap hover:border-accent transition-colors"
    >
        {sort === "oldest" ? labels.sortOldest : labels.sortNewest}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="M8 7l4-4 4 4M8 17l4 4 4-4" /></svg>
    </button>
    <span class="text-[11px] text-muted whitespace-nowrap" role="status">{filtered.length} {filtered.length === 1 ? labels.result : labels.results}</span>
</div>

<!-- active technology filter -->
{#if tech}
    <div class="px-page mt-4 flex items-center gap-2.5 text-[11.5px] text-body flex-wrap">
        <span>{labels.builtWith}</span>
        <button
            type="button"
            aria-label="{labels.removeTechFilter} {tech}"
            onclick={() => tech = null}
            class="inline-flex items-center gap-1.75 font-bold text-heading bg-chip border border-accent rounded-full py-1.5 px-3.5"
        >
            <span class="w-1.75 h-1.75 rounded-full" style="background:{techDot}" />
            {tech}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" class="opacity-60" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
        <span class="text-muted">{labels.clickToFilter}</span>
    </div>
{/if}

<!-- projects grid -->
<div class="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5 px-page mt-6 pb-6">
    {#each filtered as p (p.slug)}
        <article class="explorer-card relative rounded-[13px] overflow-hidden border border-edge flex flex-col">
            <div class="relative aspect-video overflow-hidden">
                <img src={p.thumb} alt="" aria-hidden="true" loading="lazy" decoding="async" class="absolute inset-0 w-full h-full object-cover scale-110 blur-lg opacity-70" />
                <img src={p.thumb} alt={p.name} loading="lazy" decoding="async" class="relative w-full h-full object-contain" />
            </div>
            <div class="bg-card-solid pt-3.75 px-4.25 pb-3.25 flex flex-col gap-2.25 flex-1">
                <div class="flex justify-between items-baseline gap-2">
                    <h3 class="m-0"><a href={p.href} class="card-link text-[15px] font-bold text-heading">{p.name}</a></h3>
                    <span class="text-[11px] font-bold text-muted">{p.date}</span>
                </div>
                <p class="text-[11.5px] leading-[1.6] text-body m-0">{p.desc}</p>
                <div class="relative z-10 flex gap-1.5 flex-wrap mt-auto">
                    {#each p.cats as c (c.key)}
                        <button
                            type="button"
                            onclick={() => pickCategory(c.key)}
                            class="inline-flex items-center gap-1.25 text-[10.5px] font-semibold text-chip-text border border-edge-strong rounded-full py-1 px-2.5 hover:border-accent hover:text-heading transition-colors"
                        >
                            <span class="w-1.5 h-1.5 rounded-full" style="background:{c.dot}" />
                            {c.label}
                        </button>
                    {/each}
                </div>
                <div class="border-t border-edge pt-2.5 flex gap-3.5 text-[10.5px] text-muted items-center">
                    <span class="inline-flex items-center gap-1.25 whitespace-nowrap">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            {#if p.solo}
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                            {:else}
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                            {/if}
                        </svg>
                        {p.teamLabel}
                    </span>
                    <span class="whitespace-nowrap">{p.contextLabel}</span>
                    <span class="ml-auto text-accent font-bold whitespace-nowrap" aria-hidden="true">{labels.details} →</span>
                </div>
            </div>
        </article>
    {/each}
</div>

{#if filtered.length === 0}
    <div class="text-center px-page pb-14 text-muted text-[13px]">{labels.noProject}</div>
{/if}

{#if filter !== "all" || tech || q}
    <div class="flex justify-center px-page pb-12">
        <button
            type="button"
            onclick={() => { filter = "all"; tech = null; query = ""; }}
            class="btn-outline text-[12.5px] py-2.75 px-6"
        >{labels.showAll}</button>
    </div>
{/if}

<!-- tech skills -->
<section class="border-t border-edge mx-page-margin pt-10.5 pb-1.5">
    <h2 class="text-[26px] font-bold m-0 text-heading">{labels.techSkillsTitle}</h2>
    <p class="text-[13px] text-body mt-2 max-w-155 leading-[1.7]">{labels.techSkillsIntro}</p>
    <div class="flex gap-2.5 flex-wrap mt-6">
        {#each skillHighlights as highlight (highlight)}
            <span class="inline-flex items-center gap-2 text-xs font-semibold leading-normal text-heading bg-card border border-edge-strong rounded-full py-2.5 px-4.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-accent shrink-0" aria-hidden="true"><path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15" /><path d="M11 12 5.12 2.2M13 12l5.88-9.8M8 7h8" /><circle cx="12" cy="17" r="5" /><path d="M12 18v-2h-.5" /></svg>
                {highlight}
            </span>
        {/each}
    </div>
    <div class="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 mt-6.5">
        {#each skillGroups as group (group.title)}
            <div class="surface-card py-5 px-5.5">
                <div class="flex justify-between items-baseline mb-3.5">
                    <span class="text-[13px] font-bold text-accent-heading">{group.title}</span>
                    <span class="text-[10.5px] text-muted whitespace-nowrap">{group.countLabel}</span>
                </div>
                <div class="flex flex-col gap-2.75">
                    {#each group.items as item (item.n)}
                        {#if item.count > 0}
                            <button type="button" onclick={() => pickTech(item.n)} class="flex items-center gap-2.25 text-[12.5px] font-semibold text-heading hover:text-accent transition-colors text-left">
                                <span class="w-2 h-2 rounded-full shrink-0" style="background:{item.c}" />
                                {item.n}
                                <span class="ml-auto text-[10.5px] font-semibold text-accent">{item.countLabel}</span>
                            </button>
                        {:else}
                            <div class="flex items-center gap-2.25 text-[12.5px] font-semibold text-heading">
                                <span class="w-2 h-2 rounded-full shrink-0" style="background:{item.c}" />
                                {item.n}
                                <span class="ml-auto text-[10.5px] font-semibold text-muted">0</span>
                            </div>
                        {/if}
                    {/each}
                </div>
            </div>
        {/each}
    </div>
</section>

<style lang="scss">
    // Same page padding as .px-page but as margins, for full-width separators.
    .mx-page-margin {
        margin-inline: clamp(20px, 3.5vw, 44px);
    }

    #projects-toolbar {
        margin-top: 18px;
    }

    .explorer-card {
        transition: box-shadow .25s, transform .25s;

        &:hover,
        &:focus-within {
            box-shadow: 0 0 0 1px rgba(97, 156, 243, .7), 0 16px 44px rgba(97, 156, 243, .22);
            transform: translateY(-3px);
        }
    }

    // Stretch the title link over the whole card while keeping
    // the technology chips clickable above it.
    .card-link::after {
        content: "";
        position: absolute;
        inset: 0;
    }
</style>
