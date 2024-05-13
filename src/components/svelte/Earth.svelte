<script lang="ts">
    import { T, Canvas } from "@threlte/core";
    import { OrbitControls } from "@threlte/extras";
    import Grabbable from "@components/svelte/Grabbable.svelte";
    import Planet from "./Planet.svelte";

    const res = "2k";
</script>

<Grabbable>
    <Canvas size={{width: 700, height: 500}}>
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
                rotateSpeed={0.5}
                autoRotate={false}
            />
        </T.PerspectiveCamera>

        <T.DirectionalLight position={[0, 10, 10]} />
        <T.AmbientLight args={[0xffffff]} intensity={0.1} />

        <Planet
            atmosphere
            radius={6}
            rotationSpeed={0.1}
            cloudsRotationSpeed={-0.05}
            tiltRadians={0.409}
            texturesPaths={{
                map: `/earth/${res}_earth_daymap.jpg`,
                clouds: `/earth/${res}_earth_clouds.jpg`,
                normalMap: `/earth/${res}_earth_normal_map.jpg`,
                specularMap: `/earth/${res}_earth_specular_map.jpg`,
            }}
        />
    </Canvas>
</Grabbable>