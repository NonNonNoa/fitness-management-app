"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth/client";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Plus, Zap, Scale, Target, Utensils, Dumbbell, 
  Activity, ChevronRight, TrendingUp, TrendingDown, Ruler
} from "lucide-react";
import { AnimatedCard, StatsCard } from "@/components/ui/animated-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { ChartContainer, WeightChart, CalorieChart } from "@/components/ui/charts";
import { getTodayMeals, getWeekMeals } from "@/lib/actions/meals";
import { getTodayWorkouts, getRecentWorkouts } from "@/lib/actions/workouts";
import { getActiveGoals, getRecentBodyCompositions } from "@/lib/actions/goals";

/** 目標データの詳細型 */
interface GoalDetail {
  id: string;
  type: string;
  // 減量・増量
  currentWeightKg?: number | null;
  targetWeightKg?: number | null;
  // 筋力向上
  exerciseName?: string | null;
  currentValue?: number | null;
  targetValue?: number | null;
  // 筋肉量アップ
  currentMuscleMassKg?: number | null;
  targetMuscleMassKg?: number | null;
  currentArmCm?: number | null;
  targetArmCm?: number | null;
  currentChestCm?: number | null;
  targetChestCm?: number | null;
  currentWaistCm?: number | null;
  targetWaistCm?: number | null;
}

interface DashboardData {
  todayCalories: number;
  targetCalories: number;
  todayWorkoutSets: number;
  activeGoals: GoalDetail[];
  weightHistory: { date: string; weight: number }[];
  calorieHistory: { date: string; calories: number; target: number }[];
  recentActivity: { type: string; title: string; date: string }[];
}

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
      const [todayMealsResult, weekMealsResult, todayWorkoutsResult, recentWorkoutsResult, goalsResult, bodyCompsResult] = await Promise.all([
        getTodayMeals(),
        getWeekMeals(),
        getTodayWorkouts(),
        getRecentWorkouts(5),
        getActiveGoals(),
        getRecentBodyCompositions(14),
      ]);

      const todayCalories = todayMealsResult.success 
        ? todayMealsResult.data?.reduce((sum: number, m: { totalCalories?: number | null }) => sum + (m.totalCalories || 0), 0) || 0 
        : 0;

      // アクティブな目標を詳細に取得
      const activeGoals: GoalDetail[] = goalsResult.success && goalsResult.data
        ? goalsResult.data.map((g: {
            id: string;
            goalType: string;
            currentWeightKg?: number | null;
            targetWeightKg?: number | null;
            exerciseName?: string | null;
            currentValue?: number | null;
            targetValue?: number | null;
            currentMuscleMassKg?: number | null;
            targetMuscleMassKg?: number | null;
            currentArmCm?: number | null;
            targetArmCm?: number | null;
            currentChestCm?: number | null;
            targetChestCm?: number | null;
            currentWaistCm?: number | null;
            targetWaistCm?: number | null;
          }) => ({
            id: g.id,
            type: g.goalType,
            currentWeightKg: g.currentWeightKg,
            targetWeightKg: g.targetWeightKg,
            exerciseName: g.exerciseName,
            currentValue: g.currentValue,
            targetValue: g.targetValue,
            currentMuscleMassKg: g.currentMuscleMassKg,
            targetMuscleMassKg: g.targetMuscleMassKg,
            currentArmCm: g.currentArmCm,
            targetArmCm: g.targetArmCm,
            currentChestCm: g.currentChestCm,
            targetChestCm: g.targetChestCm,
            currentWaistCm: g.currentWaistCm,
            targetWaistCm: g.targetWaistCm,
          }))
        : [];

      const weightHistory = bodyCompsResult.success && bodyCompsResult.data
        ? bodyCompsResult.data
            .filter((bc: { weightKg?: number | null }) => bc.weightKg)
            .map((bc: { recordDate: string; weightKg?: number | null }) => ({ date: bc.recordDate.slice(5), weight: bc.weightKg! }))
            .reverse()
        : [];

      const calorieHistory = weekMealsResult.success && weekMealsResult.data
        ? Object.entries(
            weekMealsResult.data.reduce((acc: Record<string, number>, m: { mealDate: string; totalCalories?: number | null }) => {
              const date = m.mealDate.slice(5);
              acc[date] = (acc[date] || 0) + (m.totalCalories || 0);
              return acc;
            }, {} as Record<string, number>)
          ).map(([date, calories]) => ({ date, calories: calories as number, target: 2000 }))
        : [];

      const recentActivity: DashboardData["recentActivity"] = [];
      if (todayMealsResult.success && todayMealsResult.data) {
        todayMealsResult.data.slice(0, 3).forEach((m: { mealType?: string | null; totalCalories?: number | null; mealDate: string }) => {
          recentActivity.push({
            type: "meal",
            title: `${m.mealType || "食事"} - ${m.totalCalories}kcal`,
            date: m.mealDate,
          });
        });
      }
      if (recentWorkoutsResult.success && recentWorkoutsResult.data) {
        recentWorkoutsResult.data.slice(0, 3).forEach((w: { totalVolume?: number | null; workoutDate: string }) => {
          recentActivity.push({
            type: "workout",
            title: `トレーニング - ${w.totalVolume?.toFixed(0) || 0}kg`,
            date: w.workoutDate,
          });
        });
      }

      setData({
        todayCalories,
        targetCalories: 2000,
        todayWorkoutSets: todayWorkoutsResult.success ? todayWorkoutsResult.data?.length || 0 : 0,
        activeGoals,
        weightHistory,
        calorieHistory,
        recentActivity: recentActivity.slice(0, 5),
      });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (session?.user) {
      fetchDashboardData();
    }
  }, [session]);

  if (isPending || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const today = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  // 目標タイプ別のラベル取得
  const getGoalTypeLabel = (type: string) => {
    switch (type) {
      case "weight_loss": return "減量";
      case "weight_gain": return "増量";
      case "strength": return "筋力向上";
      case "muscle_gain": return "筋肉量アップ";
      default: return "目標";
    }
  };

  // 目標体重を取得（減量・増量の目標から）
  const targetWeightKg = data?.activeGoals.find(g => 
    (g.type === "weight_loss" || g.type === "weight_gain") && g.targetWeightKg
  )?.targetWeightKg;

  return (
    <div className="space-y-6 pb-20 md:pb-6 relative z-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div className="relative">
          <motion.h1 
            className="text-2xl md:text-3xl font-bold text-white bg-gradient-to-r from-white via-orange-100 to-white bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            こんにちは、{session?.user?.name?.split(" ")[0] || "ユーザー"}さん！
          </motion.h1>
          <motion.p 
            className="text-zinc-400 mt-1 flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
            {today}
          </motion.p>
        </div>
        <div className="flex gap-2">
          <Link href="/meals/new">
            <AnimatedButton icon={<Plus className="w-4 h-4" />} size="sm">
              食事
            </AnimatedButton>
          </Link>
          <Link href="/workouts/new">
            <AnimatedButton icon={<Dumbbell className="w-4 h-4" />} size="sm" variant="secondary">
              筋トレ
            </AnimatedButton>
          </Link>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="今日のカロリー"
          value={`${data?.todayCalories || 0}`}
          subtitle={`/ ${data?.targetCalories} kcal`}
          icon={<Utensils className="w-5 h-5 text-white" />}
          color="green"
          delay={0}
        />
        <StatsCard
          title="今日のセット"
          value={data?.todayWorkoutSets || 0}
          subtitle="セット完了"
          icon={<Dumbbell className="w-5 h-5 text-white" />}
          color="orange"
          delay={0.1}
        />
        <StatsCard
          title="目標数"
          value={data?.activeGoals.length || 0}
          subtitle="アクティブ"
          icon={<Target className="w-5 h-5 text-white" />}
          color="purple"
          delay={0.2}
        />
        <StatsCard
          title="連続記録"
          value="0"
          subtitle="日"
          icon={<Zap className="w-5 h-5 text-white" />}
          color="blue"
          delay={0.3}
        />
      </div>

      {/* アクティブな目標（目標タイプ別） */}
      {data?.activeGoals && data.activeGoals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-500" />
            アクティブな目標
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.activeGoals.map((goal, index) => (
              <GoalCard key={goal.id} goal={goal} index={index} getGoalTypeLabel={getGoalTypeLabel} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="体重推移" delay={0.4}>
          <WeightChart 
            data={data?.weightHistory || []} 
            targetWeight={targetWeightKg || undefined}
          />
        </ChartContainer>
        <ChartContainer title="カロリー摂取" delay={0.5}>
          <CalorieChart data={data?.calorieHistory || []} />
        </ChartContainer>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <AnimatedCard title="クイックアクション" delay={0.6} hoverable={false}>
          <div className="grid grid-cols-2 gap-3">
            <QuickAction
              href="/meals/new"
              icon={<Utensils className="w-5 h-5" />}
              label="食事を記録"
              color="green"
            />
            <QuickAction
              href="/workouts/new"
              icon={<Dumbbell className="w-5 h-5" />}
              label="筋トレ開始"
              color="orange"
            />
            <QuickAction
              href="/goals/weight"
              icon={<Scale className="w-5 h-5" />}
              label="体重を記録"
              color="blue"
            />
            <QuickAction
              href="/ai/meal-suggest"
              icon={<Zap className="w-5 h-5" />}
              label="AI提案"
              color="purple"
            />
          </div>
        </AnimatedCard>

        {/* Recent Activity */}
        <AnimatedCard title="最近のアクティビティ" delay={0.7} hoverable={false}>
          {data?.recentActivity && data.recentActivity.length > 0 ? (
            <div className="space-y-3">
              {data.recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl
                             hover:bg-zinc-800/80 border border-transparent hover:border-zinc-700/50
                             transition-all duration-300 cursor-pointer group"
                >
                  <motion.div 
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      activity.type === "meal" 
                        ? "bg-green-500/20 text-green-400 group-hover:bg-green-500/30" 
                        : "bg-orange-500/20 text-orange-400 group-hover:bg-orange-500/30"
                    }`}
                    whileHover={{ rotate: [0, -5, 5, -5, 0], transition: { duration: 0.5 } }}
                  >
                    {activity.type === "meal" ? (
                      <Utensils className="w-4 h-4" />
                    ) : (
                      <Dumbbell className="w-4 h-4" />
                    )}
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{activity.title}</p>
                    <p className="text-xs text-zinc-500">{activity.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-zinc-500">
              <Activity className="w-12 h-12 mx-auto mb-3 text-zinc-600" />
              <p>まだアクティビティがありません</p>
              <p className="text-sm mt-1">食事やトレーニングを記録して始めましょう！</p>
            </div>
          )}
        </AnimatedCard>
      </div>

      {/* AI Features Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        whileHover={{ scale: 1.01, y: -2 }}
        className="relative overflow-hidden bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 border border-purple-500/30 rounded-2xl p-6
                   backdrop-blur-md shadow-2xl shadow-purple-500/10
                   before:absolute before:inset-0 before:bg-gradient-to-br before:from-purple-500/10 before:to-pink-500/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500"
      >
        <div className="relative z-10">
          <motion.div 
            className="flex items-center gap-2 mb-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Zap className="w-5 h-5 text-purple-400" />
            </motion.div>
            <span className="text-sm font-medium text-purple-300">AI機能</span>
          </motion.div>
          <motion.h3 
            className="text-xl font-bold text-white mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            AIがあなたのトレーニングをサポート
          </motion.h3>
          <motion.p 
            className="text-zinc-400 text-sm mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            写真からカロリー計算、食事提案、トレーニングプラン生成など
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/ai">
              <AnimatedButton variant="secondary" size="sm" icon={<ChevronRight className="w-4 h-4" />}>
                AI機能を使う
              </AnimatedButton>
            </Link>
          </motion.div>
        </div>
        <motion.div 
          className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute -right-5 -bottom-10 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"
          animate={{ 
            x: [0, 20, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}

/** 目標タイプ別のカード */
function GoalCard({ 
  goal, 
  index, 
  getGoalTypeLabel 
}: { 
  goal: GoalDetail; 
  index: number;
  getGoalTypeLabel: (type: string) => string;
}) {
  const getGoalIcon = () => {
    switch (goal.type) {
      case "weight_loss": return <TrendingDown className="w-5 h-5" />;
      case "weight_gain": return <TrendingUp className="w-5 h-5" />;
      case "strength": return <Dumbbell className="w-5 h-5" />;
      case "muscle_gain": return <Ruler className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  const getGoalColor = () => {
    switch (goal.type) {
      case "weight_loss": return "from-blue-500 to-cyan-600";
      case "weight_gain": return "from-green-500 to-emerald-600";
      case "strength": return "from-orange-500 to-red-600";
      case "muscle_gain": return "from-purple-500 to-pink-600";
      default: return "from-zinc-500 to-zinc-600";
    }
  };

  const getBorderColor = () => {
    switch (goal.type) {
      case "weight_loss": return "border-blue-500/30";
      case "weight_gain": return "border-green-500/30";
      case "strength": return "border-orange-500/30";
      case "muscle_gain": return "border-purple-500/30";
      default: return "border-zinc-700";
    }
  };

  const getStatusBadgeClass = () => {
    switch (goal.type) {
      case "weight_loss": return "bg-blue-500/20 text-blue-400";
      case "weight_gain": return "bg-green-500/20 text-green-400";
      case "strength": return "bg-orange-500/20 text-orange-400";
      case "muscle_gain": return "bg-purple-500/20 text-purple-400";
      default: return "bg-zinc-700 text-zinc-400";
    }
  };

  const getGoalEmoji = () => {
    switch (goal.type) {
      case "weight_loss": return "📉";
      case "weight_gain": return "📈";
      case "strength": return "🏋️";
      case "muscle_gain": return "💪";
      default: return "🎯";
    }
  };

  // 進捗の計算
  const getProgress = () => {
    if (goal.type === "weight_loss" && goal.currentWeightKg && goal.targetWeightKg) {
      // 減量の場合は逆算（開始体重が必要だが、ここでは単純に表示）
      return null; // 開始体重がないため進捗バーは非表示
    }
    if (goal.type === "weight_gain" && goal.currentWeightKg && goal.targetWeightKg) {
      return null; // 開始体重がないため進捗バーは非表示
    }
    if (goal.type === "strength" && goal.currentValue && goal.targetValue) {
      return Math.min(100, (goal.currentValue / goal.targetValue) * 100);
    }
    return null;
  };

  const progress = getProgress();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 + index * 0.1 }}
    >
      <Link href={`/goals/${goal.id}`}>
        <motion.div 
          className={`p-4 bg-zinc-900/90 backdrop-blur-md border ${getBorderColor()} rounded-xl relative overflow-hidden group
                     shadow-xl shadow-black/20
                     before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:to-transparent before:opacity-0 before:transition-opacity before:duration-300
                     hover:bg-zinc-800/90 hover:border-opacity-100 hover:shadow-2xl hover:shadow-orange-500/10 hover:before:opacity-100
                     transition-all duration-300`}
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* 目標タイプヘッダー */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div 
              className={`p-2.5 rounded-xl bg-gradient-to-br ${getGoalColor()} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
              whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
            >
                {getGoalIcon()}
              </motion.div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                  <span>{getGoalEmoji()}</span>
                  <span>{getGoalTypeLabel(goal.type)}</span>
                </h3>
                <p className="text-xs text-zinc-500">目標</p>
              </div>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass()}`}>
              進行中
            </div>
          </div>

          {/* 減量・増量の場合 */}
          {(goal.type === "weight_loss" || goal.type === "weight_gain") && (
            <div className="space-y-3">
              <div className="p-3 bg-zinc-800/50 rounded-lg">
                <p className="text-xs text-zinc-500 mb-1">現在の体重 → 目標体重</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">
                    {goal.currentWeightKg || "-"}
                  </span>
                  <span className="text-zinc-400">→</span>
                  <span className="text-2xl font-bold text-white">
                    {goal.targetWeightKg || "-"}
                  </span>
                  <span className="text-sm text-zinc-400">kg</span>
                </div>
              </div>
              {goal.currentWeightKg && goal.targetWeightKg && (
                <>
                  {/* 残り量の可視化バー */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {goal.type === "weight_loss" ? (
                          <TrendingDown className="w-4 h-4 text-blue-400" />
                        ) : (
                          <TrendingUp className="w-4 h-4 text-green-400" />
                        )}
                        <span className="text-sm text-zinc-400">
                          あと{" "}
                          <span className={`font-bold ${goal.type === "weight_loss" ? "text-blue-400" : "text-green-400"}`}>
                            {Math.abs(goal.targetWeightKg - goal.currentWeightKg).toFixed(1)} kg
                          </span>
                        </span>
                      </div>
                      <span className="text-xs text-zinc-500">
                        {goal.type === "weight_loss" ? "減量" : "増量"}
                      </span>
                    </div>
                    {/* ビジュアルプログレスバー（目標に近づくほど埋まる） */}
                    <div className="relative">
                      <div className="h-3 bg-zinc-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-700 rounded-full ${
                            goal.type === "weight_loss" 
                              ? "bg-gradient-to-r from-blue-500 to-cyan-400" 
                              : "bg-gradient-to-r from-green-500 to-emerald-400"
                          }`}
                          style={{ 
                            width: `${Math.max(5, 100 - (Math.abs(goal.targetWeightKg - goal.currentWeightKg) / Math.max(goal.currentWeightKg, goal.targetWeightKg)) * 100)}%` 
                          }}
                        />
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-zinc-500">
                        <span>開始</span>
                        <span>🎯 目標達成</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* 筋力向上の場合 */}
          {goal.type === "strength" && (
            <div className="space-y-3">
              {goal.exerciseName && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                  <Dumbbell className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-semibold text-orange-400">{goal.exerciseName}</span>
                </div>
              )}
              <div className="p-3 bg-zinc-800/50 rounded-lg">
                <p className="text-xs text-zinc-500 mb-1">現在の重量 → 目標重量</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">
                    {goal.currentValue || "-"}
                  </span>
                  <span className="text-zinc-400">→</span>
                  <span className="text-2xl font-bold text-white">
                    {goal.targetValue || "-"}
                  </span>
                  <span className="text-sm text-zinc-400">kg</span>
                </div>
              </div>
              {goal.currentValue && goal.targetValue && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-400">
                      あと{" "}
                      <span className="font-bold text-orange-400">
                        +{(goal.targetValue - goal.currentValue).toFixed(1)} kg
                      </span>
                    </span>
                    <span className="text-sm font-bold text-orange-400">
                      {progress?.toFixed(0)}%
                    </span>
                  </div>
                  <div className="relative">
                    <div className="h-3 bg-zinc-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-700 rounded-full"
                        style={{ width: `${progress || 0}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-zinc-500">
                      <span>0kg</span>
                      <span>🎯 {goal.targetValue}kg</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 筋肉量アップの場合 */}
          {goal.type === "muscle_gain" && (
            <div className="space-y-3">
              <div className="p-3 bg-zinc-800/50 rounded-lg space-y-3">
                {goal.currentMuscleMassKg && goal.targetMuscleMassKg && (
                  <MuscleProgressItem
                    label="筋肉量"
                    emoji="💪"
                    current={goal.currentMuscleMassKg}
                    target={goal.targetMuscleMassKg}
                    unit="kg"
                  />
                )}
                {goal.currentArmCm && goal.targetArmCm && (
                  <MuscleProgressItem
                    label="腕回り"
                    emoji="💪"
                    current={goal.currentArmCm}
                    target={goal.targetArmCm}
                    unit="cm"
                  />
                )}
                {goal.currentChestCm && goal.targetChestCm && (
                  <MuscleProgressItem
                    label="胸囲"
                    emoji="🎽"
                    current={goal.currentChestCm}
                    target={goal.targetChestCm}
                    unit="cm"
                  />
                )}
                {goal.currentWaistCm && goal.targetWaistCm && (
                  <MuscleProgressItem
                    label="ウエスト"
                    emoji="📏"
                    current={goal.currentWaistCm}
                    target={goal.targetWaistCm}
                    unit="cm"
                    isReverse={true}
                  />
                )}
              </div>
              {!goal.currentMuscleMassKg && !goal.currentArmCm && !goal.currentChestCm && !goal.currentWaistCm && (
                <p className="text-sm text-zinc-500 text-center py-2">
                  タップして詳細を設定 →
                </p>
              )}
            </div>
          )}
        </motion.div>
      </Link>
    </motion.div>
  );
}

function QuickAction({
  href,
  icon,
  label,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  color: "green" | "orange" | "blue" | "purple";
}) {
  const colorClasses = {
    green: "from-green-500 to-emerald-600",
    orange: "from-orange-500 to-red-600",
    blue: "from-blue-500 to-cyan-600",
    purple: "from-purple-500 to-pink-600",
  };

  return (
    <Link href={href}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ 
          scale: 1.05, 
          y: -4,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center gap-2 p-4 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/50 rounded-xl 
                   hover:bg-zinc-800/80 hover:border-orange-500/30 
                   transition-all duration-300 relative overflow-hidden group
                   shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-orange-500/10
                   before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:to-transparent before:opacity-0 before:transition-opacity before:duration-300
                   hover:before:opacity-100"
      >
        <motion.div 
          className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg group-hover:scale-110 transition-transform duration-300`}
          whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
        >
          <div className="text-white">{icon}</div>
        </motion.div>
        <span className="text-sm text-zinc-300 font-medium group-hover:text-white transition-colors">{label}</span>
      </motion.div>
    </Link>
  );
}

/** 筋肉量アップの各項目の進捗表示 */
function MuscleProgressItem({
  label,
  emoji,
  current,
  target,
  unit,
  isReverse = false,
}: {
  label: string;
  emoji: string;
  current: number;
  target: number;
  unit: string;
  isReverse?: boolean;
}) {
  // 進捗計算（ウエストは減らす目標なのでisReverseの場合は逆算）
  const progress = isReverse
    ? Math.min(100, Math.max(0, ((target - current) / (target - current + (current - target))) * 100 + 50))
    : Math.min(100, (current / target) * 100);
  
  const diff = target - current;
  const diffText = isReverse 
    ? (diff < 0 ? `${Math.abs(diff).toFixed(1)}${unit}達成!` : `あと-${diff.toFixed(1)}${unit}`)
    : (diff > 0 ? `あと+${diff.toFixed(1)}${unit}` : `達成!`);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs text-zinc-400 flex items-center gap-1">
          <span>{emoji}</span> {label}
        </span>
        <span className="text-xs text-zinc-300">
          {current} → {target} {unit}
        </span>
      </div>
      <div className="relative">
        <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 rounded-full"
            style={{ width: `${Math.max(5, progress)}%` }}
          />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-zinc-500">{progress.toFixed(0)}%</span>
        <span className="text-[10px] text-purple-400">{diffText}</span>
      </div>
    </div>
  );
}
