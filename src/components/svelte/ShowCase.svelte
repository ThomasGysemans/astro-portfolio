<script lang="ts">
    import { T, useTask, useThrelte } from "@threlte/core";
    import { BufferGeometry, Color, Float32BufferAttribute, type PerspectiveCamera, Points, PointsMaterial } from "three";
    import {
        EffectComposer,
        EffectPass,
        RenderPass,
        SMAAEffect,
        SMAAPreset,
        BloomEffect,
        KernelSize
    } from 'postprocessing';

    const { scene, renderer, camera, size, renderStage } = useThrelte();
    const composer = new EffectComposer(renderer);

    const setupEffectComposer = (camera: PerspectiveCamera) => {
        composer.removeAllPasses();
        composer.addPass(new RenderPass(scene, camera));
        composer.addPass(
            new EffectPass(
                camera,
                new BloomEffect({
                    intensity: 1,
                    luminanceThreshold: 0.15,
                    height: 256,
                    width: 256,
                    luminanceSmoothing: 0.08,
                    mipmapBlur: true,
                    kernelSize: KernelSize.VERY_SMALL
                })
            )
        );
        composer.addPass(
            new EffectPass(
                camera,
                new SMAAEffect({
                    preset: SMAAPreset.HIGH
                })
            )
        );
    };

    // We need to set up the passes according to the camera in use
    $: setupEffectComposer($camera as PerspectiveCamera);
    $: composer.setSize($size.width, $size.height);

    const starGeometry = new BufferGeometry();
    const starPositions = [];
    const starColors = [];

    for (let i = 0; i < 4000; i++) {
        const x = Math.random() * 600 - 300;
        const y = Math.random() * 600 - 300;
        const z = Math.random() * 600 - 300;

        starPositions.push(x, y, z);

        // Randomize colors
        const color = new Color();
        color.setHSL(Math.random(), 1.0, 0.65);
        starColors.push(color.r, color.g, color.b);
    }

    starGeometry.setAttribute('position', new Float32BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new Float32BufferAttribute(starColors, 3));

    const starMaterial = new PointsMaterial({
        color: 0xffffff, // Vertex colors will be used instead
        vertexColors: true, // Enable vertex colors
        size: 0.2,
    });

    const stars = new Points(starGeometry, starMaterial);

    useTask((delta) => {
        composer.render(delta);
        stars.rotation.y += 0.04 * delta;
    }, { stage: renderStage });
</script>

<T is={stars} />
