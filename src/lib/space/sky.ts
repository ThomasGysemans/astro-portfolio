// The starfield behind every page: a still canvas fixed to the screen, drawn
// once from a seeded random sequence (the same sky on every visit), plus a few
// stars that twinkle in CSS. The twinkles stop with the pause button.

function seededRandom(seed: number): () => number {
    let s = seed;
    return () => {
        s = (s * 48271) % 2147483647;
        return s / 2147483647;
    };
}

function drawStars(canvas: HTMLCanvasElement): void {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    // As tall as the screen, not the window: a phone toolbar sliding away
    // must not uncover a strip without stars
    const w = window.innerWidth, h = Math.max(window.innerHeight, window.screen?.height ?? 0);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.height = `${h}px`;
    const c = canvas.getContext("2d");
    if (!c) return;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, w, h);
    const rnd = seededRandom(1234567);
    const count = Math.round(w * h / 1700);
    for (let i = 0; i < count; i++) {
        const x = rnd() * w, y = rnd() * h, k = rnd(), a = 0.2 + rnd() * 0.65;
        const size = k > 0.992 ? 1.8 : k > 0.94 ? 1.2 : 0.8;
        // A few blue giants and warm dwarfs among the white stars
        c.fillStyle = k > 0.975 ? `rgba(180,205,255,${a})` : k < 0.03 ? `rgba(255,228,190,${a})` : `rgba(255,255,255,${a})`;
        c.fillRect(x, y, size, size);
    }
}

function addTwinkles(container: HTMLElement): void {
    const rnd = seededRandom(98765);
    for (let i = 0; i < 26; i++) {
        const star = document.createElement("span");
        star.className = "tw";
        star.style.left = `${(rnd() * 100).toFixed(2)}%`;
        star.style.top = `${(rnd() * 100).toFixed(2)}%`;
        star.style.setProperty("--dur", `${(2 + rnd() * 3).toFixed(2)}s`);
        star.style.setProperty("--del", `${(-rnd() * 5).toFixed(2)}s`);
        container.appendChild(star);
    }
}

export function mountSky(canvas: HTMLCanvasElement, twinkles: HTMLElement): void {
    drawStars(canvas);
    addTwinkles(twinkles);
    let width = window.innerWidth;
    let timer: ReturnType<typeof setTimeout> | undefined;
    window.addEventListener("resize", () => {
        // Only a change of width re-draws: on phones the height changes with
        // every scroll, as the toolbar slides in and out
        if (window.innerWidth === width) return;
        width = window.innerWidth;
        clearTimeout(timer);
        timer = setTimeout(() => drawStars(canvas), 150);
    });
}
