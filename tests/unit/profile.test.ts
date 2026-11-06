import { describe, expect, it } from "vitest";
import { averageRating, CODING_SINCE, yearsOfCode } from "@lib/profile";

// The footer states the start year and "Behind the screen" counts from it:
// the count must follow the calendar, not a number typed once.
describe("yearsOfCode", () => {
    it("counts whole calendar years since the start year", () => {
        expect(yearsOfCode(new Date(2026, 10, 5))).toBe(2026 - CODING_SINCE);
    });

    it("moves on by itself on the first of January", () => {
        expect(yearsOfCode(new Date(2027, 0, 1))).toBe(yearsOfCode(new Date(2026, 11, 31)) + 1);
    });
});

// The third stat of "Behind the screen": it must follow the reviews stored in
// PocketBase and disappear when there are none.
describe("averageRating", () => {
    it("averages the star ratings to one decimal", () => {
        expect(averageRating([5, 5, 5])).toBe(5);
        expect(averageRating([5, 4, 4])).toBe(4.3);
    });

    it("has no average without any review", () => {
        expect(averageRating([])).toBeUndefined();
    });
});
