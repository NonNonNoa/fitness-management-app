/**
 * @fileoverview データベーススキーマ定義
 * Drizzle ORMを使用したSQLiteテーブル定義と型エクスポート
 */

import { sqliteTable, text, integer, real, index, uniqueIndex } from "drizzle-orm/sqlite-core";

// ==================== BetterAuth Tables ====================

/**
 * ユーザーテーブル
 * BetterAuth認証システム用のユーザー情報を格納
 */
export const users = sqliteTable("users", {
  /** ユーザーID (UUID) */
  id: text("id").primaryKey(),
  /** 表示名 */
  name: text("name"),
  /** メールアドレス（一意） */
  email: text("email").notNull().unique(),
  /** メール認証済みフラグ */
  emailVerified: integer("email_verified", { mode: "boolean" }).default(false),
  /** プロフィール画像URL */
  image: text("image"),
  /** 作成日時 */
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  /** 更新日時 */
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

/**
 * セッションテーブル
 * ユーザーのログインセッションを管理
 */
export const sessions = sqliteTable("sessions", {
  /** セッションID (UUID) */
  id: text("id").primaryKey(),
  /** ユーザーID */
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** セッション有効期限 */
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  /** セッショントークン（一意） */
  token: text("token").notNull().unique(),
  /** IPアドレス */
  ipAddress: text("ip_address"),
  /** ユーザーエージェント */
  userAgent: text("user_agent"),
  /** 作成日時 */
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  /** 更新日時 */
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  userIdIdx: index("sessions_user_id_idx").on(table.userId),
  tokenIdx: index("sessions_token_idx").on(table.token),
}));

/**
 * アカウントテーブル
 * OAuthプロバイダーとの連携情報を格納
 */
export const accounts = sqliteTable("accounts", {
  /** アカウントID (UUID) */
  id: text("id").primaryKey(),
  /** ユーザーID */
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** プロバイダー側のアカウントID */
  accountId: text("account_id").notNull(),
  /** プロバイダーID (google, github等) */
  providerId: text("provider_id").notNull(),
  /** アクセストークン */
  accessToken: text("access_token"),
  /** リフレッシュトークン */
  refreshToken: text("refresh_token"),
  /** IDトークン */
  idToken: text("id_token"),
  /** アクセストークン有効期限 */
  accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
  /** リフレッシュトークン有効期限 */
  refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
  /** 有効期限 */
  expiresAt: integer("expires_at", { mode: "timestamp" }),
  /** スコープ */
  scope: text("scope"),
  /** パスワード (Credential認証用) */
  password: text("password"),
  /** 作成日時 */
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  /** 更新日時 */
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  userIdIdx: index("accounts_user_id_idx").on(table.userId),
  providerAccountIdx: uniqueIndex("accounts_provider_account_idx").on(table.providerId, table.accountId),
}));

/**
 * 認証検証テーブル
 * メール認証やパスワードリセット用のトークンを格納
 */
export const verifications = sqliteTable("verifications", {
  /** 検証ID (UUID) */
  id: text("id").primaryKey(),
  /** 識別子 (メールアドレス等) */
  identifier: text("identifier").notNull(),
  /** 検証値 (トークン) */
  value: text("value").notNull(),
  /** 有効期限 */
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  /** 作成日時 */
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  /** 更新日時 */
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// ==================== Application Tables ====================

/**
 * 目標テーブル
 * ユーザーの各種目標を管理
 */
export const goals = sqliteTable("goals", {
  /** 目標ID (UUID) */
  id: text("id").primaryKey(),
  /** ユーザーID */
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** 目標タイプ: 'muscle_gain' | 'weight_loss' | 'weight_gain' | 'strength' */
  goalType: text("goal_type").notNull(),
  /** 目標値（筋力向上時の目標重量 kg） */
  targetValue: real("target_value"),
  /** 現在値（筋力向上時の現在重量 kg） */
  currentValue: real("current_value"),
  /** 目標体重 (kg) - 減量・増量時に使用 */
  targetWeightKg: real("target_weight_kg"),
  /** 現在体重 (kg) - 減量・増量時に使用 */
  currentWeightKg: real("current_weight_kg"),
  /** 目標筋肉量 (kg) - 筋肉量アップ時に使用 */
  targetMuscleMassKg: real("target_muscle_mass_kg"),
  /** 現在筋肉量 (kg) - 筋肉量アップ時に使用 */
  currentMuscleMassKg: real("current_muscle_mass_kg"),
  /** 目標腕回り (cm) - 筋肉量アップ時に使用 */
  targetArmCm: real("target_arm_cm"),
  /** 現在腕回り (cm) - 筋肉量アップ時に使用 */
  currentArmCm: real("current_arm_cm"),
  /** 目標胸囲 (cm) - 筋肉量アップ時に使用 */
  targetChestCm: real("target_chest_cm"),
  /** 現在胸囲 (cm) - 筋肉量アップ時に使用 */
  currentChestCm: real("current_chest_cm"),
  /** 目標ウエスト (cm) - 筋肉量アップ時に使用 */
  targetWaistCm: real("target_waist_cm"),
  /** 現在ウエスト (cm) - 筋肉量アップ時に使用 */
  currentWaistCm: real("current_waist_cm"),
  /** 種目名 (筋力向上時に使用: ベンチプレス、スクワット等) */
  exerciseName: text("exercise_name"),
  /** 開始日 (YYYY-MM-DD) */
  startDate: text("start_date").notNull(),
  /** 目標達成日 (YYYY-MM-DD) */
  targetDate: text("target_date"),
  /** アクティブフラグ */
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  /** 作成日時 */
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  /** 更新日時 */
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  userIdIdx: index("goals_user_id_idx").on(table.userId),
}));

/**
 * トレーニング種目テーブル
 * 利用可能なトレーニング種目のマスターデータ
 */
export const exercises = sqliteTable("exercises", {
  /** 種目ID (UUID) */
  id: text("id").primaryKey(),
  /** 種目名（日本語） */
  name: text("name").notNull(),
  /** 種目名（英語） */
  nameEn: text("name_en"),
  /** 対象部位: 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core' */
  bodyPart: text("body_part").notNull(),
  /** 器具: 'barbell' | 'dumbbell' | 'machine' | 'cable' | 'bodyweight' */
  equipment: text("equipment"),
  /** 難易度: 'beginner' | 'intermediate' | 'advanced' */
  difficulty: text("difficulty"),
  /** 説明 */
  description: text("description"),
  /** 画像URL */
  imageUrl: text("image_url"),
  /** 作成日時 */
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  bodyPartIdx: index("exercises_body_part_idx").on(table.bodyPart),
}));

/**
 * トレーニング記録テーブル
 * ユーザーの日々のトレーニング記録
 */
export const workouts = sqliteTable("workouts", {
  /** トレーニングID (UUID) */
  id: text("id").primaryKey(),
  /** ユーザーID */
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** トレーニング日 (YYYY-MM-DD) */
  workoutDate: text("workout_date").notNull(),
  /** トレーニング時間（分） */
  durationMinutes: integer("duration_minutes"),
  /** 総ボリューム (重量 × レップ数の合計) */
  totalVolume: real("total_volume"),
  /** 消費カロリー */
  caloriesBurned: integer("calories_burned"),
  /** メモ */
  notes: text("notes"),
  /** 作成日時 */
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  /** 更新日時 */
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  userIdIdx: index("workouts_user_id_idx").on(table.userId),
  dateIdx: index("workouts_date_idx").on(table.workoutDate),
}));

/**
 * トレーニングセットテーブル
 * 各トレーニングの詳細なセット情報
 */
export const workoutSets = sqliteTable("workout_sets", {
  /** セットID (UUID) */
  id: text("id").primaryKey(),
  /** トレーニングID */
  workoutId: text("workout_id").notNull().references(() => workouts.id, { onDelete: "cascade" }),
  /** 種目ID */
  exerciseId: text("exercise_id").notNull().references(() => exercises.id),
  /** セット番号 */
  setNumber: integer("set_number").notNull(),
  /** 重量 (kg) */
  weightKg: real("weight_kg"),
  /** レップ数 */
  reps: integer("reps"),
  /** 休憩時間（秒） */
  restSeconds: integer("rest_seconds"),
  /** RPE (主観的運動強度、1-10) */
  rpe: real("rpe"),
  /** メモ */
  notes: text("notes"),
  /** 作成日時 */
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  workoutIdIdx: index("workout_sets_workout_id_idx").on(table.workoutId),
}));

/**
 * 食事記録テーブル
 * ユーザーの日々の食事記録
 */
export const meals = sqliteTable("meals", {
  /** 食事ID (UUID) */
  id: text("id").primaryKey(),
  /** ユーザーID */
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** 食事日 (YYYY-MM-DD) */
  mealDate: text("meal_date").notNull(),
  /** 食事時間 (HH:MM) */
  mealTime: text("meal_time"),
  /** 食事タイプ: 'breakfast' | 'lunch' | 'dinner' | 'snack' */
  mealType: text("meal_type"),
  /** 総カロリー */
  totalCalories: integer("total_calories"),
  /** 総タンパク質 (g) */
  totalProtein: real("total_protein"),
  /** 総炭水化物 (g) */
  totalCarbs: real("total_carbs"),
  /** 総脂質 (g) */
  totalFats: real("total_fats"),
  /** 画像URL */
  imageUrl: text("image_url"),
  /** メモ */
  notes: text("notes"),
  /** 作成日時 */
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  /** 更新日時 */
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  userIdIdx: index("meals_user_id_idx").on(table.userId),
  dateIdx: index("meals_date_idx").on(table.mealDate),
}));

/**
 * 食事アイテムテーブル
 * 食事に含まれる個別の食品情報
 */
export const mealItems = sqliteTable("meal_items", {
  /** アイテムID (UUID) */
  id: text("id").primaryKey(),
  /** 食事ID */
  mealId: text("meal_id").notNull().references(() => meals.id, { onDelete: "cascade" }),
  /** 食品名 */
  foodName: text("food_name").notNull(),
  /** 数量 */
  quantity: real("quantity"),
  /** 単位 (g, ml, 個など) */
  unit: text("unit"),
  /** カロリー */
  calories: integer("calories"),
  /** タンパク質 (g) */
  protein: real("protein"),
  /** 炭水化物 (g) */
  carbs: real("carbs"),
  /** 脂質 (g) */
  fats: real("fats"),
  /** 作成日時 */
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  mealIdIdx: index("meal_items_meal_id_idx").on(table.mealId),
}));

/**
 * 体組成記録テーブル
 * 体重、体脂肪率、筋肉量などの記録
 */
export const bodyCompositions = sqliteTable("body_compositions", {
  /** 記録ID (UUID) */
  id: text("id").primaryKey(),
  /** ユーザーID */
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** 記録日 (YYYY-MM-DD) */
  recordDate: text("record_date").notNull(),
  /** 体重 (kg) */
  weightKg: real("weight_kg"),
  /** 体脂肪率 (%) */
  bodyFatPercentage: real("body_fat_percentage"),
  /** 筋肉量 (kg) */
  muscleMassKg: real("muscle_mass_kg"),
  /** メモ */
  notes: text("notes"),
  /** 作成日時 */
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  userIdIdx: index("body_compositions_user_id_idx").on(table.userId),
}));

// ==================== Achievement/Badge Tables ====================

/**
 * 実績テーブル
 * アプリ内で獲得できる実績（バッジ）の定義
 */
export const achievements = sqliteTable("achievements", {
  /** 実績ID */
  id: text("id").primaryKey(),
  /** 実績名 */
  name: text("name").notNull(),
  /** 説明 */
  description: text("description").notNull(),
  /** アイコン (絵文字) */
  icon: text("icon").notNull(),
  /** カテゴリ: 'workout' | 'meal' | 'goal' | 'streak' | 'milestone' */
  category: text("category").notNull(),
  /** 達成条件 (JSON文字列) */
  requirement: text("requirement").notNull(),
  /** 獲得ポイント */
  points: integer("points").notNull().default(10),
  /** 作成日時 */
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

/**
 * ユーザー実績テーブル
 * ユーザーが獲得した実績の記録
 */
export const userAchievements = sqliteTable("user_achievements", {
  /** レコードID (UUID) */
  id: text("id").primaryKey(),
  /** ユーザーID */
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** 実績ID */
  achievementId: text("achievement_id").notNull().references(() => achievements.id, { onDelete: "cascade" }),
  /** 獲得日時 */
  earnedAt: integer("earned_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  /** 進捗 (0-100) */
  progress: integer("progress").default(0),
  /** 完了フラグ */
  isCompleted: integer("is_completed", { mode: "boolean" }).notNull().default(false),
}, (table) => ({
  userIdIdx: index("user_achievements_user_id_idx").on(table.userId),
  uniqueUserAchievement: uniqueIndex("user_achievements_unique_idx").on(table.userId, table.achievementId),
}));

// ==================== Notification Tables ====================

/**
 * 通知テーブル
 * ユーザーへの各種通知を管理
 */
export const notifications = sqliteTable("notifications", {
  /** 通知ID (UUID) */
  id: text("id").primaryKey(),
  /** ユーザーID */
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** 通知タイプ: 'reminder' | 'achievement' | 'goal' | 'system' */
  type: text("type").notNull(),
  /** タイトル */
  title: text("title").notNull(),
  /** メッセージ */
  message: text("message").notNull(),
  /** 既読フラグ */
  isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
  /** アクションURL */
  actionUrl: text("action_url"),
  /** 作成日時 */
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  userIdIdx: index("notifications_user_id_idx").on(table.userId),
}));

// ==================== Type Exports ====================

/** ユーザー型 */
export type User = typeof users.$inferSelect;
/** ユーザー挿入型 */
export type NewUser = typeof users.$inferInsert;

/** セッション型 */
export type Session = typeof sessions.$inferSelect;
/** セッション挿入型 */
export type NewSession = typeof sessions.$inferInsert;

/** アカウント型 */
export type Account = typeof accounts.$inferSelect;
/** アカウント挿入型 */
export type NewAccount = typeof accounts.$inferInsert;

/** 目標型 */
export type Goal = typeof goals.$inferSelect;
/** 目標挿入型 */
export type NewGoal = typeof goals.$inferInsert;

/** 種目型 */
export type Exercise = typeof exercises.$inferSelect;
/** 種目挿入型 */
export type NewExercise = typeof exercises.$inferInsert;

/** トレーニング型 */
export type Workout = typeof workouts.$inferSelect;
/** トレーニング挿入型 */
export type NewWorkout = typeof workouts.$inferInsert;

/** トレーニングセット型 */
export type WorkoutSet = typeof workoutSets.$inferSelect;
/** トレーニングセット挿入型 */
export type NewWorkoutSet = typeof workoutSets.$inferInsert;

/** 食事型 */
export type Meal = typeof meals.$inferSelect;
/** 食事挿入型 */
export type NewMeal = typeof meals.$inferInsert;

/** 食事アイテム型 */
export type MealItem = typeof mealItems.$inferSelect;
/** 食事アイテム挿入型 */
export type NewMealItem = typeof mealItems.$inferInsert;

/** 体組成型 */
export type BodyComposition = typeof bodyCompositions.$inferSelect;
/** 体組成挿入型 */
export type NewBodyComposition = typeof bodyCompositions.$inferInsert;

/** 実績型 */
export type Achievement = typeof achievements.$inferSelect;
/** 実績挿入型 */
export type NewAchievement = typeof achievements.$inferInsert;

/** ユーザー実績型 */
export type UserAchievement = typeof userAchievements.$inferSelect;
/** ユーザー実績挿入型 */
export type NewUserAchievement = typeof userAchievements.$inferInsert;

/** 通知型 */
export type Notification = typeof notifications.$inferSelect;
/** 通知挿入型 */
export type NewNotification = typeof notifications.$inferInsert;
