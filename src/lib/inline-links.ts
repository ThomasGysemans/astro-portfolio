// A translated sentence may name a page as [visible text](key). Splitting it
// into runs keeps the whole sentence in one translatable string, while the
// page decides where each key leads, or that it leads nowhere (the run then
// renders as plain text).
export interface Run {
    text: string;
    href?: string;
}

const LINK = /\[([^\]]+)\]\(([\w-]+)\)/g;

export function inlineLinks(text: string, resolve: (key: string) => string | undefined): Run[] {
    const runs: Run[] = [];
    let last = 0;
    for (const match of text.matchAll(LINK)) {
        const at = match.index ?? 0;
        if (at > last) runs.push({ text: text.slice(last, at) });
        runs.push({ text: match[1]!, href: resolve(match[2]!) });
        last = at + match[0].length;
    }
    if (last < text.length) runs.push({ text: text.slice(last) });
    return runs;
}
