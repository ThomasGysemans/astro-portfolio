<script lang="ts">
    // Immersive fullscreen viewer of the featured projects.
    // Fixed dark palette on purpose: the showcase is its own universe,
    // independent from the light/dark theme of the rest of the site.
    import { onDestroy, onMount } from "svelte";
    import { Spring } from "svelte/motion";
    import { Canvas, T } from "@threlte/core";
    import Nebula from "./Nebula.svelte";

    type ShowcaseItem = {
        name: string,
        tagline: string,
        desc: string,
        thumb: string,
        href: string,
        techs: string[],
    };

    type Labels = {
        label: string,
        title: string,
        exit: string,
        travelTip: string,
        learnMore: string,
        previous: string,
        next: string,
    };

    let { items, labels, exitHref }: {
        items: ShowcaseItem[],
        labels: Labels,
        exitHref: string,
    } = $props();

    let index = $state(0);

    // The nebula canvas only makes sense on the client, and is skipped
    // entirely for users who prefer reduced motion (the static stars
    // background below remains as the backdrop).
    let showNebula = $state(false);

    // Cap the render resolution: the nebula is a soft, bloomed backdrop, so
    // rendering it at the full Retina pixel ratio is wasted GPU work.
    let nebulaDpr = $state(1);

    // Tint of the nebula clouds, re-randomized on each navigation.
    const ri = new Spring(0);
    const gi = new Spring(0);
    const bi = new Spring(0);

    let current = $derived(items[index]);
    let counter = $derived(`${pad(index + 1)} / ${pad(items.length)}`);

    function pad(n: number): string {
        return n < 10 ? `0${n}` : `${n}`;
    }

    function changeColors() {
        ri.set(Math.random() * 0.4);
        gi.set(Math.random() * 0.4);
        bi.set(Math.random() * 0.4);
    }

    function select(i: number) {
        index = i;
        changeColors();
    }

    function go(delta: number) {
        select((index + delta + items.length) % items.length);
    }

    function onKeydown(event: KeyboardEvent) {
        if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
            event.preventDefault();
            go(-1);
        } else if (event.key === "ArrowDown" || event.key === "ArrowRight") {
            event.preventDefault();
            go(1);
        }
    }

    onMount(() => {
        document.addEventListener("keydown", onKeydown);
        showNebula = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        nebulaDpr = Math.min(window.devicePixelRatio || 1, 1.5);
        changeColors();
    });
    onDestroy(() => {
        if (typeof document !== "undefined") {
            document.removeEventListener("keydown", onKeydown);
        }
    });
</script>

<div class="showcase relative min-h-dvh overflow-hidden bg-[#04141c] text-white">
    <div class="absolute inset-0 bg-cover bg-center showcase-stars" style="background-image:url('/stars.jpg')" aria-hidden="true" />
    {#if showNebula}
        <div class="absolute inset-0 showcase-nebula" aria-hidden="true">
            <!-- The soft, blurry nebula doesn't need Retina crispness: cap the
                 device pixel ratio (huge fill-rate saving on hi-DPI screens).
                 autoRender is off because Nebula draws through its own
                 EffectComposer — otherwise the scene would be rendered twice. -->
            <Canvas autoRender={false} dpr={nebulaDpr}>
                <T.PerspectiveCamera
                    makeDefault
                    position={[0, 0, 1]}
                    rotation={[1.16, -0.12, 0.27]}
                />
                <T.PointLight args={[0xff0000, ri.current, 0, 0]} position={[-0.8, 1.5, -0.5]} />
                <T.PointLight args={[0x00ff00, gi.current, 0, 0]} position={[-0.8, 1.5, -0.5]} />
                <T.PointLight args={[0x0000ff, bi.current, 0, 0]} position={[-0.8, 1.5, -0.5]} />
                <Nebula />
            </Canvas>
        </div>
    {/if}
    <div class="absolute inset-0 showcase-overlay" aria-hidden="true" />

    <a
        href={exitHref}
        class="absolute top-5 right-5 lg:top-6.5 lg:right-8 z-30 inline-flex items-center gap-2 text-xs font-bold text-[#c4dfe2] bg-[rgba(3,17,26,.72)] border border-[rgba(154,209,212,.3)] rounded-full py-2.5 px-4.5 backdrop-blur-lg hover:border-[#9ad1d4] hover:text-white transition-colors"
    >{labels.exit}</a>

    <!-- left rail -->
    <nav class="absolute left-8 top-7 bottom-7 w-70 xl:w-80 2xl:w-96 z-20 max-lg:hidden flex flex-col" aria-label={labels.title}>
        <div class="text-[12px] xl:text-[13px] 2xl:text-[14px] font-bold tracking-[.22em] text-[#9ad1d4] mb-2">{labels.label}</div>
        <div class="text-[23px] xl:text-[27px] 2xl:text-[31px] font-bold leading-[1.3] mb-5">{labels.title}</div>
        <div class="flex flex-col gap-1">
            {#each items as item, i (item.href)}
                <button
                    type="button"
                    aria-current={i === index ? "true" : undefined}
                    onclick={() => select(i)}
                    class="flex items-center gap-2.5 text-[15px] xl:text-[17px] 2xl:text-[19px] py-2.5 xl:py-3 px-3 rounded-[9px] border text-left transition-colors {i === index ? 'text-white font-bold bg-[rgba(154,209,212,.12)] border-[rgba(154,209,212,.35)]' : 'text-[#8fb4ba] border-transparent hover:text-white'}"
                >
                    <span class="text-[11.5px] xl:text-[13px] 2xl:text-[14.5px] font-bold {i === index ? 'text-[#9ad1d4]' : 'text-[rgba(143,180,186,.6)]'}">{pad(i + 1)}</span>
                    {item.name}
                </button>
            {/each}
        </div>
        <div class="mt-auto text-[12.5px] xl:text-[14px] 2xl:text-[15.5px] text-[#7da3ab] leading-[1.7]">{labels.travelTip}</div>
    </nav>

    <!-- center title -->
    {#key index}
        <div class="absolute z-10 text-center left-1/2 top-[16%] w-full px-5 lg:w-auto lg:px-0 lg:left-[56%] lg:top-[34%] -translate-x-1/2 lg:-translate-y-1/2 showcase-fade-title">
            <h1 class="text-[clamp(32px,4.8vw,46px)] font-bold m-0 [text-shadow:0_0_44px_rgba(154,209,212,.55)]">{current.name}</h1>
            <div class="text-sm md:text-[15px] text-[#9fc3c9] mt-2.5 tracking-[.08em] [text-shadow:0_1px_14px_rgba(2,10,16,.9)]">{current.tagline}</div>
        </div>
    {/key}

    <!-- info card -->
    {#key index}
        <div class="absolute z-20 bottom-5 left-4 right-4 sm:left-auto sm:right-8 sm:bottom-8 sm:w-90 bg-[rgba(3,17,26,.78)] border border-[rgba(154,209,212,.28)] rounded-[15px] p-4 backdrop-blur-xl showcase-fade-card">
            <img src={current.thumb} alt={current.name} loading="lazy" decoding="async" class="w-full aspect-video object-cover rounded-[10px] mb-3.25" />
            <div class="flex justify-between items-baseline mb-1.75">
                <span class="text-base font-bold">{current.name}</span>
                <span class="text-[10.5px] text-[#9ad1d4] font-bold">{counter}</span>
            </div>
            <p class="text-[11.5px] leading-[1.65] text-[#b8d6da] mb-3">{current.desc}</p>
            <div class="flex gap-1.5 mb-3.5 flex-wrap max-sm:hidden">
                {#each current.techs as tech (tech)}
                    <span class="text-[10px] font-semibold text-[#c4dfe2] border border-white/20 rounded-full py-1 px-2.75">{tech}</span>
                {/each}
            </div>
            <div class="flex gap-2">
                <a href={current.href} class="flex-1 text-center bg-white text-night text-xs font-bold py-2.75 rounded-lg hover:brightness-90 transition-[filter]">{labels.learnMore}</a>
                <button type="button" aria-label={labels.previous} onclick={() => go(-1)} class="w-11 text-center border border-white/25 rounded-lg text-sm py-2.5 hover:bg-white/10 transition-colors">‹</button>
                <button type="button" aria-label={labels.next} onclick={() => go(1)} class="w-11 text-center border border-white/25 rounded-lg text-sm py-2.5 hover:bg-white/10 transition-colors">›</button>
            </div>
        </div>
    {/key}
</div>

<style>
    /* The raw stars picture is much brighter than the nebula canvas that
       replaces it: toned down so the swap doesn't flash, while remaining
       a decent backdrop for reduced-motion users (who never get the nebula). */
    .showcase-stars {
        filter: brightness(.45);
    }

    /* The nebula appears once Three.js is ready: fading it in (instead of
       an instant swap) softens the transition from the static backdrop. */
    @keyframes showcase-nebula-in {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .showcase-nebula {
        animation: showcase-nebula-in 1.4s ease-out both;
    }

    .showcase-overlay {
        background:
            linear-gradient(90deg, rgba(2, 10, 16, .72) 0%, transparent 34%),
            radial-gradient(ellipse 70% 60% at 60% 45%, transparent 30%, rgba(2, 10, 16, .5) 100%);
    }

    /* Only animates the 8px vertical offset via `transform`. Centering is
       handled by the `-translate-x-1/2`/`-translate-y-1/2` utilities, which
       in Tailwind v4 use the independent `translate` property, so the two no
       longer share the `transform` property and must not restate the -50%. */
    @keyframes showcase-fade-title {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .showcase-fade-title {
        animation: showcase-fade-title .4s ease both;
    }

    @keyframes showcase-fade-card {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .showcase-fade-card {
        animation: showcase-fade-card .4s ease both;
    }
</style>
