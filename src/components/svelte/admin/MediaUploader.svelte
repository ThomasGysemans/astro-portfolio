<script lang="ts">
    // Media block of the project form: live thumbnail preview and a single
    // ordered list mixing the already-uploaded pictures and the files staged
    // for upload. The rows are reordered by drag & drop (or the keyboard) and
    // each media carries its French/English caption. It is rendered inside
    // the main project <form>: the `thumb`/`pictures` file inputs, the
    // per-row `picture_order` hidden inputs and the `picture_alt_fr`/`_en`
    // caption inputs are submitted with it, in the DOM order of the rows, so
    // the server can rebuild the full display order and the captions map.
    // A DataTransfer keeps the pictures input's FileList in sync with the
    // staged rows, so the admin can add files in several batches and drop
    // one before saving.
    import { flip } from "svelte/animate";
    import { tick } from "svelte";

    type Picture = { name: string; url: string; captionFr: string; captionEn: string };

    // One row of the media list: an already-uploaded file (`name` set) or a
    // staged upload (`file` set). Removed existing rows stay visible (grayed
    // out) with their inputs disabled so they are not submitted.
    type Item = {
        key: string;
        name?: string;
        file?: File;
        url: string;
        removed: boolean;
        captionFr: string;
        captionEn: string;
    };

    interface Props {
        thumbUrl?: string;
        pictures: Picture[];
        isNew: boolean;
    }

    const { thumbUrl, pictures, isNew }: Props = $props();

    const isVideo = (name: string) => /\.(mp4|mov|qt|webm)$/i.test(name);

    let thumbPreview = $state<string | null>(null);
    let items = $state<Item[]>(pictures.map(p => ({
        key: `existing:${p.name}`,
        name: p.name,
        url: p.url,
        removed: false,
        captionFr: p.captionFr,
        captionEn: p.captionEn,
    })));

    // `existing:<filename>` or `new:<index in the pictures FileList>`; the
    // file indexes follow the rows order because the FileList is rebuilt by
    // iterating the same array.
    let tokens = $derived.by(() => {
        let fileIndex = 0;
        return items.map(item => item.file ? `new:${fileIndex++}` : `existing:${item.name}`);
    });

    let thumbInput: HTMLInputElement;
    let picturesInput: HTMLInputElement;
    // Accumulates the picks; its FileList is mirrored onto the input so the
    // form submits exactly what the rows show.
    let transfer: DataTransfer | null = null;

    let dragIndex = $state<number | null>(null);
    // Grip handles, keyed by row key, so the keyboard reorder can restore
    // focus on the moved row (relocating a focused node drops its focus).
    const grips: Record<string, HTMLElement> = {};

    function onThumbChange(event: Event): void {
        const file = (event.currentTarget as HTMLInputElement).files?.[0];
        if (thumbPreview) URL.revokeObjectURL(thumbPreview);
        thumbPreview = file ? URL.createObjectURL(file) : null;
    }

    function clearThumb(): void {
        if (thumbPreview) URL.revokeObjectURL(thumbPreview);
        thumbPreview = null;
        // Clear the file input so the form no longer submits the picked file.
        thumbInput.value = "";
    }

    function syncPicturesInput(): void {
        transfer ??= new DataTransfer();
        // Rebuild from the rows so removals and reorders are reflected.
        while (transfer.items.length) transfer.items.remove(0);
        for (const item of items) {
            if (item.file) transfer.items.add(item.file);
        }
        picturesInput.files = transfer.files;
    }

    function onPicturesChange(event: Event): void {
        const input = event.currentTarget as HTMLInputElement;
        for (const file of Array.from(input.files ?? [])) {
            // The server ignores empty files: staging one would shift the
            // `new:<i>` indexes of the files submitted after it.
            if (file.size === 0) continue;
            const duplicate = items.some(item => item.file && item.file.name === file.name && item.file.size === file.size);
            if (!duplicate) {
                items.push({
                    key: `new:${file.name}:${file.size}:${Date.now()}`,
                    file,
                    url: URL.createObjectURL(file),
                    removed: false,
                    captionFr: "",
                    captionEn: "",
                });
            }
        }
        syncPicturesInput();
    }

    function removeItem(i: number): void {
        const item = items[i];
        if (item.file) {
            // Staged rows just disappear (and leave the FileList).
            URL.revokeObjectURL(item.url);
            items.splice(i, 1);
            syncPicturesInput();
        } else {
            // Existing rows are toggled: the server deletes the files whose
            // `picture_order` entry is missing from the submitted list.
            item.removed = !item.removed;
        }
    }

    function moveItem(from: number, to: number): void {
        if (to < 0 || to >= items.length || from === to) return;
        const [moved] = items.splice(from, 1);
        items.splice(to, 0, moved);
        syncPicturesInput();
    }

    function handleDragStart(event: DragEvent, i: number): void {
        dragIndex = i;
        const li = (event.currentTarget as HTMLElement).closest("li");
        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData("text/plain", String(i));
            // Drag the whole row, not just the grip handle.
            if (li) event.dataTransfer.setDragImage(li, 20, 20);
        }
    }

    function handleDragOver(event: DragEvent, i: number): void {
        if (dragIndex === null) return;
        event.preventDefault();
        if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
        if (dragIndex === i) return;

        // Only move once the cursor has crossed the middle of the hovered row.
        // The half of that row nearest the dragged item is a dead zone: without
        // it, the row displaced by a swap lands back under the cursor and
        // triggers the reverse swap, oscillating indefinitely.
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        const inBottomHalf = event.clientY - rect.top > rect.height / 2;
        const to = i > dragIndex ? (inBottomHalf ? i : i - 1) : inBottomHalf ? i + 1 : i;
        if (to !== dragIndex) {
            moveItem(dragIndex, to);
            dragIndex = to;
        }
    }

    async function handleKey(event: KeyboardEvent, i: number): Promise<void> {
        const to = event.key === "ArrowUp" ? i - 1 : event.key === "ArrowDown" ? i + 1 : i;
        if (to === i) return;
        event.preventDefault();
        if (to < 0 || to >= items.length) return;
        const key = items[i].key;
        moveItem(i, to);
        // The moved row keeps the same node but changes position; restore its
        // focus once Svelte has applied the reorder so the arrows can be chained.
        await tick();
        grips[key]?.focus();
    }

    const rowLabel = (item: Item) => item.name ?? item.file?.name ?? "";
</script>

<div class="flex flex-col gap-6">
    <div>
        <span class="adm-label" class:adm-label-req={isNew}>Vignette{isNew ? "" : " (remplacée seulement si un fichier est choisi)"}</span>
        <div class={["flex items-start gap-3 flex-wrap mb-3", { hidden: !thumbUrl && !thumbPreview }]}>
            {#if thumbUrl}
                <figure class="adm-media-card w-50" class:adm-media-removed={thumbPreview}>
                    <img src={thumbUrl} alt="Vignette actuelle" loading="lazy" />
                    <figcaption class="text-[11.5px] text-muted">{thumbPreview ? "Remplacée à l'enregistrement" : "Vignette actuelle"}</figcaption>
                </figure>
            {/if}
            {#if thumbPreview}
                <figure class="adm-media-card w-50">
                    <img src={thumbPreview} alt="Nouvelle vignette" />
                    <figcaption class="text-[11.5px] font-bold text-accent">Nouvelle vignette</figcaption>
                    <button type="button" class="adm-btn-danger px-2! py-1! text-[11px]!" onclick={clearThumb}>✕ Retirer</button>
                </figure>
            {/if}
        </div>
        <input id="thumb" name="thumb" type="file" accept="image/*" class="adm-file" required={isNew} bind:this={thumbInput} onchange={onThumbChange} />
    </div>

    <div>
        <span class="adm-label">Images & vidéos ({items.filter(i => !i.removed).length})</span>
        <!-- Tells the server the media editor ran, even when the list is empty. -->
        <input type="hidden" name="picture_order_present" value="1" />
        {#if items.length > 0}
            <p class="text-[12.5px] text-muted mb-2.5">L'ordre des lignes définit l'ordre d'affichage sur la page du projet : glisse-dépose pour réordonner. La légende sert de texte alternatif et s'affiche sous le média.</p>
            <ul class="flex flex-col gap-2.5 mb-4 list-none p-0">
                {#each items as item, i (item.key)}
                    <li
                        class="adm-row items-stretch!"
                        class:dragging={dragIndex === i}
                        class:media-removed={item.removed}
                        animate:flip={{ duration: 200 }}
                        ondragover={e => handleDragOver(e, i)}
                    >
                        {#if !item.removed}
                            <input type="hidden" name="picture_order" value={tokens[i]} />
                        {/if}
                        <span
                            bind:this={grips[item.key]}
                            class="adm-grip self-center"
                            role="button"
                            tabindex="0"
                            draggable="true"
                            aria-label={`Déplacer ${rowLabel(item)}`}
                            title="Glisser pour réordonner (ou flèches ↑ ↓)"
                            ondragstart={e => handleDragStart(e, i)}
                            ondragend={() => (dragIndex = null)}
                            onkeydown={e => handleKey(e, i)}
                        >⠿</span>
                        <div class="media-preview self-center shrink-0">
                            {#if item.file ? item.file.type.startsWith("video/") : isVideo(item.name ?? "")}
                                <video src={item.url} muted playsinline preload="metadata"></video>
                            {:else}
                                <img src={item.url} alt={rowLabel(item)} loading="lazy" />
                            {/if}
                        </div>
                        <div class="flex flex-col gap-1.5 flex-1 min-w-50">
                            {#if item.name}
                                <a href={item.url} target="_blank" rel="noopener" class="text-[11.5px] text-accent hover:underline truncate">{item.name}</a>
                            {:else}
                                <span class="text-[11.5px] font-bold text-accent truncate">Nouveau : {item.file?.name}</span>
                            {/if}
                            <div class="flex gap-2 flex-wrap">
                                <label class="flex items-center gap-1.5 flex-1 min-w-40">
                                    <span class="fi fi-fr rounded-[2px] shrink-0" title="Légende française" aria-hidden="true"></span>
                                    <input
                                        type="text"
                                        name="picture_alt_fr"
                                        class="adm-input text-[12px]!"
                                        placeholder="Légende / texte alternatif (FR)"
                                        aria-label={`Légende française de ${rowLabel(item)}`}
                                        disabled={item.removed}
                                        bind:value={item.captionFr}
                                    />
                                </label>
                                <label class="flex items-center gap-1.5 flex-1 min-w-40">
                                    <span class="fi fi-gb rounded-[2px] shrink-0" title="Légende anglaise" aria-hidden="true"></span>
                                    <input
                                        type="text"
                                        name="picture_alt_en"
                                        class="adm-input text-[12px]!"
                                        placeholder="Caption / alt text (EN)"
                                        aria-label={`Légende anglaise de ${rowLabel(item)}`}
                                        disabled={item.removed}
                                        bind:value={item.captionEn}
                                    />
                                </label>
                            </div>
                        </div>
                        <button
                            type="button"
                            class="adm-btn-danger px-2.5! self-center"
                            aria-label={`${item.removed ? "Restaurer" : "Retirer"} ${rowLabel(item)}`}
                            onclick={() => removeItem(i)}
                        >{item.removed ? "↺" : "✕"}</button>
                    </li>
                {/each}
            </ul>
        {/if}
        <label for="pictures" class="text-[12.5px] text-muted block mb-1.5">Ajouter des fichiers (10 max au total ; si vide à la création, la vignette est utilisée) :</label>
        <input
            id="pictures"
            name="pictures"
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,image/gif,image/avif,video/mp4,video/quicktime"
            class="adm-file"
            bind:this={picturesInput}
            onchange={onPicturesChange}
        />
    </div>
</div>

<style>
    .adm-grip {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 1.75rem;
        height: 1.75rem;
        font-size: 1.1rem;
        line-height: 1;
        color: var(--muted);
        cursor: grab;
        user-select: none;
        border-radius: 0.5rem;
        transition: color 0.2s, background-color 0.2s;
    }

    .adm-grip:hover,
    .adm-grip:focus-visible {
        color: var(--accent);
        background-color: color-mix(in srgb, var(--accent) 12%, transparent);
        outline: none;
    }

    .adm-grip:active {
        cursor: grabbing;
    }

    li.dragging {
        opacity: 0.55;
        border-color: var(--accent);
    }

    /* Marked for removal: grayed out until saved (or restored). */
    li.media-removed {
        opacity: 0.45;
        border-color: rgba(236, 50, 59, 0.6);
    }

    li.media-removed .media-preview img,
    li.media-removed .media-preview video {
        filter: grayscale(1);
    }

    .media-preview img,
    .media-preview video {
        width: 6.5rem;
        height: 4.25rem;
        object-fit: cover;
        border-radius: 0.5rem;
        background: var(--night);
    }
</style>
