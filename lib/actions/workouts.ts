"use server";

import { db } from "@/lib/db";
import { workouts, workoutSets, exercises } from "@/lib/db/schema";
import { eq, and, desc, gte, lte } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// UUIDを生成
function generateId() {
  return crypto.randomUUID();
}

// 今日の日付を取得
function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

export type WorkoutSetData = {
  exerciseId: string;
  setNumber: number;
  weightKg?: number;
  reps?: number;
  restSeconds?: number;
  rpe?: number;
  notes?: string;
};

export type WorkoutFormData = {
  workoutDate: string;
  durationMinutes?: number;
  notes?: string;
  sets: WorkoutSetData[];
};

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
