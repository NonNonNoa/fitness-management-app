"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth/client";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Plus, Zap, Scale, Target, Utensils, Dumbbell, 
  Activity, ChevronRight 
} from "lucide-react";
import { AnimatedCard, StatsCard } from "@/components/ui/animated-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { ChartContainer, WeightChart, CalorieChart } from "@/components/ui/charts";
import { getTodayMeals, getWeekMeals } from "@/lib/actions/meals";
import { getTodayWorkouts, getRecentWorkouts } from "@/lib/actions/workouts";
import { getActiveGoals, getRecentBodyCompositions } from "@/lib/actions/goals";

interface DashboardData {
  todayCalories: number;
  targetCalories: number;
  todayWorkoutSets: number;
  activeGoal: { type: string; current: number; target: number } | null;
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

      const activeGoal = goalsResult.success && goalsResult.data && goalsResult.data.length > 0
        ? {
            type: goalsResult.data[0].goalType,
            current: goalsResult.data[0].currentValue || 0,
            target: goalsResult.data[0].targetValue || 0,
          }
        : null;

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
        activeGoal,
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

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            こんにちは、{session?.user?.name?.split(" ")[0] || "ユーザー"}さん！
          </h1>
          <p className="text-zinc-400 mt-1">{today}</p>
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
          title="目標"
          value={data?.activeGoal ? `${data.activeGoal.current}` : "-"}
          subtitle={data?.activeGoal ? `/ ${data.activeGoal.target}` : "未設定"}
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="体重推移" delay={0.4}>
          <WeightChart data={data?.weightHistory || []} />
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
                  className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl"
                >
                  <div className={`p-2 rounded-lg ${
                    activity.type === "meal" 
                      ? "bg-green-500/20 text-green-400" 
                      : "bg-orange-500/20 text-orange-400"
                  }`}>
                    {activity.type === "meal" ? (
                      <Utensils className="w-4 h-4" />
                    ) : (
                      <Dumbbell className="w-4 h-4" />
                    )}
                  </div>
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="relative overflow-hidden bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-6"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">AI機能</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            AIがあなたのトレーニングをサポート
          </h3>
          <p className="text-zinc-400 text-sm mb-4">
            写真からカロリー計算、食事提案、トレーニングプラン生成など
          </p>
          <Link href="/ai">
            <AnimatedButton variant="secondary" size="sm" icon={<ChevronRight className="w-4 h-4" />}>
              AI機能を使う
            </AnimatedButton>
          </Link>
        </div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute -right-5 -bottom-10 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl" />
      </motion.div>
    </div>
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
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex flex-col items-center gap-2 p-4 bg-zinc-800/50 rounded-xl hover:bg-zinc-800 transition-colors"
      >
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]}`}>
          <div className="text-white">{icon}</div>
        </div>
        <span className="text-sm text-zinc-300">{label}</span>
      </motion.div>
    </Link>
  );
}
