<script>
    import { T, Canvas } from "@threlte/core";
    import { OrbitControls } from "@threlte/extras";
    import Planet from "./Planet.svelte";

    let grabbing = false;
</script>

<div class="{grabbing ? 'cursor-grabbing' : 'cursor-grab'}" role="presentation" on:mousedown={() => grabbing = true} on:mouseup={() => grabbing = false}>
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
                autoRotate
            />
        </T.PerspectiveCamera>

        <T.DirectionalLight position={[0, 10, 10]} />
        <T.AmbientLight args={[0xffffff]} intensity={0.1} />

        <Planet
            atmosphere
            radius={6}
            rotationSpeed={0.01}
            cloudsRotationSpeed={-0.05}
            tiltRadians={0.409}
            texturesPaths={{
                map: "/earth/2k_earth_daymap.jpg",
                lights: "/earth/2k_earth_nightmap.jpg",
                clouds: "/earth/2k_earth_clouds.jpg",
                normalMap: "/earth/2k_earth_normal_map.jpg",
                specularMap: "/earth/2k_earth_specular_map.jpg"
            }}
        />
    </Canvas>
</div>