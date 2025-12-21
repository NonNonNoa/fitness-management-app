"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { 
  ArrowLeft, 
  Camera, 
  Search, 
  Coffee, 
  Sun, 
  Moon, 
  Cookie,
  Plus,
  Minus,
  Sparkles
} from "lucide-react"
import { AnimatedCard } from "@/components/ui/animated-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { AnimatedInput, NumberInput, AnimatedTextarea } from "@/components/ui/animated-input"
import { StaggerContainer, StaggerItem } from "@/components/ui/motion"

export default function NewMealPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialType = searchParams.get("type") || "lunch"

  const [mealType, setMealType] = useState(initialType)
  const [mealName, setMealName] = useState("")
  const [calories, setCalories] = useState(0)
  const [protein, setProtein] = useState(0)
  const [carbs, setCarbs] = useState(0)
  const [fat, setFat] = useState(0)
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const mealTypes = [
    { type: "breakfast", icon: <Coffee size={20} />, label: "朝食" },
    { type: "lunch", icon: <Sun size={20} />, label: "昼食" },
    { type: "dinner", icon: <Moon size={20} />, label: "夕食" },
    { type: "snack", icon: <Cookie size={20} />, label: "間食" },
  ]

  const quickFoods = [
    { name: "プロテイン", calories: 120, protein: 25, carbs: 3, fat: 1 },
    { name: "鶏胸肉 100g", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    { name: "白米 150g", calories: 252, protein: 3.8, carbs: 55.7, fat: 0.5 },
    { name: "卵 1個", calories: 91, protein: 7.4, carbs: 0.2, fat: 6.5 },
  ]

  const handleQuickAdd = (food: typeof quickFoods[0]) => {
    setMealName(food.name)
    setCalories(food.calories)
    setProtein(food.protein)
    setCarbs(food.carbs)
    setFat(food.fat)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    // TODO: API呼び出し
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push("/meals")
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
          <h1 className="text-xl font-bold text-white">食事を記録</h1>
          <p className="text-sm text-zinc-400">栄養素を入力してください</p>
        </div>
      </motion.div>

      {/* 食事タイプ選択 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <label className="block text-sm font-medium text-zinc-300 mb-3">食事タイプ</label>
        <div className="grid grid-cols-4 gap-2">
          {mealTypes.map((meal) => (
            <motion.button
              key={meal.type}
              onClick={() => setMealType(meal.type)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex flex-col items-center p-3 rounded-xl border transition-all ${
                mealType === meal.type
                  ? "bg-orange-500/20 border-orange-500 text-orange-500"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700"
              }`}
            >
              {meal.icon}
              <span className="text-xs mt-1 font-medium">{meal.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* AI/カメラ入力 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-3 mb-6"
      >
        <AnimatedCard className="p-4 cursor-pointer hover:border-orange-500/30 transition-colors">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 text-orange-500 mb-2">
              <Camera size={24} />
            </div>
            <p className="text-sm font-medium text-white">写真で記録</p>
            <p className="text-xs text-zinc-500">AIが自動計算</p>
          </div>
        </AnimatedCard>
        <AnimatedCard className="p-4 cursor-pointer hover:border-cyan-500/30 transition-colors">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 text-cyan-500 mb-2">
              <Search size={24} />
            </div>
            <p className="text-sm font-medium text-white">食品を検索</p>
            <p className="text-xs text-zinc-500">データベースから</p>
          </div>
        </AnimatedCard>
      </motion.div>

      {/* クイック追加 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <label className="block text-sm font-medium text-zinc-300 mb-3">よく使う食品</label>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {quickFoods.map((food) => (
            <motion.button
              key={food.name}
              onClick={() => handleQuickAdd(food)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-shrink-0 px-4 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-zinc-300 hover:border-orange-500/30 transition-colors"
            >
              {food.name}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* 手動入力フォーム */}
      <StaggerContainer className="space-y-4 mb-8">
        <StaggerItem>
          <AnimatedInput
            label="食品名"
            placeholder="例: 鶏胸肉のグリル"
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
          />
        </StaggerItem>

        <StaggerItem>
          <NumberInput
            label="カロリー"
            value={calories}
            onChange={setCalories}
            step={10}
            unit="kcal"
          />
        </StaggerItem>

        <StaggerItem>
          <div className="grid grid-cols-3 gap-3">
            <NumberInput
              label="タンパク質"
              value={protein}
              onChange={setProtein}
              unit="g"
            />
            <NumberInput
              label="炭水化物"
              value={carbs}
              onChange={setCarbs}
              unit="g"
            />
            <NumberInput
              label="脂質"
              value={fat}
              onChange={setFat}
              unit="g"
            />
          </div>
        </StaggerItem>

        <StaggerItem>
          <AnimatedTextarea
            label="メモ（任意）"
            placeholder="食事に関するメモ..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </StaggerItem>
      </StaggerContainer>

      {/* プレビュー */}
      {(mealName || calories > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <AnimatedCard variant="gradient" className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-orange-500" />
              <span className="text-sm text-zinc-400">プレビュー</span>
            </div>
            <p className="font-medium text-white mb-2">{mealName || "食品名未入力"}</p>
            <div className="grid grid-cols-4 gap-2 text-center text-sm">
              <div>
                <p className="text-zinc-500">カロリー</p>
                <p className="font-bold text-orange-500">{calories}</p>
              </div>
              <div>
                <p className="text-zinc-500">P</p>
                <p className="font-bold text-cyan-500">{protein}g</p>
              </div>
              <div>
                <p className="text-zinc-500">C</p>
                <p className="font-bold text-green-500">{carbs}g</p>
              </div>
              <div>
                <p className="text-zinc-500">F</p>
                <p className="font-bold text-yellow-500">{fat}g</p>
              </div>
            </div>
          </AnimatedCard>
        </motion.div>
      )}

      {/* 保存ボタン */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <AnimatedButton
          onClick={handleSubmit}
          isLoading={isLoading}
          variant="primary"
          size="lg"
          className="w-full"
          disabled={!mealName || calories === 0}
        >
          記録を保存
        </AnimatedButton>
      </motion.div>
    </div>
  )
}
