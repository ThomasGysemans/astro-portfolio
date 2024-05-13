<script lang="ts">
    import { T, Canvas } from "@threlte/core";
    import { OrbitControls } from "@threlte/extras";
    import Grabbable from "@components/svelte/Grabbable.svelte";
    import Planet from "./Planet.svelte";

    const radius = 6;
    const rotationSpeed = 0.1;
    const cloudsRotationSpeed = -0.07;
    const tiltRadians = 0.409;

    let res = '2k';
    $: textures = {
        map: `/earth/${res}_earth_daymap.jpg`,
        clouds: `/earth/${res}_earth_clouds.jpg`,
        normalMap: `/earth/${res}_earth_normal_map.jpg`,
        specularMap: `/earth/${res}_earth_specular_map.jpg`,
    };
</script>

<div class="absolute top-12 -left-[15%] text-white space-x-2 text-xs">
    {#each ['2k', '8k'] as r (r)}
        <button type="button" class="bg-primary rounded-sm py-1 px-2 {res === r ? 'opacity-100' : 'opacity-50 hover:opacity-70'}" on:click={() => res = r}>
            {r.toUpperCase()}
        </button>
    {/each}
</div>

<Grabbable>
    <Canvas size={{width: 700, height: 500}}>
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

        {#if res === '2k'}
            <Planet
                atmosphere
                {radius}
                {rotationSpeed}
                {cloudsRotationSpeed}
                {tiltRadians}
                texturesPaths={textures}
            />
        {:else}
            <Planet
                atmosphere
                {radius}
                {rotationSpeed}
                {cloudsRotationSpeed}
                {tiltRadians}
                texturesPaths={textures}
            />
        {/if}
    </Canvas>
</Grabbable>