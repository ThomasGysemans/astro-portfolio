export const ACCEPTED_EXTENSIONS = ["image/png", "image/jpeg", "image/gif", "image/svg+xml", "image/webp"];
export const MAXIMUM_IMAGE_SIZE = 5; // 5 MiB

export function bytesToMiB(bytes: number): number {
    return bytes / 1_048_576;
}

export function bytesToMiBStr(bytes: number): string {
    return bytesToMiB(bytes).toPrecision(4);
}

export function isValidFile(file: File): boolean {
    return file.size > 0 &&
        bytesToMiB(file.size) <= MAXIMUM_IMAGE_SIZE &&
        ACCEPTED_EXTENSIONS.includes(file.type);
}