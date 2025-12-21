import { describe, it, expect } from "vitest";
import { getMealTypeLabel } from "@/lib/utils/meal-helpers";
import { getBodyPartLabel } from "@/lib/utils/workout-helpers";
import { getGoalTypeLabel, calculateProgress as calcGoalProgress } from "@/lib/utils/goal-helpers";

describe("Meal Helpers", () => {
  describe("getMealTypeLabel", () => {
    it("should return correct labels for meal types", () => {
      expect(getMealTypeLabel("breakfast")).toBe("朝食");
      expect(getMealTypeLabel("lunch")).toBe("昼食");
      expect(getMealTypeLabel("dinner")).toBe("夕食");
      expect(getMealTypeLabel("snack")).toBe("間食");
    });

    it("should return the input for unknown types", () => {
      expect(getMealTypeLabel("unknown")).toBe("unknown");
    });
  });
});

describe("Workout Helpers", () => {
  describe("getBodyPartLabel", () => {
    it("should return correct labels for body parts", () => {
      expect(getBodyPartLabel("chest")).toBe("胸");
      expect(getBodyPartLabel("back")).toBe("背中");
      expect(getBodyPartLabel("legs")).toBe("脚");
      expect(getBodyPartLabel("shoulders")).toBe("肩");
      expect(getBodyPartLabel("arms")).toBe("腕");
      expect(getBodyPartLabel("core")).toBe("体幹");
    });

    it("should return the input for unknown parts", () => {
      expect(getBodyPartLabel("unknown")).toBe("unknown");
    });
  });
});

describe("Goal Helpers", () => {
  describe("getGoalTypeLabel", () => {
    it("should return correct labels for goal types", () => {
      expect(getGoalTypeLabel("weight_loss")).toBe("減量");
      expect(getGoalTypeLabel("weight_gain")).toBe("増量");
      expect(getGoalTypeLabel("muscle_gain")).toBe("筋肉量アップ");
      expect(getGoalTypeLabel("strength")).toBe("筋力向上");
    });

    it("should return the input for unknown types", () => {
      expect(getGoalTypeLabel("unknown")).toBe("unknown");
    });
  });

  describe("calculateProgress", () => {
    it("should calculate progress correctly for weight gain", () => {
      // Start: 60kg, Current: 70kg, Target: 80kg = 50%
      expect(calcGoalProgress("weight_gain", 70, 80, 60)).toBe(50);
      expect(calcGoalProgress("weight_gain", 80, 80, 60)).toBe(100);
    });

    it("should calculate progress correctly for weight loss", () => {
      // Start: 80kg, Current: 75kg, Target: 70kg = 50%
      expect(calcGoalProgress("weight_loss", 75, 70, 80)).toBe(50);
    });

    it("should return 0 when values are null or undefined", () => {
      expect(calcGoalProgress("weight_gain", null, 100, 60)).toBe(0);
      expect(calcGoalProgress("weight_gain", 70, null, 60)).toBe(0);
    });

    it("should return 100 when at target", () => {
      expect(calcGoalProgress("weight_gain", 80, 80, 60)).toBe(100);
    });

    it("should clamp progress to max 100", () => {
      // Start: 60, Current: 100 (over target), Target: 80
      expect(calcGoalProgress("weight_gain", 100, 80, 60)).toBe(100);
    });
  });
});
