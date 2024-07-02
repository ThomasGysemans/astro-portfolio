<script lang="ts">
    import type { ProjectListItem } from "@db/models/DAOProject.ts";
    import { ProjectType } from "@lib/ProjectType.ts";
    import { actions } from "astro:actions";
    import Icon from "@iconify/svelte";
    import Swal from "sweetalert2";

    export let projects: ProjectListItem[];

    let search: string = "";
    let allProjects = [...projects];
    $: filteredProjects = search.trim().length === 0 ? allProjects : allProjects.filter(p => matches(search.toLowerCase(), p.name.toLowerCase()));

    function matches(a: string, b: string): boolean {
        return Array.from(a).every(char => b.includes(char));
    }

    function displayDate(date: Date): string {
        return date.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
        });
    }

    function handleSubmit(e: SubmitEvent, name: string, slug: string) {
        Swal.fire({
            title: `Supprimer ce projet ?`,
            text: `Tu es sûr de vouloir supprimer le project "${name}" de manière définitive ?`,
            icon: "warning",
            confirmButtonText: "Confirmer",
            cancelButtonText: "Annuler",
            showCancelButton: true,
            showLoaderOnConfirm: true,
            async preConfirm() {
                const formData = new FormData(e.target as HTMLFormElement);
                const result = await actions.deleteProject(formData);
                if (result.status === 200) {
                    Swal.fire({
                        title: "Opération réussie !",
                        text: `Le projet '${name}' a été supprimé.`,
                        icon: "success"
                    }).then(() => {
                        allProjects = allProjects.filter(p => p.slug !== slug);
                    });
                } else {
                    Swal.fire({
                        title: `Erreur ${result.status} !`,
                        text: `Le projet n'a pas pu être supprimé pour la raison suivante : "${result.error}"`,
                        icon: "error",
                    });
                }
            }
        });
    }
</script>

<div class="relative w-full">
    <Icon icon="lucide:search" class="text-primary/50 absolute top-[50%] left-4 -translate-y-[50%]" />
    <input
        bind:value={search}
        id="search"
        type="search"
        aria-label={`Rechercher un projet (parmi ${filteredProjects.length})`}
        placeholder={`Rechercher un projet (parmi ${filteredProjects.length})`}
        class="py-3 pr-6 pl-10 text-sm max-w-80 w-full rounded-md border-2 border-primary/10"
    />
</div>

<table class="my-10">
    <thead>
        <tr class="border-b-[1px] border-b-primary/10">
            <th class="font-bold text-left text-sm py-3 pr-8">Nom</th>
            <th class="font-bold text-left text-sm py-3 pr-8">Type</th>
            <th class="font-bold text-left text-sm py-3 pr-8">En vitrine</th>
            <th class="font-bold text-left text-sm py-3 pr-8">Date de dernière modification</th>
            <th class="font-bold text-left text-sm py-3 pr-8">Actions</th>
        </tr>
    </thead>
    <tbody>
        {#each filteredProjects.sort((a, b) => a.name.localeCompare(b.name)) as p, i (p.slug)}
            {@const isLast = i === filteredProjects.length - 1}
            {@const projectType = ProjectType.getProjectType(p.type)}
            <tr data-slug={p.slug} class={isLast ? "" : "border-b-[1px] border-b-primary/10"}>
                <td class="font-light text-sm py-3 pr-8">{p.name}</td>
                <td class="font-light text-sm py-3 pr-8">
                    <div class="flex items-center space-x-2">
                        <span>{p.type}</span>
                        <div class={`rounded-full w-6 h-6 flex items-center justify-center ${projectType.color}`}>
                            <Icon icon={`lucide:${projectType.icon}`} class="text-sm text-white" />
                        </div>
                    </div>
                </td>
                <td class="font-light text-sm py-3 pr-8">{p.showcase ? "Oui" : "Non"}</td>
                <td class="font-light text-sm py-3 pr-8">{displayDate(p.updatedAt)}</td>
                <td class="font-light text-sm py-3 pr-8">
                    <div class="flex justify-center space-x-4">
                        <a href="/admin/project?slug={p.slug}" class="block opacity-50 hover:opacity-100 relative top-[2px]">
                            <Icon icon="lucide:pen" />
                        </a>
                        <form method="POST" on:submit|preventDefault={(e) => handleSubmit(e, p.name, p.slug)}>
                            <input type="hidden" name="slug" value={p.slug} />
                            <button type="submit" class="text-red-500 text-base opacity-50 hover:opacity-100">
                                <Icon icon="lucide:trash" />
                            </button>
                        </form>
                    </div>
                </td>
            </tr>
        {/each}
    </tbody>
</table>
