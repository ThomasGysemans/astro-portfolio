// Client runtime of the back-office, loaded once by AdminLayout.
//
// Its main job is to make saving safe: every `form[data-async]` is sent with
// `fetch` instead of a page navigation, so a failed save never replaces the
// form. What the admin typed, the files picked in the file inputs (which a
// browser can never re-fill) and the islands' unsaved state (media order,
// staged YouTube links, techs list) all stay on screen, next to the problems.
// Without JS the same forms still post natively and the pages re-render.
//
// The answer of an async POST is `{ ok: true, redirect }` or
// `{ ok: false, error, fields }` (see `formResponse` in data/admin/forms.ts);
// `fields` maps a control's `name` to its problem.
//
// It also drives the shell: unsaved-changes tracking (status bar, per-field
// marks, leave-page warning), the problems panel, ⌘S / Ctrl+S, the list
// filters, the confirmation dialog, the theme toggle and the mobile explorer.

type Problem = {
    message: string,
    // The control (or group wrapper) the problem belongs to, when known.
    target?: HTMLElement,
    label?: string,
};

type AsyncAnswer = { ok: true, redirect: string } | { ok: false, error: string, fields?: Record<string, string> };

type StatusState = "idle" | "dirty" | "saving" | "error" | "saved";

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

// Vercel caps a serverless request body at 4.5 MB: past this, the upload is
// cut off before it reaches the page. Checked before sending, with some room
// left for the text fields and the multipart overhead.
const UPLOAD_LIMIT = 4.2 * 1024 * 1024;

const statusBar = document.getElementById("adm-status");
const statusText = statusBar?.querySelector<HTMLElement>("[data-status-text]");
const problemsToggle = statusBar?.querySelector<HTMLButtonElement>("[data-status-problems]");
const panel = document.getElementById("adm-problems");
const panelList = panel?.querySelector<HTMLElement>("[data-problems-list]");
const panelTitle = panel?.querySelector<HTMLElement>("[data-problems-title]");
const live = document.getElementById("adm-live");
const main = document.getElementById("adm-main");

const asyncForms = Array.from(document.querySelectorAll<HTMLFormElement>("form[data-async]"));
// Set while a successful save navigates away, so the leave-page warning
// does not fire for the very navigation the save triggered.
let leaving = false;
// The form whose problems the panel currently lists.
let problemsForm: HTMLFormElement | null = null;
let problems: Problem[] = [];
let savedTimer: number | undefined;

// --- Small DOM helpers --------------------------------------------------------

function isControl(el: Element): el is Control {
    return el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement;
}

// `form.action` and `form.method` are shadowed by any control named
// "action" — which most forms here have. Read the attribute instead.
function formUrl(form: HTMLFormElement): string {
    return form.getAttribute("action") || window.location.href;
}

// A control without a `name` is never submitted, so it is neither validated
// nor tracked — except a `[data-pending]` helper field (the YouTube link
// input), whose typed-but-not-added value would otherwise be silently lost.
function isPending(el: Control): boolean {
    return el.dataset.pending !== undefined;
}

function controlsOf(form: HTMLFormElement): Control[] {
    return Array.from(form.elements).filter(isControl).filter(el => el.name !== "" || isPending(el));
}

// The element that visually holds a control: its `.adm-field` (or a
// `[data-field]` group) wrapper, where the inline error message goes.
function wrapperOf(el: HTMLElement): HTMLElement {
    return el.closest<HTMLElement>("[data-field], .adm-field") ?? el.parentElement ?? el;
}

function labelOf(el: HTMLElement): string {
    const wrapper = wrapperOf(el);
    const explicit = wrapper.dataset.label ?? el.dataset.label;
    if (explicit) return explicit;
    if (isControl(el) && el.labels?.[0]) return el.labels[0].innerText.replace(/\s*\*$/, "").trim();
    const label = wrapper.querySelector(".adm-label");
    if (label) return (label as HTMLElement).innerText.replace(/\s*\*$/, "").trim();
    return el.getAttribute("aria-label") ?? (el as Control).name ?? "";
}

// The control a server-side field name points to, or its group wrapper
// (checkbox groups, the techs list) when there is no single control.
function findTarget(form: HTMLFormElement, name: string): HTMLElement | undefined {
    const group = form.querySelector<HTMLElement>(`[data-field="${CSS.escape(name)}"]`);
    if (group) return group;
    const control = form.elements.namedItem(name);
    if (control instanceof HTMLElement) return control;
    if (control instanceof RadioNodeList && control[0] instanceof HTMLElement) return wrapperOf(control[0]);
    return undefined;
}

function focusTarget(target: HTMLElement): void {
    const focusable = target.matches("input, select, textarea, button, [tabindex]")
        ? target
        : target.querySelector<HTMLElement>("input:not([type=hidden]), select, textarea, button, [tabindex]");
    target.scrollIntoView({ block: "center", behavior: "smooth" });
    (focusable ?? target).focus({ preventScroll: true });
}

function announce(message: string): void {
    if (!live) return;
    // Clearing first makes screen readers repeat an identical message.
    live.textContent = "";
    window.setTimeout(() => (live.textContent = message), 50);
}

// --- Status bar ---------------------------------------------------------------

function setStatus(state: StatusState, message: string): void {
    if (!statusBar || !statusText) return;
    window.clearTimeout(savedTimer);
    statusBar.dataset.state = state;
    statusText.textContent = message;
}

function idleStatus(): void {
    const dirty = asyncForms.some(isDirty);
    if (dirty) setStatus("dirty", "Modifications non enregistrées");
    else setStatus("idle", "Tout est enregistré");
}

// --- Unsaved changes ------------------------------------------------------------

function controlIsDirty(el: Control): boolean {
    if (isPending(el)) return el.value.trim() !== "";
    if (el instanceof HTMLInputElement) {
        if (el.type === "checkbox" || el.type === "radio") return el.checked !== el.defaultChecked;
        if (el.type === "file") return (el.files?.length ?? 0) > 0;
        if (el.type === "hidden" || el.type === "submit" || el.type === "button") return false;
        return el.value !== el.defaultValue;
    }
    if (el instanceof HTMLTextAreaElement) return el.value !== el.defaultValue;
    const options = Array.from(el.options);
    // Without any `selected` attribute, the browser picks the first option.
    const defaults = options.some(o => o.defaultSelected) ? options.map(o => o.defaultSelected) : options.map((_, i) => i === 0);
    return options.some((o, i) => o.selected !== defaults[i]);
}

function isDirty(form: HTMLFormElement): boolean {
    return form.dataset.dirty === "true";
}

// Recomputes the form's state from its controls. The islands flag changes a
// control cannot express (reordered rows, removed media) with `adm:dirty`.
function refreshDirty(form: HTMLFormElement): void {
    let dirty = form.dataset.structureDirty === "true";
    for (const el of controlsOf(form)) {
        const changed = !el.disabled && controlIsDirty(el);
        dirty ||= changed;
        const wrapper = el.closest<HTMLElement>(".adm-field");
        if (wrapper) {
            // A wrapper may hold several controls (checkbox groups): one is enough.
            const anyChanged = Array.from(wrapper.querySelectorAll("input, select, textarea"))
                .some(c => isControl(c) && !c.disabled && controlIsDirty(c));
            wrapper.toggleAttribute("data-modified", anyChanged);
        }
    }
    form.dataset.dirty = String(dirty);
    if (statusBar?.dataset.state !== "saving" && statusBar?.dataset.state !== "error") idleStatus();
}

// --- Problems -------------------------------------------------------------------

function clearInlineError(target: HTMLElement): void {
    const wrapper = wrapperOf(target);
    wrapper.removeAttribute("data-invalid");
    wrapper.querySelector(":scope > .adm-error[data-generated]")?.remove();
    for (const el of wrapper.querySelectorAll("[aria-invalid]")) el.removeAttribute("aria-invalid");
    if (target.getAttribute("aria-invalid")) target.removeAttribute("aria-invalid");
}

function clearProblems(): void {
    for (const problem of problems) {
        if (problem.target) clearInlineError(problem.target);
    }
    problems = [];
    problemsForm = null;
    renderProblems();
}

function markInline(problem: Problem, index: number): void {
    const target = problem.target;
    if (!target) return;
    const wrapper = wrapperOf(target);
    wrapper.setAttribute("data-invalid", "");
    const message = document.createElement("p");
    message.className = "adm-error";
    message.dataset.generated = "";
    message.id = `adm-error-${index}`;
    message.textContent = problem.message;
    wrapper.querySelector(":scope > .adm-error[data-generated]")?.remove();
    if (target === wrapper) {
        wrapper.append(message);
    } else {
        // Right under the control (or under the box holding it, like the
        // slug's prefix), before any help text that follows.
        let anchor: HTMLElement = target;
        while (anchor.parentElement && anchor.parentElement !== wrapper) anchor = anchor.parentElement;
        anchor.after(message);
    }
    const controls = target.matches("input, select, textarea")
        ? [target]
        : Array.from(target.querySelectorAll<HTMLElement>("input:not([type=hidden]), select, textarea"));
    for (const control of controls) {
        control.setAttribute("aria-invalid", "true");
        const described = (control.getAttribute("aria-describedby") ?? "").split(" ").filter(id => id && !id.startsWith("adm-error-"));
        control.setAttribute("aria-describedby", [...described, message.id].join(" "));
    }
}

// Badges on the in-page section links: how many problems each section holds.
function renderSectionBadges(): void {
    for (const link of document.querySelectorAll<HTMLAnchorElement>("a[data-section-link]")) {
        const section = document.querySelector(link.hash);
        const count = section ? problems.filter(p => p.target && section.contains(p.target)).length : 0;
        const badge = link.querySelector<HTMLElement>("[data-badge]");
        if (badge) {
            badge.textContent = count ? String(count) : "";
            badge.hidden = count === 0;
        }
        link.toggleAttribute("data-has-problems", count > 0);
    }
}

function renderProblems(): void {
    if (!panel || !panelList) return;
    panelList.replaceChildren();
    problems.forEach(problem => {
        const item = document.createElement("li");
        const button = document.createElement("button");
        button.type = "button";
        button.className = "adm-problem";
        const icon = document.createElement("span");
        icon.className = "adm-problem-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = "✕";
        const message = document.createElement("span");
        message.className = "adm-problem-message";
        message.textContent = problem.message;
        button.append(icon, message);
        if (problem.label) {
            const where = document.createElement("span");
            where.className = "adm-problem-where";
            where.textContent = problem.label;
            button.append(where);
        }
        if (problem.target) {
            const target = problem.target;
            button.addEventListener("click", () => focusTarget(target));
        } else {
            button.disabled = true;
        }
        item.append(button);
        panelList.append(item);
    });
    const count = problems.length;
    panel.hidden = count === 0;
    if (panelTitle) panelTitle.textContent = count === 1 ? "1 problème" : `${count} problèmes`;
    if (problemsToggle) {
        problemsToggle.hidden = count === 0;
        const label = problemsToggle.querySelector("[data-count]");
        if (label) label.textContent = String(count);
    }
    renderSectionBadges();
}

function showProblems(form: HTMLFormElement, list: Problem[], summary: string): void {
    clearProblems();
    problemsForm = form;
    problems = list;
    problems.forEach(markInline);
    renderProblems();
    setStatus("error", summary);
    announce(`${summary} ${list.map(p => (p.label ? `${p.label} : ` : "") + p.message).join(" ")}`);
    // Straight to the first faulty control; the panel lists the others.
    const first = problems.find(p => p.target)?.target;
    if (first) focusTarget(first);
    else panel?.querySelector<HTMLElement>("[data-problems-title]")?.focus();
}

// Clears a control's problem as soon as the admin edits it.
function resolveProblem(form: HTMLFormElement, el: HTMLElement): void {
    if (form !== problemsForm || problems.length === 0) return;
    // Also drops a pending helper's problem once the island emptied it (the
    // YouTube link was added to the list: no input event fires for that).
    const remaining = problems.filter(p => !(p.target && (
        p.target === el || p.target.contains(el) || wrapperOf(p.target).contains(el)
        || (isControl(p.target) && isPending(p.target) && p.target.value.trim() === "")
    )));
    if (remaining.length === problems.length) return;
    for (const p of problems) {
        if (!remaining.includes(p) && p.target) clearInlineError(p.target);
    }
    problems = remaining;
    renderProblems();
    if (problems.length === 0) {
        problemsForm = null;
        idleStatus();
    }
}

// --- Validation -----------------------------------------------------------------

// The back-office is French whatever the browser's language: the native
// `validationMessage` would follow the browser (and stay generic).
function validityMessage(el: Control): string {
    const v = el.validity;
    if (v.valueMissing) {
        if (el instanceof HTMLInputElement && el.type === "file") return "Choisis un fichier.";
        if (el instanceof HTMLSelectElement || (el instanceof HTMLInputElement && el.type === "radio")) return "Choisis une valeur.";
        return "Ce champ est obligatoire.";
    }
    if (el instanceof HTMLSelectElement) return el.validationMessage;
    if (v.typeMismatch && el instanceof HTMLInputElement) {
        if (el.type === "url") return "Adresse invalide : elle doit commencer par https://.";
        if (el.type === "email") return "Adresse e-mail invalide.";
    }
    if (v.tooShort) return `Trop court : ${el.minLength} caractères minimum.`;
    if (v.tooLong) return `Trop long : ${el.maxLength} caractères maximum.`;
    if (el instanceof HTMLInputElement) {
        if (v.rangeUnderflow) return `La valeur minimale est ${el.min}.`;
        if (v.rangeOverflow) return `La valeur maximale est ${el.max}.`;
        if (v.badInput || v.stepMismatch) return "Saisis un nombre entier.";
        if (v.patternMismatch) return el.title || "Format invalide.";
    }
    return el.validationMessage;
}

// Native constraint validation, but reported in the problems panel (the
// browser's bubbles show one field at a time and vanish).
function validate(form: HTMLFormElement): Problem[] {
    const list: Problem[] = [];
    for (const el of controlsOf(form)) {
        if (isPending(el)) {
            if (el.value.trim() !== "") list.push({ message: el.dataset.pending || "Valeur saisie mais pas ajoutée.", target: el, label: labelOf(el) });
        } else if (el.willValidate && !el.checkValidity()) {
            list.push({ message: validityMessage(el), target: el, label: labelOf(el) });
        }
    }
    // Checkbox groups needing at least one ticked box.
    for (const group of form.querySelectorAll<HTMLElement>("[data-required-group]")) {
        if (!group.querySelector("input:checked")) {
            list.push({ message: group.dataset.requiredGroup || "Coche au moins une option.", target: group, label: labelOf(group) });
        }
    }
    return list;
}

function uploadSize(data: FormData): number {
    let total = 0;
    for (const value of data.values()) {
        if (value instanceof File) total += value.size;
    }
    return total;
}

const megabytes = (bytes: number) => `${(bytes / 1024 / 1024).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} Mo`;

// --- Sending ----------------------------------------------------------------------

async function send(form: HTMLFormElement, submitter: HTMLElement | null): Promise<void> {
    const data = new FormData(form, submitter instanceof HTMLButtonElement || submitter instanceof HTMLInputElement ? submitter : undefined);

    const size = uploadSize(data);
    if (import.meta.env.PROD && size > UPLOAD_LIMIT) {
        const files = form.querySelector<HTMLElement>("[data-field=pictures], input[type=file]");
        showProblems(form, [{
            message: `${megabytes(size)} de fichiers dans cet envoi : la limite est d'environ 4 Mo par enregistrement. Enregistre une partie des médias, puis ajoute les autres dans un second temps.`,
            target: files ?? undefined,
            label: "Médias",
        }], "Fichiers trop lourds : rien n'a été envoyé");
        return;
    }

    form.setAttribute("aria-busy", "true");
    const buttons = Array.from(form.querySelectorAll<HTMLButtonElement>("button[type=submit], button:not([type])"));
    for (const button of buttons) button.disabled = true;
    // Submit buttons outside the form (the sticky header) point at it via `form=`.
    const external = Array.from(document.querySelectorAll<HTMLButtonElement>(`button[form="${CSS.escape(form.id)}"]`));
    for (const button of external) button.disabled = true;
    setStatus("saving", "Enregistrement…");

    let answer: AsyncAnswer | null = null;
    let failure = "";
    try {
        const response = await fetch(formUrl(form), {
            method: "POST",
            body: data,
            headers: { "x-admin-async": "1" },
            credentials: "same-origin",
        });
        // An expired session: the middleware redirected the POST to the
        // login page, which the fetch followed.
        if (response.redirected && new URL(response.url).pathname.startsWith("/admin/login")) {
            failure = "Ta session a expiré. Reconnecte-toi dans un autre onglet (/admin/login), puis enregistre à nouveau : tes modifications sont toujours là.";
        } else if (response.status === 413) {
            failure = "Les fichiers sont trop lourds pour être envoyés en une fois. Enregistre une partie des médias, puis ajoute les autres.";
        } else {
            answer = await response.json().catch(() => null);
            if (!answer) failure = `Le serveur a répondu une erreur inattendue (${response.status}). Tes modifications sont toujours là : réessaie.`;
        }
    } catch {
        failure = "Connexion impossible avec le serveur. Tes modifications sont toujours là : vérifie la connexion et réessaie.";
    } finally {
        form.removeAttribute("aria-busy");
        for (const button of [...buttons, ...external]) button.disabled = false;
    }

    if (answer?.ok) {
        form.dataset.dirty = "false";
        // The reload discards the other forms of the page (the technologies
        // rows): only skip the leave-page warning when none of them holds a
        // change, otherwise the browser asks first.
        leaving = !asyncForms.some(other => other !== form && isDirty(other));
        setStatus("saving", "Enregistré, rechargement…");
        const target = new URL(answer.redirect, window.location.href);
        // Saving a long form reloads it: come back at the same spot.
        if (target.pathname === window.location.pathname && main) {
            try {
                sessionStorage.setItem(`adm-scroll:${target.pathname}`, String(main.scrollTop));
            } catch {
                // Storage unavailable: the page simply reopens at the top.
            }
        }
        window.location.assign(target);
        return;
    }

    if (!answer) {
        showProblems(form, [{ message: failure }], "Enregistrement impossible");
        return;
    }

    const list: Problem[] = [];
    for (const [name, message] of Object.entries(answer.fields ?? {})) {
        const target = findTarget(form, name);
        list.push({ message, target, label: target ? labelOf(target) : name });
    }
    // The general message adds nothing when every field problem is listed.
    if (list.length === 0 || list.some(p => !p.target)) list.unshift({ message: answer.error });
    showProblems(form, list, "Enregistrement impossible : rien n'a été perdu");
}

// --- Confirmation dialog ---------------------------------------------------------

const dialog = document.getElementById("adm-confirm") as HTMLDialogElement | null;
const dialogMessage = document.getElementById("adm-confirm-message");

function confirmAction(text: string): Promise<boolean> {
    if (!dialog || !dialogMessage) return Promise.resolve(window.confirm(text));
    dialogMessage.textContent = text;
    return new Promise(resolve => {
        const ok = document.getElementById("adm-confirm-ok");
        const cancel = document.getElementById("adm-confirm-cancel");
        const done = (value: boolean) => {
            ok?.removeEventListener("click", onOk);
            cancel?.removeEventListener("click", onCancel);
            dialog.removeEventListener("close", onClose);
            if (dialog.open) dialog.close();
            resolve(value);
        };
        const onOk = () => done(true);
        const onCancel = () => done(false);
        // Escape closes the dialog natively.
        const onClose = () => done(false);
        ok?.addEventListener("click", onOk);
        cancel?.addEventListener("click", onCancel);
        dialog.addEventListener("close", onClose);
        dialog.showModal();
        // The safe choice gets the focus.
        cancel?.focus();
    });
}

// --- Wiring the forms -------------------------------------------------------------

for (const form of asyncForms) {
    // The runtime reports the constraints itself, all at once.
    form.noValidate = true;
    form.dataset.dirty = "false";

    form.addEventListener("submit", async event => {
        event.preventDefault();
        if (form.getAttribute("aria-busy") === "true") return;
        const submitter = event.submitter as HTMLButtonElement | null;
        const confirmText = submitter?.dataset.confirm ?? form.dataset.confirm;
        if (confirmText && !(await confirmAction(confirmText))) return;

        if (!submitter?.formNoValidate) {
            const invalid = validate(form);
            if (invalid.length > 0) {
                showProblems(form, invalid, invalid.length === 1 ? "Un champ est à corriger" : `${invalid.length} champs sont à corriger`);
                return;
            }
        }
        if (problemsForm === form) clearProblems();
        await send(form, submitter);
    });

    const onEdit = (event: Event) => {
        const target = event.target as HTMLElement;
        refreshDirty(form);
        resolveProblem(form, target);
    };
    form.addEventListener("input", onEdit);
    form.addEventListener("change", onEdit);
    form.addEventListener("adm:dirty", event => {
        form.dataset.structureDirty = "true";
        onEdit(event);
    });
}

// Natively-posted pages that came back with an error (no JS at submission
// time, or a delete that failed): the layout serialised the field problems.
const initial = document.getElementById("adm-initial-problems");
if (initial?.textContent) {
    try {
        const { error, fields } = JSON.parse(initial.textContent) as { error: string, fields?: Record<string, string> };
        const form = document.querySelector<HTMLFormElement>("form[data-primary]") ?? asyncForms[0];
        if (form) {
            const list: Problem[] = Object.entries(fields ?? {}).map(([name, message]) => {
                const target = findTarget(form, name);
                return { message, target, label: target ? labelOf(target) : name };
            });
            if (list.length === 0 || list.some(p => !p.target)) list.unshift({ message: error });
            problemsForm = form;
            problems = list;
            problems.forEach(markInline);
            renderProblems();
        }
    } catch {
        // Malformed payload: the server-rendered panel still shows the message.
    }
}

panel?.querySelector("[data-problems-close]")?.addEventListener("click", () => {
    if (panel) panel.hidden = true;
});
problemsToggle?.addEventListener("click", () => {
    if (!panel) return;
    panel.hidden = !panel.hidden;
});

window.addEventListener("beforeunload", event => {
    if (leaving || !asyncForms.some(isDirty)) return;
    event.preventDefault();
    // Still required by some browsers to show the prompt.
    event.returnValue = "";
});

// ⌘S / Ctrl+S saves the form being edited (the primary one by default). Only
// editing forms qualify (`data-primary`, `data-shortcut`), never a list row's
// delete form; and on a page with nothing to save, the browser's "save page"
// dialog is still kept out of the way.
const SAVABLE = "form[data-primary], form[data-shortcut]";
document.addEventListener("keydown", event => {
    if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "s") return;
    event.preventDefault();
    const active = document.activeElement;
    const focused = active instanceof HTMLElement ? active.closest<HTMLFormElement>(SAVABLE) : null;
    const form = focused ?? document.querySelector<HTMLFormElement>("form[data-primary]");
    if (!form) return;
    // Same default submitter as pressing Enter: the form's first submit button.
    const fallback = form.querySelector<HTMLButtonElement>("button[type=submit]:not([formnovalidate]), button:not([type])");
    form.requestSubmit(fallback ?? undefined);
});

// --- After a reload ----------------------------------------------------------------

// Strip the status params so a refresh doesn't replay the notice.
const url = new URL(window.location.href);
let hadStatusParam = false;
for (const param of ["saved", "created", "deleted"]) {
    if (url.searchParams.has(param)) {
        url.searchParams.delete(param);
        hadStatusParam = true;
    }
}
if (hadStatusParam) history.replaceState(null, "", url);

try {
    const key = `adm-scroll:${window.location.pathname}`;
    const scroll = sessionStorage.getItem(key);
    if (scroll && main) {
        sessionStorage.removeItem(key);
        main.scrollTop = Number(scroll);
    }
} catch {
    // Storage unavailable: nothing to restore.
}

// --- Filters ----------------------------------------------------------------------

// `input[data-filter="<selector>"]` filters the `[data-filter-text]` rows of
// that container; `[data-filter-flag]` chips narrow them to the rows whose
// `data-flags` carry the flag.
function applyFilter(container: HTMLElement): void {
    const input = document.querySelector<HTMLInputElement>(`input[data-filter="#${container.id}"]`);
    const query = (input?.value ?? "").trim().toLocaleLowerCase("fr");
    const chip = document.querySelector<HTMLElement>(`[data-filter-for="#${container.id}"][aria-pressed="true"]`);
    const flag = chip?.dataset.filterFlag ?? "";
    let shown = 0;
    for (const row of container.querySelectorAll<HTMLElement>("[data-filter-text]")) {
        const matches = (!query || (row.dataset.filterText ?? "").includes(query))
            && (!flag || (row.dataset.flags ?? "").split(" ").includes(flag));
        row.hidden = !matches;
        if (matches) shown++;
    }
    container.querySelectorAll<HTMLElement>("[data-filter-group]").forEach(group => {
        group.hidden = !group.querySelector("[data-filter-text]:not([hidden])");
    });
    const empty = container.querySelector<HTMLElement>("[data-filter-empty]");
    if (empty) empty.hidden = shown > 0;
}

for (const input of document.querySelectorAll<HTMLInputElement>("input[data-filter]")) {
    const container = document.querySelector<HTMLElement>(input.dataset.filter ?? "");
    if (!container) continue;
    input.addEventListener("input", () => applyFilter(container));
    // Escape clears the filter.
    input.addEventListener("keydown", event => {
        if (event.key === "Escape" && input.value) {
            input.value = "";
            applyFilter(container);
        }
    });
}

// The chips of one container behave like radio buttons; the "all" chip
// carries an empty flag.
for (const chip of document.querySelectorAll<HTMLButtonElement>("[data-filter-flag]")) {
    const container = document.querySelector<HTMLElement>(chip.dataset.filterFor ?? "");
    if (!container) continue;
    chip.addEventListener("click", () => {
        for (const other of document.querySelectorAll(`[data-filter-for="${chip.dataset.filterFor}"]`)) {
            other.setAttribute("aria-pressed", String(other === chip));
        }
        applyFilter(container);
    });
}

// --- Shell ------------------------------------------------------------------------

for (const button of document.querySelectorAll<HTMLButtonElement>("[data-theme-toggle]")) {
    button.addEventListener("click", () => {
        const html = document.documentElement;
        const theme = html.dataset.theme === "light" ? "dark" : "light";
        html.dataset.theme = theme;
        // Same cookie as the public site's toggle: the middleware renders it.
        document.cookie = `theme=${theme};path=/;max-age=31536000;samesite=lax`;
    });
}

const explorer = document.getElementById("adm-explorer");
function setExplorer(open: boolean): void {
    document.documentElement.toggleAttribute("data-explorer-open", open);
    for (const toggle of document.querySelectorAll("[data-explorer-toggle]")) {
        toggle.setAttribute("aria-expanded", String(open));
    }
    if (open) explorer?.querySelector<HTMLElement>("input, a")?.focus();
}
for (const toggle of document.querySelectorAll("[data-explorer-toggle]")) {
    toggle.addEventListener("click", () => setExplorer(!document.documentElement.hasAttribute("data-explorer-open")));
}
document.addEventListener("keydown", event => {
    if (event.key === "Escape" && document.documentElement.hasAttribute("data-explorer-open")) setExplorer(false);
});
document.querySelector("[data-explorer-backdrop]")?.addEventListener("click", () => setExplorer(false));

// Collapsible explorer groups; the state is remembered per browser.
for (const toggle of document.querySelectorAll<HTMLButtonElement>("[data-tree-toggle]")) {
    const list = document.getElementById(toggle.getAttribute("aria-controls") ?? "");
    if (!list) continue;
    const key = `adm-tree:${list.id}`;
    const apply = (open: boolean) => {
        toggle.setAttribute("aria-expanded", String(open));
        list.toggleAttribute("data-collapsed", !open);
    };
    try {
        // The group of the open record always starts expanded.
        if (localStorage.getItem(key) === "closed" && !list.querySelector("[aria-current=page]")) apply(false);
    } catch {
        // Storage unavailable: groups start expanded.
    }
    toggle.addEventListener("click", () => {
        const open = toggle.getAttribute("aria-expanded") !== "true";
        apply(open);
        try {
            localStorage.setItem(key, open ? "open" : "closed");
        } catch {
            // Not remembered; harmless.
        }
    });
}

// "/" jumps to the explorer filter, as in most editors (not while typing).
document.addEventListener("keydown", event => {
    if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
    const active = document.activeElement;
    if (active instanceof HTMLElement && active.closest("input, textarea, select, [contenteditable]")) return;
    const filter = document.querySelector<HTMLInputElement>(".adm-explorer-filter input");
    if (!filter) return;
    event.preventDefault();
    if (window.matchMedia("(max-width: 900px)").matches) setExplorer(true);
    filter.focus();
});

// The current entry of the explorer starts in view.
explorer?.querySelector<HTMLElement>("[aria-current=page]")?.scrollIntoView({ block: "nearest" });

// Initial status: a server-rendered error or notice wins over the idle state.
if (statusBar?.dataset.state === "error") {
    // Rendered by the layout with its message; nothing to recompute.
} else if (statusBar?.dataset.state === "saved") {
    savedTimer = window.setTimeout(idleStatus, 5000);
} else {
    idleStatus();
}
