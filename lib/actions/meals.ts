"use server";

import { db } from "@/lib/db";
import { meals, mealItems } from "@/lib/db/schema";
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

export type MealFormData = {
  mealDate: string;
  mealTime?: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  items: {
    foodName: string;
    quantity?: number;
    unit?: string;
    calories?: number;
    protein?: number;
    carbs?: number;
    fats?: number;
  }[];
  notes?: string;
};

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
