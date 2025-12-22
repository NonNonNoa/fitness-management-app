/**
 * @fileoverview トレーニング記録に関するサーバーアクション
 * トレーニングの作成、取得、更新、削除などの操作を提供する
 */
"use server";

import { db } from "@/lib/db";
import { workouts, workoutSets, exercises } from "@/lib/db/schema";
import { eq, and, desc, gte, lte } from "drizzle-orm";
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
 * 今日の日付をYYYY-MM-DD形式で取得する
 * @returns {string} 今日の日付文字列
 */
function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * トレーニングセットのデータ型定義
 */
export type WorkoutSetData = {
  /** 種目ID */
  exerciseId: string;
  /** セット番号 */
  setNumber: number;
  /** 重量 (kg) */
  weightKg?: number;
  /** レップ数 */
  reps?: number;
  /** 休憩時間 (秒) */
  restSeconds?: number;
  /** RPE (主観的運動強度、1-10) */
  rpe?: number;
  /** メモ */
  notes?: string;
};

/**
 * トレーニング記録のフォームデータ型定義
 */
export type WorkoutFormData = {
  /** トレーニング日 (YYYY-MM-DD形式) */
  workoutDate: string;
  /** トレーニング時間 (分) */
  durationMinutes?: number;
  /** メモ */
  notes?: string;
  /** セットの配列 */
  sets: WorkoutSetData[];
};

/**
 * 新しいトレーニング記録を作成する
 * @param {WorkoutFormData} data - トレーニングのフォームデータ
 * @returns {Promise<{success: boolean, workoutId?: string, error?: string}>} 作成結果
 * @example
 * const result = await createWorkout({
 *   workoutDate: "2024-01-01",
 *   durationMinutes: 60,
 *   sets: [{ exerciseId: "xxx", setNumber: 1, weightKg: 100, reps: 10 }]
 * });
 */
export async function createWorkout(data: WorkoutFormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { success: false, error: "認証が必要です" };
  }

  try {
    const workoutId = generateId();

    // 総ボリュームを計算 (重量 × レップ数の合計)
    const totalVolume = data.sets.reduce(
      (sum, set) => sum + (set.weightKg || 0) * (set.reps || 0),
      0
    );

    // 消費カロリーを推定 (簡易計算: セット数 × 10kcal程度)
    const caloriesBurned = data.sets.length * 10;

    // ワークアウトレコードを作成
    await db.insert(workouts).values({
      id: workoutId,
      userId: session.user.id,
      workoutDate: data.workoutDate,
      durationMinutes: data.durationMinutes,
      totalVolume,
      caloriesBurned,
      notes: data.notes,
    });

    // セットを作成
    if (data.sets.length > 0) {
      await db.insert(workoutSets).values(
        data.sets.map((set) => ({
          id: generateId(),
          workoutId,
          exerciseId: set.exerciseId,
          setNumber: set.setNumber,
          weightKg: set.weightKg,
          reps: set.reps,
          restSeconds: set.restSeconds,
          rpe: set.rpe,
          notes: set.notes,
        }))
      );
    }

    revalidatePath("/workouts");
    revalidatePath("/dashboard");

    return { success: true, workoutId };
  } catch (error) {
    console.error("トレーニング記録の作成に失敗しました:", error);
    return { success: false, error: "トレーニング記録の作成に失敗しました" };
  }
}

/**
 * ユーザーのトレーニング記録一覧を取得する
 * @param {string} [startDate] - 取得開始日 (YYYY-MM-DD形式)
 * @param {string} [endDate] - 取得終了日 (YYYY-MM-DD形式)
 * @returns {Promise<Array>} トレーニング記録の配列（日付降順）
 */
export async function getWorkouts(startDate?: string, endDate?: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return [];
  }

  try {
    const conditions = [eq(workouts.userId, session.user.id)];

    if (startDate) {
      conditions.push(gte(workouts.workoutDate, startDate));
    }
    if (endDate) {
      conditions.push(lte(workouts.workoutDate, endDate));
    }

    const result = await db
      .select()
      .from(workouts)
      .where(and(...conditions))
      .orderBy(desc(workouts.workoutDate));

    return result;
  } catch (error) {
    console.error("トレーニング記録の取得に失敗しました:", error);
    return [];
  }
}

/**
 * 指定IDのトレーニング記録と関連するセットを取得する
 * @param {string} workoutId - トレーニング記録ID
 * @returns {Promise<Object|null>} トレーニング記録とセット情報、または見つからない場合はnull
 */
export async function getWorkoutWithSets(workoutId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return null;
  }

  try {
    const workout = await db
      .select()
      .from(workouts)
      .where(and(eq(workouts.id, workoutId), eq(workouts.userId, session.user.id)))
      .limit(1);

    if (workout.length === 0) {
      return null;
    }

    const sets = await db
      .select({
        set: workoutSets,
        exercise: exercises,
      })
      .from(workoutSets)
      .leftJoin(exercises, eq(workoutSets.exerciseId, exercises.id))
      .where(eq(workoutSets.workoutId, workoutId))
      .orderBy(workoutSets.setNumber);

    return { ...workout[0], sets };
  } catch (error) {
    console.error("トレーニング記録の取得に失敗しました:", error);
    return null;
  }
}

/**
 * トレーニング記録を削除する
 * @param {string} workoutId - 削除するトレーニング記録のID
 * @returns {Promise<{success: boolean, error?: string}>} 削除結果
 */
export async function deleteWorkout(workoutId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { success: false, error: "認証が必要です" };
  }

  try {
    // 所有者チェック
    const workout = await db
      .select()
      .from(workouts)
      .where(and(eq(workouts.id, workoutId), eq(workouts.userId, session.user.id)))
      .limit(1);

    if (workout.length === 0) {
      return { success: false, error: "トレーニング記録が見つかりません" };
    }

    // 削除（workout_setsはカスケード削除）
    await db.delete(workouts).where(eq(workouts.id, workoutId));

    revalidatePath("/workouts");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("トレーニング記録の削除に失敗しました:", error);
    return { success: false, error: "トレーニング記録の削除に失敗しました" };
  }
}

/**
 * トレーニング種目一覧を取得する
 * @param {string} [bodyPart] - 部位でフィルタリング (chest, back, legs, shoulders, arms, core)
 * @returns {Promise<Array>} 種目の配列
 */
export async function getExercises(bodyPart?: string) {
  try {
    if (bodyPart) {
      return await db
        .select()
        .from(exercises)
        .where(eq(exercises.bodyPart, bodyPart))
        .orderBy(exercises.name);
    }
    return await db.select().from(exercises).orderBy(exercises.bodyPart, exercises.name);
  } catch (error) {
    console.error("種目の取得に失敗しました:", error);
    return [];
  }
}

/**
 * 今日の総セット数を取得する
 * @returns {Promise<number>} 今日の総セット数
 */
export async function getTodaySets() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return 0;
  }

  try {
    const today = getTodayDate();
    const todayWorkouts = await db
      .select()
      .from(workouts)
      .where(and(eq(workouts.userId, session.user.id), eq(workouts.workoutDate, today)));

    if (todayWorkouts.length === 0) {
      return 0;
    }

    const workoutIds = todayWorkouts.map((w) => w.id);
    let totalSets = 0;

    for (const id of workoutIds) {
      const sets = await db
        .select()
        .from(workoutSets)
        .where(eq(workoutSets.workoutId, id));
      totalSets += sets.length;
    }

    return totalSets;
  } catch (error) {
    console.error("セット数の取得に失敗しました:", error);
    return 0;
  }
}

/**
 * 今日のトレーニング記録一覧を取得する
 * @returns {Promise<{success: boolean, data: Array, error?: string}>} 今日のトレーニング記録
 */
export async function getTodayWorkouts() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { success: false, error: "認証が必要です", data: [] };
  }

  try {
    const today = getTodayDate();
    const result = await db
      .select()
      .from(workouts)
      .where(and(eq(workouts.userId, session.user.id), eq(workouts.workoutDate, today)));

    return { success: true, data: result };
  } catch (error) {
    console.error("トレーニング記録の取得に失敗しました:", error);
    return { success: false, error: "取得に失敗しました", data: [] };
  }
}

/**
 * 最近のトレーニング記録を取得する
 * @param {number} [limit=10] - 取得件数
 * @returns {Promise<{success: boolean, data: Array, error?: string}>} 最近のトレーニング記録
 */
export async function getRecentWorkouts(limit = 10) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { success: false, error: "認証が必要です", data: [] };
  }

  try {
    const result = await db
      .select()
      .from(workouts)
      .where(eq(workouts.userId, session.user.id))
      .orderBy(desc(workouts.workoutDate))
      .limit(limit);

    return { success: true, data: result };
  } catch (error) {
    console.error("トレーニング記録の取得に失敗しました:", error);
    return { success: false, error: "取得に失敗しました", data: [] };
  }
}

/**
 * 既存のトレーニング記録を更新する
 * @param {string} workoutId - 更新するトレーニング記録のID
 * @param {WorkoutFormData} data - 新しいトレーニングデータ
 * @returns {Promise<{success: boolean, workoutId?: string, error?: string}>} 更新結果
 */
export async function updateWorkout(workoutId: string, data: WorkoutFormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { success: false, error: "認証が必要です" };
  }

  try {
    // 所有者チェック
    const existingWorkout = await db
      .select()
      .from(workouts)
      .where(and(eq(workouts.id, workoutId), eq(workouts.userId, session.user.id)))
      .limit(1);

    if (existingWorkout.length === 0) {
      return { success: false, error: "トレーニング記録が見つかりません" };
    }

    // 総ボリュームを計算 (重量 × レップ数の合計)
    const totalVolume = data.sets.reduce(
      (sum, set) => sum + (set.weightKg || 0) * (set.reps || 0),
      0
    );

    // 消費カロリーを推定 (簡易計算: セット数 × 10kcal程度)
    const caloriesBurned = data.sets.length * 10;

    // ワークアウトレコードを更新
    await db
      .update(workouts)
      .set({
        workoutDate: data.workoutDate,
        durationMinutes: data.durationMinutes,
        totalVolume,
        caloriesBurned,
        notes: data.notes,
        updatedAt: new Date(),
      })
      .where(eq(workouts.id, workoutId));

    // 既存のセットを削除
    await db.delete(workoutSets).where(eq(workoutSets.workoutId, workoutId));

    // 新しいセットを作成
    if (data.sets.length > 0) {
      await db.insert(workoutSets).values(
        data.sets.map((set) => ({
          id: generateId(),
          workoutId,
          exerciseId: set.exerciseId,
          setNumber: set.setNumber,
          weightKg: set.weightKg,
          reps: set.reps,
          restSeconds: set.restSeconds,
          rpe: set.rpe,
          notes: set.notes,
        }))
      );
    }

    revalidatePath("/workouts");
    revalidatePath(`/workouts/${workoutId}`);
    revalidatePath("/dashboard");

    return { success: true, workoutId };
  } catch (error) {
    console.error("トレーニング記録の更新に失敗しました:", error);
    return { success: false, error: "トレーニング記録の更新に失敗しました" };
  }
}
