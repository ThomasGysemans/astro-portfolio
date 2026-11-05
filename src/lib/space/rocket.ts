// The rocket of the quote section: it waits on its launch pad next to the form,
// vents a little more once the required fields are valid, and lifts off when
// the form is sent. The model (rocket.glb, 308 flat-shaded triangles) is
// fetched a little before the section scrolls into view. One shader lights the
// hull, a second one draws the smoke and the engine glow as soft sprites.
//
// The pad is drawn in SVG by the page (viewBox 220 x 360); its geometry is
// mirrored here: rocket axis at x = 140, deck at y = 300.
import { camera, CORNERS, fetchModel, fitCanvas, glProgram, parseGLB, PRECISION, webgl, type Model } from "./gl";
import { motionOK, onMotionChange } from "@lib/motion";
import { wake } from "./loop";

const MESH_VS = [
    "attribute vec3 aPos; attribute vec3 aNor;",
    "uniform mat4 uVP; uniform mat4 uM; uniform vec4 uFl;",
    "varying vec3 vN; varying vec3 vW;",
    "void main() {",
    "  vec3 p = aPos;",
    // The flame stretches from the nozzle: x = is flame, y = its origin, z = length, w = width
    "  if (uFl.x > 0.5) { p.y = uFl.y + (p.y - uFl.y) * uFl.z; p.xz *= uFl.w; }",
    "  vec4 w = uM * vec4(p, 1.0); vW = w.xyz; vN = (uM * vec4(aNor, 0.0)).xyz;",
    "  gl_Position = uVP * w;",
    "}",
].join("\n");
// Flat shading: a warm key light from the upper left, a night sky ambient (blue
// above, dark below), the engine lighting the underside, and a blue rim so the
// hull belongs to the page.
const MESH_FS = [
    PRECISION,
    "uniform vec3 uCol; uniform float uUnlit; uniform float uA; uniform vec3 uEye; uniform float uFire;",
    "varying vec3 vN; varying vec3 vW;",
    "void main() {",
    "  vec3 c = uCol;",
    "  if (uUnlit < 0.5) {",
    "    vec3 n = normalize(vN), v = normalize(uEye - vW);",
    "    float key = max(dot(n, normalize(vec3(-0.55, 0.62, 0.56))), 0.0);",
    "    vec3 sky = mix(vec3(0.03, 0.045, 0.1), vec3(0.15, 0.21, 0.4), n.y * 0.5 + 0.5);",
    "    c = uCol * (sky + vec3(1.05, 1.0, 0.94) * key + vec3(1.0, 0.5, 0.2) * max(-n.y, 0.0) * uFire);",
    "    c += vec3(0.22, 0.42, 1.0) * pow(1.0 - max(dot(n, v), 0.0), 3.0) * 0.6;",
    "  }",
    "  gl_FragColor = vec4(pow(c, vec3(0.4545)) * uA, uA);",
    "}",
].join("\n");
// Soft round sprites; uAdd = 1 turns them into added light (alpha 0 in a
// premultiplied canvas)
const SPRITE_VS = [
    "attribute vec2 aP; attribute vec2 aC; attribute vec3 aD;",
    "uniform vec2 uRes; varying vec2 vC; varying vec2 vD;",
    "void main() { vC = aC; vD = aD.yz; gl_Position = vec4((aP + aC * aD.x) / uRes * 2.0 - 1.0, 0.0, 1.0); }",
].join("\n");
const SPRITE_FS = [
    "precision mediump float;",
    "uniform vec3 uCool; uniform vec3 uWarm; uniform float uAdd; varying vec2 vC; varying vec2 vD;",
    "void main() {",
    "  float d = dot(vC, vC); if (d > 1.0) discard;",
    "  float a = vD.x * (1.0 - d) * (1.0 - d);",
    "  gl_FragColor = vec4(mix(uCool, uWarm, vD.y) * a, a * (1.0 - uAdd));",
    "}",
].join("\n");

const MAX_SPRITES = 300;
const SMOKE_COOL = [0.55, 0.63, 0.82], SMOKE_WARM = [1, 0.72, 0.45], GLOW_OUT = [1, 0.42, 0.12], GLOW_CORE = [1, 0.86, 0.6];
// Height of the nozzle on the model's axis, in model units
const NOZZLE = -1.8;

type Pose = { x: number, y: number, s: number, tilt: number, roll: number, flame: number, alpha: number };
type Sprite = { x: number, y: number, size: number, alpha: number, warm: number };

function flicker(t: number): number {
    return 1 + 0.07 * Math.sin(t * 37) + 0.05 * Math.sin(t * 23 + 1.3) + 0.06 * (Math.random() - 0.5);
}

function makeScene(canvas: HTMLCanvasElement, model: Model) {
    const gl = webgl(canvas);
    if (!gl) return null;
    const mesh = glProgram(gl, MESH_VS, MESH_FS, ["aPos", "aNor"]);
    const sprite = glProgram(gl, SPRITE_VS, SPRITE_FS, ["aP", "aC", "aD"]);
    if (!mesh || !sprite) return null;
    const mu = mesh.uniforms, su = sprite.uniforms;

    // The whole model in one interleaved buffer (position, normal), one draw call per part
    let count = 0;
    for (const p of model.parts) count += p.pos.length / 3;
    const data = new Float32Array(count * 6);
    const ranges: { start: number, count: number, col: number[], unlit: boolean, flame: boolean }[] = [];
    let at = 0;
    for (const p of model.parts) {
        const n = p.pos.length / 3;
        for (let i = 0; i < n; i++) {
            for (let k = 0; k < 3; k++) {
                data[(at + i) * 6 + k] = p.pos[i * 3 + k];
                data[(at + i) * 6 + 3 + k] = p.nor[i * 3 + k];
            }
        }
        ranges.push({ start: at, count: n, col: p.base, unlit: p.unlit, flame: p.flame });
        at += n;
    }
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    const spriteData = new Float32Array(MAX_SPRITES * 42), sbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sbo);
    gl.bufferData(gl.ARRAY_BUFFER, spriteData.byteLength, gl.DYNAMIC_DRAW);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    let w = 0, h = 0, cam = camera(1, 1);

    // translate * rotateZ(tilt) * rotateY(roll) * scale
    function modelOf(r: Pose): Float32Array {
        const cz = Math.cos(r.tilt), sz = Math.sin(r.tilt), cy = Math.cos(r.roll), sy = Math.sin(r.roll), s = r.s;
        return new Float32Array([cz * cy * s, sz * cy * s, -sy * s, 0, -sz * s, cz * s, 0, 0, cz * sy * s, sz * sy * s, cy * s, 0, r.x, r.y, 0, 1]);
    }

    function sprites(list: Sprite[], cool: number[], warm: number[], add: number): void {
        const n = Math.min(list.length, MAX_SPRITES);
        if (!gl || !n) return;
        let k = 0;
        for (let i = 0; i < n; i++) {
            const p = list[i];
            for (let c = 0; c < 6; c++) {
                spriteData[k++] = p.x; spriteData[k++] = p.y;
                spriteData[k++] = CORNERS[c * 2]; spriteData[k++] = CORNERS[c * 2 + 1];
                spriteData[k++] = p.size; spriteData[k++] = p.alpha; spriteData[k++] = p.warm;
            }
        }
        gl.useProgram(sprite!.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, sbo);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, spriteData.subarray(0, k));
        gl.enableVertexAttribArray(2);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 28, 0);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 28, 8);
        gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 28, 16);
        gl.uniform2f(su.uRes, w, h);
        gl.uniform3fv(su.uCool, cool);
        gl.uniform3fv(su.uWarm, warm);
        gl.uniform1f(su.uAdd, add);
        gl.drawArrays(gl.TRIANGLES, 0, n * 6);
    }

    return {
        get w() { return w; },
        get h() { return h; },
        resize(width: number, height: number) {
            fitCanvas(gl, canvas, width, height, 2.5e6);
            w = width; h = height; cam = camera(width, height);
        },
        // Where a point of the rocket axis lands on the canvas (CSS px, y up):
        // the nozzle, for the exhaust
        axis(r: Pose, ly: number) {
            const m = modelOf(r), x = m[4] * ly + m[12], y = m[5] * ly + m[13], v = cam.vp;
            const cx = v[0] * x + v[4] * y + v[12], cy = v[1] * x + v[5] * y + v[13], cw = v[3] * x + v[7] * y + v[15];
            return { x: (cx / cw + 1) / 2 * w, y: (cy / cw + 1) / 2 * h };
        },
        // Smoke behind, then the rocket (depth tested), then the engine glow added on top
        draw(rockets: Pose[], smoke: Sprite[], glow: Sprite[]) {
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.enableVertexAttribArray(0);
            gl.enableVertexAttribArray(1);
            gl.disable(gl.DEPTH_TEST);
            sprites(smoke, SMOKE_COOL, SMOKE_WARM, 0);
            gl.useProgram(mesh.program);
            gl.enable(gl.DEPTH_TEST);
            gl.disableVertexAttribArray(2);
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
            gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0);
            gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12);
            gl.uniformMatrix4fv(mu.uVP, false, cam.vp);
            gl.uniform3fv(mu.uEye, cam.eye);
            for (const r of rockets) {
                if (r.alpha < 0.01) continue;
                gl.uniformMatrix4fv(mu.uM, false, modelOf(r));
                gl.uniform1f(mu.uA, r.alpha);
                gl.uniform1f(mu.uFire, Math.min(1, r.flame));
                for (const g of ranges) {
                    if (g.flame && r.flame < 0.04) continue;
                    gl.uniform4f(mu.uFl, g.flame ? 1 : 0, model.flameY, r.flame, 0.75 + 0.25 * Math.min(1, r.flame));
                    gl.uniform3f(mu.uCol, g.col[0], g.col[1], g.col[2]);
                    gl.uniform1f(mu.uUnlit, g.unlit ? 1 : 0);
                    gl.drawArrays(gl.TRIANGLES, g.start, g.count);
                }
            }
            gl.disable(gl.DEPTH_TEST);
            sprites(glow, GLOW_OUT, GLOW_CORE, 1);
        },
    };
}

type Puff = {
    x: number, y: number, vx: number, vy: number, s0: number, s1: number,
    life: number, a: number, warm: number, drag: number, lift: number, age: number,
};

// Smoke puffs: they grow, slow down, cool from orange to blue grey, then fade
class Smoke {
    list: Puff[] = [];
    constructor(private max: number) {}

    emit(x: number, y: number, vx: number, vy: number, s0: number, s1: number, life: number, a: number, warm: number, drag: number, lift: number): void {
        if (this.list.length >= this.max) this.list.shift();
        this.list.push({ x, y, vx, vy, s0, s1, life, a, warm, drag, lift, age: 0 });
    }

    step(dt: number): void {
        this.list = this.list.filter(p => {
            p.age += dt;
            if (p.age >= p.life) return false;
            const k = Math.exp(-p.drag * dt);
            p.vx *= k;
            p.vy = p.vy * k + p.lift * dt;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            return true;
        });
    }

    sprites(): Sprite[] {
        return this.list.map(p => {
            const t = p.age / p.life;
            return {
                x: p.x,
                y: p.y,
                size: p.s0 + (p.s1 - p.s0) * (1 - (1 - t) * (1 - t)),
                alpha: p.a * (t < 0.1 ? t / 0.1 : Math.pow((1 - t) / 0.9, 1.5)),
                warm: p.warm * Math.max(0, 1 - t * 3),
            };
        });
    }
}

function flameGlow(p: { x: number, y: number }, S: number, f: number, tilt: number): Sprite[] {
    const dx = Math.sin(tilt), dy = -Math.cos(tilt);
    return [
        { x: p.x + dx * 0.9 * S * f, y: p.y + dy * 0.9 * S * f, size: 2.6 * S * f, alpha: 0.32, warm: 0.15 },
        { x: p.x + dx * 0.35 * S * f, y: p.y + dy * 0.35 * S * f, size: 0.95 * S * f, alpha: 0.6, warm: 1 },
    ];
}

export type LaunchPad = {
    launch(): void, // the form was sent
    reset(): void, // back on the pad, to edit the request
    setReady(ready: boolean): void, // every required field is valid
};

export function mountLaunchPad(section: HTMLElement, canvas: HTMLCanvasElement, padEl: HTMLElement): LaunchPad {
    type Phase = "idle" | "launch" | "lit" | "gone";
    let scene: ReturnType<typeof makeScene> = null;
    let loading = false, visible = false, ready = false, lastFrame = 0;
    let phase: Phase = "idle", t = 0, fade = 1, acc = 0, accGround = 0;
    let L: { S: number, x: number, deck: number, y: number } | null = null;
    const smoke = new Smoke(260);

    function layout(): void {
        if (!scene) return;
        const sec = section.getBoundingClientRect(), box = padEl.getBoundingClientRect(), k = box.width / 220;
        // The canvas is a strip centred on the pad, not the whole section
        const axisX = box.left - sec.left + 140 * k, W = Math.min(sec.width, 820);
        const left = Math.min(Math.max(axisX - W / 2, 0), sec.width - W);
        canvas.style.left = `${left}px`;
        canvas.style.width = `${W}px`;
        scene.resize(W, section.clientHeight);
        const S = 250 * k / 3.78, deck = scene.h - (box.top - sec.top + 300 * k);
        L = { S, x: axisX - left, deck, y: deck + 1.78 * S };
    }

    function pose(still: boolean): Pose {
        const r: Pose = { x: L!.x, y: L!.y, s: L!.S, tilt: 0, roll: 0.55, flame: 0, alpha: fade };
        if (phase === "lit") r.flame = 1;
        if (phase === "launch") {
            r.flame = Math.min(Math.max(t / 0.45, 0), 1) * 1.3 * (still ? 1 : flicker(t));
            const ft = t - 1.2;
            if (ft > 0) {
                r.y += 300 * ft * ft;
                r.x += 6 * ft * ft;
                r.tilt = -0.03 * ft * ft;
            }
        }
        return r;
    }

    function step(dt: number): Pose {
        const { S, x, y, deck } = L!;
        const rnd = Math.random;
        t += dt;
        if (fade < 1) fade = Math.min(1, fade + dt / 0.6);
        const r = pose(false);
        if (phase === "idle") {
            acc += dt * (ready ? 9 : 3.5);
            while (acc >= 1) {
                acc -= 1;
                const side = rnd() < 0.5 ? -1 : 1;
                smoke.emit(x + side * (0.5 + rnd() * 0.15) * S, y - (0.4 + rnd() * 0.9) * S, side * (14 + rnd() * 24), 4 + rnd() * 8, 0.07 * S, (0.35 + rnd() * 0.25) * S, 2 + rnd(), 0.13, 0, 0.4, 4);
            }
        } else if (phase === "launch" && scene) {
            const out = r.y - 4 * S > scene.h, nozzle = scene.axis(r, NOZZLE);
            if (t > 0.15 && t < 2.8) {
                // the ground cloud, pushed sideways along the deck
                accGround += dt * 60;
                while (accGround >= 1) {
                    accGround -= 1;
                    const side = rnd() < 0.5 ? -1 : 1;
                    smoke.emit(x + (rnd() - 0.5) * 0.5 * S, deck + rnd() * 0.15 * S, side * (60 + rnd() * 200), 6 + rnd() * 26, 0.3 * S, (1.1 + rnd() * 0.9) * S, 2.4 + rnd() * 1.2, 0.2, 0.85, 1.1, 8);
                }
            }
            if (t > 1.2 && !out) {
                acc += dt * 40;
                while (acc >= 1) {
                    acc -= 1;
                    smoke.emit(nozzle.x + (rnd() - 0.5) * 0.25 * S, nozzle.y, (rnd() - 0.5) * 30, -(90 + rnd() * 60), 0.2 * S, (0.7 + rnd() * 0.5) * S, 1.8 + rnd() * 0.8, 0.16, 0.9, 0.8, 0);
                }
            }
            if (t > 3.2) padEl.classList.remove("firing");
            if (out && smoke.list.length === 0) phase = "gone";
        }
        smoke.step(dt);
        return r;
    }

    function draw(r: Pose): void {
        if (!scene || !L) return;
        let glow: Sprite[] = [];
        if (r.flame > 0.04) {
            glow = flameGlow(scene.axis(r, NOZZLE), r.s, r.flame, r.tilt);
            const near = Math.max(0, 1 - (r.y - L.y) / (5 * r.s));
            if (near > 0) glow.push({ x: L.x, y: L.deck, size: 3.6 * r.s, alpha: 0.3 * near * Math.min(1, r.flame), warm: 0.3 });
        }
        scene.draw(phase === "gone" ? [] : [r], smoke.sprites(), glow);
    }

    // Without motion: one still frame, the rocket on its pad (or gone)
    function drawStill(): void {
        if (!scene || !L) return;
        if (phase === "launch") {
            phase = "gone";
            padEl.classList.remove("firing");
        }
        smoke.list = [];
        fade = 1;
        draw(pose(true));
    }

    function active(): boolean {
        return !!scene && !!L && (visible || phase === "launch");
    }

    function tick(now: number): boolean {
        if (!active()) return false;
        if (now - lastFrame >= 33) {
            const dt = Math.min(0.1, lastFrame ? (now - lastFrame) / 1000 : 0.033);
            lastFrame = now;
            if (phase !== "gone") draw(step(dt));
        }
        return active();
    }

    function start(): void {
        if (motionOK()) {
            lastFrame = 0;
            wake(tick);
        } else {
            drawStill();
        }
    }

    function init(): void {
        if (scene || loading) return;
        loading = true;
        fetchModel("rocket").then(buffer => {
            scene = makeScene(canvas, parseGLB(buffer));
            layout();
            start();
        }).catch(() => {
            // No rocket: the pad stays a drawing, the form works the same
        }).finally(() => {
            loading = false;
        });
    }

    if ("IntersectionObserver" in window) {
        new IntersectionObserver(entries => {
            visible = entries[0].isIntersecting;
            if (visible) init();
            if (visible && scene) start();
        }).observe(section);
        // Fetched a little before it scrolls into view
        const near = new IntersectionObserver(entries => {
            if (!entries[0].isIntersecting) return;
            init();
            near.disconnect();
        }, { rootMargin: "800px 0px" });
        near.observe(section);
    } else {
        visible = true;
        init();
    }

    // The section changes size with the window but also with its own content
    // (the textarea dragged taller, an error message): the canvas fills it, so
    // its pixels must follow, or the browser stretches the last frame. Done
    // right in the observer, which runs between layout and paint, and redrawn
    // at once since resizing a canvas clears it: no stretched or blank frame.
    new ResizeObserver(() => {
        layout();
        if (!motionOK()) drawStill();
        else if (L) draw(pose(false));
    }).observe(section);
    document.fonts?.ready.then(() => {
        layout();
        if (!motionOK()) drawStill();
    });
    onMotionChange(on => {
        if (on) start();
        else drawStill();
    });

    return {
        launch() {
            padEl.classList.add("launched");
            t = 0; acc = 0; accGround = 0;
            // Sent before the model even arrived: the rocket is simply already gone
            if (!scene) {
                phase = "gone";
                return;
            }
            layout();
            if (!motionOK()) {
                phase = "lit";
                drawStill();
                return;
            }
            phase = "launch";
            padEl.classList.add("firing");
            start();
        },
        reset() {
            padEl.classList.remove("launched", "firing");
            phase = "idle";
            t = 0;
            smoke.list = [];
            fade = motionOK() ? 0 : 1;
            layout();
            start();
        },
        setReady(value: boolean) {
            ready = value;
        },
    };
}
