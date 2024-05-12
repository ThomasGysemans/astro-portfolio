<script lang="ts">
    import { T, Canvas } from "@threlte/core";
    import { spring } from "svelte/motion";
    import { onMount } from "svelte";
    import Nebula from "@components/svelte/Nebula.svelte";

    const ri = spring(0);
    const gi = spring(0);
    const bi = spring(0);

    function getRandomIntensity() {
        return Math.random() * 0.4;
    }

    function changeColors() {
        ri.set(getRandomIntensity());
        gi.set(getRandomIntensity());
        bi.set(getRandomIntensity());
    }

    export let number_of_projects: number;

    const rotateFn = 'rotateY'; // rotateX for horizontal
    let carousel: HTMLElement;
    let selectedIndex = 0;
    let radius = 0;
    let theta = 0;

    function getCells(): HTMLElement[] {
        return Array.from(carousel.querySelectorAll(".cell")) as HTMLElement[];
    }

    function rotateCarousel(): void {
        const cells = getCells();
        const angle = theta * selectedIndex * -1;
        carousel.style.transform = `translateZ(${-radius}px) ${rotateFn}(${angle}deg)`;
        carousel.querySelectorAll(".previous-active")?.forEach(e => e.classList.remove("previous-active"));
        carousel.querySelectorAll(".active")?.forEach(e => e.classList.remove("active"));
        carousel.querySelectorAll(".next-active")?.forEach(e => e.classList.remove("next-active"));
        cells[getActualCellIndex(selectedIndex - 1)]?.classList.add("previous-active");
        cells[getActualCellIndex(selectedIndex)]?.classList.add("active");
        cells[getActualCellIndex(selectedIndex + 1)]?.classList.add("next-active");
    }

    function getActualCellIndex(index: number): number {
        if (index < 0) {
            const abs = (Math.abs(index) % number_of_projects);
            if (abs === 0) {
                return 0;
            } else {
                return number_of_projects - abs;
            }
        }
        return Math.abs(index) % number_of_projects;
    }

    function next() {
        selectedIndex++;
        rotateCarousel();
        changeColors();
    }

    function previous() {
        selectedIndex--;
        rotateCarousel();
        changeColors();
    }

    function initCarousel() {
        const cells = getCells();
        const cellSize = carousel.offsetWidth; // "offsetHeight" for horizontal
        radius = Math.round((cellSize / 2) / Math.tan(Math.PI / number_of_projects));
        theta = 360 / number_of_projects;
        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i];
            if (i < number_of_projects) { // visible cell
                cell.style.visibility = "visible";
                cell.style.transform = `${rotateFn}(${theta * i}deg) translateZ(${radius}px)`;
            } else { // hidden cell
                cell.style.visibility = "hidden";
                cell.style.transform = 'none';
            }
        }

        rotateCarousel();
    }

    onMount(() => {
        initCarousel();

        function handleKeyboard(e: KeyboardEvent) {
            if (e.key === "ArrowLeft") {
                previous();
            } else if (e.key === "ArrowRight") {
                next();
            }
        }

        window.addEventListener("keydown", handleKeyboard);

        return () => {
            window.removeEventListener("keydown", handleKeyboard);
        };
    });
</script>

<div class="w-full h-dvh bg-black overflow-hidden">
    <Canvas>
        <T.PerspectiveCamera
            makeDefault
            position={[0, 0, 1]}
            rotation={[1.16, -0.12, 0.27]}
        />
        <T.PointLight args={[0xff0000, $ri, 0, 0]} position={[-0.8, 1.5, -0.5]} />
        <T.PointLight args={[0x00ff00, $gi, 0, 0]} position={[-0.8, 1.5, -0.5]} />
        <T.PointLight args={[0x0000ff, $bi, 0, 0]} position={[-0.8, 1.5, -0.5]} />
        <Nebula />
    </Canvas>

    <div class="scene">
        <div class="carousel" aria-live="polite" bind:this={carousel}>
            <slot />
        </div>
    </div>

    <div class="absolute bottom-32 left-[50%] -translate-x-[50%] z-30 flex items-center justify-center space-x-6">
        <button type="button" id="previous-button" class="carousel-btn w-32" on:click={previous}>Précédent</button>
        <button type="button" id="next-button" class="carousel-btn w-32" on:click={next}>Suivant</button>
    </div>
</div>

<style lang="scss">
    // https://3dtransforms.desandro.com/carousel

    @use 'sass:math';

    $cellWidth: 350px;
    $cellHeight: $cellWidth * 0.75;
    $cellGap: 20px;
    $angle: 40;
    $tz: math.div(math.div($cellWidth, 2), math.tan(math.div($angle, 2)));

    .scene {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 30;
        width: $cellWidth;
        height: $cellHeight;
        perspective: 1000px;
    }

    .carousel {
        width: 100%;
        height: 100%;
        position: absolute;
        transform: translateZ(-#{$tz});
        transform-style: preserve-3d;
        transition: transform 1s;
    }

    :global(.carousel .cell > div) {
        transform: translateY(0);
        transition: transform 500ms ease;
    }

    :global(.carousel .cell) {
        position: absolute;
        width: calc($cellWidth - $cellGap);
        height: calc($cellHeight - $cellGap);
        left: calc($cellGap / 2);
        top: calc($cellGap / 2);
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        font-size: 4rem;
        color: white;
        transition: transform 1s, opacity 1s;
    }

    @for $i from 1 through 9 {
        :global(.carousel .cell:nth-child(#{$i})) {
            transform: rotateY(#{($i - 1) * $angle}deg) translateZ($tz);
        }
    }

    :global(.carousel .cell:not(.active)) {
        opacity: 0.03;
    }

    :global(.carousel .cell:not(.active) > div) {
        transform: translateY(10%);
    }

    :global(.carousel .cell:not(.active) .cell-details) {
        opacity: 0;
    }

    :global(.carousel .cell.active) {
        opacity: 1;
    }

    :global(.carousel .cell.previous-active),
    :global(.carousel .cell.next-active) {
        opacity: .5;
    }
</style>
