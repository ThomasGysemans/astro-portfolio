<script lang="ts">
    // Must be a child of <Canvas>. The planet's rotation invalidates every frame,
    // so the scene would otherwise be re-rendered at 60fps for as long as the
    // page stays open, even scrolled far away from it.
    import { useThrelte } from "@threlte/core";

    const { dom, mainStage, renderStage, invalidate } = useThrelte();

    $effect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                mainStage.start();
                renderStage.start();
                invalidate();
            } else {
                mainStage.stop();
                renderStage.stop();
            }
        });
        observer.observe(dom);
        return () => observer.disconnect();
    });
</script>
