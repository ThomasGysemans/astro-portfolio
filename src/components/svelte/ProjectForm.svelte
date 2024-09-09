<script lang="ts">
    import type { FullProject } from "@db/models/DAOProject.ts";
    import type { Technology } from "@db/models/DAOSkills.ts";
    import type { ActionResponse } from "@lib/ActionResponse.ts";
    import { actions } from "astro:actions";
    import { Language } from "@lib/Language.ts";
    import { ProjectType } from "@lib/ProjectType.ts";
    import { bytesToMiBStr, isValidFile } from "@lib/files.ts";
    import { alert, confirm } from "@lib/popups.ts";
    import { flip } from "svelte/animate";
    import Icon from "@iconify/svelte";
    import Checkbox from "@components/svelte/Checkbox.svelte";
    import BuildProject from "@components/svelte/BuildProject.svelte";
    import DropZone from "@components/svelte/DropZone.svelte";
    import Swal from "sweetalert2";

    type Picture = {
        file?: File
        url: string
    }

    export let project: FullProject | null;
    export let showcaseCount: number;
    export let skills: Technology[];

    const existingPictures: string[] = project?.pictures ?? [];

    let loading = false;
    let includeInShowcase = !!project?.showcase;
    let projectType: string = ProjectType.WEB.frenchName;

    let presentationPicture: { file?: File, url?: string } = {
        file: undefined,
        url: project === null ? undefined : project.pictures[project.presentationPicture!],
    };

    let pictures: Picture[] = existingPictures.map(p => ({
        file: undefined,
        url: p,
    }));

    function hasPresentationPicture(): boolean {
        return !!(presentationPicture.file && presentationPicture.url);
    }

    async function handlePresentationPictureImport(e: CustomEvent<{files: File[]}>): Promise<void> {
        const file = e.detail.files[0];
        if (!isValidFile(file)) {
            await alert(`File ${file.name} (${bytesToMiBStr(file.size)} MiB, of type ${file.type}) is not valid`);
        } else {
            if (hasPresentationPicture() && presentationPicture.file!.name === file.name) {
                if (await confirm(`File of name "${file.name}" already imported. Overwrite?`)) {
                    URL.revokeObjectURL(presentationPicture.url!);
                } else {
                    return;
                }
            }
            presentationPicture = {
                url: URL.createObjectURL(file),
                file,
            };
        }
    }

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

    async function handlePictureImport(e: CustomEvent<{files: File[], metadata: {multiple: boolean, index: number}}>): Promise<void> {
        const isNewImport = e.detail.metadata.index === pictures.length;
        const isReplacement = e.detail.metadata.multiple === false;
        const files = e.detail.files;
        for (let i = 0; i < files.length; i++) {
            if (!isValidFile(files[i])) {
                await alert(`File ${files[i].name} (${bytesToMiBStr(files[i].size)} MiB, of type ${files[i].type}) is not valid`);
            } else {
                const file = files[i];
                if (isNewImport) {
                    const pic = pictures.find(p => p.file?.name === file.name);
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

    async function handleSubmit(e: SubmitEvent): Promise<void> {
        const formData = new FormData(e.target as HTMLFormElement);
        for (const key of Array.from(formData.keys())) {
            if (key.startsWith("picture-") || key === "presentationPicture") {
                formData.delete(key);
            }
        }
        if (!hasPresentationPicture()) {
            Swal.fire({
                title: "Erreur !",
                text: "Une image de présentation est requise.",
                icon: "error",
            });
            return;
        }
        const existingPresentationPicture = pictures.findIndex(p => p.file!.name === presentationPicture.file!.name);
        if (existingPresentationPicture === -1) {
            pictures.push({
                file: presentationPicture.file!,
                url: presentationPicture.url!,
            });
            formData.set("presentationPicture", (pictures.length - 1).toString());
        } else {
            formData.set("presentationPicture", existingPresentationPicture.toString());
        }
        for (const picture of pictures) {
            formData.append("pictures", picture.file!)
        }
        const entries = Array.from(formData.entries());
        console.log("entries =", entries);
        loading = true;
        try {
            const result = await actions.submitProject(formData) as ActionResponse;
            if (result.status === 200) {
                Swal.fire({
                    title: "Opération réussie !",
                    icon: "success"
                });
            } else {
                Swal.fire({
                    title: `Erreur ${result.status} !`,
                    text: result.details ?? "Erreur inattendue",
                    icon: "error"
                });
            }
        } catch (e) {
            console.warn(e);
            Swal.fire({
                title: `Erreur !`,
                text: "Une erreur inattendue s'est produite.",
                icon: "error",
            });
        } finally {
            loading = false;
        }
    }
</script>

<form method="POST" class="space-y-8" enctype="application/x-www-form-urlencoded" on:submit|preventDefault={handleSubmit}>
    <div class="space-y-8">
        <div class="flex w-full space-x-8">
            <BuildProject
                {project}
                {skills}
                projectType={ProjectType.getProjectType(projectType)}
                presentationPicturePreview={presentationPicture.url}
                handleImport={handlePresentationPictureImport}
            />
            <div class="w-full h-full max-h-64 space-y-4">
                <textarea
                    placeholder="Description du projet..."
                    aria-label="Description du projet"
                    class="min-h-60"
                    name="description"
                    required
                >{project?.description?.trim() ?? ""}</textarea>
                <div>
                    <Checkbox name="showcase" initialValue={project?.showcase} on:toggle={(e) => includeInShowcase = e.detail.checked}>
                        Inclure à la vitrine ({showcaseCount})
                    </Checkbox>
                </div>
                {#each Language.getAllLanguages() as lang (lang.short)}
                    <div>
                        <Checkbox name={lang.short} initialValue={project?.languages?.includes(lang.short)}>
                            <img src="/icons/{lang.flag}.svg" class="w-6 h-6" alt="" />
                        </Checkbox>
                    </div>
                {/each}
            </div>
        </div>
        <div class={includeInShowcase ? "" : "hidden"}>
            <textarea placeholder="Description de la vitrine" aria-label="Description de la vitrine" name="showcaseDescription">{project?.showcaseDescription ?? ""}</textarea>
        </div>
        <div>
            <label for="github">Lien GitHub: https://github.com/</label>
            <input id="github" type="text" name="github" class="border-b border-primary/10 bg-transparent px-1 max-w-80 w-full" value={project?.github ?? ""} required />
        </div>
        <div>
            <label for="link">Lien du projet :</label>
            <input id="link" type="text" name="link" class="border-b border-primary/10 bg-transparent px-1 max-w-80 w-full" value={project?.link ?? ""} required />
        </div>
        <div>
            <label for="type">Type du projet :</label>
            <select id="type" bind:value={projectType} class="px-1 bg-transparent border-b border-primary/10 w-32" name="projectType">
                {#each ProjectType.getAllTypes() as type (type.frenchName)}
                    <option value={type.frenchName}>{type.frenchName}</option>
                {/each}
            </select>
        </div>
        <div>
            <input type="hidden" name="existingPictures" value={existingPictures.join()} />
            <div class="space-y-8">
                {#each Array(pictures.length + 1).fill(0) as _, index (pictures[index]?.url ?? "next")}
                    {@const picture = pictures[index]}
                    <div animate:flip={{ duration: 150 }}>
                        <div class="flex space-x-4">
                            {#if picture !== undefined}
                                <div class="flex flex-col items-center">
                                    <button type="button" title="Go up" aria-label="Go up" disabled={index === 0} on:click={() => up(index)}>
                                        <Icon icon="lucide:chevron-up" class="w-7 h-7" />
                                    </button>
                                    <button type="button" title="Go down" aria-label="Go down" disabled={index === pictures.length - 1} on:click={() => down(index)}>
                                        <Icon icon="lucide:chevron-down" class="w-7 h-7" />
                                    </button>
                                    <div>
                                        <button type="button" title="Supprimer" aria-label="Supprimer" class="opacity-30 hover:opacity-100 mt-4" on:click={() => removePicture(index)}>
                                            <Icon icon="lucide:x" class="w-7 h-7" />
                                        </button>
                                    </div>
                                </div>
                            {/if}
                            <DropZone on:drop={handlePictureImport} previewUrl={picture?.url} metadata={{index}} name="picture-{index}" multiple={picture?.url === undefined}>
                                <Icon icon="lucide:image" class="w-12 h-12" />
                            </DropZone>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
    <button type="submit" class="bg-primary-dark hover:bg-primary-darker py-2 px-5 text-white rounded-md" disabled={loading}>
        {loading ? "Chargement..." : "Confirmer"}
    </button>
</form>

<style>
    button:disabled {
        opacity: .3;
        cursor: not-allowed;
    }

    textarea {
        @apply border-dashed border-2 border-primary/10 p-6 rounded-md bg-transparent resize-none w-full h-full;
    }
</style>
