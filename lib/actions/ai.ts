"use server";

import {
  analyzeImageForCalories,
  suggestMeals,
  generateWorkoutPlan,
  predictProgress,
  type CalorieAnalysis,
  type MealSuggestion,
  type WorkoutPlan,
  type ProgressPrediction,
} from "@/lib/ai";
import { getSession } from "@/lib/auth";

async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function analyzeFood(imageBase64: string): Promise<{
  success: boolean;
  data?: CalorieAnalysis;
  error?: string;
}> {
  try {
    await requireAuth();
    const analysis = await analyzeImageForCalories(imageBase64);
    return { success: true, data: analysis };
  } catch (error) {
    console.error("Failed to analyze food:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "分析に失敗しました",
    };
  }
}

export async function getMealSuggestions(
  goalType: "weight_loss" | "weight_gain" | "muscle_gain" | "maintain",
  currentCalories: number,
  targetCalories: number,
  preferences?: string
): Promise<{
  success: boolean;
  data?: MealSuggestion;
  error?: string;
}> {
  try {
    await requireAuth();
    const suggestions = await suggestMeals(
      goalType,
      currentCalories,
      targetCalories,
      preferences
    );
    return { success: true, data: suggestions };
  } catch (error) {
    console.error("Failed to get meal suggestions:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "提案の取得に失敗しました",
    };
  }
}

export async function getWorkoutPlan(
  goalType: "muscle_gain" | "strength" | "weight_loss" | "endurance",
  level: "beginner" | "intermediate" | "advanced",
  daysPerWeek: number,
  equipment: string[],
  focusAreas?: string[]
): Promise<{
  success: boolean;
  data?: WorkoutPlan;
  error?: string;
}> {
  try {
    await requireAuth();
    const plan = await generateWorkoutPlan(
      goalType,
      level,
      daysPerWeek,
      equipment,
      focusAreas
    );
    return { success: true, data: plan };
  } catch (error) {
    console.error("Failed to generate workout plan:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "プラン生成に失敗しました",
    };
  }
}

export async function getProgressPrediction(
  goalType: string,
  currentValue: number,
  targetValue: number,
  historicalData: { date: string; value: number }[]
): Promise<{
  success: boolean;
  data?: ProgressPrediction;
  error?: string;
}> {
  try {
    await requireAuth();
    const prediction = await predictProgress(
      goalType,
      currentValue,
      targetValue,
      historicalData
    );
    return { success: true, data: prediction };
  } catch (error) {
    console.error("Failed to predict progress:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "予測に失敗しました",
    };
  }
}

