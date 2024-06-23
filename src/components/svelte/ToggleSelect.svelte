<script lang="ts">
    import { ProjectNature } from "@lib/ProjectNature.ts";

    export let initialValue: string = ProjectNature.PROFESSIONAL.frenchName;

    const options = ProjectNature.getAllNatures();
    let value = initialValue;
</script>

<input type="hidden" {value} name="nature" />

<span class="text-primary/50 flex items-center space-x-2 text-sm">
    <span>
        {#if value === ProjectNature.PROFESSIONAL.frenchName}
            <slot name="pro" />
        {:else if value === ProjectNature.SCHOOL.frenchName}
            <slot name="school" />
        {:else}
            <slot name="personal" />
        {/if}
    </span>
    <select bind:value={value} class="w-24">
        {#each options as opt (opt.frenchName)}
            <option value={opt.frenchName}>{opt.frenchName}</option>
        {/each}
    </select>
</span>