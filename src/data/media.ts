// Media helpers shared by the public pages and the back-office.
// This module must stay free of PocketBase imports: it is also bundled
// client-side (MediaUploader island), where `pb.ts` cannot run.

// A project's media list mixes three things: uploaded images, uploaded videos
// and YouTube links. The first two live in the `pictures` file field and are
// told apart by their extension; the third cannot (a file field only holds
// files) and lives in the `picture_embeds` JSON column instead.
export type MediaKind = "image" | "video" | "youtube";

// The `pictures` field of a project mixes images and videos: the type is
// told apart by the file extension. Works on bare filenames as well as
// PocketBase file URLs, which may carry a query string (thumb, token…).
export function isVideo(fileNameOrUrl: string): boolean {
    return /\.(mp4|mov|qt|webm)(\?|$)/i.test(fileNameOrUrl);
}

// A YouTube video id is exactly 11 URL-safe characters.
const VIDEO_ID = /^[\w-]{11}$/;
const YOUTUBE_HOST = /^(?:www\.|m\.)?(?:youtube(?:-nocookie)?\.com|youtu\.be)$/i;
// The path forms that carry the id directly, unlike /watch?v=<id>.
const ID_IN_PATH = /^\/(?:embed|shorts|live|v)\/([\w-]{11})$/;

// The id of a YouTube video, whatever URL form was pasted in the back-office
// (youtu.be/<id>, /watch?v=<id>, /embed/<id>, /shorts/<id>, /live/<id>), or
// `null` when the string is not a YouTube link at all. Everything that stores
// or renders an embed goes through this: it doubles as the validator.
export function youtubeId(url: string): string | null {
    let parsed: URL;
    try {
        parsed = new URL(url.trim());
    } catch {
        return null;
    }
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
    if (!YOUTUBE_HOST.test(parsed.hostname)) return null;

    if (/(^|\.)youtu\.be$/i.test(parsed.hostname)) {
        const id = parsed.pathname.slice(1);
        return VIDEO_ID.test(id) ? id : null;
    }
    if (parsed.pathname === "/watch") {
        const id = parsed.searchParams.get("v") ?? "";
        return VIDEO_ID.test(id) ? id : null;
    }
    return parsed.pathname.match(ID_IN_PATH)?.[1] ?? null;
}

export function isYouTube(url: string): boolean {
    return youtubeId(url) !== null;
}

export function mediaKind(url: string): MediaKind {
    if (isYouTube(url)) return "youtube";
    return isVideo(url) ? "video" : "image";
}

// Player URL of an embed. `youtube-nocookie.com` is YouTube's own privacy
// host: it holds back the tracking cookies until the visitor actually plays.
export function youtubeEmbedUrl(id: string, autoplay = false): string {
    const params = new URLSearchParams({ rel: "0", modestbranding: "1", playsinline: "1" });
    if (autoplay) params.set("autoplay", "1");
    return `https://www.youtube-nocookie.com/embed/${id}?${params}`;
}

// Still frame of a video, used where an iframe would be too heavy (the
// homepage carousel). `maxresdefault` only exists for videos uploaded in HD,
// so callers displaying it must fall back to `hqdefault`, which always does.
export function youtubeThumbnail(id: string, fallback = false): string {
    return `https://i.ytimg.com/vi/${id}/${fallback ? "hqdefault" : "maxresdefault"}.jpg`;
}

// One YouTube link of a project, with the index it occupies in the merged
// media list (see `mergeMedia`). Stored as-is in the `picture_embeds` column.
export type MediaEmbed = {
    url: string,
    position: number,
};

// The `picture_embeds` column is plain JSON, editable by hand from the
// PocketBase dashboard: never trust its shape. Anything that is not a valid
// YouTube link at a finite position is dropped rather than rendered broken.
export function parseEmbeds(value: unknown): MediaEmbed[] {
    if (!Array.isArray(value)) return [];
    return value
        .filter((entry): entry is MediaEmbed =>
            !!entry
            && typeof entry === "object"
            && typeof (entry as MediaEmbed).url === "string"
            && Number.isFinite((entry as MediaEmbed).position)
            && isYouTube((entry as MediaEmbed).url))
        .map(entry => ({ url: entry.url.trim(), position: entry.position }));
}

export type MediaSlot = {
    // Stored filename for an uploaded file, full URL for a YouTube embed.
    name: string,
    youtube: boolean,
};

// Rebuilds the display order of a project's media out of its two storages:
// each embed claims the index recorded with it, and the uploaded files fill
// the remaining slots in the order of the `pictures` field. An embed whose
// position is beyond the list simply lands at the end.
export function mergeMedia(files: string[], embeds: MediaEmbed[]): MediaSlot[] {
    const pending = [...embeds].sort((a, b) => a.position - b.position);
    const queue = [...files];
    const merged: MediaSlot[] = [];
    while (pending.length > 0 || queue.length > 0) {
        const takeEmbed = pending.length > 0 && (queue.length === 0 || pending[0].position <= merged.length);
        merged.push(takeEmbed
            ? { name: pending.shift()!.url, youtube: true }
            : { name: queue.shift()!, youtube: false });
    }
    return merged;
}
