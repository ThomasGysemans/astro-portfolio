// The year Thomas started programming. The footer states it and "Behind the
// screen" counts the years from it, so both always agree, and the count moves
// on by itself every January.
export const CODING_SINCE = 2017;

export function yearsOfCode(now = new Date()): number {
    return now.getFullYear() - CODING_SINCE;
}
