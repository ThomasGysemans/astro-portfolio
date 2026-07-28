<script lang="ts">
    // Carousel of the homepage: it cycles through the pictures (images and
    // videos) of a single project, the one flagged as `carousel` in the
    // back-office — not through several projects.
    import { onDestroy, onMount } from "svelte";

    type Media = {
        src: string,
        video: boolean,
    };

    type ProjectInfo = {
        name: string,
        tagline: string,
        caption: string,
        href: string,
    };

    type Labels = {
        details: string,
        prevPicture: string,
        nextPicture: string,
        gotoPicture: string,
        pause: string,
        resume: string,
    };

    let { project, media, labels }: {
        project: ProjectInfo,
        media: Media[],
        labels: Labels,
    } = $props();

    const AUTOPLAY_DELAY = 5000;

    let index = $state(0);
    let paused = $state(false);
    let timer: ReturnType<typeof setInterval> | undefined;
    let videos = $state<(HTMLVideoElement | undefined)[]>([]);
    let portrait = $state<boolean[]>([]);

    // A portrait media (e.g. a mobile screenshot) cannot fill the wide frame
    // without being cropped beyond recognition, so it is displayed whole
    // (object-contain) instead. Its orientation is only known from the
    // intrinsic size, measured once the browser has it — immediately when the
    // element was already loaded before hydration.
    function detectOrientation(node: HTMLImageElement | HTMLVideoElement, i: number) {
        const measure = () => {
            const isVideo = node instanceof HTMLVideoElement;
            const width = isVideo ? node.videoWidth : node.naturalWidth;
            const height = isVideo ? node.videoHeight : node.naturalHeight;
            if (width && height) portrait[i] = height > width;
        };
        measure();
        const event = node instanceof HTMLVideoElement ? "loadedmetadata" : "load";
        node.addEventListener(event, measure);
        return { destroy: () => node.removeEventListener(event, measure) };
    }

    function startTimer() {
        clearInterval(timer);
        if (media.length > 1) {
            timer = setInterval(() => {
                if (!paused) {
                    index = (index + 1) % media.length;
                }
            }, AUTOPLAY_DELAY);
        }
    }

    // Manual navigation restarts the autoplay countdown.
    function goTo(i: number) {
        index = (i + media.length) % media.length;
        startTimer();
    }

    // The visible video plays only while the carousel is running; pausing the
    // slideshow (manually or via reduced-motion) freezes it in place, and the
    // hidden ones are rewound.
    $effect(() => {
        for (let i = 0; i < videos.length; i++) {
            const video = videos[i];
            if (!video) continue;
            if (i === index && !paused) {
                video.play().catch(() => {});
            } else {
                video.pause();
                if (i !== index) video.currentTime = 0;
            }
        }
    });

    onMount(() => {
        // Respect a reduced-motion preference: start paused so nothing moves on
        // its own; the visitor can still press play. `matchMedia` is browser-only,
        // hence resolved here rather than in the initial (SSR) state.
        paused = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        startTimer();
    });
    onDestroy(() => clearInterval(timer));
</script>

<div class="relative rounded-2xl overflow-hidden border border-edge shadow-[0_24px_70px_rgba(2,8,18,.35)]" role="region" aria-roledescription="carousel" aria-label={project.name}>
    <div class="relative aspect-4/3 md:aspect-video lg:aspect-2/1 bg-[#04101f]">
        {#each media as item, i (item.src)}
            <div
                class="absolute inset-0 transition-opacity duration-450 {i === index ? 'opacity-100' : 'opacity-0'}"
                aria-hidden={i === index ? "false" : "true"}
            >
                {#if portrait[i] && !item.video}
                    <!-- Blurred copy filling the sides left empty by a portrait picture. -->
                    <img
                        src={item.src}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        aria-hidden="true"
                        class="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-60"
                    />
                {/if}
                {#if item.video}
                    <video
                        bind:this={videos[i]}
                        use:detectOrientation={i}
                        src={item.src}
                        muted
                        loop
                        playsinline
                        preload={i === 0 ? "auto" : "metadata"}
                        class="absolute inset-0 w-full h-full {portrait[i] ? 'object-contain' : 'object-cover'}"
                    />
                {:else}
                    <img
                        use:detectOrientation={i}
                        src={item.src}
                        alt={i === index ? project.caption : ""}
                        loading={i === 0 ? "eager" : "lazy"}
                        decoding="async"
                        class="absolute inset-0 w-full h-full {portrait[i] ? 'object-contain' : 'object-cover'}"
                    />
                {/if}
            </div>
        {/each}
        <div class="absolute inset-0 bg-linear-to-b from-[rgba(3,15,32,.25)] via-transparent to-[rgba(3,15,32,.92)] pointer-events-none" />
    </div>

    <div class="absolute left-[clamp(14px,2vw,28px)] right-[clamp(14px,2vw,28px)] bottom-[clamp(12px,1.6vw,22px)] flex items-end gap-5 flex-wrap">
        <div class="flex-1 min-w-0">
            <div class="text-xs font-bold tracking-[.14em] text-[#9fc1f7] [text-shadow:0_1px_8px_rgba(0,0,0,.6)] max-sm:hidden">{project.tagline}</div>
            <h3 class="text-[clamp(20px,2vw,26px)] font-bold mt-1.5 mb-0 text-white [text-shadow:0_2px_12px_rgba(0,0,0,.5)]">{project.name}</h3>
            <div class="text-sm text-[#c9d6ef] mt-1 [text-shadow:0_1px_8px_rgba(0,0,0,.6)] max-sm:hidden">{project.caption}</div>
        </div>
        <a
            href={project.href}
            class="bg-accent-strong text-night text-xs font-bold py-2.5 px-5 rounded-lg whitespace-nowrap transition hover:brightness-110 hover:-translate-y-0.5"
        >{labels.details} →</a>
    </div>

    {#if media.length > 1}
        <button
            type="button"
            aria-label={labels.prevPicture}
            onclick={() => goTo(index - 1)}
            class="carousel-arrow left-4"
        >‹</button>
        <button
            type="button"
            aria-label={labels.nextPicture}
            onclick={() => goTo(index + 1)}
            class="carousel-arrow right-4"
        >›</button>

        <div class="absolute top-4.5 right-5 flex items-center gap-3">
            <span class="text-xs font-bold text-[#c9d6ef] tracking-widest whitespace-nowrap [text-shadow:0_1px_8px_rgba(0,0,0,.6)]">{index + 1} / {media.length}</span>
            <div class="flex gap-1.5 items-center max-sm:hidden">
                {#each media as item, i (item.src)}
                    <button
                        type="button"
                        aria-label="{labels.gotoPicture} {i + 1}"
                        aria-current={i === index ? "true" : undefined}
                        onclick={() => goTo(i)}
                        class="h-1.75 rounded-full transition-all {i === index ? 'w-6.5 bg-accent-strong' : 'w-2 bg-white/30 hover:bg-white/50'}"
                    />
                {/each}
            </div>
            <button
                type="button"
                aria-label={paused ? labels.resume : labels.pause}
                title={paused ? labels.resume : labels.pause}
                onclick={() => paused = !paused}
                class="w-7.5 h-7.5 rounded-full bg-[rgba(3,15,32,.72)] border border-white/25 text-white flex items-center justify-center transition-colors hover:border-accent-strong"
            >
                <!-- Lucide play/pause, inlined: Astro's <Icon> can't render inside an island. -->
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    {#if paused}
                        <path d="M5 4.5a1 1 0 0 1 1.5-.87l12 7.5a1 1 0 0 1 0 1.74l-12 7.5A1 1 0 0 1 5 19.5z" />
                    {:else}
                        <rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" />
                    {/if}
                </svg>
            </button>
        </div>
    {/if}
</div>

<style>
    .carousel-arrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: rgba(3, 15, 32, .72);
        border: 1px solid rgba(255, 255, 255, .25);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
    }

    .carousel-arrow:hover {
        background: rgba(3, 15, 32, .9);
        border-color: #619cf3;
    }
</style>
