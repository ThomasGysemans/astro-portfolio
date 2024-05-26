<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { ACCEPTED_EXTENSIONS } from "@lib/files.ts";

    export let previewUrl: string | undefined = undefined;
    export let metadata: any = {};

    const dispatch = createEventDispatcher();
    const multiple = previewUrl === undefined;
    let fileInput: HTMLInputElement;
    let dragging = false;

    function importFiles(files: File[]): void {
        dispatch("drop", {
            files,
            metadata: {
                multiple,
                ...metadata,
            },
        });
    }

    function onDrop(e: Event): void {
        e.preventDefault();
        const dataTransfer = (e as any).dataTransfer as DataTransfer;
        let files: File[];
        if (dataTransfer.items) {
            files = (Array
                .from(dataTransfer.items)
                .filter(i => i.kind === "file")
                .map(f => f.getAsFile())
                .filter(f => f?.size != undefined) as File[])
        } else {
            files = Array.from(dataTransfer.files);
        }
        if (files.length > 0) {
            importFiles(files);
        }
    }

    function handleManualImport(): void {
        if (fileInput.files) {
            importFiles(Array.from(fileInput.files));
        }
    }

    function onClick(): void {
        fileInput.click();
    }

    function onDragOver(e: Event): void {
        e.preventDefault();
    }
</script>

<button
    type="button"
    aria-label="Drop zone"
    class="border-dashed border-2 border-primary/50 rounded-md w-full h-full aspect-video flex items-center justify-center"
    on:dragover={onDragOver}
    on:dragenter={() => dragging = true}
    on:dragleave={() => dragging = false}
    on:drop={onDrop}
    on:click={onClick}
>
    {#if dragging}
        <p class="text-center">Dépose l'image ici</p>
    {:else}
        {#if previewUrl === undefined}
            <slot />
        {:else}
            <img src={previewUrl} alt="" />
        {/if}
    {/if}
    <input
        bind:this={fileInput}
        on:change={handleManualImport}
        type="file"
        accept={ACCEPTED_EXTENSIONS.join()}
        class="sr-only pointer-events-none"
        {multiple}
    />
</button>