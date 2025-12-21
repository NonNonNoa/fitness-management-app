"use server";

import { db } from "@/lib/db";
import { goals, bodyCompositions } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// UUIDを生成
function generateId() {
  return crypto.randomUUID();
}

export type GoalType = "muscle_gain" | "weight_loss" | "weight_gain" | "strength";

export type GoalFormData = {
  goalType: GoalType;
  targetValue?: number;
  currentValue?: number;
  startDate: string;
  targetDate?: string;
};

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

// 体組成を記録
export async function recordBodyComposition(data: {
  recordDate: string;
  weightKg?: number;
  bodyFatPercentage?: number;
  muscleMassKg?: number;
  notes?: string;
}) {
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
