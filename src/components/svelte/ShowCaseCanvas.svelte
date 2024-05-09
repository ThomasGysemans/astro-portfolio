<script>
    import { T, Canvas } from "@threlte/core";
    import Nebula from "@components/svelte/Nebula.svelte";
</script>

<div class="w-full h-dvh bg-black overflow-hidden">
    <Canvas>
        <T.PerspectiveCamera
            makeDefault
            position={[0, 0, 1]}
            rotation={[1.16, -0.12, 0.27]}
        />
        <Nebula />
    </Canvas>
</div>