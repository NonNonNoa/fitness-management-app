/**
 * @fileoverview AI機能に関するサーバーアクション
 * 食事の画像分析、食事提案、トレーニングプラン生成、進捗予測などを提供する
 */
"use server";

import {
  analyzeImageForCalories,
  suggestMeals,
  generateWorkoutPlan,
  predictProgress,
  getMotivationMessage,
  type CalorieAnalysis,
  type MealSuggestion,
  type WorkoutPlan,
  type ProgressPrediction,
  type ChatResponse,
} from "@/lib/ai";
import { getSession } from "@/lib/auth";
import { getTodayWorkouts, getWorkouts } from "@/lib/actions/workouts";
import { getTodayMeals } from "@/lib/actions/meals";
import { getActiveGoals } from "@/lib/actions/goals";

/**
 * 認証を要求する内部ヘルパー関数
 * @throws {Error} 未認証の場合
 * @returns {Promise<User>} 認証済みユーザー情報
 */
async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

/**
 * 食事画像を分析してカロリーと栄養素を推定する
 * @param {string} imageBase64 - Base64エンコードされた画像データ
 * @returns {Promise<{success: boolean, data?: CalorieAnalysis, error?: string}>} 分析結果
 * @description AIを使用して画像から食品を識別し、推定カロリーと栄養素を返す
 * @example
 * const result = await analyzeFood(base64ImageData);
 * if (result.success) {
 *   console.log(result.data.totalCalories);
 * }
 */
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

/**
 * 目標に基づいた食事提案を取得する
 * @param {"weight_loss" | "weight_gain" | "muscle_gain" | "maintain"} goalType - 目標タイプ
 * @param {number} currentCalories - 現在の摂取カロリー
 * @param {number} targetCalories - 目標カロリー
 * @param {string} [preferences] - 食事の好み（オプション）
 * @returns {Promise<{success: boolean, data?: MealSuggestion, error?: string}>} 食事提案
 * @description AIが目標と現在の状況に基づいて最適な食事を提案する
 */
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
    console.log("[AI] Getting meal suggestions...");
    const suggestions = await suggestMeals(
      goalType,
      currentCalories,
      targetCalories,
      preferences
    );
    console.log("[AI] Meal suggestions received");
    return { success: true, data: suggestions };
  } catch (error) {
    console.error("Failed to get meal suggestions:", error);
    const errorMessage = error instanceof Error ? error.message : "提案の取得に失敗しました";
    console.error("[AI] Error details:", errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * カスタマイズされたトレーニングプランを生成する
 * @param {"muscle_gain" | "strength" | "weight_loss" | "endurance"} goalType - トレーニング目標
 * @param {"beginner" | "intermediate" | "advanced"} level - トレーニングレベル
 * @param {number} daysPerWeek - 週あたりのトレーニング日数
 * @param {string[]} equipment - 利用可能な器具
 * @param {string[]} [focusAreas] - 重点的に鍛えたい部位（オプション）
 * @returns {Promise<{success: boolean, data?: WorkoutPlan, error?: string}>} トレーニングプラン
 * @description AIがユーザーの目標と条件に基づいてパーソナライズされたプランを生成
 */
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
    console.log("[AI] Generating workout plan...");
    const plan = await generateWorkoutPlan(
      goalType,
      level,
      daysPerWeek,
      equipment,
      focusAreas
    );
    console.log("[AI] Workout plan generated");
    return { success: true, data: plan };
  } catch (error) {
    console.error("Failed to generate workout plan:", error);
    const errorMessage = error instanceof Error ? error.message : "プラン生成に失敗しました";
    console.error("[AI] Error details:", errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * 過去のデータに基づいて進捗を予測する
 * @param {string} goalType - 目標タイプ
 * @param {number} currentValue - 現在値
 * @param {number} targetValue - 目標値
 * @param {Array<{date: string, value: number}>} historicalData - 過去の記録データ
 * @returns {Promise<{success: boolean, data?: ProgressPrediction, error?: string}>} 進捗予測
 * @description AIが過去のトレンドを分析し、目標達成までの予測を提供する
 */
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

/**
 * モチベーションメッセージを取得
 * @param {string} userMessage - ユーザーのメッセージ
 * @returns {Promise<{success: boolean, data?: ChatResponse, error?: string}>} モチベーションメッセージ
 * @description マッスルマスターキャラクターがユーザーの進捗を考慮してモチベーションを上げるメッセージを生成
 */
export async function getMotivationChat(userMessage: string): Promise<{
  success: boolean;
  data?: ChatResponse;
  error?: string;
}> {
  try {
    await requireAuth();

    // ユーザーの進捗情報を取得
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 7); // 7日前から

    const [todayWorkouts, weekWorkouts, todayMeals, activeGoals] = await Promise.all([
      getTodayWorkouts(),
      getWorkouts(
        weekStart.toISOString().split("T")[0],
        today.toISOString().split("T")[0]
      ),
      getTodayMeals(),
      getActiveGoals(),
    ]);

    const workoutsThisWeek = Array.isArray(weekWorkouts) ? weekWorkouts.length : 0;
    const todayCalories = todayMeals.success
      ? todayMeals.data?.reduce((sum, m) => sum + (m.totalCalories || 0), 0) || 0
      : 0;
    const goalsCount = activeGoals.success ? activeGoals.data?.length || 0 : 0;

    const response = await getMotivationMessage(userMessage, {
      workoutsThisWeek,
      caloriesToday: todayCalories,
      activeGoals: goalsCount,
    });

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Failed to get motivation chat:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
