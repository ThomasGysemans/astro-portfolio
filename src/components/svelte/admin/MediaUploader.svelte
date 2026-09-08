<script lang="ts">
    // Media block of the project form: live previews of the thumbnail and of
    // its optional looping video, plus a single ordered list mixing the
    // already-uploaded pictures, the files staged for upload and the YouTube
    // links. The rows are reordered by drag & drop (or the keyboard) and each
    // media carries its French/English caption. It is rendered inside the main
    // project <form>: the `thumb`/`thumb_video`/`pictures` file inputs, the
    // per-row `picture_order` hidden inputs and the `picture_alt_fr`/`_en`
    // caption inputs are submitted with it, in the DOM order of the rows, so
    // the server can rebuild the full display order and the captions map.
    // A DataTransfer keeps the pictures input's FileList in sync with the
    // staged rows, so the admin can add files in several batches and drop
    // one before saving.
    import { flip } from "svelte/animate";
    import { tick } from "svelte";
    import { isVideo, youtubeId, youtubeThumbnail } from "@data/media";

    type Picture = { name: string; url: string; youtube: boolean; captionFr: string; captionEn: string };

    // One row of the media list: an already-uploaded file (`name` set), a
    // staged upload (`file` set) or a YouTube link (`youtube`, `name` being
    // the link itself). Removed existing files stay visible (grayed out) with
    // their inputs disabled so they are not submitted; a link, which destroys
    // nothing on the server, simply disappears.
    type Item = {
        key: string;
        name?: string;
        file?: File;
        youtube?: boolean;
        url: string;
        removed: boolean;
        captionFr: string;
        captionEn: string;
    };

    interface Props {
        thumbUrl?: string;
        thumbVideoUrl?: string;
        pictures: Picture[];
        isNew: boolean;
    }

    const { thumbUrl, thumbVideoUrl, pictures, isNew }: Props = $props();

    let thumbPreview = $state<string | null>(null);
    let videoPreview = $state<string | null>(null);
    // A file input can say "replace this file" but never "delete it": the
    // video is optional, so removing it needs its own explicit checkbox.
    let removeVideo = $state(false);
    // Seeded from the props on purpose, so the rows stay editable: `pictures`
    // is the server-rendered list this island starts from, not a value to
    // track. A `$derived` would throw away the admin's pending edits.
    // svelte-ignore state_referenced_locally
    let items = $state<Item[]>(pictures.map(p => ({
        key: `${p.youtube ? "youtube" : "existing"}:${p.name}`,
        name: p.name,
        youtube: p.youtube,
        url: p.url,
        removed: false,
        captionFr: p.captionFr,
        captionEn: p.captionEn,
    })));

    // `existing:<filename>`, `new:<index in the pictures FileList>` or
    // `youtube:<link>`; the file indexes follow the rows order because the
    // FileList is rebuilt by iterating the same array.
    let tokens = $derived.by(() => {
        let fileIndex = 0;
        return items.map(item => {
            if (item.youtube) return `youtube:${item.name}`;
            return item.file ? `new:${fileIndex++}` : `existing:${item.name}`;
        });
    });

    // The link being typed in the "add a YouTube video" field.
    let youtubeUrl = $state("");
    let youtubeError = $state("");

    let thumbInput: HTMLInputElement;
    let videoInput: HTMLInputElement;
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

    function onVideoChange(event: Event): void {
        const file = (event.currentTarget as HTMLInputElement).files?.[0];
        if (videoPreview) URL.revokeObjectURL(videoPreview);
        videoPreview = file ? URL.createObjectURL(file) : null;
        // Uploading and deleting at once makes no sense; the upload wins.
        if (videoPreview) removeVideo = false;
    }

    function clearVideo(): void {
        if (videoPreview) URL.revokeObjectURL(videoPreview);
        videoPreview = null;
        videoInput.value = "";
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

    // A YouTube link is not a file: it is stored in its own column, so it
    // never goes through the `pictures` input — only through a row (and its
    // `youtube:` token). `youtubeId` is the same validator the server runs.
    function addYouTube(): void {
        const url = youtubeUrl.trim();
        if (!url) return;
        if (!youtubeId(url)) {
            youtubeError = "Lien YouTube non reconnu (ex. https://youtu.be/0IFQUaUi2pw).";
            return;
        }
        if (items.some(item => item.youtube && item.name === url)) {
            youtubeError = "Cette vidéo est déjà dans la liste.";
            return;
        }
        items.push({
            key: `youtube:${url}`,
            name: url,
            youtube: true,
            url,
            removed: false,
            captionFr: "",
            captionEn: "",
        });
        youtubeUrl = "";
        youtubeError = "";
    }

    // Inside the project <form>, Enter would submit the whole thing: in this
    // field it means "add this link".
    function onYouTubeKey(event: KeyboardEvent): void {
        if (event.key !== "Enter") return;
        event.preventDefault();
        addYouTube();
    }

    function removeItem(i: number): void {
        const item = items[i];
        if (item.youtube) {
            // Nothing is stored server-side for a link: drop the row outright.
            items.splice(i, 1);
        } else if (item.file) {
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
                <!-- The button is a control acting on the figure, not part of
                     its content: it stays outside so the caption remains the
                     last child. `contents` drops the figure from the layout,
                     leaving the card's flex column exactly as it was. -->
                <div class="adm-media-card w-50">
                    <figure class="contents">
                        <img src={thumbPreview} alt="Nouvelle vignette" />
                        <figcaption class="text-[11.5px] font-bold text-accent">Nouvelle vignette</figcaption>
                    </figure>
                    <button type="button" class="adm-btn-danger px-2! py-1! text-[11px]!" onclick={clearThumb}>✕ Retirer</button>
                </div>
            {/if}
        </div>
        <input id="thumb" name="thumb" type="file" accept="image/*" class="adm-file" required={isNew} bind:this={thumbInput} onchange={onThumbChange} />
    </div>

    <div>
        <span class="adm-label">Vidéo de vignette (optionnelle)</span>
        <p class="text-[12.5px] text-muted mb-2.5">
            Jouée en boucle, sans son, à la place de la vignette sur les cartes du site (accueil, /projects, /freelance, showcase).
            La vignette reste affichée pendant le chargement, pour les visiteurs qui ont désactivé les animations, et comme image de partage.
        </p>
        <div class={["flex items-start gap-3 flex-wrap mb-3", { hidden: !thumbVideoUrl && !videoPreview }]}>
            {#if thumbVideoUrl}
                <figure class="adm-media-card w-50" class:adm-media-removed={videoPreview || removeVideo}>
                    <!-- svelte-ignore a11y_media_has_caption -->
                    <video src={thumbVideoUrl} muted loop playsinline controls preload="metadata"></video>
                    <figcaption class="text-[11.5px] text-muted">
                        {videoPreview ? "Remplacée à l'enregistrement" : removeVideo ? "Supprimée à l'enregistrement" : "Vidéo actuelle"}
                    </figcaption>
                </figure>
            {/if}
            {#if videoPreview}
                <div class="adm-media-card w-50">
                    <figure class="contents">
                        <!-- svelte-ignore a11y_media_has_caption -->
                        <video src={videoPreview} muted loop playsinline controls preload="metadata"></video>
                        <figcaption class="text-[11.5px] font-bold text-accent">Nouvelle vidéo</figcaption>
                    </figure>
                    <button type="button" class="adm-btn-danger px-2! py-1! text-[11px]!" onclick={clearVideo}>✕ Retirer</button>
                </div>
            {/if}
        </div>
        {#if thumbVideoUrl}
            <label class="adm-check mb-2.5">
                <input type="checkbox" name="thumb_video_remove" bind:checked={removeVideo} disabled={!!videoPreview} />
                Supprimer la vidéo (revenir à la vignette fixe)
            </label>
        {/if}
        <input
            id="thumb_video"
            name="thumb_video"
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            class="adm-file"
            bind:this={videoInput}
            onchange={onVideoChange}
        />
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
                        <div class="media-preview self-center shrink-0 relative">
                            {#if item.youtube}
                                <img src={youtubeThumbnail(youtubeId(item.url) ?? "", true)} alt={rowLabel(item)} loading="lazy" />
                                <span class="yt-badge" aria-hidden="true">&#9654;</span>
                            {:else if item.file ? item.file.type.startsWith("video/") : isVideo(item.name ?? "")}
                                <video src={item.url} muted playsinline preload="metadata"></video>
                            {:else}
                                <img src={item.url} alt={rowLabel(item)} loading="lazy" />
                            {/if}
                        </div>
                        <div class="flex flex-col gap-1.5 flex-1 min-w-50">
                            {#if item.youtube}
                                <a href={item.url} target="_blank" rel="noopener" class="text-[11.5px] text-accent hover:underline truncate">YouTube : {item.name}</a>
                            {:else if item.name}
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

        <label for="youtube_url" class="text-[12.5px] text-muted block mt-4 mb-1.5">
            Ou ajouter une vid&eacute;o YouTube (elle s'ins&egrave;re dans la liste ci-dessus et se r&eacute;ordonne comme les autres m&eacute;dias) :
        </label>
        <div class="flex gap-2 flex-wrap">
            <input
                id="youtube_url"
                type="url"
                inputmode="url"
                class="adm-input flex-1 min-w-60"
                placeholder="https://youtu.be/0IFQUaUi2pw"
                aria-describedby="youtube_help"
                bind:value={youtubeUrl}
                oninput={() => (youtubeError = "")}
                onkeydown={onYouTubeKey}
            />
            <button type="button" class="adm-btn-outline" onclick={addYouTube}>+ Ajouter la vid&eacute;o</button>
        </div>
        <p id="youtube_help" class="text-[12px] mt-1.5 {youtubeError ? 'text-[#f27b81]' : 'text-muted'}">
            {youtubeError || "Le lien n'est pas un fichier : il ne compte pas dans la limite de 10 fichiers. Le projet doit toutefois garder au moins une image ou vidéo importée."}
        </p>
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

    /* Marks a row as a YouTube link rather than an uploaded still. */
    .yt-badge {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.85rem;
        color: #fff;
        background: rgba(3, 15, 32, 0.45);
        border-radius: 0.5rem;
        pointer-events: none;
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
