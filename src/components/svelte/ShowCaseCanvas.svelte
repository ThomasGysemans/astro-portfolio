<script>
    import { T, Canvas } from "@threlte/core";
    import { OrbitControls } from "@threlte/extras";
    import ShowCase from "@components/svelte/ShowCase.svelte";
    import Grabbable from "@components/svelte/Grabbable.svelte";
</script>

<div class="w-full h-dvh bg-black my-40 overflow-hidden">
    <Grabbable>
        <Canvas>
            <T.PerspectiveCamera
                makeDefault
                position={[10, 50, 10]}
                on:create={({ref}) => {
                    ref.lookAt(0, 0, 0);
                }}
            >
                <OrbitControls
                    enableDamping
                    enableZoom={false}
                    autoRotate={false}
                />
            </T.PerspectiveCamera>

            <ShowCase />
        </Canvas>
    </Grabbable>
</div>