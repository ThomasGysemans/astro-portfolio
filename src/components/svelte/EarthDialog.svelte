<script lang="ts">
    import trans from "@trans";

    export let lang: App.LangCode;
    export let resolution: string | undefined = undefined;
    export let onResolutionChanged: ((r: string) => void) | undefined = undefined;

    const isUsingSpecialFormat = resolution != undefined && onResolutionChanged != undefined;
</script>

<div class="dialog bg-primary max-w-96 py-2 px-3 rounded-md {isUsingSpecialFormat ? 'absolute -top-[12%] 2xl:-top-[32%] -left-[20%] sm:-left-[15%] md:-top-[14%] xl:-top-[16%]' : 'relative mt-12'}">
    <div class="dialog-triangle absolute -bottom-[10px] xl:-bottom-[20px] {isUsingSpecialFormat ? 'right-12' : 'right-[50%] translate-x-[50%]'} w-0 h-0 border-l-[15px] border-l-transparent border-t-[20px] border-t-primary border-r-[15px] border-r-transparent" />
    <p class="text-white font-light {isUsingSpecialFormat ? "text-sm" : "text-xs"} xl:text-base">{@html trans.homepage.dialog[lang]}</p>
    {#if isUsingSpecialFormat}
        <div class="resolutions absolute -bottom-10 left-0 text-white space-x-2 text-xs">
            {#each ['2k', '8k'] as r (r)}
                <button type="button" class="bg-primary rounded-sm py-1 px-2 {resolution === r ? 'opacity-100' : 'opacity-50 hover:opacity-70'}" on:click={() => onResolutionChanged?.(r)}>
                    {r.toUpperCase()}
                </button>
            {/each}
        </div>
    {/if}
</div>