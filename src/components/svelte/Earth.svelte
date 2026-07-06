<script lang="ts">
    import { T, Canvas } from "@threlte/core";
    import { OrbitControls } from "@threlte/extras";
    import Grabbable from "@components/svelte/Grabbable.svelte";
    import Planet from "./Planet.svelte";

    export let dragLabel: string;

    const radius = 6;
    const rotationSpeed = 0.1;
    const cloudsRotationSpeed = -0.07;
    const tiltRadians = 0.409;
    const resolutions = ["2k", "8k"] as const;

    let res: (typeof resolutions)[number] = "2k";
    $: textures = {
        map: `/earth/${res}_earth_daymap.jpg`,
        clouds: `/earth/${res}_earth_clouds.jpg`,
        normalMap: `/earth/${res}_earth_normal_map.jpg`,
        specularMap: `/earth/${res}_earth_specular_map.jpg`,
    };
</script>

<div class="relative w-full h-full">
    <Grabbable>
        <Canvas>
            <T.PerspectiveCamera
                makeDefault
                position={[10, 10, 10]}
                on:create={({ref}) => {
                    ref.lookAt(0, 0, 0);
                }}
            >
                <OrbitControls
                    enableDamping
                    enableZoom={false}
                    autoRotate={false}
                    rotateSpeed={0.5}
                />
            </T.PerspectiveCamera>

            <T.DirectionalLight position={[0, 10, 10]} />
            <T.AmbientLight args={[0xffffff]} intensity={0.1} />

            {#key res}
                <Planet
                    atmosphere
                    {radius}
                    {rotationSpeed}
                    {cloudsRotationSpeed}
                    {tiltRadians}
                    texturesPaths={textures}
                />
            {/key}
        </Canvas>
    </Grabbable>

    <!-- Control pill: fixed dark colors on purpose, it floats over the dark canvas in both themes. -->
    <div class="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-2.5 items-center bg-[rgba(3,15,32,.75)] border border-white/[.12] rounded-full py-[5px] pr-1.5 pl-4 text-[11px] text-[#a9b8d8] whitespace-nowrap">
        <span class="inline-flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#87b3f6" stroke-width="2" aria-hidden="true"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
            {dragLabel}
        </span>
        <span class="w-px h-4 bg-white/15" />
        <span class="inline-flex gap-0.5 bg-white/[.07] rounded-full p-0.5">
            {#each resolutions as r (r)}
                <button
                    type="button"
                    aria-pressed={res === r}
                    on:click={() => res = r}
                    class="font-bold text-[10.5px] rounded-full py-1 px-3 transition-colors {res === r ? 'bg-accent-strong text-night' : 'text-[#a9b8d8] hover:text-white'}"
                >
                    {r.toUpperCase()}
                </button>
            {/each}
        </span>
    </div>
</div>
