"use server";

import { db } from "@/lib/db";
import { achievements, userAchievements } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { requireSession } from "@/lib/auth";
import { generateId } from "@/lib/utils";

export async function getUserAchievements() {
  try {
    const session = await requireSession();
    
    const result = await db
      .select({
        id: userAchievements.id,
        achievementId: userAchievements.achievementId,
        earnedAt: userAchievements.earnedAt,
        progress: userAchievements.progress,
        isCompleted: userAchievements.isCompleted,
        achievement: achievements,
      })
      .from(userAchievements)
      .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
      .where(eq(userAchievements.userId, session.user.id));

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to get user achievements:", error);
    return { success: false, error: "Failed to get achievements" };
  }
}

export async function getAllAchievements() {
  try {
    const result = await db.select().from(achievements);
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to get achievements:", error);
    return { success: false, error: "Failed to get achievements" };
  }
}

export async function checkAndAwardAchievement(
  achievementId: string,
  progress: number = 100
) {
  try {
    const session = await requireSession();

    // Check if already earned
    const existing = await db
      .select()
      .from(userAchievements)
      .where(
        and(
          eq(userAchievements.userId, session.user.id),
          eq(userAchievements.achievementId, achievementId)
        )
      );

    if (existing.length > 0 && existing[0].isCompleted) {
      return { success: true, alreadyEarned: true };
    }

    const isCompleted = progress >= 100;

    if (existing.length > 0) {
      await db
        .update(userAchievements)
        .set({ progress, isCompleted, earnedAt: isCompleted ? new Date() : existing[0].earnedAt })
        .where(eq(userAchievements.id, existing[0].id));
    } else {
      await db.insert(userAchievements).values({
        id: generateId(),
        userId: session.user.id,
        achievementId,
        progress,
        isCompleted,
      });
    }

    return { success: true, completed: isCompleted };
  } catch (error) {
    console.error("Failed to award achievement:", error);
    return { success: false, error: "Failed to award achievement" };
  }
}

export async function initializeAchievements() {
  const defaultAchievements = [
    // Workout achievements
    {
      id: "first_workout",
      name: "最初の一歩",
      description: "初めてのトレーニングを記録",
      icon: "🏋️",
      category: "workout",
      requirement: JSON.stringify({ type: "workout_count", value: 1 }),
      points: 10,
    },
    {
      id: "workout_10",
      name: "トレーニング習慣",
      description: "10回のトレーニングを達成",
      icon: "💪",
      category: "workout",
      requirement: JSON.stringify({ type: "workout_count", value: 10 }),
      points: 50,
    },
    {
      id: "workout_50",
      name: "筋トレマスター",
      description: "50回のトレーニングを達成",
      icon: "🏆",
      category: "workout",
      requirement: JSON.stringify({ type: "workout_count", value: 50 }),
      points: 200,
    },
    // Meal achievements
    {
      id: "first_meal",
      name: "食事記録開始",
      description: "初めての食事を記録",
      icon: "🍽️",
      category: "meal",
      requirement: JSON.stringify({ type: "meal_count", value: 1 }),
      points: 10,
    },
    {
      id: "meal_week",
      name: "一週間の食事管理",
      description: "7日連続で食事を記録",
      icon: "📊",
      category: "meal",
      requirement: JSON.stringify({ type: "meal_streak", value: 7 }),
      points: 100,
    },
    // Goal achievements
    {
      id: "first_goal",
      name: "目標設定",
      description: "初めての目標を設定",
      icon: "🎯",
      category: "goal",
      requirement: JSON.stringify({ type: "goal_count", value: 1 }),
      points: 10,
    },
    {
      id: "goal_achieved",
      name: "目標達成",
      description: "目標を達成",
      icon: "🌟",
      category: "goal",
      requirement: JSON.stringify({ type: "goal_achieved", value: 1 }),
      points: 150,
    },
    // Streak achievements
    {
      id: "streak_3",
      name: "3日連続",
      description: "3日連続でアプリを使用",
      icon: "🔥",
      category: "streak",
      requirement: JSON.stringify({ type: "login_streak", value: 3 }),
      points: 30,
    },
    {
      id: "streak_7",
      name: "一週間の習慣",
      description: "7日連続でアプリを使用",
      icon: "⚡",
      category: "streak",
      requirement: JSON.stringify({ type: "login_streak", value: 7 }),
      points: 70,
    },
    {
      id: "streak_30",
      name: "30日チャレンジ",
      description: "30日連続でアプリを使用",
      icon: "👑",
      category: "streak",
      requirement: JSON.stringify({ type: "login_streak", value: 30 }),
      points: 300,
    },
    // Milestone achievements
    {
      id: "volume_1000",
      name: "1トンリフト",
      description: "累計1,000kgの重量を挙げる",
      icon: "🏅",
      category: "milestone",
      requirement: JSON.stringify({ type: "total_volume", value: 1000 }),
      points: 100,
    },
    {
      id: "calories_10000",
      name: "10,000kcal記録",
      description: "累計10,000kcalを記録",
      icon: "📈",
      category: "milestone",
      requirement: JSON.stringify({ type: "total_calories", value: 10000 }),
      points: 100,
    },
  ];

  try {
    for (const achievement of defaultAchievements) {
      const existing = await db
        .select()
        .from(achievements)
        .where(eq(achievements.id, achievement.id));
      
      if (existing.length === 0) {
        await db.insert(achievements).values({
          ...achievement,
          createdAt: new Date(),
        });
      }
    }
    return { success: true };
  } catch (error) {
    console.error("Failed to initialize achievements:", error);
    return { success: false, error: "Failed to initialize achievements" };
  }
}

