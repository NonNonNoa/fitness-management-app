/**
 * @fileoverview 目標管理に関するサーバーアクション
 * 目標と体組成の作成、取得、更新、削除などの操作を提供する
 */
"use server";

import { db } from "@/lib/db";
import { goals, bodyCompositions } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * UUIDを生成する
 * @returns {string} 生成されたUUID
 */
function generateId(): string {
  return crypto.randomUUID();
}

/**
 * 目標タイプの型定義
 * - muscle_gain: 筋肉量アップ
 * - weight_loss: 減量
 * - weight_gain: 増量
 * - strength: 筋力向上
 */
export type GoalType = "muscle_gain" | "weight_loss" | "weight_gain" | "strength";

/**
 * 目標のフォームデータ型定義
 */
export type GoalFormData = {
  /** 目標タイプ */
  goalType: GoalType;
  /** 目標値（筋力向上時の目標重量 kg） */
  targetValue?: number;
  /** 現在値（筋力向上時の現在重量 kg） */
  currentValue?: number;
  /** 目標体重 (kg) - 減量・増量時に使用 */
  targetWeightKg?: number;
  /** 現在体重 (kg) - 減量・増量時に使用 */
  currentWeightKg?: number;
  /** 目標筋肉量 (kg) - 筋肉量アップ時に使用 */
  targetMuscleMassKg?: number;
  /** 現在筋肉量 (kg) - 筋肉量アップ時に使用 */
  currentMuscleMassKg?: number;
  /** 目標腕回り (cm) - 筋肉量アップ時に使用 */
  targetArmCm?: number;
  /** 現在腕回り (cm) - 筋肉量アップ時に使用 */
  currentArmCm?: number;
  /** 目標胸囲 (cm) - 筋肉量アップ時に使用 */
  targetChestCm?: number;
  /** 現在胸囲 (cm) - 筋肉量アップ時に使用 */
  currentChestCm?: number;
  /** 目標ウエスト (cm) - 筋肉量アップ時に使用 */
  targetWaistCm?: number;
  /** 現在ウエスト (cm) - 筋肉量アップ時に使用 */
  currentWaistCm?: number;
  /** 種目名 (筋力向上時に使用) */
  exerciseName?: string;
  /** 開始日 (YYYY-MM-DD形式) */
  startDate: string;
  /** 目標達成日 (YYYY-MM-DD形式) */
  targetDate?: string;
};

/**
 * 新しい目標を作成する
 * @param {GoalFormData} data - 目標のフォームデータ
 * @returns {Promise<{success: boolean, goalId?: string, error?: string}>} 作成結果
 * @example
 * const result = await createGoal({
 *   goalType: "weight_loss",
 *   targetValue: 70,
 *   currentValue: 75,
 *   startDate: "2024-01-01"
 * });
 */
export async function createGoal(data: GoalFormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { success: false, error: "認証が必要です" };
  }

  try {
    const goalId = generateId();

    await db.insert(goals).values({
      id: goalId,
      userId: session.user.id,
      goalType: data.goalType,
      targetValue: data.targetValue,
      currentValue: data.currentValue,
      targetWeightKg: data.targetWeightKg,
      currentWeightKg: data.currentWeightKg,
      targetMuscleMassKg: data.targetMuscleMassKg,
      currentMuscleMassKg: data.currentMuscleMassKg,
      targetArmCm: data.targetArmCm,
      currentArmCm: data.currentArmCm,
      targetChestCm: data.targetChestCm,
      currentChestCm: data.currentChestCm,
      targetWaistCm: data.targetWaistCm,
      currentWaistCm: data.currentWaistCm,
      exerciseName: data.exerciseName,
      startDate: data.startDate,
      targetDate: data.targetDate,
      isActive: true,
    });

    revalidatePath("/goals");
    revalidatePath("/dashboard");

    return { success: true, goalId };
  } catch (error) {
    console.error("目標の作成に失敗しました:", error);
    return { success: false, error: "目標の作成に失敗しました" };
  }
}

/**
 * ユーザーの目標一覧を取得する
 * @param {boolean} [activeOnly=false] - アクティブな目標のみ取得するか
 * @returns {Promise<Array>} 目標の配列（作成日降順）
 */
export async function getGoals(activeOnly = false) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return [];
  }

  try {
    const conditions = [eq(goals.userId, session.user.id)];
    if (activeOnly) {
      conditions.push(eq(goals.isActive, true));
    }

    const result = await db
      .select()
      .from(goals)
      .where(and(...conditions))
      .orderBy(desc(goals.createdAt));

    return result;
  } catch (error) {
    console.error("目標の取得に失敗しました:", error);
    return [];
  }
}

/**
 * 指定IDの目標を取得する
 * @param {string} goalId - 目標ID
 * @returns {Promise<Object|null>} 目標オブジェクト、または見つからない場合はnull
 */
export async function getGoal(goalId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return null;
  }

  try {
    const result = await db
      .select()
      .from(goals)
      .where(and(eq(goals.id, goalId), eq(goals.userId, session.user.id)))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error("目標の取得に失敗しました:", error);
    return null;
  }
}

/**
 * 既存の目標を更新する
 * @param {string} goalId - 更新する目標のID
 * @param {GoalFormData} data - 新しい目標データ
 * @returns {Promise<{success: boolean, goalId?: string, error?: string}>} 更新結果
 */
export async function updateGoal(goalId: string, data: GoalFormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { success: false, error: "認証が必要です" };
  }

  try {
    // 所有者チェック
    const existingGoal = await db
      .select()
      .from(goals)
      .where(and(eq(goals.id, goalId), eq(goals.userId, session.user.id)))
      .limit(1);

    if (existingGoal.length === 0) {
      return { success: false, error: "目標が見つかりません" };
    }

    await db
      .update(goals)
      .set({
        goalType: data.goalType,
        targetValue: data.targetValue,
        currentValue: data.currentValue,
        targetWeightKg: data.targetWeightKg,
        currentWeightKg: data.currentWeightKg,
        targetMuscleMassKg: data.targetMuscleMassKg,
        currentMuscleMassKg: data.currentMuscleMassKg,
        targetArmCm: data.targetArmCm,
        currentArmCm: data.currentArmCm,
        targetChestCm: data.targetChestCm,
        currentChestCm: data.currentChestCm,
        targetWaistCm: data.targetWaistCm,
        currentWaistCm: data.currentWaistCm,
        exerciseName: data.exerciseName,
        startDate: data.startDate,
        targetDate: data.targetDate,
        updatedAt: new Date(),
      })
      .where(eq(goals.id, goalId));

    revalidatePath("/goals");
    revalidatePath(`/goals/${goalId}`);
    revalidatePath("/dashboard");

    return { success: true, goalId };
  } catch (error) {
    console.error("目標の更新に失敗しました:", error);
    return { success: false, error: "目標の更新に失敗しました" };
  }
}

/**
 * 目標の進捗（現在値）を更新する
 * @param {string} goalId - 更新する目標のID
 * @param {number} currentValue - 新しい現在値
 * @returns {Promise<{success: boolean, error?: string}>} 更新結果
 */
export async function updateGoalProgress(goalId: string, currentValue: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { success: false, error: "認証が必要です" };
  }

  try {
    // 所有者チェック
    const goal = await db
      .select()
      .from(goals)
      .where(and(eq(goals.id, goalId), eq(goals.userId, session.user.id)))
      .limit(1);

    if (goal.length === 0) {
      return { success: false, error: "目標が見つかりません" };
    }

    await db
      .update(goals)
      .set({ currentValue, updatedAt: new Date() })
      .where(eq(goals.id, goalId));

    revalidatePath("/goals");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("目標の更新に失敗しました:", error);
    return { success: false, error: "目標の更新に失敗しました" };
  }
}

/**
 * 目標のアクティブ状態を切り替える
 * @param {string} goalId - 切り替える目標のID
 * @returns {Promise<{success: boolean, error?: string}>} 切り替え結果
 */
export async function toggleGoalActive(goalId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { success: false, error: "認証が必要です" };
  }

  try {
    const goal = await db
      .select()
      .from(goals)
      .where(and(eq(goals.id, goalId), eq(goals.userId, session.user.id)))
      .limit(1);

    if (goal.length === 0) {
      return { success: false, error: "目標が見つかりません" };
    }

    await db
      .update(goals)
      .set({ isActive: !goal[0].isActive, updatedAt: new Date() })
      .where(eq(goals.id, goalId));

    revalidatePath("/goals");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("目標の更新に失敗しました:", error);
    return { success: false, error: "目標の更新に失敗しました" };
  }
}

/**
 * 目標を削除する
 * @param {string} goalId - 削除する目標のID
 * @returns {Promise<{success: boolean, error?: string}>} 削除結果
 */
export async function deleteGoal(goalId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { success: false, error: "認証が必要です" };
  }

  try {
    const goal = await db
      .select()
      .from(goals)
      .where(and(eq(goals.id, goalId), eq(goals.userId, session.user.id)))
      .limit(1);

    if (goal.length === 0) {
      return { success: false, error: "目標が見つかりません" };
    }

    await db.delete(goals).where(eq(goals.id, goalId));

    revalidatePath("/goals");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("目標の削除に失敗しました:", error);
    return { success: false, error: "目標の削除に失敗しました" };
  }
}

/**
 * 体組成データ型定義
 */
type BodyCompositionData = {
  /** 記録日 (YYYY-MM-DD形式) */
  recordDate: string;
  /** 体重 (kg) */
  weightKg?: number;
  /** 体脂肪率 (%) */
  bodyFatPercentage?: number;
  /** 筋肉量 (kg) */
  muscleMassKg?: number;
  /** メモ */
  notes?: string;
};

/**
 * 体組成を記録する
 * @param {BodyCompositionData} data - 体組成データ
 * @returns {Promise<{success: boolean, error?: string}>} 記録結果
 */
export async function recordBodyComposition(data: BodyCompositionData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { success: false, error: "認証が必要です" };
  }

  try {
    await db.insert(bodyCompositions).values({
      id: generateId(),
      userId: session.user.id,
      recordDate: data.recordDate,
      weightKg: data.weightKg,
      bodyFatPercentage: data.bodyFatPercentage,
      muscleMassKg: data.muscleMassKg,
      notes: data.notes,
    });

    revalidatePath("/goals");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("体組成の記録に失敗しました:", error);
    return { success: false, error: "体組成の記録に失敗しました" };
  }
}

/**
 * 体組成の記録一覧を取得する
 * @param {number} [limit=30] - 取得件数
 * @returns {Promise<Array>} 体組成記録の配列（記録日降順）
 */
export async function getBodyCompositions(limit = 30) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return [];
  }

  try {
    const result = await db
      .select()
      .from(bodyCompositions)
      .where(eq(bodyCompositions.userId, session.user.id))
      .orderBy(desc(bodyCompositions.recordDate))
      .limit(limit);

    return result;
  } catch (error) {
    console.error("体組成の取得に失敗しました:", error);
    return [];
  }
}

/**
 * アクティブな目標一覧を取得する
 * @returns {Promise<{success: boolean, data: Array, error?: string}>} アクティブな目標
 */
export async function getActiveGoals() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { success: false, error: "認証が必要です", data: [] };
  }

  try {
    const result = await db
      .select()
      .from(goals)
      .where(and(eq(goals.userId, session.user.id), eq(goals.isActive, true)))
      .orderBy(desc(goals.createdAt));

    return { success: true, data: result };
  } catch (error) {
    console.error("目標の取得に失敗しました:", error);
    return { success: false, error: "取得に失敗しました", data: [] };
  }
}

/**
 * 最近の体組成記録を取得する
 * @param {number} [limit=14] - 取得件数
 * @returns {Promise<{success: boolean, data: Array, error?: string}>} 最近の体組成記録
 */
export async function getRecentBodyCompositions(limit = 14) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { success: false, error: "認証が必要です", data: [] };
  }

  try {
    const result = await db
      .select()
      .from(bodyCompositions)
      .where(eq(bodyCompositions.userId, session.user.id))
      .orderBy(desc(bodyCompositions.recordDate))
      .limit(limit);

    return { success: true, data: result };
  } catch (error) {
    console.error("体組成の取得に失敗しました:", error);
    return { success: false, error: "取得に失敗しました", data: [] };
  }
}
