export function createElement<T extends HTMLElement>(tagName: string, attributes?: [string, string][], textContent?: string): T {
    const element = document.createElement(tagName) as any as T;
    if (attributes) {
        for (const attr of attributes) {
            if (attr[0] === "class") {
                element.classList.add(attr[1]);
            } else {
                element.setAttribute(attr[0], attr[1]);
            }
        }
    }
    if (textContent) element.textContent = textContent;
    return element;
}

export function hideElement(element: HTMLElement): void {
    element.setAttribute("aria-hidden", "true");
}

export function showElement(element: HTMLElement): void {
    element.removeAttribute("aria-hidden");
}