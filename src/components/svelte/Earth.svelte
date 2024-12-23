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

<div class="dialog bg-primary max-w-96 py-2 px-3 rounded-md absolute -top-[12%] 2xl:-top-[32%] -left-[20%] sm:-left-[15%] md:-top-[14%] xl:-top-[16%]">
    <div class="dialog-triangle absolute -bottom-[10px] xl:-bottom-[20px] right-12 w-0 h-0 border-l-[15px] border-l-transparent border-t-[20px] border-t-primary border-r-[15px] border-r-transparent" />
    <p class="text-white font-light text-sm xl:text-base">
        Je suis passionné d’informatique, mais aussi d’astronomie, j’ai ainsi combiné mes passions pour réaliser ce modèle 3D en utilisant
        <a href="https://threejs.org/" target="_blank" class="underline">ThreeJS</a> et <a href="https://threlte.xyz/" target="_blank" class="underline">Threlte</a> !
    </p>
    <div class="resolutions absolute -bottom-10 left-0 text-white space-x-2 text-xs">
        {#each ['2k', '8k'] as r (r)}
            <button type="button" class="bg-primary rounded-sm py-1 px-2 {res === r ? 'opacity-100' : 'opacity-50 hover:opacity-70'}" on:click={() => res = r}>
                {r.toUpperCase()}
            </button>
        {/each}
    </div>
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
    // Responsiveness of the dialog box & the earth requires some highly precise adjustments.

    @media (max-width: 500px) {
        .earth-container { transform: scale(.85); }
        .dialog-triangle { right: 80px; }
    }
    
    @media (max-width: 435px) {
        .dialog { left: -25%; }
    }

    @media (max-width: 415px) {
        .dialog > p { font-size: 0.75rem; }
        .dialog { left: -30%; }

        .earth-container {
            transform: scale(.75);
            position: relative;
            right: -20px;
        }
    }

    @media (max-width: 370px) {
        .earth-container {
            right: -30px;
        }
    }

    @media (max-width: 350px) {
        .earth-container {
            transform: scale(.7);
            right: -50px;
        }
    }

    @media (max-width: 320px) {
        .earth-container { right: -70px; }
        .dialog { left: -40%; }
    }
</style>