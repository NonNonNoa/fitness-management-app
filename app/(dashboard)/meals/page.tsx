"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { 
  Plus, 
  Flame, 
  Coffee, 
  Sun, 
  Moon, 
  Cookie,
  ChevronRight,
  Camera
} from "lucide-react"
import { AnimatedCard } from "@/components/ui/animated-card"
import { FloatingActionButton } from "@/components/ui/animated-button"
import { AnimatedProgressBar, StaggerContainer, StaggerItem } from "@/components/ui/motion"

export default function MealsPage() {
  // サンプルデータ
  const todayStats = {
    calories: { consumed: 1850, target: 2500 },
    protein: 120,
    carbs: 180,
    fat: 65,
  }

  const mealTypes = [
    { type: "breakfast", icon: <Coffee size={20} />, label: "朝食", time: "7:00 - 9:00" },
    { type: "lunch", icon: <Sun size={20} />, label: "昼食", time: "12:00 - 14:00" },
    { type: "dinner", icon: <Moon size={20} />, label: "夕食", time: "18:00 - 21:00" },
    { type: "snack", icon: <Cookie size={20} />, label: "間食", time: "随時" },
  ]

  const todayMeals = [
    {
      type: "breakfast",
      name: "オートミール + プロテイン",
      calories: 450,
      protein: 35,
      time: "7:30",
      image: null
    },
    {
      type: "lunch",
      name: "鶏胸肉のグリル定食",
      calories: 650,
      protein: 45,
      time: "12:15",
      image: null
    },
    {
      type: "snack",
      name: "プロテインバー",
      calories: 200,
      protein: 20,
      time: "15:00",
      image: null
    },
  ]

  const getMealIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      breakfast: <Coffee size={20} />,
      lunch: <Sun size={20} />,
      dinner: <Moon size={20} />,
      snack: <Cookie size={20} />,
    }
    return icons[type] || <Flame size={20} />
  }

  return (
    <div className="px-4 pt-6">
      {/* ヘッダー */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">食事管理</h1>
          <p className="text-sm text-zinc-400">今日の栄養バランス</p>
        </div>
        <Link href="/meals/new">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white"
          >
            <Camera size={20} />
          </motion.div>
        </Link>
      </motion.div>

      {/* 今日のカロリー */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <AnimatedCard variant="glow" className="p-6" hover={false}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-zinc-400 mb-1">本日の摂取カロリー</p>
              <p className="text-4xl font-bold text-white">
                {todayStats.calories.consumed}
                <span className="text-lg text-zinc-500 font-normal ml-2">kcal</span>
              </p>
            </div>
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  stroke="#27272a"
                  strokeWidth="6"
                />
                <motion.circle
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 226" }}
                  animate={{ 
                    strokeDasharray: `${(todayStats.calories.consumed / todayStats.calories.target) * 226} 226` 
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {Math.round((todayStats.calories.consumed / todayStats.calories.target) * 100)}%
                </span>
              </div>
            </div>
          </div>
          <p className="text-sm text-zinc-500">
            目標まであと <span className="text-orange-500 font-medium">{todayStats.calories.target - todayStats.calories.consumed} kcal</span>
          </p>
        </AnimatedCard>
      </motion.div>

      {/* マクロ栄養素 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-3 mb-6"
      >
        {[
          { label: "タンパク質", value: todayStats.protein, unit: "g", color: "from-cyan-500 to-blue-500" },
          { label: "炭水化物", value: todayStats.carbs, unit: "g", color: "from-green-500 to-emerald-500" },
          { label: "脂質", value: todayStats.fat, unit: "g", color: "from-yellow-500 to-orange-500" },
        ].map((macro, index) => (
          <motion.div
            key={macro.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <AnimatedCard className="p-4 text-center" hover={false}>
              <p className="text-xs text-zinc-500 mb-1">{macro.label}</p>
              <p className="text-xl font-bold text-white">
                {macro.value}
                <span className="text-sm text-zinc-500 font-normal">{macro.unit}</span>
              </p>
              <div className="mt-2 h-1 rounded-full bg-zinc-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "60%" }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className={`h-full rounded-full bg-gradient-to-r ${macro.color}`}
                />
              </div>
            </AnimatedCard>
          </motion.div>
        ))}
      </motion.div>

      {/* 食事タイプ選択 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <h2 className="text-lg font-bold text-white mb-4">食事を追加</h2>
        <div className="grid grid-cols-4 gap-2">
          {mealTypes.map((meal, index) => (
            <Link key={meal.type} href={`/meals/new?type=${meal.type}`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-orange-500/30 transition-colors"
              >
                <div className="p-2 rounded-lg bg-zinc-800 text-orange-500 mb-2">
                  {meal.icon}
                </div>
                <span className="text-xs text-white font-medium">{meal.label}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* 今日の食事 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">今日の記録</h2>
          <Link href="/meals/history" className="flex items-center gap-1 text-sm text-orange-500">
            履歴
            <ChevronRight size={16} />
          </Link>
        </div>

        <StaggerContainer className="space-y-3">
          {todayMeals.map((meal) => (
            <StaggerItem key={meal.time}>
              <AnimatedCard className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-zinc-800 text-zinc-400">
                    {getMealIcon(meal.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{meal.name}</p>
                    <p className="text-sm text-zinc-500">{meal.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">{meal.calories}</p>
                    <p className="text-xs text-zinc-500">kcal</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between text-sm">
                  <span className="text-zinc-500">タンパク質</span>
                  <span className="text-cyan-500 font-medium">{meal.protein}g</span>
                </div>
              </AnimatedCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {todayMeals.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-800 flex items-center justify-center">
              <Flame size={32} className="text-zinc-600" />
            </div>
            <p className="text-zinc-500 mb-4">まだ食事の記録がありません</p>
            <Link href="/meals/new">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium"
              >
                食事を記録する
              </motion.button>
            </Link>
          </motion.div>
        )}
      </motion.div>

      {/* FAB */}
      <Link href="/meals/new">
        <FloatingActionButton
          icon={<Plus size={28} />}
          label="食事を追加"
        />
      </Link>
    </div>
  )
}
