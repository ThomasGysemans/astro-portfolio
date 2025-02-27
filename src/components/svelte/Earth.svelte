<script lang="ts">
    import { T, Canvas } from "@threlte/core";
    import { OrbitControls } from "@threlte/extras";
    import Grabbable from "@components/svelte/Grabbable.svelte";
    import EarthDialog from "@components/svelte/EarthDialog.svelte";
    import Planet from "./Planet.svelte";

    export let lang: App.LangCode;

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

<div class="container-dialog contents">
    <EarthDialog
        lang={lang}
        resolution={res}
        onResolutionChanged={(r) => res = r}
    />
</div>

<div class="earth-container h-full 2xl:scale-125">
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

            <!--
                For some reason, updating the "res" state does not trigger a rebuild of Planet.
                This condition makes sure that it does.
            -->
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
</div>

<style lang="scss">
    @media (max-width: 500px) {
        .container-dialog {
            display: none;
        }
    }
</style>