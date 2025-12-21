"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft, 
  Plus,
  Minus,
  Trash2,
  Check,
  Sparkles,
  Timer,
  Dumbbell
} from "lucide-react"
import { AnimatedCard } from "@/components/ui/animated-card"
import { AnimatedButton, IconButton } from "@/components/ui/animated-button"
import { AnimatedInput, NumberInput, AnimatedSelect } from "@/components/ui/animated-input"
import { StaggerContainer, StaggerItem } from "@/components/ui/motion"

interface ExerciseSet {
  weight: number
  reps: number
  completed: boolean
}

interface Exercise {
  id: string
  name: string
  sets: ExerciseSet[]
}

export default function NewWorkoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialBodyPart = searchParams.get("bodyPart") || "chest"

  const [bodyPart, setBodyPart] = useState(initialBodyPart)
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: "1",
      name: "",
      sets: [{ weight: 0, reps: 0, completed: false }]
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [restTimer, setRestTimer] = useState<number | null>(null)

  const bodyParts = [
    { value: "chest", label: "胸" },
    { value: "back", label: "背中" },
    { value: "legs", label: "脚" },
    { value: "shoulders", label: "肩" },
    { value: "arms", label: "腕" },
    { value: "abs", label: "腹筋" },
  ]

  const exercisesByPart: Record<string, string[]> = {
    chest: ["ベンチプレス", "インクラインダンベルプレス", "ケーブルフライ", "ディップス", "ダンベルフライ"],
    back: ["デッドリフト", "ラットプルダウン", "ベントオーバーロウ", "シーテッドロウ", "懸垂"],
    legs: ["スクワット", "レッグプレス", "ルーマニアンデッドリフト", "レッグカール", "レッグエクステンション"],
    shoulders: ["オーバーヘッドプレス", "サイドレイズ", "フロントレイズ", "リアデルトフライ", "アップライトロウ"],
    arms: ["バーベルカール", "トライセプスエクステンション", "ハンマーカール", "ケーブルプッシュダウン", "インクラインカール"],
    abs: ["クランチ", "レッグレイズ", "プランク", "アブローラー", "ケーブルクランチ"],
  }

  const addExercise = () => {
    setExercises([
      ...exercises,
      {
        id: Date.now().toString(),
        name: "",
        sets: [{ weight: 0, reps: 0, completed: false }]
      }
    ])
  }

  const removeExercise = (id: string) => {
    setExercises(exercises.filter(e => e.id !== id))
  }

  const updateExerciseName = (id: string, name: string) => {
    setExercises(exercises.map(e => 
      e.id === id ? { ...e, name } : e
    ))
  }

  const addSet = (exerciseId: string) => {
    setExercises(exercises.map(e => 
      e.id === exerciseId 
        ? { ...e, sets: [...e.sets, { weight: e.sets[e.sets.length - 1]?.weight || 0, reps: 0, completed: false }] }
        : e
    ))
  }

  const removeSet = (exerciseId: string, setIndex: number) => {
    setExercises(exercises.map(e => 
      e.id === exerciseId 
        ? { ...e, sets: e.sets.filter((_, i) => i !== setIndex) }
        : e
    ))
  }

  const updateSet = (exerciseId: string, setIndex: number, field: keyof ExerciseSet, value: number | boolean) => {
    setExercises(exercises.map(e => 
      e.id === exerciseId 
        ? { 
            ...e, 
            sets: e.sets.map((s, i) => 
              i === setIndex ? { ...s, [field]: value } : s
            ) 
          }
        : e
    ))
  }

  const toggleSetComplete = (exerciseId: string, setIndex: number) => {
    const exercise = exercises.find(e => e.id === exerciseId)
    if (exercise) {
      const set = exercise.sets[setIndex]
      updateSet(exerciseId, setIndex, "completed", !set.completed)
      if (!set.completed) {
        // 休憩タイマー開始
        setRestTimer(90)
      }
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    // TODO: API呼び出し
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push("/workouts")
  }

  const totalVolume = exercises.reduce((acc, e) => 
    acc + e.sets.reduce((setAcc, s) => setAcc + (s.weight * s.reps), 0), 0
  )

  const completedSets = exercises.reduce((acc, e) => 
    acc + e.sets.filter(s => s.completed).length, 0
  )

  const totalSets = exercises.reduce((acc, e) => acc + e.sets.length, 0)

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
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">ワークアウト</h1>
          <p className="text-sm text-zinc-400">種目と重量を記録</p>
        </div>
        {restTimer !== null && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-500/20 border border-orange-500/30"
          >
            <Timer size={16} className="text-orange-500" />
            <span className="text-orange-500 font-mono font-bold">{restTimer}s</span>
          </motion.div>
        )}
      </motion.div>

      {/* 部位選択 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <AnimatedSelect
          label="トレーニング部位"
          options={bodyParts}
          value={bodyPart}
          onChange={setBodyPart}
        />
      </motion.div>

      {/* サマリー */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-3 mb-6"
      >
        <AnimatedCard className="p-4 text-center" hover={false}>
          <p className="text-xs text-zinc-500 mb-1">総ボリューム</p>
          <p className="text-2xl font-bold text-orange-500">{totalVolume.toLocaleString()}<span className="text-sm text-zinc-500">kg</span></p>
        </AnimatedCard>
        <AnimatedCard className="p-4 text-center" hover={false}>
          <p className="text-xs text-zinc-500 mb-1">完了セット</p>
          <p className="text-2xl font-bold text-white">{completedSets}<span className="text-sm text-zinc-500">/{totalSets}</span></p>
        </AnimatedCard>
      </motion.div>

      {/* 種目リスト */}
      <div className="space-y-4 mb-6">
        <AnimatePresence>
          {exercises.map((exercise, exerciseIndex) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: 0.1 * exerciseIndex }}
            >
              <AnimatedCard className="p-4" hover={false}>
                {/* 種目名 */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-zinc-800">
                    <Dumbbell size={20} className="text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <AnimatedSelect
                      options={exercisesByPart[bodyPart].map(name => ({ value: name, label: name }))}
                      value={exercise.name}
                      onChange={(name) => updateExerciseName(exercise.id, name)}
                      placeholder="種目を選択"
                    />
                  </div>
                  {exercises.length > 1 && (
                    <IconButton
                      icon={<Trash2 size={18} />}
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExercise(exercise.id)}
                      className="text-red-500"
                    />
                  )}
                </div>

                {/* セット */}
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-xs text-zinc-500 px-2">
                    <div className="col-span-2">セット</div>
                    <div className="col-span-4 text-center">重量 (kg)</div>
                    <div className="col-span-4 text-center">レップ</div>
                    <div className="col-span-2"></div>
                  </div>

                  {exercise.sets.map((set, setIndex) => (
                    <motion.div
                      key={setIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`grid grid-cols-12 gap-2 items-center p-2 rounded-xl transition-colors ${
                        set.completed ? "bg-green-500/10" : "bg-zinc-800/50"
                      }`}
                    >
                      <div className="col-span-2 text-center text-sm font-medium text-white">
                        {setIndex + 1}
                      </div>
                      <div className="col-span-4">
                        <input
                          type="number"
                          value={set.weight || ""}
                          onChange={(e) => updateSet(exercise.id, setIndex, "weight", parseFloat(e.target.value) || 0)}
                          className="w-full text-center py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div className="col-span-4">
                        <input
                          type="number"
                          value={set.reps || ""}
                          onChange={(e) => updateSet(exercise.id, setIndex, "reps", parseInt(e.target.value) || 0)}
                          className="w-full text-center py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div className="col-span-2 flex justify-center gap-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleSetComplete(exercise.id, setIndex)}
                          className={`p-2 rounded-lg transition-colors ${
                            set.completed 
                              ? "bg-green-500 text-white" 
                              : "bg-zinc-700 text-zinc-400 hover:text-white"
                          }`}
                        >
                          <Check size={16} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* セット追加/削除 */}
                <div className="flex gap-2 mt-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => addSet(exercise.id)}
                    className="flex-1 py-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white text-sm flex items-center justify-center gap-1 transition-colors"
                  >
                    <Plus size={16} />
                    セット追加
                  </motion.button>
                  {exercise.sets.length > 1 && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => removeSet(exercise.id, exercise.sets.length - 1)}
                      className="py-2 px-4 rounded-lg bg-zinc-800 text-zinc-400 hover:text-red-500 text-sm transition-colors"
                    >
                      <Minus size={16} />
                    </motion.button>
                  )}
                </div>
              </AnimatedCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 種目追加ボタン */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8"
      >
        <AnimatedButton
          onClick={addExercise}
          variant="secondary"
          size="lg"
          className="w-full"
          leftIcon={<Plus size={20} />}
        >
          種目を追加
        </AnimatedButton>
      </motion.div>

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
          leftIcon={<Sparkles size={20} />}
        >
          ワークアウトを保存
        </AnimatedButton>
      </motion.div>
    </div>
  )
}
