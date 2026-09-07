<script lang="ts">
    // Svelte twin of `ProjectThumb.astro`, for the cards the islands render
    // themselves (the /projects explorer and the showcase slides). Same markup,
    // but the videos register through the `thumbVideo` action instead of the
    // one-shot scan: these cards are created and destroyed as the visitor
    // filters or moves between slides, and each one must stop being observed
    // when it goes.
    import { thumbVideo } from "@lib/thumb-video";

    let { thumb, video, alt, class: className = "" }: {
        thumb: string,
        video?: string,
        alt: string,
        class?: string,
    } = $props();
</script>

<div class="relative aspect-video overflow-hidden {className}">
    <img src={thumb} alt="" aria-hidden="true" loading="lazy" decoding="async" class="absolute inset-0 w-full h-full object-cover scale-110 blur-lg opacity-70" />
    {#if video}
        <!-- svelte-ignore a11y_media_has_caption -- decorative loop, muted and captionless by design -->
        <video
            use:thumbVideo
            data-src={video}
            poster={thumb}
            muted
            loop
            playsinline
            preload="none"
            aria-label={alt}
            class="relative w-full h-full object-contain"
        ></video>
    {:else}
        <img src={thumb} {alt} loading="lazy" decoding="async" class="relative w-full h-full object-contain" />
    {/if}
</div>
