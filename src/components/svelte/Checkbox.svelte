<script lang="ts">
    export let name: string;
    export let initialValue: boolean = false;

    let checked = initialValue;

    function toggle() {
        checked = !checked;
    }
</script>

<input type="hidden" {name} value={checked ? "on" : "off"} />

<div class="flex items-center space-x-3">
    <button class="w-5 h-5 rounded-sm border border-primary/5 {checked ? 'bg-primary-light' : 'bg-white'}" on:click={toggle} />
    <button type="button" on:click={toggle}>
        <slot />
    </button>
</div>