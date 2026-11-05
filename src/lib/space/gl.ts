// The small WebGL toolkit behind the planets and the launch pad, written by
// hand rather than pulling three.js into the pages: the models are a few
// hundred flat-shaded triangles, and three.js on the initial load is what used
// to cost the homepage 30 points of mobile Lighthouse score.

export type Mat4 = Float32Array;

// 4x4 matrices, column major like WebGL expects
export function mul4(a: Mat4, b: Mat4): Mat4 {
    const o = new Float32Array(16);
    for (let c = 0; c < 4; c++) {
        for (let r = 0; r < 4; r++) {
            o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
        }
    }
    return o;
}

export function chain(list: Mat4[]): Mat4 {
    return list.reduce(mul4);
}

export function translate(x: number, y: number, z: number): Mat4 {
    return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]);
}

export function scale(s: number): Mat4 {
    return new Float32Array([s, 0, 0, 0, 0, s, 0, 0, 0, 0, s, 0, 0, 0, 0, 1]);
}

export function rotX(a: number): Mat4 {
    const c = Math.cos(a), s = Math.sin(a);
    return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]);
}

export function rotY(a: number): Mat4 {
    const c = Math.cos(a), s = Math.sin(a);
    return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]);
}

export function rotZ(a: number): Mat4 {
    const c = Math.cos(a), s = Math.sin(a);
    return new Float32Array([c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
}

type GltfNode = {
    name?: string,
    mesh?: number,
    children?: number[],
    matrix?: number[],
    rotation?: number[],
    scale?: number[],
    translation?: number[],
};

function nodeMatrix(n: GltfNode): Mat4 {
    if (n.matrix) return new Float32Array(n.matrix);
    const q = n.rotation ?? [0, 0, 0, 1], s = n.scale ?? [1, 1, 1], t = n.translation ?? [0, 0, 0];
    const [x, y, z, w] = q;
    return new Float32Array([
        (1 - 2 * (y * y + z * z)) * s[0], 2 * (x * y + z * w) * s[0], 2 * (x * z - y * w) * s[0], 0,
        2 * (x * y - z * w) * s[1], (1 - 2 * (x * x + z * z)) * s[1], 2 * (y * z + x * w) * s[1], 0,
        2 * (x * z + y * w) * s[2], 2 * (y * z - x * w) * s[2], (1 - 2 * (x * x + y * y)) * s[2], 0,
        t[0], t[1], t[2], 1,
    ]);
}

export type ModelPart = {
    pos: Float32Array,
    nor: Float32Array,
    col: Float32Array | null, // per-vertex colours (planets), or null
    base: [number, number, number], // material colour (rocket)
    unlit: boolean, // the rocket's flame
    flame: boolean,
    ring: boolean, // a planet's rings
};

export type Model = {
    parts: ModelPart[],
    flameY: number,
    // The root node's own transform when it was kept out of the vertices
    root: Mat4,
};

export async function fetchModel(name: string): Promise<ArrayBuffer> {
    const response = await fetch(`/models/${name}.glb`);
    if (!response.ok) throw new Error(`${name}.glb: ${response.status}`);
    return response.arrayBuffer();
}

// A GLB file is a 12 byte header, a JSON chunk, then a binary chunk. This reads
// what the models use: positions, normals, vertex colours or material colours,
// and the node hierarchy, baked into the vertices once. With `keepRoot`, the
// root node's own rotation (a planet's axial tilt) is returned apart instead,
// so the planet can spin around its own axis before being tilted.
export function parseGLB(buffer: ArrayBuffer, keepRoot = false): Model {
    const dv = new DataView(buffer);
    const jsonLength = dv.getUint32(12, true);
    const binStart = 20 + jsonLength + 8;
    const gltf = JSON.parse(new TextDecoder().decode(new Uint8Array(buffer, 20, jsonLength)));
    const sizes: Record<string, number> = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 };

    // Reads an accessor into floats: float data, or normalized bytes and shorts
    function read(index: number, want: number): Float32Array {
        const accessor = gltf.accessors[index];
        const view = gltf.bufferViews[accessor.bufferView];
        const bytes = accessor.componentType === 5126 ? 4 : accessor.componentType === 5123 ? 2 : 1;
        const stride = view.byteStride || sizes[accessor.type] * bytes;
        const start = binStart + (view.byteOffset || 0) + (accessor.byteOffset || 0);
        const out = new Float32Array(accessor.count * want);
        for (let i = 0; i < accessor.count; i++) {
            for (let k = 0; k < want; k++) {
                const at = start + i * stride + k * bytes;
                out[i * want + k] = bytes === 4 ? dv.getFloat32(at, true) : bytes === 2 ? dv.getUint16(at, true) / 65535 : dv.getUint8(at) / 255;
            }
        }
        return out;
    }

    const parts: ModelPart[] = [];
    const identity = nodeMatrix({});
    let flameY = 0;
    let root = identity;

    function walk(index: number, parent: Mat4, inFlame: boolean, skip: boolean): void {
        const node: GltfNode = gltf.nodes[index];
        const m = skip ? parent : mul4(parent, nodeMatrix(node));
        const flame = inFlame || node.name === "Flame";
        if (node.name === "Flame") flameY = m[13];
        if (node.mesh !== undefined) {
            for (const primitive of gltf.meshes[node.mesh].primitives) {
                const pos = read(primitive.attributes.POSITION, 3);
                const nor = read(primitive.attributes.NORMAL, 3);
                const col = primitive.attributes.COLOR_0 !== undefined ? read(primitive.attributes.COLOR_0, 3) : null;
                const material = gltf.materials?.[primitive.material] ?? {};
                for (let k = 0; k < pos.length; k += 3) {
                    const x = pos[k], y = pos[k + 1], z = pos[k + 2], a = nor[k], b = nor[k + 1], c = nor[k + 2];
                    pos[k] = m[0] * x + m[4] * y + m[8] * z + m[12];
                    pos[k + 1] = m[1] * x + m[5] * y + m[9] * z + m[13];
                    pos[k + 2] = m[2] * x + m[6] * y + m[10] * z + m[14];
                    nor[k] = m[0] * a + m[4] * b + m[8] * c;
                    nor[k + 1] = m[1] * a + m[5] * b + m[9] * c;
                    nor[k + 2] = m[2] * a + m[6] * b + m[10] * c;
                }
                const color = material.pbrMetallicRoughness?.baseColorFactor ?? [1, 1, 1, 1];
                parts.push({
                    pos,
                    nor,
                    col,
                    base: [color[0], color[1], color[2]],
                    unlit: !!material.extensions?.KHR_materials_unlit,
                    flame,
                    ring: /ring/i.test(node.name ?? ""),
                });
            }
        }
        for (const child of node.children ?? []) walk(child, m, flame, false);
    }

    for (const index of gltf.scenes[gltf.scene ?? 0].nodes as number[]) {
        if (keepRoot) root = nodeMatrix(gltf.nodes[index]);
        walk(index, identity, false, keepRoot);
    }
    return { parts, flameY, root };
}

export type Program = {
    program: WebGLProgram,
    uniforms: Record<string, WebGLUniformLocation | null>,
};

export function glProgram(gl: WebGLRenderingContext, vs: string, fs: string, attributes: string[]): Program | null {
    const program = gl.createProgram();
    if (!program) return null;
    for (const [type, source] of [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]] as const) {
        const shader = gl.createShader(type);
        if (!shader) return null;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        gl.attachShader(program, shader);
    }
    attributes.forEach((name, i) => gl.bindAttribLocation(program, i, name));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
    const uniforms: Program["uniforms"] = {};
    const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < count; i++) {
        const info = gl.getActiveUniform(program, i);
        if (info) uniforms[info.name] = gl.getUniformLocation(program, info.name);
    }
    return { program, uniforms };
}

export function webgl(canvas: HTMLCanvasElement, lowPower = false): WebGLRenderingContext | null {
    try {
        return canvas.getContext("webgl", {
            antialias: true,
            alpha: true,
            premultipliedAlpha: true,
            powerPreference: lowPower ? "low-power" : "default",
            // No GPU (hardware acceleration off, a blocklisted driver, a
            // virtual machine, the servers of PageSpeed Insights): the browser
            // would draw in software, every frame on the CPU, and hand each one
            // to the compositor through a copy that blocks the main thread
            // (over 100 ms per frame measured at mobile speed). For decorations,
            // no context is the better answer: the page goes without them.
            failIfMajorPerformanceCaveat: true,
        });
    } catch {
        return null;
    }
}

// The canvas resolution follows the screen, within a pixel budget: MSAA
// multiplies the GPU memory per pixel, and these are decorations.
export function fitCanvas(gl: WebGLRenderingContext, canvas: HTMLCanvasElement, w: number, h: number, budget: number): void {
    const dpr = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(budget / Math.max(1, w * h)));
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
}

export type Camera = { vp: Mat4, eye: [number, number, number] };

// A camera on the canvas axis, set so that at depth 0 one world unit is one
// CSS pixel (origin bottom left, y up): things are placed in page pixels.
export function camera(w: number, h: number): Camera {
    const fov = 24 * Math.PI / 180, t = 1 / Math.tan(fov / 2);
    const d = h / 2 * t, near = d * 0.5, far = d * 1.5;
    const proj = new Float32Array([t * h / w, 0, 0, 0, 0, t, 0, 0, 0, 0, (far + near) / (near - far), -1, 0, 0, 2 * far * near / (near - far), 0]);
    const view = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -w / 2, -h / 2, -d, 1]);
    return { vp: mul4(proj, view), eye: [w / 2, h / 2, d] };
}

export const PRECISION = [
    "#ifdef GL_FRAGMENT_PRECISION_HIGH",
    "precision highp float;",
    "#else",
    "precision mediump float;",
    "#endif",
].join("\n");

// Two triangles covering a [-1, 1] square
export const CORNERS = [-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1];

// Resolves once the page has loaded.
function loaded(): Promise<void> {
    if (document.readyState === "complete") return Promise.resolve();
    return new Promise(resolve => window.addEventListener("load", () => resolve(), { once: true }));
}

// Resolves once the first content has been painted. The load event does not
// wait for it: on a slow device it can fire first, and a WebGL context created
// then keeps the GPU busy while the page's first frame waits (measured: the
// first paint pushed 2 s after load).
function painted(): Promise<void> {
    if (!PerformanceObserver.supportedEntryTypes?.includes("paint")) return Promise.resolve();
    return new Promise(resolve => {
        const observer = new PerformanceObserver(list => {
            if (!list.getEntriesByName("first-contentful-paint").length) return;
            observer.disconnect();
            resolve();
        });
        // Buffered: the paint may well be over before this runs
        observer.observe({ type: "paint", buffered: true });
    });
}

// Runs `fn` once the page has loaded, its first content is on screen and the
// browser is idle, so nothing 3D competes with the first paint.
export function afterLoad(fn: () => void): void {
    Promise.all([loaded(), painted()]).then(() => {
        if ("requestIdleCallback" in window) requestIdleCallback(fn, { timeout: 2000 });
        else setTimeout(fn, 200);
    });
}
