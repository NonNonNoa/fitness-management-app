"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Scale,
  Dumbbell,
  Plus,
  ChevronRight,
  Trophy,
  Flame
} from "lucide-react"
import { AnimatedCard } from "@/components/ui/animated-card"
import { AnimatedButton, FloatingActionButton } from "@/components/ui/animated-button"
import { AnimatedProgressBar, StaggerContainer, StaggerItem } from "@/components/ui/motion"

export default function GoalsPage() {
  // サンプルデータ
  const currentWeight = 75.5
  const targetWeight = 80
  const startWeight = 70

  const goals = [
    {
      id: "1",
      type: "weight_gain",
      title: "体重増量",
      current: currentWeight,
      target: targetWeight,
      unit: "kg",
      progress: ((currentWeight - startWeight) / (targetWeight - startWeight)) * 100,
      icon: <TrendingUp size={24} />,
      color: "from-green-500/20 to-emerald-500/10",
      textColor: "text-green-500"
    },
    {
      id: "2",
      type: "strength",
      title: "ベンチプレス",
      current: 85,
      target: 100,
      unit: "kg",
      progress: 85,
      icon: <Dumbbell size={24} />,
      color: "from-orange-500/20 to-amber-500/10",
      textColor: "text-orange-500"
    },
    {
      id: "3",
      type: "strength",
      title: "スクワット",
      current: 100,
      target: 140,
      unit: "kg",
      progress: 71,
      icon: <Dumbbell size={24} />,
      color: "from-cyan-500/20 to-blue-500/10",
      textColor: "text-cyan-500"
    },
  ]

  const weightHistory = [
    { date: "12/21", weight: 75.5 },
    { date: "12/18", weight: 75.2 },
    { date: "12/15", weight: 74.8 },
    { date: "12/12", weight: 74.5 },
    { date: "12/09", weight: 74.2 },
  ]

  const achievements = [
    { title: "7日連続記録", icon: "🔥", achieved: true },
    { title: "ベンチ80kg達成", icon: "💪", achieved: true },
    { title: "ベンチ100kg", icon: "🏆", achieved: false },
  ]

  return (
    <div className="px-4 pt-6">
      {/* ヘッダー */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">目標管理</h1>
          <p className="text-sm text-zinc-400">進捗を確認しよう</p>
        </div>
        <Link href="/goals/new">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white"
          >
            <Plus size={20} />
          </motion.div>
        </Link>
      </motion.div>

      {/* 現在の体重 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <AnimatedCard variant="glow" className="p-6" hover={false}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/10">
                <Scale size={28} className="text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">現在の体重</p>
                <p className="text-3xl font-bold text-white">
                  {currentWeight}
                  <span className="text-lg text-zinc-500 ml-1">kg</span>
                </p>
              </div>
            </div>
            <Link href="/goals/weight">
              <AnimatedButton variant="primary" size="sm">
                記録する
              </AnimatedButton>
            </Link>
          </div>
          
          {/* ミニグラフ */}
          <div className="h-16 flex items-end gap-1 mb-3">
            {weightHistory.map((entry, index) => {
              const height = ((entry.weight - 70) / 10) * 100
              return (
                <motion.div
                  key={entry.date}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex-1 bg-gradient-to-t from-orange-500 to-amber-500 rounded-t-sm"
                />
              )
            })}
          </div>
          <div className="flex justify-between text-xs text-zinc-500">
            {weightHistory.map(entry => (
              <span key={entry.date}>{entry.date}</span>
            ))}
          </div>
        </AnimatedCard>
      </motion.div>

      {/* 目標リスト */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">アクティブな目標</h2>
          <Link href="/goals/all" className="flex items-center gap-1 text-sm text-orange-500">
            すべて
            <ChevronRight size={16} />
          </Link>
        </div>

        <StaggerContainer className="space-y-3">
          {goals.map((goal) => (
            <StaggerItem key={goal.id}>
              <AnimatedCard className="p-4">
                <div className="flex items-center gap-4 mb-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${goal.color} ${goal.textColor}`}>
                    {goal.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{goal.title}</p>
                    <p className="text-sm text-zinc-500">
                      目標: {goal.target}{goal.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${goal.textColor}`}>
                      {goal.current}
                    </p>
                    <p className="text-xs text-zinc-500">{goal.unit}</p>
                  </div>
                </div>
                <div className="mb-2">
                  <AnimatedProgressBar 
                    value={goal.progress} 
                    max={100}
                    color={`bg-gradient-to-r ${goal.color.replace('/20', '').replace('/10', '')}`}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">進捗</span>
                  <span className={goal.textColor}>{Math.round(goal.progress)}%</span>
                </div>
              </AnimatedCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </motion.div>

      {/* 実績 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Trophy size={20} className="text-amber-500" />
          <h2 className="text-lg font-bold text-white">実績</h2>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.title}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className={`flex-shrink-0 p-4 rounded-xl border ${
                achievement.achieved 
                  ? "bg-amber-500/10 border-amber-500/30" 
                  : "bg-zinc-900 border-zinc-800 opacity-50"
              }`}
            >
              <span className="text-2xl mb-2 block">{achievement.icon}</span>
              <p className={`text-sm font-medium ${achievement.achieved ? "text-white" : "text-zinc-500"}`}>
                {achievement.title}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* アスリート比較 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <AnimatedCard variant="gradient" className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/10">
              <Flame size={20} className="text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">あなたのベンチプレス</p>
              <p className="font-bold text-white">85kg</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">一般成人男性平均</span>
              <span className="text-sm text-white">40kg</span>
              <span className="text-xs text-green-500">✓ 達成</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">トレーニー平均</span>
              <span className="text-sm text-white">80kg</span>
              <span className="text-xs text-green-500">✓ 達成</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">上級者</span>
              <span className="text-sm text-white">100kg</span>
              <span className="text-xs text-orange-500">あと15kg</span>
            </div>
          </div>
        </AnimatedCard>
      </motion.div>

      {/* FAB */}
      <Link href="/goals/weight">
        <FloatingActionButton
          icon={<Scale size={24} />}
          label="体重を記録"
        />
      </Link>
    </div>
  )
}
