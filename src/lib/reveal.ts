// Sections rise into view once, the first time they are scrolled to.
//
// Only what starts below the fold is hidden, and only once this script runs:
// without JavaScript, or for the first screen, everything is visible at rest.
// The pause button reveals everything at once.
import { onMotionChange } from "@lib/motion";

export function mountReveals(root: ParentNode = document): void {
    const items = Array.from(root.querySelectorAll<HTMLElement>(".reveal"));
    if (!("IntersectionObserver" in window) || items.length === 0) return;

    const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.remove("pending");
            observer.unobserve(entry.target);
        }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    for (const item of items) {
        if (item.getBoundingClientRect().top > window.innerHeight * 0.92) {
            item.classList.add("pending");
            observer.observe(item);
        }
    }

    onMotionChange(on => {
        if (on) return;
        for (const item of items) item.classList.remove("pending");
    });
}
