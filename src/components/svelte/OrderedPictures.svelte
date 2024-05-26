<script lang="ts">
    import { isValidFile, bytesToMiB } from "@lib/files.ts";
    import DropZone from "@components/svelte/DropZone.svelte";

    type Picture = {
        file: File
        url: string
    }

    let pictures: Picture[] = [];

    function replacePicture(originalPicture: Picture, newFile: File): void {
        URL.revokeObjectURL(originalPicture.url);
        originalPicture.file = newFile;
        originalPicture.url = URL.createObjectURL(newFile);
        pictures = [...pictures];
    }

    function handleImport(e: CustomEvent<{files: File[], metadata: {multiple: boolean, index: number}}>): void {
        const isNewImport = e.detail.metadata.index === pictures.length;
        const isReplacement = e.detail.metadata.multiple === false;
        const files = e.detail.files;
        for (let i = 0; i < files.length; i++) {
            if (!isValidFile(files[i])) {
                alert(`File ${files[i].name} (${bytesToMiB(files[i].size)} MiB, of type ${files[i].type}) is not valid`);
            } else {
                const file = files[i];
                if (isNewImport) {
                    if (pictures.some(p => p.file.name === file.name)) {
                        if (confirm(`File of name "${file.name}" already imported. Overwrite?`)) {
                            const pic = pictures.find(p => p.file.name === file.name)!;
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
        console.log("pictures =", pictures);
    }
</script>

<div class="space-y-8">
    {#each Array(pictures.length + 1).fill(0) as _, index (pictures[index]?.file?.name ?? "next")}
        {@const picture = pictures[index]}
        <div class="flex space-x-4">
            {#if picture !== undefined}
                <div class="flex flex-col items-center">
                    <button type="button" title="Go up" aria-label="Go up" disabled={index === 0}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="m18 15-6-6-6 6"/>
                        </svg>
                    </button>
                    <button type="button" title="Go down" aria-label="Go down" class="rotate-180" disabled={index === pictures.length - 1}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="m18 15-6-6-6 6"/>
                        </svg>
                    </button>
                </div>
            {/if}
            <DropZone on:drop={handleImport} previewUrl={picture?.url} metadata={{index}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
            </DropZone>
        </div>
    {/each}
</div>

<style>
    button:disabled {
        opacity: .3;
        cursor: not-allowed;
    }
</style>