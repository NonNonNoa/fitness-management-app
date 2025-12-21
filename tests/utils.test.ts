import { describe, it, expect } from "vitest";
import { cn, formatDate, generateId, calculateProgress, getToday } from "@/lib/utils";

describe("Utils", () => {
  describe("cn", () => {
    it("should merge class names correctly", () => {
      expect(cn("foo", "bar")).toBe("foo bar");
      expect(cn("foo", { bar: true })).toBe("foo bar");
      expect(cn("foo", { bar: false })).toBe("foo");
    });

    it("should handle tailwind merge", () => {
      expect(cn("px-2", "px-4")).toBe("px-4");
      expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    });
  });

  describe("formatDate", () => {
    it("should format date correctly", () => {
      const date = new Date("2024-12-22");
      const formatted = formatDate(date);
      expect(formatted).toContain("2024");
      expect(formatted).toContain("12");
      expect(formatted).toContain("22");
    });

    it("should handle string dates", () => {
      const formatted = formatDate("2024-12-22");
      expect(formatted).toContain("2024");
    });
  });

  describe("generateId", () => {
    it("should generate unique IDs", () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it("should generate valid UUIDs", () => {
      const id = generateId();
      expect(id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
      );
    });
  });

  describe("calculateProgress", () => {
    it("should calculate progress correctly", () => {
      expect(calculateProgress(50, 100, 0)).toBe(50);
      expect(calculateProgress(100, 100, 0)).toBe(100);
      expect(calculateProgress(0, 100, 0)).toBe(0);
    });

    it("should handle edge cases", () => {
      expect(calculateProgress(150, 100, 0)).toBe(100);
      expect(calculateProgress(-10, 100, 0)).toBe(0);
      expect(calculateProgress(50, 50, 50)).toBe(100);
    });

    it("should handle weight loss progress", () => {
      // Start: 80kg, Target: 70kg, Current: 75kg = 50%
      expect(calculateProgress(75, 70, 80)).toBe(50);
    });
  });

  describe("getToday", () => {
    it("should return today's date in YYYY-MM-DD format", () => {
      const today = getToday();
      expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});

