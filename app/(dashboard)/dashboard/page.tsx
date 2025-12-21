"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { 
  Flame, 
  Dumbbell, 
  Target, 
  TrendingUp, 
  Plus, 
  ChevronRight,
  Utensils,
  Trophy,
  Calendar
} from "lucide-react"
import { AnimatedCard, StatsCard, ActionCard } from "@/components/ui/animated-card"
import { AnimatedButton, FloatingActionButton } from "@/components/ui/animated-button"
import { AnimatedProgressBar, StaggerContainer, StaggerItem } from "@/components/ui/motion"

export default function DashboardPage() {
  // サンプルデータ（実際はAPIから取得）
  const stats = {
    calories: { consumed: 1850, target: 2500 },
    protein: { consumed: 120, target: 180 },
    workouts: 3,
    streak: 7
  }

  const quickActions = [
    { 
      icon: <Utensils size={24} />, 
      title: "食事を記録", 
      desc: "カロリーを追加",
      href: "/meals/new",
      color: "from-orange-500/20 to-amber-500/10"
    },
    { 
      icon: <Dumbbell size={24} />, 
      title: "トレーニング", 
      desc: "ワークアウト開始",
      href: "/workouts/new",
      color: "from-cyan-500/20 to-blue-500/10"
    },
    { 
      icon: <Target size={24} />, 
      title: "体重記録", 
      desc: "進捗を更新",
      href: "/goals/weight",
      color: "from-green-500/20 to-emerald-500/10"
    },
  ]

  const recentWorkouts = [
    { name: "胸トレ", date: "今日", sets: 15, duration: "45分" },
    { name: "背中トレ", date: "昨日", sets: 18, duration: "55分" },
    { name: "脚トレ", date: "2日前", sets: 12, duration: "40分" },
  ]

  return (
    <div className="px-4 pt-6">
      {/* ヘッダー */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="text-zinc-400 text-sm mb-1">おはようございます</p>
        <h1 className="text-2xl font-bold text-white">今日も頑張ろう! 💪</h1>
      </motion.div>

      {/* 継続日数バナー */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-orange-500/20 via-amber-500/10 to-orange-500/5 border border-orange-500/20"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-500/20">
              <Flame size={24} className="text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">連続記録</p>
              <p className="text-xl font-bold text-white">{stats.streak}日連続 🔥</p>
            </div>
          </div>
          <Trophy className="text-orange-500/50" size={40} />
        </div>
      </motion.div>

      {/* 今日のステータス */}
      <StaggerContainer className="grid grid-cols-2 gap-4 mb-6">
        <StaggerItem>
          <AnimatedCard className="p-4" hover={false}>
            <div className="flex items-center gap-2 mb-3">
              <Flame size={18} className="text-orange-500" />
              <span className="text-sm text-zinc-400">カロリー</span>
            </div>
            <p className="text-2xl font-bold text-white mb-2">
              {stats.calories.consumed}
              <span className="text-sm text-zinc-500 font-normal ml-1">/ {stats.calories.target} kcal</span>
            </p>
            <AnimatedProgressBar 
              value={stats.calories.consumed} 
              max={stats.calories.target}
            />
          </AnimatedCard>
        </StaggerItem>

        <StaggerItem>
          <AnimatedCard className="p-4" hover={false}>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={18} className="text-cyan-500" />
              <span className="text-sm text-zinc-400">タンパク質</span>
            </div>
            <p className="text-2xl font-bold text-white mb-2">
              {stats.protein.consumed}
              <span className="text-sm text-zinc-500 font-normal ml-1">/ {stats.protein.target} g</span>
            </p>
            <AnimatedProgressBar 
              value={stats.protein.consumed} 
              max={stats.protein.target}
              color="bg-gradient-to-r from-cyan-500 to-blue-500"
            />
          </AnimatedCard>
        </StaggerItem>
      </StaggerContainer>

      {/* クイックアクション */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <h2 className="text-lg font-bold text-white mb-4">クイックアクション</h2>
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((action, index) => (
            <Link key={action.title} href={action.href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex flex-col items-center p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-colors"
              >
                <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} text-orange-500 mb-2`}>
                  {action.icon}
                </div>
                <p className="text-sm font-medium text-white text-center">{action.title}</p>
                <p className="text-xs text-zinc-500">{action.desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* 今週のトレーニング */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">今週のトレーニング</h2>
          <Link href="/workouts" className="flex items-center gap-1 text-sm text-orange-500">
            すべて見る
            <ChevronRight size={16} />
          </Link>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {["月", "火", "水", "木", "金", "土", "日"].map((day, index) => {
            const isActive = index < stats.workouts
            const isToday = index === 6
            return (
              <motion.div
                key={day}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                className={`flex-shrink-0 w-10 h-14 rounded-xl flex flex-col items-center justify-center ${
                  isToday 
                    ? "bg-gradient-to-b from-orange-500 to-amber-500 text-white" 
                    : isActive
                      ? "bg-zinc-800 text-white"
                      : "bg-zinc-900 text-zinc-600"
                }`}
              >
                <span className="text-xs">{day}</span>
                {isActive && !isToday && (
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1" />
                )}
              </motion.div>
            )
          })}
        </div>

        {/* 最近のワークアウト */}
        <StaggerContainer className="space-y-3">
          {recentWorkouts.map((workout) => (
            <StaggerItem key={workout.name}>
              <AnimatedCard className="p-4" hover={true}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-zinc-800">
                      <Dumbbell size={20} className="text-zinc-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{workout.name}</p>
                      <p className="text-sm text-zinc-500">{workout.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-zinc-300">{workout.sets} セット</p>
                    <p className="text-xs text-zinc-500">{workout.duration}</p>
                  </div>
                </div>
              </AnimatedCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </motion.div>

      {/* 目標達成状況 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">目標</h2>
          <Link href="/goals" className="flex items-center gap-1 text-sm text-orange-500">
            編集
            <ChevronRight size={16} />
          </Link>
        </div>

        <AnimatedCard variant="glow" className="p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/10">
              <Target size={28} className="text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">現在の目標</p>
              <p className="text-xl font-bold text-white">ベンチプレス 100kg</p>
            </div>
          </div>
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-zinc-400">進捗</span>
              <span className="text-white font-medium">80kg / 100kg</span>
            </div>
            <AnimatedProgressBar value={80} max={100} />
          </div>
          <p className="text-sm text-zinc-500">
            あと <span className="text-orange-500 font-medium">20kg</span> で達成！
          </p>
        </AnimatedCard>
      </motion.div>

      {/* FAB */}
      <FloatingActionButton
        icon={<Plus size={28} />}
        label="新規記録"
        onClick={() => {}}
      />
    </div>
  )
}
