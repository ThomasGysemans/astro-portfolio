<script lang="ts">
    // Fullscreen viewer for the pictures of a project page.
    //
    // The gallery itself stays server-rendered in `SingleProjectPage.astro`
    // (SEO, lazy loading, no JS required): every picture is wrapped in a plain
    // link to the full-size file, tagged with `data-lightbox-index`. This
    // island only intercepts those clicks and opens a native <dialog> instead,
    // so the page still works if the island never hydrates.
    import { onMount } from "svelte";
    import PhIcon from "./PhIcon.svelte";

    type Picture = {
        src: string,
        caption: string,
    };

    type Labels = {
        gallery: string,
        close: string,
        previous: string,
        next: string,
        zoomIn: string,
        zoomOut: string,
    };

    let { pictures, labels }: {
        pictures: Picture[],
        labels: Labels,
    } = $props();

    const ZOOM_FACTOR = 2.5;

    let dialog = $state<HTMLDialogElement>();
    let index = $state<number | null>(null);
    let zoomed = $state(false);
    // Transform origin of the zoom, in percentages: it follows the pointer so
    // that zooming in keeps the clicked area under the cursor, and moving the
    // pointer afterwards pans the picture.
    let originX = $state(50);
    let originY = $state(50);

    const current = $derived(index === null ? null : pictures[index]);

    function open(i: number) {
        index = i;
        resetZoom();
    }

    function close() {
        index = null;
    }

    function resetZoom() {
        zoomed = false;
        originX = 50;
        originY = 50;
    }

    function go(step: number) {
        if (index === null) return;
        index = (index + step + pictures.length) % pictures.length;
        resetZoom();
    }

    function moveOrigin(event: MouseEvent) {
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        originX = ((event.clientX - rect.left) / rect.width) * 100;
        originY = ((event.clientY - rect.top) / rect.height) * 100;
    }

    function toggleZoom(event: MouseEvent) {
        if (zoomed) {
            resetZoom();
        } else {
            // `detail` is 0 when the click comes from the keyboard (Enter or
            // Space on the focused button): there is no pointer to zoom onto,
            // so the picture stays centred.
            if (event.detail > 0) moveOrigin(event);
            zoomed = true;
        }
    }

    function pan(event: PointerEvent) {
        if (zoomed) moveOrigin(event);
    }

    // Recentre the zoomed picture when the pointer goes away — but only for a
    // mouse: on a touchscreen `pointerleave` also fires when the finger lifts,
    // which would undo the pan the visitor just did.
    function endPan(event: PointerEvent) {
        if (zoomed && event.pointerType === "mouse") {
            originX = 50;
            originY = 50;
        }
    }

    function onKeydown(event: KeyboardEvent) {
        if (pictures.length < 2) return;
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            go(-1);
        } else if (event.key === "ArrowRight") {
            event.preventDefault();
            go(1);
        }
    }

    // Closing the backdrop: only a click landing on the padding around the
    // picture (the element itself, not one of its children) dismisses it.
    function onBackdropClick(event: MouseEvent) {
        if (event.target === event.currentTarget) close();
    }

    // <dialog> is driven imperatively: showModal() is what puts it in the top
    // layer, traps the focus and enables Escape (which fires `close`).
    $effect(() => {
        if (!dialog) return;
        if (index !== null && !dialog.open) {
            dialog.showModal();
        } else if (index === null && dialog.open) {
            dialog.close();
        }
    });

    // The page behind a modal dialog still scrolls in most browsers. Same
    // lock as the mobile drawer of `Header.astro`: on <html>, with the width
    // of the removed scrollbar given back as padding so the layout behind the
    // viewer doesn't shift. The effect only runs while open, and its cleanup
    // unlocks on close as well as on destroy.
    $effect(() => {
        if (index === null) return;
        const root = document.documentElement;
        const scrollbar = window.innerWidth - root.clientWidth;
        root.style.overflow = "hidden";
        if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`;
        return () => {
            root.style.overflow = "";
            root.style.paddingRight = "";
        };
    });

    onMount(() => {
        const onClick = (event: MouseEvent) => {
            // Let the browser handle "open in a new tab" and middle clicks.
            if (event.defaultPrevented || event.button !== 0) return;
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            const target = event.target as HTMLElement | null;
            const trigger = target?.closest<HTMLElement>("[data-lightbox-index]");
            if (!trigger) return;
            const i = Number(trigger.dataset.lightboxIndex);
            if (!Number.isInteger(i) || !pictures[i]) return;
            event.preventDefault();
            open(i);
        };
        document.addEventListener("click", onClick);
        return () => document.removeEventListener("click", onClick);
    });

</script>

<dialog
    bind:this={dialog}
    aria-label={labels.gallery}
    onclose={() => index = null}
    onkeydown={onKeydown}
    class="lightbox"
>
    {#if current}
        <div class="flex items-center justify-between gap-4 px-4 py-3">
            <span class="counter">{(index ?? 0) + 1} / {pictures.length}</span>
            <button type="button" aria-label={labels.close} title={labels.close} onclick={close} class="lightbox-btn">
                <PhIcon name="x" class="size-5" />
            </button>
        </div>

        <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
        <div class="flex-1 min-h-0 flex items-center justify-center px-4 sm:px-14" onclick={onBackdropClick}>
            <button
                type="button"
                aria-label={zoomed ? labels.zoomOut : labels.zoomIn}
                onclick={toggleZoom}
                onpointermove={pan}
                onpointerleave={endPan}
                class="max-w-full max-h-full overflow-hidden rounded-2xl {zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}"
            >
                <img
                    src={current.src}
                    alt={current.caption}
                    decoding="async"
                    style={`transform: scale(${zoomed ? ZOOM_FACTOR : 1}); transform-origin: ${originX}% ${originY}%;`}
                    class="max-w-full max-h-[calc(100dvh-9rem)] object-contain transition-transform duration-200"
                />
            </button>
        </div>

        <div class="flex items-center justify-between gap-4 px-4 py-3">
            {#if pictures.length > 1}
                <button type="button" aria-label={labels.previous} title={labels.previous} onclick={() => go(-1)} class="lightbox-btn">
                    <PhIcon name="caret-left" class="size-5" />
                </button>
            {/if}
            <p class="caption">{current.caption}</p>
            {#if pictures.length > 1}
                <button type="button" aria-label={labels.next} title={labels.next} onclick={() => go(1)} class="lightbox-btn">
                    <PhIcon name="caret-right" class="size-5" />
                </button>
            {/if}
        </div>
    {/if}
</dialog>

<style>
    .lightbox {
        width: 100vw;
        max-width: 100vw;
        height: 100dvh;
        max-height: 100dvh;
        margin: 0;
        padding: 0;
        border: none;
        background: transparent;
        color: var(--heading);
        overflow: hidden;
    }

    .lightbox[open] {
        display: flex;
        flex-direction: column;
    }

    .lightbox::backdrop {
        background: rgb(3 7 19 / 0.9);
        -webkit-backdrop-filter: blur(8px);
        backdrop-filter: blur(8px);
    }

    .counter {
        font-family: var(--font-mono);
        font-size: 0.75rem;
        line-height: 1rem;
        font-weight: 600;
        color: var(--text);
        font-variant-numeric: tabular-nums;
    }

    .caption {
        flex: 1;
        text-align: center;
        font-size: 0.875rem;
        line-height: 1.25rem;
        color: var(--text);
    }

    .lightbox-btn {
        width: 44px;
        height: 44px;
        flex-shrink: 0;
        border-radius: 9999px;
        background: var(--panel-solid);
        border: 1px solid var(--line-strong);
        color: var(--heading);
        display: grid;
        place-items: center;
        transition: border-color 300ms var(--ease-space), background-color 300ms var(--ease-space);
    }

    .lightbox-btn:hover {
        border-color: var(--line-hover);
    }

    :global(:root[data-motion="reduce"]) .lightbox img {
        transition: none;
    }
</style>
