<script lang="ts">
    import { bytesToMiBStr, isValidFile } from "@lib/files.ts";
    import { confirm, alert } from "@lib/popups.ts";
    import DropZone from "@components/svelte/DropZone.svelte";

    export let initialUrl: string | undefined = undefined;

    let importedFile: File | undefined = undefined;
    let previewUrl: string | undefined = initialUrl;

    function hasPicture(): boolean {
        return !!(importedFile && previewUrl);
    }

    async function handleImport(e: CustomEvent<{files: File[]}>): Promise<void> {
        const file = e.detail.files[0];
        if (!isValidFile(file)) {
            await alert(`File ${file.name} (${bytesToMiBStr(file.size)} MiB, of type ${file.type}) is not valid`);
        } else {
            if (hasPicture() && importedFile!.name === file.name) {
                if (await confirm(`File of name "${file.name}" already imported. Overwrite?`)) {
                    URL.revokeObjectURL(previewUrl!);
                } else {
                    return;
                }
            }
            previewUrl = URL.createObjectURL(file);
            importedFile = file;
        }
    }
</script>

<div class="flex items-center justify-center w-full h-full rounded-[4px]">
    <DropZone name="presentation-picture" {previewUrl} on:drop={handleImport} className="w-full h-full object-cover">
        <slot />
    </DropZone>
</div>
