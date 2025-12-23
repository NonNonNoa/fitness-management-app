"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getMeals } from "@/lib/actions/meals";
import { getMealTypeLabel } from "@/lib/utils/meal-helpers";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function MealsPage() {
  const [meals, setMeals] = useState<Awaited<ReturnType<typeof getMeals>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMeals() {
      try {
        const data = await getMeals();
        setMeals(data);
      } catch (error) {
        console.error("Failed to fetch meals:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMeals();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full shadow-[0_0_20px_rgba(168,85,247,0.6)]"
        />
      </div>
    );
  }

  // 日付ごとにグループ化
  const mealsByDate = meals.reduce((acc, meal) => {
    const date = meal.mealDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(meal);
    return acc;
  }, {} as Record<string, typeof meals>);

  const sortedDates = Object.keys(mealsByDate).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <motion.h1 
            className="text-2xl font-black text-white bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            食事記録
          </motion.h1>
          <motion.p 
            className="text-purple-300/70 mt-1 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            日々の食事を記録・管理
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/meals/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:from-purple-500 hover:to-pink-500 transition-all shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.8)]"
          >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
            食事を記録
          </Link>
        </motion.div>
      </motion.div>

      {/* 食事一覧 */}
      {sortedDates.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-purple-400/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <p className="text-purple-300/70 mb-4 font-medium">まだ食事記録がありません</p>
            <Link
              href="/meals/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:from-purple-500 hover:to-pink-500 transition-all shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.8)]"
            >
              最初の食事を記録する
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => {
            const dayMeals = mealsByDate[date];
            const totalCalories = dayMeals.reduce((sum, m) => sum + (m.totalCalories || 0), 0);
            const formattedDate = new Date(date).toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "short",
            });

            return (
              <motion.div 
                key={date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + sortedDates.indexOf(date) * 0.1 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold text-white">{formattedDate}</h2>
                  <span className="text-sm text-purple-300/70">
                    合計: <span className="text-purple-300 font-bold drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]">{totalCalories}</span> kcal
                  </span>
                </div>
                <div className="grid gap-3">
                  {dayMeals.map((meal) => (
                    <MealCard key={meal.id} meal={meal} />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MealCard({ meal }: { meal: Awaited<ReturnType<typeof getMeals>>[number] }) {
  const mealTypeColors: Record<string, string> = {
    breakfast: "from-yellow-500 to-orange-500",
    lunch: "from-green-500 to-emerald-500",
    dinner: "from-blue-500 to-purple-500",
    snack: "from-pink-500 to-rose-500",
  };

  const color = mealTypeColors[meal.mealType || "snack"];

  return (
    <Link href={`/meals/${meal.id}`}>
      <motion.div 
        className="p-4 bg-black/60 backdrop-blur-md border border-purple-500/30 rounded-xl 
                   hover:border-purple-400/50 hover:bg-black/80 
                   transition-all group relative overflow-hidden
                   shadow-lg shadow-black/20 shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:shadow-xl hover:shadow-purple-500/30
                   before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:to-transparent before:opacity-0 before:transition-opacity before:duration-300
                   hover:before:opacity-100"
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              className={`w-10 h-10 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
              whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
            >
              <span className="text-white text-sm font-bold">
                {getMealTypeLabel(meal.mealType || "snack").charAt(0)}
              </span>
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white group-hover:text-purple-300 transition-colors">
                  {getMealTypeLabel(meal.mealType || "snack")}
                </span>
                {meal.mealTime && (
                  <span className="text-xs text-purple-300/60 font-medium">{meal.mealTime}</span>
                )}
              </div>
              {meal.notes && (
                <p className="text-sm text-purple-300/60 mt-1 line-clamp-1 font-medium">{meal.notes}</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-black text-white drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]">{meal.totalCalories || 0}</div>
            <div className="text-xs text-purple-300/60 font-medium">kcal</div>
          </div>
        </div>
        {/* 栄養素 */}
        <div className="flex gap-4 mt-3 pt-3 border-t border-purple-500/20">
          <div className="text-xs">
            <span className="text-purple-300/60 font-medium">P</span>{" "}
            <span className="text-purple-300 font-bold">{meal.totalProtein?.toFixed(1) || 0}g</span>
          </div>
          <div className="text-xs">
            <span className="text-purple-300/60 font-medium">C</span>{" "}
            <span className="text-purple-300 font-bold">{meal.totalCarbs?.toFixed(1) || 0}g</span>
          </div>
          <div className="text-xs">
            <span className="text-purple-300/60 font-medium">F</span>{" "}
            <span className="text-purple-300 font-bold">{meal.totalFats?.toFixed(1) || 0}g</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}


