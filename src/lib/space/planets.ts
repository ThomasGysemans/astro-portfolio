// The planets behind the pages: one canvas fixed behind the content (above the
// stars), where each body is pinned to a point of the page, drifts slower than
// it (parallax, so it looks far away) and spins on its own tilted axis.
//
// Nothing here competes with the first paint: the WebGL context is created once
// the page has loaded and the browser is idle, and each model (a small GLB
// file in /public/models) is fetched only when its body comes within about a
// screen of being seen, one at a time.
//
// The pause button stops the spin only. The parallax follows the scroll, not a
// clock, so it stays (pausing never makes the planets jump); only the system
// "reduce motion" setting turns it off, from the first frame, and the planets
// then scroll with the page like a picture.
import { afterLoad, camera, chain, CORNERS, fetchModel, fitCanvas, glProgram, mul4, parseGLB, PRECISION, rotX, rotY, rotZ, scale, translate, webgl, type Camera, type Mat4, type Model } from "./gl";
import { motionOK, onMotionChange, systemReducesMotion } from "@lib/motion";
import { wake } from "./loop";

export type PlanetName = "neptune" | "uranus" | "saturn" | "jupiter" | "mars" | "earth" | "moon";

// Where a body sits, decided by each page.
export type PlanetPlacement = {
    name: PlanetName,
    anchor: string, // CSS selector of the element the body is pinned to
    at: number, // fraction of that element's height
    x: number, // fraction of the screen width
    mAt?: number, // the same two on phones (under 640px)
    mx?: number,
    f?: number, // parallax factor: 1 scrolls with the page, lower looks farther
};

type MoonPreset = { size: number, orbit: number, speed: number, phase: number, incl: number, roll: number };

// What a body looks like and how it moves, the same on every page. `size` is
// in units of about 6% of the screen width; `ext` is how far it reaches (rings,
// the Moon's orbit) in radii; `spin` is in radians per second, negative when
// retrograde; `pitch` and `yaw` turn it towards the viewer (rings opened).
type Preset = {
    size: number, f: number, spin: number, phase: number, pitch: number, yaw: number,
    atm: [number, number, number], rim: number, glow: number, ext: number,
    moon?: MoonPreset,
};

const PRESETS: Record<PlanetName, Preset> = {
    neptune: { size: 1.15, f: 0.55, spin: 0.16, phase: 0.4, pitch: 0.3, yaw: 0, atm: [0.3, 0.5, 1], rim: 0.75, glow: 0.4, ext: 1.6 },
    uranus: { size: 0.8, f: 0.6, spin: -0.15, phase: 1.2, pitch: 0.2, yaw: 0.65, atm: [0.45, 0.85, 0.95], rim: 0.6, glow: 0.3, ext: 1.9 },
    saturn: { size: 1, f: 0.6, spin: 0.22, phase: 0, pitch: 0.42, yaw: 0, atm: [1, 0.86, 0.62], rim: 0.35, glow: 0.14, ext: 2.4 },
    jupiter: { size: 1.9, f: 0.55, spin: 0.24, phase: 2.1, pitch: 0.12, yaw: 0, atm: [1, 0.82, 0.58], rim: 0.35, glow: 0.12, ext: 1.6 },
    mars: { size: 0.62, f: 0.7, spin: 0.14, phase: 0.8, pitch: 0.2, yaw: 0, atm: [1, 0.52, 0.32], rim: 0.45, glow: 0.14, ext: 1.6 },
    earth: {
        size: 1.25, f: 0.75, spin: 0.11, phase: 3.6, pitch: 0.2, yaw: 0, atm: [0.3, 0.56, 1], rim: 0.85, glow: 0.42, ext: 2.4,
        moon: { size: 0.32, orbit: 2, speed: 0.17, phase: 0.5, incl: 0.3, roll: -0.16 },
    },
    moon: { size: 0.8, f: 0.6, spin: 0.05, phase: 2.4, pitch: 0.1, yaw: 0, atm: [0.6, 0.65, 0.75], rim: 0.2, glow: 0.1, ext: 1.6 },
};

const PLANET_VS = [
    "attribute vec3 aPos; attribute vec3 aNor; attribute vec3 aCol;",
    "uniform mat4 uVP; uniform mat4 uM;",
    "varying vec3 vN; varying vec3 vW; varying vec3 vC;",
    "void main() { vec4 w = uM * vec4(aPos, 1.0); vW = w.xyz; vN = (uM * vec4(aNor, 0.0)).xyz; vC = aCol; gl_Position = uVP * w; }",
].join("\n");
// One sun for the whole page (upper left, like the rocket's key light), a night
// blue ambient for the dark side, an atmosphere on the lit limb. Rings are lit
// from both faces and darkened where the planet stands between them and the sun.
const PLANET_FS = [
    PRECISION,
    "uniform vec3 uSun; uniform vec3 uEye; uniform vec3 uAtm; uniform vec3 uCtr; uniform float uRad; uniform float uRing; uniform float uA; uniform float uDim;",
    "varying vec3 vN; varying vec3 vW; varying vec3 vC;",
    "void main() {",
    "  vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n;",
    "  float d = dot(n, uSun); vec3 amb = vec3(0.03, 0.045, 0.1), c;",
    "  if (uRing > 0.5) {",
    "    vec3 oc = vW - uCtr; float b = dot(oc, uSun), h = b * b - dot(oc, oc) + uRad * uRad;",
    "    float shade = b < 0.0 ? 1.0 - 0.85 * smoothstep(-0.02, 0.08, h / (uRad * uRad)) : 1.0;",
    "    c = vC * (amb + vec3(1.0, 0.97, 0.92) * (0.3 + 0.7 * abs(d)) * shade);",
    "  } else {",
    "    c = vC * (amb + vec3(1.05, 1.0, 0.94) * max(d, 0.0));",
    "    float rim = pow(1.0 - max(dot(n, normalize(uEye - vW)), 0.0), 2.5);",
    "    c += uAtm * rim * (0.15 + 0.85 * smoothstep(-0.2, 0.5, d));",
    "  }",
    "  gl_FragColor = vec4(pow(c * uDim, vec3(0.4545)) * uA, uA);",
    "}",
].join("\n");
// A soft halo around the bodies with an atmosphere, brighter on the sunny side.
// It is added light: alpha 0 in a premultiplied canvas, so it brightens the
// stars behind instead of covering them.
const HALO_VS = [
    "attribute vec2 aQ; uniform vec2 uRes; uniform vec3 uC; varying vec2 vQ;",
    "void main() { vQ = aQ; gl_Position = vec4((uC.xy + aQ * uC.z) / uRes * 2.0 - 1.0, 0.0, 1.0); }",
].join("\n");
const HALO_FS = [
    PRECISION,
    "uniform vec3 uCol; uniform float uIn; uniform vec2 uSun; varying vec2 vQ;",
    "void main() {",
    "  float d = length(vQ); if (d > 1.0) discard;",
    "  float t = clamp((d - uIn) / (1.0 - uIn), 0.0, 1.0), k = (1.0 - t) * (1.0 - t) * (1.0 - t);",
    "  gl_FragColor = vec4(uCol * k * (0.5 + 0.5 * dot(vQ / max(d, 0.001), uSun)), 0.0);",
    "}",
].join("\n");

const SUN = normalize([-0.74, 0.42, 0.52]);
const SUN2 = normalize([SUN[0], SUN[1]]);

function normalize(v: number[]): number[] {
    const l = Math.hypot(...v);
    return v.map(x => x / l);
}

type Mesh = { vbo: WebGLBuffer, ranges: { start: number, count: number, ring: boolean }[], radius: number, root: Mat4 };

type DrawItem = {
    mesh: Mesh, M: Mat4, x: number, y: number, z?: number, rad: number,
    atm: number[], rim: number, glow: number, alpha: number, dim: number,
};

function makeScene(canvas: HTMLCanvasElement) {
    const gl = webgl(canvas, true);
    if (!gl) return null;
    const body = glProgram(gl, PLANET_VS, PLANET_FS, ["aPos", "aNor", "aCol"]);
    const halo = glProgram(gl, HALO_VS, HALO_FS, ["aQ"]);
    if (!body || !halo) return null;
    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(CORNERS), gl.STATIC_DRAW);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    let w = 0, h = 0, cam: Camera = camera(1, 1);
    const b = body.uniforms, hu = halo.uniforms;

    return {
        get w() { return w; },
        get h() { return h; },
        resize(width: number, height: number) {
            fitCanvas(gl, canvas, width, height, 2.2e6);
            w = width; h = height; cam = camera(width, height);
        },
        // One upload per model: position, normal and colour interleaved, one
        // range per part (body, rings). The radius of the body (rings left out)
        // lets every planet be sized in pixels.
        add(model: Model): Mesh {
            let count = 0;
            for (const p of model.parts) count += p.pos.length / 3;
            const data = new Float32Array(count * 9);
            const ranges: Mesh["ranges"] = [];
            let at = 0, radius = 0;
            for (const p of model.parts) {
                const n = p.pos.length / 3;
                for (let i = 0; i < n; i++) {
                    for (let k = 0; k < 3; k++) {
                        data[(at + i) * 9 + k] = p.pos[i * 3 + k];
                        data[(at + i) * 9 + 3 + k] = p.nor[i * 3 + k];
                        data[(at + i) * 9 + 6 + k] = p.col ? p.col[i * 3 + k] : p.base[k];
                    }
                    if (!p.ring) radius = Math.max(radius, Math.hypot(p.pos[i * 3], p.pos[i * 3 + 1], p.pos[i * 3 + 2]));
                }
                ranges.push({ start: at, count: n, ring: p.ring });
                at += n;
            }
            const vbo = gl.createBuffer()!;
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
            gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
            return { vbo, ranges, radius: radius || 1, root: model.root };
        },
        clear() {
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        },
        // The halos first, then the bodies (depth tested, so the Moon can pass
        // behind the Earth)
        draw(items: DrawItem[]) {
            this.clear();
            gl.disable(gl.DEPTH_TEST);
            gl.useProgram(halo.program);
            gl.bindBuffer(gl.ARRAY_BUFFER, quad);
            gl.enableVertexAttribArray(0);
            gl.disableVertexAttribArray(1);
            gl.disableVertexAttribArray(2);
            gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
            gl.uniform2f(hu.uRes, w, h);
            gl.uniform2f(hu.uSun, SUN2[0], SUN2[1]);
            for (const it of items) {
                if (!it.glow) continue;
                const size = it.rad * 1.55, k = it.glow * it.alpha * it.dim;
                gl.uniform3f(hu.uC, it.x, it.y, size);
                gl.uniform1f(hu.uIn, it.rad / size);
                gl.uniform3f(hu.uCol, it.atm[0] * k, it.atm[1] * k, it.atm[2] * k);
                gl.drawArrays(gl.TRIANGLES, 0, 6);
            }
            gl.useProgram(body.program);
            gl.enable(gl.DEPTH_TEST);
            gl.enableVertexAttribArray(1);
            gl.enableVertexAttribArray(2);
            gl.uniformMatrix4fv(b.uVP, false, cam.vp);
            gl.uniform3fv(b.uEye, cam.eye);
            gl.uniform3fv(b.uSun, SUN);
            for (const it of items) {
                gl.bindBuffer(gl.ARRAY_BUFFER, it.mesh.vbo);
                gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 36, 0);
                gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 36, 12);
                gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 36, 24);
                gl.uniformMatrix4fv(b.uM, false, it.M);
                gl.uniform3f(b.uCtr, it.x, it.y, it.z ?? 0);
                gl.uniform1f(b.uRad, it.rad * 0.97);
                gl.uniform3f(b.uAtm, it.atm[0] * it.rim, it.atm[1] * it.rim, it.atm[2] * it.rim);
                gl.uniform1f(b.uA, it.alpha);
                gl.uniform1f(b.uDim, it.dim);
                for (const g of it.mesh.ranges) {
                    gl.uniform1f(b.uRing, g.ring ? 1 : 0);
                    gl.drawArrays(gl.TRIANGLES, g.start, g.count);
                }
            }
            gl.disable(gl.DEPTH_TEST);
        },
    };
}

type Body = PlanetPlacement & Preset & {
    node: Element | null,
    state: "idle" | "loading" | "ready" | "failed",
    alpha: number,
    fresh: boolean,
    mesh: Mesh | null,
    moonMesh: Mesh | null,
};

function smooth(t: number): number {
    return t * t * (3 - 2 * t);
}

export function mountPlanets(canvas: HTMLCanvasElement, placements: PlanetPlacement[]): void {
    if (placements.length === 0) return;
    const bodies: Body[] = placements.map(placement => ({
        ...PRESETS[placement.name],
        ...placement,
        f: placement.f ?? PRESETS[placement.name].f,
        node: document.querySelector(placement.anchor),
        state: "idle",
        alpha: 0,
        fresh: false,
        mesh: null,
        moonMesh: null,
    }));

    let scene: ReturnType<typeof makeScene> = null;
    let clock = 0, last = performance.now(), drawnAt = -1e9;
    let loading = false, onScreen = false, clean = true;

    function load(b: Body): void {
        if (!scene) return;
        const s = scene;
        loading = true;
        b.state = "loading";
        const names = b.moon ? [b.name, "moon"] : [b.name];
        Promise.all(names.map(fetchModel)).then(buffers => {
            b.mesh = s.add(parseGLB(buffers[0], true));
            if (b.moon) b.moonMesh = s.add(parseGLB(buffers[1], true));
            b.state = "ready";
            b.fresh = true;
        }).catch(() => {
            b.state = "failed";
        }).finally(() => {
            loading = false;
            refresh();
        });
    }

    function draw(): void {
        if (!scene) return;
        const now = performance.now();
        const moving = motionOK();
        const dt = Math.max(0, Math.min(0.1, (now - last) / 1000));
        last = now;
        drawnAt = now;
        if (moving) clock += dt;

        const vw = scene.w, vh = scene.h, narrow = vw < 640;
        const unit = Math.min(92, Math.max(40, vw * 0.06)), dim = narrow ? 0.7 : 1;
        const parallax = !systemReducesMotion();
        const items: DrawItem[] = [];
        let next: Body | null = null;

        for (const b of bodies) {
            if (!b.node) continue;
            const box = b.node.getBoundingClientRect();
            const anchor = box.top + box.height * (narrow ? b.mAt ?? b.at : b.at);
            // Pinned to its anchor when that point crosses the middle of the
            // screen, slower than the page everywhere else
            const y = vh / 2 + (anchor - vh / 2) * (parallax ? b.f : 1);
            const x = vw * (narrow ? b.mx ?? b.x : b.x), R = unit * b.size, ext = R * b.ext;
            const visible = y + ext > 0 && y - ext < vh && x + ext > 0 && x - ext < vw;
            // The next model to fetch: the first one within about a screen of being seen
            if (b.state === "idle" && !next && y + ext > -vh && y - ext < vh * 2) next = b;
            if (b.state !== "ready" || !b.mesh) continue;
            // Loaded while on screen: fade in. Loaded ahead of time: just there.
            if (b.fresh) { b.alpha = visible && moving ? 0 : 1; b.fresh = false; }
            if (!visible) continue;
            if (b.alpha < 1) b.alpha = moving ? Math.min(1, b.alpha + dt / 1.2) : 1;

            const gy = vh - y, a = smooth(b.alpha);
            items.push({
                mesh: b.mesh, x, y: gy, rad: R, atm: b.atm, rim: b.rim, glow: b.glow, alpha: a, dim,
                M: chain([translate(x, gy, 0), scale(R / b.mesh.radius), rotY(b.yaw), rotX(b.pitch), b.mesh.root, rotY(b.phase + clock * b.spin)]),
            });
            const m = b.moon;
            if (m && b.moonMesh) {
                // Tidally locked: it turns once per orbit, always showing the
                // Earth the same face
                const th = m.phase + clock * m.speed, O = mul4(rotZ(m.roll), rotX(m.incl)), r = R * m.orbit;
                const ox = Math.cos(th) * r, oz = Math.sin(th) * r;
                const mx = x + O[0] * ox + O[8] * oz, my = gy + O[1] * ox + O[9] * oz, mz = O[2] * ox + O[10] * oz, mr = R * m.size;
                items.push({
                    mesh: b.moonMesh, x: mx, y: my, z: mz, rad: mr, atm: [0.6, 0.65, 0.75], rim: 0.15, glow: 0, alpha: a, dim,
                    M: chain([translate(mx, my, mz), scale(mr / b.moonMesh.radius), O, b.moonMesh.root, rotY(Math.PI - th)]),
                });
            }
        }

        onScreen = items.length > 0;
        if (onScreen) {
            scene.draw(items);
            clean = false;
        } else if (!clean) {
            scene.clear();
            clean = true;
        }
        if (next && !loading) load(next);
    }

    // The spin, at about 30 frames per second while something is on screen
    function tick(): boolean {
        if (!scene) return false;
        if (performance.now() - drawnAt > 30) draw();
        return onScreen;
    }

    // Scroll, resize, a model arriving: redraw now (once per frame at most),
    // and keep the spin going while something is on screen
    function refresh(): void {
        if (!scene) return;
        if (performance.now() - drawnAt > 4) draw();
        if (onScreen && motionOK()) wake(tick);
    }

    function resize(): void {
        scene?.resize(canvas.clientWidth, canvas.clientHeight);
    }

    afterLoad(() => {
        scene = makeScene(canvas);
        if (!scene) return;
        resize();
        refresh();
    });

    let scrollQueued = false;
    window.addEventListener("scroll", () => {
        if (scrollQueued) return;
        scrollQueued = true;
        requestAnimationFrame(() => {
            scrollQueued = false;
            refresh();
        });
    }, { passive: true });

    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => { resize(); refresh(); }, 150);
    });

    // An FAQ answer opening moves everything below it
    document.addEventListener("toggle", refresh, true);
    onMotionChange(refresh);
    matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", refresh);
}
