<script lang="ts">
    import type { Snippet } from "svelte";

    let { children }: { children?: Snippet } = $props();

    let grabbing = $state(false);
</script>

<div class="{grabbing ? 'cursor-grabbing' : 'cursor-grab'} h-full max-md:flex max-md:justify-end" role="presentation" onmousedown={() => grabbing = true} onmouseup={() => grabbing = false}>
    {@render children?.()}
</div>
