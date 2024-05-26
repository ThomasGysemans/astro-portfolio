<script lang="ts">
    export let textarea = false;
    export let pen = false;
    export let className: string = "";
    export let width: string | undefined = undefined;
    export let initialValue: string;
    export let tagName: string;
    export let name: string;

    let editing = false;
    let value = initialValue;

    function edit() {
        editing = true;
    }

    function confirmEdit() {
        editing = false;
    }

    function handleEnterKey(e: KeyboardEvent) {
        if (!e.shiftKey && e.key === "Enter") {
            confirmEdit();
        }
    }
</script>

<input type="hidden" {value} {name} />

{#if editing}
    {#if textarea}
        <textarea
            autofocus
            class="border-b-[1px] border-b-primary/20 w-full min-h-10"
            bind:value={value}
            on:keydown={handleEnterKey}
            on:blur={confirmEdit}
        />
    {:else}
        <input
            type="text"
            autofocus
            class="border-b-[1px] border-b-primary/20 {width ?? ''}"
            bind:value={value}
            on:keydown={handleEnterKey}
            on:blur={confirmEdit}
        />
    {/if}
{:else}
    {#if textarea || !pen}
        <button type="button" on:click={edit} class="block text-left">
            <svelte:element this={tagName} class={className}>{value}</svelte:element>
        </button>
    {:else}
        <div class="flex items-center space-x-3">
            <svelte:element this={tagName} class={className}>{value}</svelte:element>
            <button type="button" on:click={edit}>
                <img src="/pencil-line.svg" alt="Pinceau" class="w-6 h-6 opacity-50 hover:opacity-100" />
            </button>
        </div>
    {/if}
{/if}