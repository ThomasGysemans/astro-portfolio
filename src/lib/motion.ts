// Whether things may move on their own, for every animated part of the site.
//
// One source of truth: the `data-motion` attribute of <html>, set before the
// first paint by the inline script of PageLayout ("reduce" when the visitor
// paused the animations with the button, or when the system asks for reduced
// motion). CSS reads the attribute; scripts read it through `motionOK()` and
// are told about a change by the "motionchange" event the pause button fires.

const STORAGE_KEY = "motion";
const EVENT = "motionchange";

export function motionOK(): boolean {
    return document.documentElement.dataset.motion !== "reduce";
}

// The system setting alone, regardless of the pause button. Used by what
// follows the scroll rather than a clock (the planets' parallax): pausing must
// not make it jump, but a visitor sensitive to motion never gets it.
export function systemReducesMotion(): boolean {
    return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function setMotion(on: boolean): void {
    document.documentElement.dataset.motion = on ? "full" : "reduce";
    try {
        localStorage.setItem(STORAGE_KEY, on ? "full" : "reduce");
    } catch {
        // Private mode or blocked storage: the choice only lasts for this page.
    }
    document.dispatchEvent(new CustomEvent(EVENT, { detail: on }));
}

// Calls `listener` with the new state each time the visitor toggles the
// animations. Returns the matching cleanup.
export function onMotionChange(listener: (on: boolean) => void): () => void {
    const handler = (event: Event) => listener((event as CustomEvent<boolean>).detail);
    document.addEventListener(EVENT, handler);
    return () => document.removeEventListener(EVENT, handler);
}
