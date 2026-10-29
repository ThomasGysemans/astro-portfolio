<script lang="ts">
    // Facade of the 3D Earth. The page ships a still of the planet (rendered from
    // the scene itself, same camera, transparent background); the real scene —
    // three.js, ~1.5 MB of textures and a shader compilation, i.e. long main-thread
    // tasks — is only fetched at the visitor's first interaction, so it never
    // competes with the initial load. Until then, the still is indistinguishable.
    // It is also the hero's largest element (the LCP), hence its high fetch priority.
    import { onMount, type Component } from "svelte";

    let { dragLabel }: { dragLabel: string } = $props();

    type SceneProps = { dragLabel: string, onready?: (ready: boolean) => void };

    let Scene = $state<Component<SceneProps>>();
    // The still stays underneath until the planet is textured, so the swap is seamless.
    let ready = $state(false);

    // A software-rendered WebGL context (no GPU, blocklisted driver, VM) would
    // draw the planet at a few frames per second while monopolising the main
    // thread: those visitors, like those asking to save data, keep the still.
    function canRender3D(): boolean {
        if ((navigator as { connection?: { saveData?: boolean } }).connection?.saveData) return false;
        try {
            const canvas = document.createElement("canvas");
            const options = { failIfMajorPerformanceCaveat: true };
            const gl = canvas.getContext("webgl2", options) ?? canvas.getContext("webgl", options);
            gl?.getExtension("WEBGL_lose_context")?.loseContext();
            return gl !== null;
        } catch {
            return false;
        }
    }

    onMount(() => {
        const events = ["pointermove", "pointerdown", "touchstart", "wheel", "keydown", "scroll"] as const;
        const stopListening = () => events.forEach(e => window.removeEventListener(e, load));
        function load() {
            stopListening();
            if (canRender3D()) {
                import("./EarthScene.svelte").then(module => Scene = module.default);
            }
        }
        events.forEach(e => window.addEventListener(e, load, { passive: true }));
        return stopListening;
    });
</script>

<div class="relative w-full h-full">
    <img
        src="/earth/earth-poster-1080.webp"
        srcset="/earth/earth-poster-640.webp 640w, /earth/earth-poster-1080.webp 1080w"
        sizes="(min-width: 1688px) 540px, (max-width: 812px) 260px, 32vw"
        width="1080"
        height="1080"
        alt=""
        fetchpriority="high"
        class="absolute inset-0 w-full h-full transition-opacity duration-500 {ready ? 'opacity-0' : 'opacity-100'}"
    />
    {#if Scene}
        <Scene {dragLabel} onready={value => ready = value} />
    {/if}
</div>
