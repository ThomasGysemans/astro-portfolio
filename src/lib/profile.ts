// The year Thomas started programming. The footer states it and "Behind the
// screen" counts the years from it, so both always agree, and the count moves
// on by itself every January.
export const CODING_SINCE = 2017;

export function yearsOfCode(now = new Date()): number {
    return now.getFullYear() - CODING_SINCE;
}

// The clients' average star rating, to one decimal. Without any review there
// is no average (rather than a 0 that would read as a bad mark).
export function averageRating(ratings: number[]): number | undefined {
    if (!ratings.length) return undefined;
    return Math.round(ratings.reduce((sum, r) => sum + r, 0) / ratings.length * 10) / 10;
}
