// "Copy" buttons next to an e-mail address or a text to paste elsewhere.
//
// The confirmation is text in a live region, never colour alone. When the
// browser refuses to copy (permission, insecure context), the address is
// selected instead, so a manual copy is one shortcut away.
//
// Markup: <button data-copy="id-of-the-element-to-copy" data-status="id-of-the-live-region"
//                 data-copied="Adresse copiée" data-failed="Copie impossible…">
export function mountCopyButtons(root: ParentNode = document): void {
    for (const button of root.querySelectorAll<HTMLButtonElement>("button[data-copy]")) {
        let timer: ReturnType<typeof setTimeout> | undefined;
        button.addEventListener("click", async () => {
            const source = document.getElementById(button.dataset.copy ?? "");
            const status = document.getElementById(button.dataset.status ?? "");
            if (!source) return;
            const text = source instanceof HTMLTextAreaElement || source instanceof HTMLInputElement
                ? source.value
                : (source.textContent ?? "").trim();
            let copied = true;
            try {
                await navigator.clipboard.writeText(text);
            } catch {
                copied = false;
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(source);
                selection?.removeAllRanges();
                selection?.addRange(range);
            }
            if (status) status.textContent = (copied ? button.dataset.copied : button.dataset.failed) ?? "";
            clearTimeout(timer);
            timer = setTimeout(() => { if (status) status.textContent = ""; }, 4000);
        });
    }
}
