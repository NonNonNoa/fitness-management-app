"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  ArrowLeft, 
  Scale,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar
} from "lucide-react"
import { AnimatedCard } from "@/components/ui/animated-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { NumberInput, AnimatedTextarea } from "@/components/ui/animated-input"
import { StaggerContainer, StaggerItem } from "@/components/ui/motion"

export default function WeightRecordPage() {
  const router = useRouter()
  const [weight, setWeight] = useState(75.5)
  const [bodyFat, setBodyFat] = useState(15)
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // サンプルデータ
  const previousWeight = 75.2
  const weeklyChange = weight - 74.2
  const monthlyChange = weight - 72.5

  const handleSubmit = async () => {
    setIsLoading(true)
    // TODO: API呼び出し
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push("/goals")
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp size={16} className="text-green-500" />
    if (change < 0) return <TrendingDown size={16} className="text-red-500" />
    return <Minus size={16} className="text-zinc-500" />
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-500"
    if (change < 0) return "text-red-500"
    return "text-zinc-500"
  }

  return (
    <div className="px-4 pt-6 pb-8">
      {/* ヘッダー */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-6"
      >
        <motion.button
          onClick={() => router.back()}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </motion.button>
        <div>
          <h1 className="text-xl font-bold text-white">体重を記録</h1>
          <p className="text-sm text-zinc-400">今日の体重を入力</p>
        </div>
      </motion.div>

      {/* 日付 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-2 mb-6 text-zinc-400"
      >
        <Calendar size={18} />
        <span>{new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}</span>
      </motion.div>

      {/* 体重入力 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <AnimatedCard variant="glow" className="p-6" hover={false}>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/10">
              <Scale size={32} className="text-orange-500" />
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setWeight(w => Math.max(0, w - 0.1))}
              className="w-14 h-14 rounded-full bg-zinc-800 text-white text-2xl font-bold hover:bg-zinc-700 transition-colors"
            >
              −
            </motion.button>
            
            <div className="text-center">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                step="0.1"
                className="w-32 text-center text-5xl font-bold text-white bg-transparent focus:outline-none"
              />
              <p className="text-zinc-400 text-lg">kg</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setWeight(w => w + 0.1)}
              className="w-14 h-14 rounded-full bg-zinc-800 text-white text-2xl font-bold hover:bg-zinc-700 transition-colors"
            >
              +
            </motion.button>
          </div>

          {/* 前回との比較 */}
          <div className="flex items-center justify-center gap-2 text-sm">
            {getChangeIcon(weight - previousWeight)}
            <span className={getChangeColor(weight - previousWeight)}>
              {weight > previousWeight ? "+" : ""}{(weight - previousWeight).toFixed(1)}kg
            </span>
            <span className="text-zinc-500">（前回比）</span>
          </div>
        </AnimatedCard>
      </motion.div>

      {/* 体脂肪率（オプション） */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <AnimatedCard className="p-4" hover={false}>
          <p className="text-sm text-zinc-400 mb-3">体脂肪率（任意）</p>
          <div className="flex items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setBodyFat(bf => Math.max(0, bf - 0.5))}
              className="w-10 h-10 rounded-full bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition-colors"
            >
              −
            </motion.button>
            
            <div className="text-center">
              <span className="text-3xl font-bold text-white">{bodyFat.toFixed(1)}</span>
              <span className="text-zinc-400 text-lg ml-1">%</span>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setBodyFat(bf => Math.min(50, bf + 0.5))}
              className="w-10 h-10 rounded-full bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition-colors"
            >
              +
            </motion.button>
          </div>
        </AnimatedCard>
      </motion.div>

      {/* 変化サマリー */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 gap-3 mb-6"
      >
        <AnimatedCard className="p-4 text-center" hover={false}>
          <p className="text-xs text-zinc-500 mb-1">週間変化</p>
          <div className="flex items-center justify-center gap-1">
            {getChangeIcon(weeklyChange)}
            <span className={`text-xl font-bold ${getChangeColor(weeklyChange)}`}>
              {weeklyChange > 0 ? "+" : ""}{weeklyChange.toFixed(1)}kg
            </span>
          </div>
        </AnimatedCard>
        <AnimatedCard className="p-4 text-center" hover={false}>
          <p className="text-xs text-zinc-500 mb-1">月間変化</p>
          <div className="flex items-center justify-center gap-1">
            {getChangeIcon(monthlyChange)}
            <span className={`text-xl font-bold ${getChangeColor(monthlyChange)}`}>
              {monthlyChange > 0 ? "+" : ""}{monthlyChange.toFixed(1)}kg
            </span>
          </div>
        </AnimatedCard>
      </motion.div>

      {/* メモ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-8"
      >
        <AnimatedTextarea
          label="メモ（任意）"
          placeholder="体調や食事に関するメモ..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </motion.div>

      {/* 保存ボタン */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <AnimatedButton
          onClick={handleSubmit}
          isLoading={isLoading}
          variant="primary"
          size="lg"
          className="w-full"
        >
          記録を保存
        </AnimatedButton>
      </motion.div>
    </div>
  )
}
