/**
 * @fileoverview 食事記録に関するサーバーアクション
 * 食事の作成、取得、更新、削除などの操作を提供する
 */
"use server";

import { db } from "@/lib/db";
import { meals, mealItems } from "@/lib/db/schema";
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
  return new Date().toLocaleDateString('sv-SE');
}

/**
 * 食事記録のフォームデータの型定義
 */
export type MealFormData = {
  /** 食事日 (YYYY-MM-DD形式) */
  mealDate: string;
  /** 食事時間 (HH:MM形式) */
  mealTime?: string;
  /** 食事タイプ */
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  /** 食品アイテムの配列 */
  items: {
    /** 食品名 */
    foodName: string;
    /** 数量 */
    quantity?: number;
    /** 単位 (g, ml, 個など) */
    unit?: string;
    /** カロリー (kcal) */
    calories?: number;
    /** タンパク質 (g) */
    protein?: number;
    /** 炭水化物 (g) */
    carbs?: number;
    /** 脂質 (g) */
    fats?: number;
  }[];
  /** メモ */
  notes?: string;
};

/**
 * 新しい食事記録を作成する
 * @param {MealFormData} data - 食事記録のフォームデータ
 * @returns {Promise<{success: boolean, mealId?: string, error?: string}>} 作成結果
 * @example
 * const result = await createMeal({
 *   mealDate: "2024-01-01",
 *   mealType: "lunch",
 *   items: [{ foodName: "ご飯", calories: 300 }]
 * });
 */
export async function createMeal(data: MealFormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { success: false, error: "認証が必要です" };
  }

  try {
    const mealId = generateId();

    // 総カロリー・栄養素を計算
    const totalCalories = data.items.reduce((sum, item) => sum + (item.calories || 0), 0);
    const totalProtein = data.items.reduce((sum, item) => sum + (item.protein || 0), 0);
    const totalCarbs = data.items.reduce((sum, item) => sum + (item.carbs || 0), 0);
    const totalFats = data.items.reduce((sum, item) => sum + (item.fats || 0), 0);

    // 食事レコードを作成
    await db.insert(meals).values({
      id: mealId,
      userId: session.user.id,
      mealDate: data.mealDate,
      mealTime: data.mealTime,
      mealType: data.mealType,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFats,
      notes: data.notes,
    });

    // 食事アイテムを作成
    if (data.items.length > 0) {
      await db.insert(mealItems).values(
        data.items.map((item) => ({
          id: generateId(),
          mealId,
          foodName: item.foodName,
          quantity: item.quantity,
          unit: item.unit,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fats: item.fats,
        }))
      );
    }

    revalidatePath("/meals");
    revalidatePath("/dashboard");

    return { success: true, mealId };
  } catch (error) {
    console.error("食事記録の作成に失敗しました:", error);
    return { success: false, error: "食事記録の作成に失敗しました" };
  }
}

/**
 * ユーザーの食事記録一覧を取得する
 * @param {string} [startDate] - 取得開始日 (YYYY-MM-DD形式)
 * @param {string} [endDate] - 取得終了日 (YYYY-MM-DD形式)
 * @returns {Promise<Array>} 食事記録の配列（日付降順）
 */
export async function getMeals(startDate?: string, endDate?: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return [];
  }

  try {
    const conditions = [eq(meals.userId, session.user.id)];

    if (startDate) {
      conditions.push(gte(meals.mealDate, startDate));
    }
    if (endDate) {
      conditions.push(lte(meals.mealDate, endDate));
    }

    const result = await db
      .select()
      .from(meals)
      .where(and(...conditions))
      .orderBy(desc(meals.mealDate), desc(meals.mealTime));

    return result;
  } catch (error) {
    console.error("食事記録の取得に失敗しました:", error);
    return [];
  }
}

/**
 * 指定IDの食事記録と関連する食品アイテムを取得する
 * @param {string} mealId - 食事記録ID
 * @returns {Promise<Object|null>} 食事記録と食品アイテム、または見つからない場合はnull
 */
export async function getMealWithItems(mealId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return null;
  }

  try {
    const meal = await db
      .select()
      .from(meals)
      .where(and(eq(meals.id, mealId), eq(meals.userId, session.user.id)))
      .limit(1);

    if (meal.length === 0) {
      return null;
    }

    const items = await db
      .select()
      .from(mealItems)
      .where(eq(mealItems.mealId, mealId));

    return { ...meal[0], items };
  } catch (error) {
    console.error("食事記録の取得に失敗しました:", error);
    return null;
  }
}

/**
 * 食事記録を削除する
 * @param {string} mealId - 削除する食事記録のID
 * @returns {Promise<{success: boolean, error?: string}>} 削除結果
 */
export async function deleteMeal(mealId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { success: false, error: "認証が必要です" };
  }

  try {
    // 所有者チェック
    const meal = await db
      .select()
      .from(meals)
      .where(and(eq(meals.id, mealId), eq(meals.userId, session.user.id)))
      .limit(1);

    if (meal.length === 0) {
      return { success: false, error: "食事記録が見つかりません" };
    }

    // 削除（meal_itemsはカスケード削除）
    await db.delete(meals).where(eq(meals.id, mealId));

    revalidatePath("/meals");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("食事記録の削除に失敗しました:", error);
    return { success: false, error: "食事記録の削除に失敗しました" };
  }
}

/**
 * 今日の総摂取カロリーを取得する
 * @returns {Promise<number>} 今日の総カロリー
 */
export async function getTodayCalories() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return 0;
  }

  try {
    const today = getTodayDate();
    const todayMeals = await db
      .select()
      .from(meals)
      .where(and(eq(meals.userId, session.user.id), eq(meals.mealDate, today)));

    return todayMeals.reduce((sum, meal) => sum + (meal.totalCalories || 0), 0);
  } catch (error) {
    console.error("カロリーの取得に失敗しました:", error);
    return 0;
  }
}

/**
 * 今日の食事記録一覧を取得する
 * @returns {Promise<{success: boolean, data: Array, error?: string}>} 今日の食事記録
 */
export async function getTodayMeals() {
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
      .from(meals)
      .where(and(eq(meals.userId, session.user.id), eq(meals.mealDate, today)))
      .orderBy(desc(meals.mealTime));

    return { success: true, data: result };
  } catch (error) {
    console.error("食事記録の取得に失敗しました:", error);
    return { success: false, error: "取得に失敗しました", data: [] };
  }
}

/**
 * 過去1週間の食事記録を取得する
 * @returns {Promise<{success: boolean, data: Array, error?: string}>} 1週間分の食事記録
 */
export async function getWeekMeals() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { success: false, error: "認証が必要です", data: [] };
  }

  try {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    
    const result = await db
      .select()
      .from(meals)
      .where(
        and(
          eq(meals.userId, session.user.id),
          gte(meals.mealDate, weekAgo.toISOString().split("T")[0])
        )
      )
      .orderBy(desc(meals.mealDate));

    return { success: true, data: result };
  } catch (error) {
    console.error("食事記録の取得に失敗しました:", error);
    return { success: false, error: "取得に失敗しました", data: [] };
  }
}

/**
 * 既存の食事記録を更新する
 * @param {string} mealId - 更新する食事記録のID
 * @param {MealFormData} data - 新しい食事記録データ
 * @returns {Promise<{success: boolean, mealId?: string, error?: string}>} 更新結果
 */
export async function updateMeal(mealId: string, data: MealFormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { success: false, error: "認証が必要です" };
  }

  try {
    // 所有者チェック
    const existingMeal = await db
      .select()
      .from(meals)
      .where(and(eq(meals.id, mealId), eq(meals.userId, session.user.id)))
      .limit(1);

    if (existingMeal.length === 0) {
      return { success: false, error: "食事記録が見つかりません" };
    }

    // 総カロリー・栄養素を計算
    const totalCalories = data.items.reduce((sum, item) => sum + (item.calories || 0), 0);
    const totalProtein = data.items.reduce((sum, item) => sum + (item.protein || 0), 0);
    const totalCarbs = data.items.reduce((sum, item) => sum + (item.carbs || 0), 0);
    const totalFats = data.items.reduce((sum, item) => sum + (item.fats || 0), 0);

    // 食事レコードを更新
    await db
      .update(meals)
      .set({
        mealDate: data.mealDate,
        mealTime: data.mealTime,
        mealType: data.mealType,
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFats,
        notes: data.notes,
        updatedAt: new Date(),
      })
      .where(eq(meals.id, mealId));

    // 既存のアイテムを削除
    await db.delete(mealItems).where(eq(mealItems.mealId, mealId));

    // 新しいアイテムを作成
    if (data.items.length > 0) {
      await db.insert(mealItems).values(
        data.items.map((item) => ({
          id: generateId(),
          mealId,
          foodName: item.foodName,
          quantity: item.quantity,
          unit: item.unit,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fats: item.fats,
        }))
      );
    }

    revalidatePath("/meals");
    revalidatePath(`/meals/${mealId}`);
    revalidatePath("/dashboard");

    return { success: true, mealId };
  } catch (error) {
    console.error("食事記録の更新に失敗しました:", error);
    return { success: false, error: "食事記録の更新に失敗しました" };
  }
}
