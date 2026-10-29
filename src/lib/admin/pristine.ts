// The back-office runtime tells a changed control from its `defaultValue` /
// `defaultChecked` / `defaultSelected` (see `controlIsDirty` in runtime.ts).
// Svelte's SSR does not render those for `bind:value` / `bind:checked`
// controls, so an island calls this once mounted: what its controls show at
// that point is their pristine state, not a change.
export function markPristine(root: ParentNode): void {
    for (const el of root.querySelectorAll("input, textarea, select")) {
        if (el instanceof HTMLInputElement) {
            if (el.type === "checkbox" || el.type === "radio") el.defaultChecked = el.checked;
            else if (el.type !== "file") el.defaultValue = el.value;
        } else if (el instanceof HTMLTextAreaElement) {
            el.defaultValue = el.value;
        } else if (el instanceof HTMLSelectElement) {
            for (const option of el.options) option.defaultSelected = option.selected;
        }
    }
}
