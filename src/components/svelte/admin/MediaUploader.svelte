<script lang="ts">
    // Media block of the project form: live thumbnail preview, existing
    // pictures with a "remove" toggle, and files staged for upload. It is
    // rendered inside the main project <form>, so its file inputs
    // (`thumb`, `pictures`) and `remove_pictures` checkboxes are submitted
    // with it. A DataTransfer keeps the pictures input's FileList in sync
    // with the staged cards, so the admin can add files in several batches
    // and drop one before saving.

    type Picture = { name: string; url: string };
    type Staged = { file: File; url: string };

    interface Props {
        thumbUrl?: string;
        pictures: Picture[];
        isNew: boolean;
    }

    const { thumbUrl, pictures, isNew }: Props = $props();

    const isVideo = (name: string) => /\.(mp4|mov|qt|webm)$/i.test(name);

    let thumbPreview = $state<string | null>(null);
    let removedExisting = $state<Record<string, boolean>>({});
    let staged = $state<Staged[]>([]);

    let thumbInput: HTMLInputElement;
    let picturesInput: HTMLInputElement;
    // Accumulates the picks; its FileList is mirrored onto the input so the
    // form submits exactly what the cards show.
    let transfer: DataTransfer | null = null;

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
        // Rebuild from the staged list so removals are reflected.
        while (transfer.items.length) transfer.items.remove(0);
        for (const { file } of staged) transfer.items.add(file);
        picturesInput.files = transfer.files;
    }

    function onPicturesChange(event: Event): void {
        const input = event.currentTarget as HTMLInputElement;
        for (const file of Array.from(input.files ?? [])) {
            const duplicate = staged.some(s => s.file.name === file.name && s.file.size === file.size);
            if (!duplicate) staged.push({ file, url: URL.createObjectURL(file) });
        }
        syncPicturesInput();
    }

    function removeStaged(i: number): void {
        URL.revokeObjectURL(staged[i].url);
        staged.splice(i, 1);
        syncPicturesInput();
    }
</script>

<div class="flex flex-col gap-6">
    <div>
        <span class="adm-label">Vignette {isNew ? "(requise)" : "(remplacée seulement si un fichier est choisi)"}</span>
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
        <span class="adm-label">Images & vidéos ({pictures.length})</span>
        {#if pictures.length > 0}
            <ul class="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3 mb-4 list-none p-0">
                {#each pictures as picture (picture.name)}
                    <li class="adm-media-card" class:adm-media-removed={removedExisting[picture.name]}>
                        {#if isVideo(picture.name)}
                            <video src={picture.url} muted playsinline preload="metadata"></video>
                        {:else}
                            <img src={picture.url} alt={picture.name} loading="lazy" />
                        {/if}
                        <a href={picture.url} target="_blank" rel="noopener" class="text-[11.5px] text-accent hover:underline truncate">{picture.name}</a>
                        <label class="adm-check text-[12px]!">
                            <input type="checkbox" name="remove_pictures" value={picture.name} bind:checked={removedExisting[picture.name]} />
                            supprimer
                        </label>
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
        {#if staged.length > 0}
            <ul class="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3 mt-3 list-none p-0">
                {#each staged as item, i (item.url)}
                    <li class="adm-media-card">
                        {#if item.file.type.startsWith("video/")}
                            <video src={item.url} muted></video>
                        {:else}
                            <img src={item.url} alt={item.file.name} />
                        {/if}
                        <span class="text-[11.5px] text-muted truncate">{item.file.name}</span>
                        <button type="button" class="adm-btn-danger px-2! py-1! text-[11px]!" onclick={() => removeStaged(i)}>✕ Retirer</button>
                    </li>
                {/each}
            </ul>
        {/if}
    </div>
</div>
