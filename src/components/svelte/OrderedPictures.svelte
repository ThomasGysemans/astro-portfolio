<script lang="ts">
    import { isValidFile, bytesToMiB } from "@lib/files.ts";
    import { flip } from "svelte/animate";
    import DropZone from "@components/svelte/DropZone.svelte";
    import Swal from "sweetalert2";

    type Picture = {
        file: File
        url: string
    }

    let pictures: Picture[] = [];

    function removePicture(index: number): void {
        const picture = pictures[index];
        URL.revokeObjectURL(picture.url);
        pictures = pictures.filter(p => p !== picture);
    }

    function replacePicture(originalPicture: Picture, newFile: File): void {
        URL.revokeObjectURL(originalPicture.url);
        originalPicture.file = newFile;
        originalPicture.url = URL.createObjectURL(newFile);
        pictures = [...pictures];
    }

    function move(from: number, to: number): void {
        const current = { ...pictures[from] };
        const next = { ...pictures[to] };
        pictures[to] = current;
        pictures[from] = next;
        pictures = [...pictures];
    }

    function up(index: number): void {
        if (index === 0) {
            return;
        }
        move(index, index-1);
    }

    function down(index: number): void {
        if (index === pictures.length - 1) {
            return;
        }
        move(index, index+1);
    }

    async function confirm(text: string): Promise<boolean> {
        return (await Swal.fire({
            text,
            title: "Confirmation",
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "Annuler",
            confirmButtonText: "Confirmer",
        })).isConfirmed;
    }

    async function handleImport(e: CustomEvent<{files: File[], metadata: {multiple: boolean, index: number}}>): Promise<void> {
        const isNewImport = e.detail.metadata.index === pictures.length;
        const isReplacement = e.detail.metadata.multiple === false;
        const files = e.detail.files;
        for (let i = 0; i < files.length; i++) {
            if (!isValidFile(files[i])) {
                alert(`File ${files[i].name} (${bytesToMiB(files[i].size)} MiB, of type ${files[i].type}) is not valid`);
            } else {
                const file = files[i];
                if (isNewImport) {
                    const pic = pictures.find(p => p.file.name === file.name);
                    if (pic) {
                        if (await confirm(`File of name "${file.name}" already imported. Overwrite?`)) {
                            replacePicture(pic, file);
                        }
                    } else {
                        pictures = [...pictures, {
                            url: URL.createObjectURL(file),
                            file,
                        }];
                    }
                } else if (isReplacement) {
                    replacePicture(pictures[e.detail.metadata.index], file);
                }
            }
        }
    }
</script>

<div class="space-y-8">
    {#each Array(pictures.length + 1).fill(0) as _, index (pictures[index]?.file?.name ?? "next")}
        {@const picture = pictures[index]}
        <div animate:flip={{ duration: 150 }}>
            <div class="flex space-x-4">
                {#if picture !== undefined}
                    <div class="flex flex-col items-center">
                        <button type="button" title="Go up" aria-label="Go up" disabled={index === 0} on:click={() => up(index)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="m18 15-6-6-6 6"/>
                            </svg>
                        </button>
                        <button type="button" title="Go down" aria-label="Go down" class="rotate-180" disabled={index === pictures.length - 1} on:click={() => down(index)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="m18 15-6-6-6 6"/>
                            </svg>
                        </button>
                        <div>
                            <button type="button" title="Supprimer" aria-label="Supprimer" class="opacity-30 hover:opacity-100 mt-4" on:click={() => removePicture(index)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M18 6 6 18"/>
                                    <path d="m6 6 12 12"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                {/if}
                <DropZone on:drop={handleImport} previewUrl={picture?.url} metadata={{index}} name="picture-{index}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                        <circle cx="9" cy="9" r="2" />
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                </DropZone>
            </div>
        </div>
    {/each}
</div>

<style>
    button:disabled {
        opacity: .3;
        cursor: not-allowed;
    }
</style>