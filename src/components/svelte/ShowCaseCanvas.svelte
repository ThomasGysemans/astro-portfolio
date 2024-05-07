<script>
    import { T, Canvas } from "@threlte/core";
    import ShowCase from "@components/svelte/ShowCase.svelte";
</script>

<div class="w-full h-dvh bg-black my-40 overflow-hidden">
    <Canvas>
        <T.PerspectiveCamera
            makeDefault
            position={[10, 50, 10]}
            on:create={({ref}) => {
                ref.lookAt(0, 0, 0);
            }}
        />

        <ShowCase />
    </Canvas>
</div>