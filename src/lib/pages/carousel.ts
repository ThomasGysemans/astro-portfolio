const carousel = document.querySelector("#carousel")! as HTMLDivElement;
const tabList = carousel.querySelector("& > div[role='tablist']") as HTMLDivElement;
const tabs = Array.from(carousel.querySelectorAll("& > div[role='tabpanel']")) as HTMLDivElement[];
const btns = Array.from(tabList.querySelectorAll("& > button")) as HTMLButtonElement[];
const tabMedia = Array.from(carousel.querySelectorAll("& > div[role='tabpanel'] > *")) as HTMLElement[];
const previewImages = Array.from(document.querySelectorAll(".illustrations-container > div")) as HTMLImageElement[];

let selectedIndex = 0;

for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', () => {
        goto(i);
    });
}

for (let i = 0; i < previewImages.length; i++) {
    previewImages[i].addEventListener('click', () => {
        open();
        goto(i);
    });
}

function goto(index: number): void {
    tabs[selectedIndex].setAttribute("aria-hidden", "true");
    btns[selectedIndex].setAttribute("aria-selected", "false");
    btns[index].setAttribute("aria-selected", "true");
    tabs[index].removeAttribute("aria-hidden");
    selectedIndex = index;
}

function next(): void {
    goto((selectedIndex + 1) % tabs.length);
}

function previous(): void {
    if (selectedIndex === 0) {
        goto(tabs.length - 1);
    } else {
        goto(selectedIndex - 1);
    }
}

function open(): void {
    carousel.removeAttribute("aria-hidden");
}

function close(): void {
    carousel.setAttribute("aria-hidden", "true");
}

window.addEventListener("keydown", (e: KeyboardEvent) => {
    if (carousel.getAttribute("aria-hidden") !== "true") {
        if (e.key === "ArrowLeft") {
            previous();
        } else if (e.key === "ArrowRight") {
            next();
        } else if (e.key === "Esc" || e.key === "Escape") {
            close();
        }
    }
});

// Click on the carousel will close it,
// unless the click is near the tablist or on the image.
for (const tabImg of tabMedia) {
    tabImg.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}
tabList.addEventListener('click', (e) => e.stopPropagation());
carousel.addEventListener('click', close);