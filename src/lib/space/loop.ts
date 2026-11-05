// One requestAnimationFrame loop shared by everything that animates in
// script (the planets, the launch pad, the small moon of the hero), instead of
// one loop each. It only runs while a ticker asks for it, while the tab is
// visible and while animations are allowed; it sleeps otherwise.
import { motionOK, onMotionChange } from "@lib/motion";

// A ticker returns true to be called again on the next frame.
export type Ticker = (now: number) => boolean;

const tickers = new Set<Ticker>();
let frame = 0;

function run(now: number): void {
    frame = 0;
    for (const ticker of [...tickers]) {
        if (!ticker(now)) tickers.delete(ticker);
    }
    if (tickers.size > 0) request();
}

function request(): void {
    if (frame || document.hidden || !motionOK()) return;
    frame = requestAnimationFrame(run);
}

// Schedules `ticker` from the next frame on (a no-op when it already runs).
export function wake(ticker: Ticker): void {
    tickers.add(ticker);
    request();
}

if (typeof document !== "undefined") {
    document.addEventListener("visibilitychange", request);
    onMotionChange(on => { if (on) request(); });
}
