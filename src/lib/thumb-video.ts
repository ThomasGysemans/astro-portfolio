// Autoplay controller of the projects' presentation videos (`thumbVideo`).
//
// A plain `<video autoplay>` is the naive answer and the wrong one here: the
// /projects grid holds a card per project, so every browser would start
// downloading every video on load — megabytes for the two that are on screen.
// The markup therefore ships with no `src` at all (the `poster`, i.e. the
// project's thumbnail, is what paints), and this module hands a video its
// source only when it scrolls into view, pausing it again when it leaves.
//
// Two entry points because the cards live in two worlds: the Astro cards are
// static and scanned once (`mountThumbVideos`), while the cards of the Svelte
// islands come and go with the filters and the showcase slides, so they
// register themselves through the `thumbVideo` action.

// Reduced motion is not a "nice to have" here: these videos loop forever with
// no way to pause them, which is exactly what the setting exists to prevent.
// The poster image then stays in place — the card looks the same, just still.
const reducedMotion = typeof matchMedia === "function"
    ? matchMedia("(prefers-reduced-motion: reduce)")
    : null;

let observer: IntersectionObserver | null = null;

function sharedObserver(): IntersectionObserver {
    observer ??= new IntersectionObserver(entries => {
        for (const entry of entries) {
            const video = entry.target as HTMLVideoElement;
            if (!entry.isIntersecting) {
                video.pause();
                continue;
            }
            if (reducedMotion?.matches) continue;
            // First time in view: this is where the download starts.
            if (!video.src && video.dataset.src) video.src = video.dataset.src;
            // Rejects when the autoplay policy refuses, or when the element is
            // paused/removed before the promise settles: nothing to recover.
            video.play().catch(() => {});
        }
    }, { rootMargin: "150px" });
    return observer;
}

// Registers a single video. Returns the matching cleanup.
export function watchThumbVideo(video: HTMLVideoElement): () => void {
    sharedObserver().observe(video);
    return () => {
        observer?.unobserve(video);
        video.pause();
    };
}

// Svelte action (`use:thumbVideo`) for the videos rendered by the islands.
export function thumbVideo(video: HTMLVideoElement) {
    const stop = watchThumbVideo(video);
    return { destroy: stop };
}

// Scans a subtree for the videos rendered by the Astro components, which mark
// themselves with `data-thumb-video`. The island videos do not carry that
// attribute: they are registered by the action instead, so nothing is watched
// twice and their cleanup stays with the component that owns them.
export function mountThumbVideos(root: ParentNode = document): void {
    for (const video of root.querySelectorAll<HTMLVideoElement>("video[data-thumb-video]")) {
        watchThumbVideo(video);
    }
}
