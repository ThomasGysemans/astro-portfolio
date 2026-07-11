// Media helpers shared by the public pages and the back-office.
// This module must stay free of PocketBase imports: it is also bundled
// client-side (MediaUploader island), where `pb.ts` cannot run.

// The `pictures` field of a project mixes images and videos: the type is
// told apart by the file extension. Works on bare filenames as well as
// PocketBase file URLs, which may carry a query string (thumb, token…).
export function isVideo(fileNameOrUrl: string): boolean {
    return /\.(mp4|mov|qt|webm)(\?|$)/i.test(fileNameOrUrl);
}
