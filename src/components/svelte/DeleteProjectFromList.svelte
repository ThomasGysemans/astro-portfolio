<script lang="ts">
    import { actions } from "astro:actions";
    import Swal from "sweetalert2";

    export let slug: string;

    async function handleSubmit(e: SubmitEvent) {
        const formData = new FormData(e.target as HTMLFormElement);
        const result = await actions.deleteProject(formData);
        if (result.status === 200) {
            Swal.fire({
                title: "Opération réussie !",
                text: `Le projet '${slug}' a été supprimé.`,
                icon: "success"
            }).then(() => {
                document.querySelector<HTMLTableRowElement>(`#table-projects [data-slug='${slug}']`)?.remove();
            });
        } else {
            Swal.fire({
                title: `Erreur ${result.status} !`,
                text: `Le projet n'a pas pu être supprimé pour la raison suivante : "${result.error}"`,
                icon: "error",
            });
        }
    }
</script>

<form method="POST" on:submit|preventDefault={handleSubmit}>
    <input type="hidden" name="slug" value={slug} />
    <button type="submit" class="text-red-500 text-base opacity-50 hover:opacity-100">
        <slot />
    </button>
</form>