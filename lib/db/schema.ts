import { sqliteTable, text, integer, real, index, uniqueIndex } from "drizzle-orm/sqlite-core";

// ==================== BetterAuth Tables ====================

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).default(false),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  userIdIdx: index("sessions_user_id_idx").on(table.userId),
  tokenIdx: index("sessions_token_idx").on(table.token),
}));

export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  userIdIdx: index("accounts_user_id_idx").on(table.userId),
  providerAccountIdx: uniqueIndex("accounts_provider_account_idx").on(table.providerId, table.accountId),
}));

export const verifications = sqliteTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// ==================== Application Tables ====================

export const goals = sqliteTable("goals", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  goalType: text("goal_type").notNull(), // 'muscle_gain' | 'weight_loss' | 'weight_gain' | 'strength'
  targetValue: real("target_value"),
  currentValue: real("current_value"),
  startDate: text("start_date").notNull(),
  targetDate: text("target_date"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  userIdIdx: index("goals_user_id_idx").on(table.userId),
}));

export const exercises = sqliteTable("exercises", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  nameEn: text("name_en"),
  bodyPart: text("body_part").notNull(), // 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core'
  equipment: text("equipment"), // 'barbell' | 'dumbbell' | 'machine' | 'cable' | 'bodyweight'
  difficulty: text("difficulty"), // 'beginner' | 'intermediate' | 'advanced'
  description: text("description"),
  imageUrl: text("image_url"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  bodyPartIdx: index("exercises_body_part_idx").on(table.bodyPart),
}));

export const workouts = sqliteTable("workouts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  workoutDate: text("workout_date").notNull(),
  durationMinutes: integer("duration_minutes"),
  totalVolume: real("total_volume"),
  caloriesBurned: integer("calories_burned"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  userIdIdx: index("workouts_user_id_idx").on(table.userId),
  dateIdx: index("workouts_date_idx").on(table.workoutDate),
}));

export const workoutSets = sqliteTable("workout_sets", {
  id: text("id").primaryKey(),
  workoutId: text("workout_id").notNull().references(() => workouts.id, { onDelete: "cascade" }),
  exerciseId: text("exercise_id").notNull().references(() => exercises.id),
  setNumber: integer("set_number").notNull(),
  weightKg: real("weight_kg"),
  reps: integer("reps"),
  restSeconds: integer("rest_seconds"),
  rpe: real("rpe"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  workoutIdIdx: index("workout_sets_workout_id_idx").on(table.workoutId),
}));

export const meals = sqliteTable("meals", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  mealDate: text("meal_date").notNull(),
  mealTime: text("meal_time"),
  mealType: text("meal_type"), // 'breakfast' | 'lunch' | 'dinner' | 'snack'
  totalCalories: integer("total_calories"),
  totalProtein: real("total_protein"),
  totalCarbs: real("total_carbs"),
  totalFats: real("total_fats"),
  imageUrl: text("image_url"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  userIdIdx: index("meals_user_id_idx").on(table.userId),
  dateIdx: index("meals_date_idx").on(table.mealDate),
}));

export const mealItems = sqliteTable("meal_items", {
  id: text("id").primaryKey(),
  mealId: text("meal_id").notNull().references(() => meals.id, { onDelete: "cascade" }),
  foodName: text("food_name").notNull(),
  quantity: real("quantity"),
  unit: text("unit"),
  calories: integer("calories"),
  protein: real("protein"),
  carbs: real("carbs"),
  fats: real("fats"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  mealIdIdx: index("meal_items_meal_id_idx").on(table.mealId),
}));

export const bodyCompositions = sqliteTable("body_compositions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  recordDate: text("record_date").notNull(),
  weightKg: real("weight_kg"),
  bodyFatPercentage: real("body_fat_percentage"),
  muscleMassKg: real("muscle_mass_kg"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  userIdIdx: index("body_compositions_user_id_idx").on(table.userId),
}));

// ==================== Achievement/Badge Tables ====================

export const achievements = sqliteTable("achievements", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  category: text("category").notNull(), // 'workout' | 'meal' | 'goal' | 'streak' | 'milestone'
  requirement: text("requirement").notNull(), // JSON string with requirements
  points: integer("points").notNull().default(10),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const userAchievements = sqliteTable("user_achievements", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  achievementId: text("achievement_id").notNull().references(() => achievements.id, { onDelete: "cascade" }),
  earnedAt: integer("earned_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  progress: integer("progress").default(0),
  isCompleted: integer("is_completed", { mode: "boolean" }).notNull().default(false),
}, (table) => ({
  userIdIdx: index("user_achievements_user_id_idx").on(table.userId),
  uniqueUserAchievement: uniqueIndex("user_achievements_unique_idx").on(table.userId, table.achievementId),
}));

// ==================== Notification Tables ====================

export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // 'reminder' | 'achievement' | 'goal' | 'system'
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
  actionUrl: text("action_url"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  userIdIdx: index("notifications_user_id_idx").on(table.userId),
}));

// ==================== Type Exports ====================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

export type Goal = typeof goals.$inferSelect;
export type NewGoal = typeof goals.$inferInsert;

export type Exercise = typeof exercises.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;

export type Workout = typeof workouts.$inferSelect;
export type NewWorkout = typeof workouts.$inferInsert;

export type WorkoutSet = typeof workoutSets.$inferSelect;
export type NewWorkoutSet = typeof workoutSets.$inferInsert;

export type Meal = typeof meals.$inferSelect;
export type NewMeal = typeof meals.$inferInsert;

export type MealItem = typeof mealItems.$inferSelect;
export type NewMealItem = typeof mealItems.$inferInsert;

export type BodyComposition = typeof bodyCompositions.$inferSelect;
export type NewBodyComposition = typeof bodyCompositions.$inferInsert;

export type Achievement = typeof achievements.$inferSelect;
export type NewAchievement = typeof achievements.$inferInsert;

export type UserAchievement = typeof userAchievements.$inferSelect;
export type NewUserAchievement = typeof userAchievements.$inferInsert;

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
