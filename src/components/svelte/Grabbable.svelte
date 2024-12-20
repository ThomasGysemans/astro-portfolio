<script lang="ts">
    let grabbing = false;
</script>

<div class="{grabbing ? 'cursor-grabbing' : 'cursor-grab'} h-full max-md:flex max-md:justify-end" role="presentation" on:mousedown={() => grabbing = true} on:mouseup={() => grabbing = false}>
    <slot />
</div>