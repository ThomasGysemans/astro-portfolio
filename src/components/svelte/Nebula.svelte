<script lang="ts">
    import { T, useLoader, useTask, useThrelte } from "@threlte/core";
    import { FogExp2, Mesh, MeshLambertMaterial, type PerspectiveCamera, PlaneGeometry, type Texture, TextureLoader } from "three";
    import { BlendFunction, BloomEffect, EffectComposer, EffectPass, KernelSize, RenderPass, TextureEffect } from "postprocessing";

    const { scene, renderer, camera } = useThrelte();
    const composer = new EffectComposer(renderer);
    const stars = useLoader(TextureLoader).load("/stars.jpg");

    scene.fog = new FogExp2(0x000000, 0.001);
    renderer.setClearColor(scene.fog.color);

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

    const smoke = useLoader(TextureLoader).load("/smoke.png");
    const cloudGeo = new PlaneGeometry(500, 500);
    const cloudParticles: Mesh[] = [];

    $: {
        if (cloudParticles.length === 0 && $smoke) {
            const cloudMat = new MeshLambertMaterial({
                transparent: true,
                map: $smoke,
            });
            for (let p = 0; p < 20; p++) {
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
        if ($stars) {
            setupEffectComposer($camera as PerspectiveCamera, $stars);
        }
    }

    useTask(() => {
        cloudParticles.forEach(p => {
            p.rotation.z -= 0.001;
        });
        composer.render(0.1);
    });
</script>

<T.AmbientLight args={[0x081b2a]} intensity={1.2} />
<T.DirectionalLight args={[0x2672ba]} position={[0, 0, 1]} />