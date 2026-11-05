import { describe, expect, it } from "vitest";
import { CODING_SINCE, yearsOfCode } from "@lib/profile";

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
