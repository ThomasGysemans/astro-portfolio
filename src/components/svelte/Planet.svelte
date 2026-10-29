<script lang="ts">
    import { T, useLoader, useTask } from '@threlte/core';
    import { AdditiveBlending, IcosahedronGeometry, Mesh, MeshPhongMaterial, MeshStandardMaterial, Texture, TextureLoader } from 'three';
    import fresnel from '@fresnel.ts';

    interface PlanetTextures {
        map: string;
        normalMap?: string;
        specularMap?: string;
        clouds?: string;
    }

    interface Props {
        tiltRadians: number;
        radius: number;
        rotationSpeed: number;
        cloudsRotationSpeed?: number;
        atmosphere?: boolean;
        atmosphereColor?: number;
        atmosphereScale?: number;
        texturesPaths: PlanetTextures;
        onready?: (ready: boolean) => void;
    }

    let {
        tiltRadians,
        radius,
        rotationSpeed,
        cloudsRotationSpeed = undefined,
        atmosphere = false,
        atmosphereColor = undefined,
        atmosphereScale = undefined,
        texturesPaths,
        onready = undefined,
    }: Props = $props();

    const textures = useLoader(TextureLoader).load({
        ...texturesPaths
    });

    const geometry = new IcosahedronGeometry(radius, 12);

    let planetMesh = $state<Mesh>();
    let cloudsMesh = $state<Mesh>();

    // Lets the parent show a placeholder while the textures are loading.
    $effect(() => {
        onready?.(!!$textures);
    });

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
            <T.Mesh bind:ref={cloudsMesh} oncreate={(ref) => ref.scale.setScalar(1.01)}>
                <T is={geometry} />
                <T.MeshStandardMaterial map={texture.clouds} blending={AdditiveBlending} transparent opacity={0.5} />
            </T.Mesh>
        {/if}
    </T.Mesh>
    {#if atmosphere}
        <T.Mesh oncreate={(ref) => ref.scale.setScalar(1.025)}>
            <T is={geometry} />
            <T is={fresnel({ rimHex: atmosphereColor, scale: atmosphereScale })} />
        </T.Mesh>
    {/if}
{/await}
