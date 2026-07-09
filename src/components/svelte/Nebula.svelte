<script lang="ts">
    import { onDestroy } from "svelte";
    import { T, useTask, useThrelte } from "@threlte/core";
    import { FogExp2, Mesh, MeshLambertMaterial, type PerspectiveCamera, PlaneGeometry, type Texture, TextureLoader } from "three";
    import { BlendFunction, BloomEffect, EffectComposer, EffectPass, KernelSize, RenderPass, TextureEffect } from "postprocessing";

    const { scene, renderer, camera } = useThrelte();
    const composer = new EffectComposer(renderer);

    scene.fog = new FogExp2(0x000000, 0.001);
    renderer.setClearColor(scene.fog.color);

    // Set once the component is torn down so the retry callbacks and the render
    // task stop touching disposed resources.
    let destroyed = false;

    // Load a texture with a bounded retry. The whole nebula is gated on these
    // two textures (the clouds on smoke.png, the composer on stars.jpg), so a
    // single transient network failure would otherwise leave the nebula
    // permanently incomplete — the clouds simply never appearing — with only a
    // console error. TextureLoader.load exposes an onError callback that
    // useLoader swallows, so we drive the load directly to be able to retry.
    const textureLoader = new TextureLoader();
    function loadTexture(url: string, onLoad: (texture: Texture) => void, retries = 3) {
        textureLoader.load(
            url,
            (texture) => { if (!destroyed) onLoad(texture); },
            undefined,
            () => {
                if (destroyed || retries <= 0) {
                    console.error(`Nebula: failed to load ${url} after retries`);
                    return;
                }
                loadTexture(url, onLoad, retries - 1);
            },
        );
    }

    let smokeTexture = $state<Texture | undefined>(undefined);
    let starsTexture = $state<Texture | undefined>(undefined);
    loadTexture("/smoke.png", (texture) => { smokeTexture = texture; });
    loadTexture("/stars.jpg", (texture) => { starsTexture = texture; });

    const setupEffectComposer = async (camera: PerspectiveCamera, starsTexture: Texture) => {
        composer.removeAllPasses();
        composer.addPass(new RenderPass(scene, camera));

        const textureEffect = new TextureEffect({
            blendFunction: BlendFunction.COLOR_DODGE,
            texture: starsTexture,
        });
        textureEffect.blendMode.opacity.value = 0.2;

        const bloomEffect = new BloomEffect({
            blendFunction: BlendFunction.COLOR_DODGE,
            kernelSize: KernelSize.SMALL,
            luminanceThreshold: 0.3,
            luminanceSmoothing: 0.75
        });
        bloomEffect.blendMode.opacity.value = 1.5;

        let effectPass = new EffectPass(
            camera,
            bloomEffect,
            textureEffect
        );
        effectPass.renderToScreen = true;
        composer.addPass(effectPass);
    };

    const cloudGeo = new PlaneGeometry(500, 500);
    const cloudParticles: Mesh[] = [];
    let cloudMat: MeshLambertMaterial | undefined;

    $effect(() => {
        if (cloudParticles.length === 0 && smokeTexture) {
            cloudMat = new MeshLambertMaterial({
                transparent: true,
                map: smokeTexture,
            });
            // Fewer, still-overlapping planes: each is a large transparent
            // quad blended with bloom, so cutting the count directly cuts the
            // fill-rate cost with no perceptible change to the cloud density.
            for (let p = 0; p < 12; p++) {
                const cloud = new Mesh(cloudGeo, cloudMat);
                cloud.position.set(
                    Math.random() * 800 - 400,
                    500,
                    Math.random() * 500 - 500
                );
                cloud.rotation.x = 1.16;
                cloud.rotation.y = -0.12;
                cloud.rotation.z = Math.random()*2*Math.PI;
                cloud.material.opacity = 0.55;
                cloudParticles.push(cloud);
                scene.add(cloud);
            }
        }
        if (starsTexture) {
            setupEffectComposer($camera as PerspectiveCamera, starsTexture);
        }
    });

    useTask(() => {
        // Skip all GPU work while the tab is hidden: the nebula is purely
        // decorative, so there's nothing to keep animating off-screen.
        if (destroyed || document.hidden) return;
        cloudParticles.forEach(p => {
            p.rotation.z -= 0.001;
        });
        composer.render(0.1);
    });

    onDestroy(() => {
        // Tear down everything we added to the shared Canvas scene: on HMR the
        // Canvas can outlive this component, so without an explicit cleanup the
        // old clouds and GPU resources would leak and pile up.
        destroyed = true;
        cloudParticles.forEach(cloud => scene.remove(cloud));
        cloudParticles.length = 0;
        cloudGeo.dispose();
        cloudMat?.dispose();
        smokeTexture?.dispose();
        starsTexture?.dispose();
        composer.dispose();
    });
</script>

<T.AmbientLight args={[0x081b2a]} intensity={1.2} />
<T.DirectionalLight args={[0x2672ba]} position={[0, 0, 1]} />
