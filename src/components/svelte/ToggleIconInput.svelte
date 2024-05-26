<script lang="ts">
    let editing = false;
    let value = 1;

    function edit() {
        editing = true;
    }

    function confirmEdit() {
        editing = false;
    }
</script>

<input type="hidden" name="team_members" {value} />

<div class="text-primary/50 flex items-center space-x-2 text-sm">
    <div>
        {#if value <= 1}
            <slot name="solo" />
        {:else}
            <slot name="team" />
        {/if}
    </div>
    {#if editing}
        <input
            autofocus
            type="number"
            min="1"
            class="border-b-[1px] border-b-primary/20 w-8 focus:outline-primary-light"
            bind:value={value}
            on:blur={confirmEdit}
            on:keydown={(e) => e.key === "Enter" && confirmEdit()}
        />
    {:else}
        <button type="button" on:click={edit} class="block text-left w-6">
            <span class="relative top-[1px]">{value}</span>
        </button>
    {/if}
</div>
