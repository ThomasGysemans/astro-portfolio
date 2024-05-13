<script lang="ts">
    import { T, useLoader, useTask } from '@threlte/core';
    import { AdditiveBlending, IcosahedronGeometry, Mesh, MeshPhongMaterial, MeshStandardMaterial, Texture, TextureLoader } from 'three';
    import { onMount } from "svelte";
    import fresnel from '@/fresnel.ts';

    interface PlanetTextures {
        map: string;
        normalMap?: string;
        specularMap?: string;
        clouds?: string;
    }

    export let tiltRadians: number;
    export let radius: number;
    export let rotationSpeed: number;
    export let cloudsRotationSpeed: number | undefined = undefined;
    export let atmosphere: boolean = false;
    export let atmosphereColor: number | undefined = undefined;
    export let atmosphereScale: number | undefined = undefined;
    export let texturesPaths: PlanetTextures;

    const textures = useLoader(TextureLoader).load({
        ...texturesPaths
    });

    const geometry = new IcosahedronGeometry(radius, 12);

    let planetMesh: Mesh;
    let cloudsMesh: Mesh;
    let browser = false;

    $: {
        if ($textures && browser) {
            document.querySelector("#earth-loading-replacement")?.remove();
        }
    }

    function createPlanetMat(map: Texture, normalMap?: Texture, specularMap?: Texture) {
        if (normalMap) {
            const phongMat = new MeshPhongMaterial();
            phongMat.map = map;
            phongMat.normalMap = normalMap;
            phongMat.normalScale.set(10, 10);
            if (specularMap) {
                phongMat.specularMap = specularMap;
                phongMat.shininess = 100;
            }
            return phongMat;
        } else {
            return new MeshStandardMaterial({ map });
        }
    }

    useTask((delta) => {
        // Handle rotation of the planet on its own axis.
        // The clouds have a different rotation so that it looks more dynamic.
        if (planetMesh) planetMesh.rotation.y += rotationSpeed * delta;
        if (cloudsMesh && cloudsRotationSpeed != undefined) cloudsMesh.rotation.y += cloudsRotationSpeed * delta;
    });

    onMount(() => {
        browser = true;
    });
</script>

{#await textures then texture}
    {@const planetMat = createPlanetMat(texture.map, texture.normalMap, texture.specularMap)}
    <T.Mesh
        bind:ref={planetMesh}
        rotation.z={tiltRadians}
    >
        <T is={geometry} />
        <T is={planetMat} />
        {#if texture.clouds != null}
            <T.Mesh bind:ref={cloudsMesh} on:create={({ref}) => ref.scale.setScalar(1.01) }>
                <T is={geometry} />
                <T.MeshStandardMaterial map={texture.clouds} blending={AdditiveBlending} transparent opacity={0.5} />
            </T.Mesh>
        {/if}
    </T.Mesh>
    {#if atmosphere}
        <T.Mesh on:create={({ref}) => ref.scale.setScalar(1.025)}>
            <T is={geometry} />
            <T is={fresnel({ rimHex: atmosphereColor, scale: atmosphereScale })} />
        </T.Mesh>
    {/if}
{/await}