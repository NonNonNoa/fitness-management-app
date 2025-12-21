"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { 
  Plus, 
  Dumbbell, 
  ChevronRight,
  Trophy,
  Flame,
  Clock,
  TrendingUp
} from "lucide-react"
import { AnimatedCard } from "@/components/ui/animated-card"
import { FloatingActionButton } from "@/components/ui/animated-button"
import { AnimatedProgressBar, StaggerContainer, StaggerItem } from "@/components/ui/motion"

export default function WorkoutsPage() {
  const bodyParts = [
    { id: "chest", label: "胸", icon: "💪", color: "from-red-500/20 to-orange-500/10" },
    { id: "back", label: "背中", icon: "🔙", color: "from-blue-500/20 to-cyan-500/10" },
    { id: "legs", label: "脚", icon: "🦵", color: "from-green-500/20 to-emerald-500/10" },
    { id: "shoulders", label: "肩", icon: "🎯", color: "from-purple-500/20 to-pink-500/10" },
    { id: "arms", label: "腕", icon: "💪", color: "from-yellow-500/20 to-orange-500/10" },
    { id: "abs", label: "腹筋", icon: "🔥", color: "from-orange-500/20 to-red-500/10" },
  ]

  const weeklyStats = {
    workouts: 4,
    totalVolume: 12500,
    bestLift: "ベンチプレス 85kg",
    streak: 3
  }

  const recentWorkouts = [
    {
      date: "今日",
      bodyPart: "chest",
      exercises: [
        { name: "ベンチプレス", sets: 4, reps: "8-10", weight: 80 },
        { name: "インクラインダンベル", sets: 3, reps: "10-12", weight: 28 },
        { name: "ケーブルフライ", sets: 3, reps: "12-15", weight: 15 },
      ],
      duration: 45,
      volume: 3200
    },
    {
      date: "昨日",
      bodyPart: "back",
      exercises: [
        { name: "デッドリフト", sets: 4, reps: "5-6", weight: 120 },
        { name: "ラットプルダウン", sets: 4, reps: "10-12", weight: 55 },
        { name: "シーテッドロウ", sets: 3, reps: "10-12", weight: 50 },
      ],
      duration: 55,
      volume: 4500
    },
  ]

  const getBodyPartInfo = (id: string) => {
    return bodyParts.find(bp => bp.id === id) || bodyParts[0]
  }

  return (
    <div className="px-4 pt-6">
      {/* ヘッダー */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-white">トレーニング</h1>
        <p className="text-sm text-zinc-400">今週の進捗を確認</p>
      </motion.div>

      {/* 週間サマリー */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <AnimatedCard variant="glow" className="p-5" hover={false}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/10">
              <Trophy size={24} className="text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">今週のトレーニング</p>
              <p className="text-2xl font-bold text-white">{weeklyStats.workouts}回</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-800">
            <div className="text-center">
              <p className="text-xs text-zinc-500 mb-1">総ボリューム</p>
              <p className="font-bold text-white">{weeklyStats.totalVolume.toLocaleString()}<span className="text-xs text-zinc-500">kg</span></p>
            </div>
            <div className="text-center">
              <p className="text-xs text-zinc-500 mb-1">ベスト</p>
              <p className="font-bold text-cyan-500 text-sm">{weeklyStats.bestLift}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-zinc-500 mb-1">連続</p>
              <p className="font-bold text-white">{weeklyStats.streak}日 🔥</p>
            </div>
          </div>
        </AnimatedCard>
      </motion.div>

      {/* 部位選択 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">部位を選択</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {bodyParts.map((part, index) => (
            <Link key={part.id} href={`/workouts/new?bodyPart=${part.id}`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-4 rounded-2xl bg-gradient-to-br ${part.color} border border-zinc-800 hover:border-orange-500/30 transition-all text-center`}
              >
                <span className="text-2xl mb-1 block">{part.icon}</span>
                <span className="text-sm font-medium text-white">{part.label}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* 最近のワークアウト */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">最近のワークアウト</h2>
          <Link href="/workouts/history" className="flex items-center gap-1 text-sm text-orange-500">
            すべて
            <ChevronRight size={16} />
          </Link>
        </div>

        <StaggerContainer className="space-y-4">
          {recentWorkouts.map((workout) => {
            const bodyPart = getBodyPartInfo(workout.bodyPart)
            return (
              <StaggerItem key={workout.date}>
                <AnimatedCard className="p-4">
                  {/* ヘッダー */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${bodyPart.color}`}>
                        <span className="text-xl">{bodyPart.icon}</span>
                      </div>
                      <div>
                        <p className="font-bold text-white">{bodyPart.label}トレ</p>
                        <p className="text-sm text-zinc-500">{workout.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-1 text-zinc-400">
                        <Clock size={14} />
                        {workout.duration}分
                      </div>
                      <div className="flex items-center gap-1 text-orange-500">
                        <TrendingUp size={14} />
                        {workout.volume}kg
                      </div>
                    </div>
                  </div>

                  {/* 種目リスト */}
                  <div className="space-y-2">
                    {workout.exercises.map((exercise, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-2 border-t border-zinc-800 first:border-0 first:pt-0"
                      >
                        <span className="text-sm text-zinc-300">{exercise.name}</span>
                        <span className="text-sm text-zinc-500">
                          {exercise.sets}×{exercise.reps} @ {exercise.weight}kg
                        </span>
                      </div>
                    ))}
                  </div>
                </AnimatedCard>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </motion.div>

      {/* FAB */}
      <Link href="/workouts/new">
        <FloatingActionButton
          icon={<Plus size={28} />}
          label="ワークアウト開始"
        />
      </Link>
    </div>
  )
}
