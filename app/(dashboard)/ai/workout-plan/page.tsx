"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Dumbbell, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { AnimatedButton } from "@/components/ui/animated-button";
import { AnimatedCard } from "@/components/ui/animated-card";
import { AnimatedSelect, AnimatedInput } from "@/components/ui/animated-input";
import { getWorkoutPlan } from "@/lib/actions/ai";

interface WorkoutPlan {
  name: string;
  description: string;
  durationWeeks: number;
  daysPerWeek: number;
  schedule: {
    day: string;
    focus: string;
    exercises: {
      name: string;
      sets: number;
      reps: string;
      restSeconds: number;
      notes?: string;
    }[];
  }[];
  tips: string[];
}

const equipmentOptions = [
  { id: "barbell", label: "バーベル" },
  { id: "dumbbell", label: "ダンベル" },
  { id: "machine", label: "マシン" },
  { id: "cable", label: "ケーブル" },
  { id: "bodyweight", label: "自重" },
];

const focusOptions = [
  { id: "chest", label: "胸" },
  { id: "back", label: "背中" },
  { id: "legs", label: "脚" },
  { id: "shoulders", label: "肩" },
  { id: "arms", label: "腕" },
  { id: "core", label: "体幹" },
];

export default function WorkoutPlanPage() {
  const [goalType, setGoalType] = useState<"muscle_gain" | "strength" | "weight_loss" | "endurance">("muscle_gain");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("intermediate");
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [equipment, setEquipment] = useState<string[]>(["barbell", "dumbbell", "machine"]);
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WorkoutPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const toggleEquipment = (id: string) => {
    setEquipment((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const toggleFocus = (id: string) => {
    setFocusAreas((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (equipment.length === 0) {
      setError("使用可能な器具を選択してください");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await getWorkoutPlan(
        goalType,
        level,
        daysPerWeek,
        equipment,
        focusAreas.length > 0 ? focusAreas : undefined
      );
      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setError(response.error || "プラン生成に失敗しました");
      }
    } catch (err) {
      setError("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Link href="/ai">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-400" />
          </motion.div>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">トレーニングプラン</h1>
          <p className="text-zinc-400 text-sm">AIがあなた専用のプランを作成</p>
        </div>
      </motion.div>

      {/* Form */}
      <AnimatedCard hoverable={false}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <AnimatedSelect
              label="目標"
              value={goalType}
              onChange={(e) => setGoalType(e.target.value as typeof goalType)}
              options={[
                { value: "muscle_gain", label: "筋肥大" },
                { value: "strength", label: "筋力向上" },
                { value: "weight_loss", label: "脂肪燃焼" },
                { value: "endurance", label: "持久力向上" },
              ]}
            />
            <AnimatedSelect
              label="レベル"
              value={level}
              onChange={(e) => setLevel(e.target.value as typeof level)}
              options={[
                { value: "beginner", label: "初心者" },
                { value: "intermediate", label: "中級者" },
                { value: "advanced", label: "上級者" },
              ]}
            />
          </div>

          <AnimatedInput
            label="週のトレーニング日数"
            type="number"
            min={1}
            max={7}
            value={daysPerWeek}
            onChange={(e) => setDaysPerWeek(Number(e.target.value))}
          />

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              使用可能な器具
            </label>
            <div className="flex flex-wrap gap-2">
              {equipmentOptions.map((opt) => (
                <motion.button
                  key={opt.id}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleEquipment(opt.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    equipment.includes(opt.id)
                      ? "bg-orange-500 text-white"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  }`}
                >
                  {opt.label}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              重点部位（任意）
            </label>
            <div className="flex flex-wrap gap-2">
              {focusOptions.map((opt) => (
                <motion.button
                  key={opt.id}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleFocus(opt.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    focusAreas.includes(opt.id)
                      ? "bg-purple-500 text-white"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  }`}
                >
                  {opt.label}
                </motion.button>
              ))}
            </div>
          </div>

          <AnimatedButton
            type="submit"
            fullWidth
            loading={loading}
            icon={<Dumbbell className="w-4 h-4" />}
          >
            プランを生成
          </AnimatedButton>
        </form>
      </AnimatedCard>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Plan Overview */}
            <AnimatedCard hoverable={false}>
              <h2 className="text-xl font-bold text-white mb-2">{result.name}</h2>
              <p className="text-zinc-400 text-sm mb-4">{result.description}</p>
              <div className="flex gap-4 text-sm text-zinc-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{result.durationWeeks}週間</span>
                </div>
                <div className="flex items-center gap-1">
                  <Dumbbell className="w-4 h-4" />
                  <span>週{result.daysPerWeek}日</span>
                </div>
              </div>
            </AnimatedCard>

            {/* Schedule */}
            <div className="space-y-3">
              {result.schedule.map((day, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AnimatedCard
                    hoverable
                    onClick={() => setSelectedDay(selectedDay === index ? null : index)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{day.day}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{day.focus}</h3>
                          <p className="text-zinc-500 text-sm">{day.exercises.length}種目</p>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {selectedDay === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-zinc-800 space-y-3"
                        >
                          {day.exercises.map((exercise, exIndex) => (
                            <div
                              key={exIndex}
                              className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl"
                            >
                              <div>
                                <p className="text-white text-sm">{exercise.name}</p>
                                {exercise.notes && (
                                  <p className="text-zinc-500 text-xs">{exercise.notes}</p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-orange-400 text-sm">
                                  {exercise.sets}セット × {exercise.reps}
                                </p>
                                <p className="text-zinc-500 text-xs flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  休憩 {exercise.restSeconds}秒
                                </p>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </AnimatedCard>
                </motion.div>
              ))}
            </div>

            {/* Tips */}
            {result.tips && result.tips.length > 0 && (
              <AnimatedCard title="アドバイス" hoverable={false}>
                <ul className="space-y-2">
                  {result.tips.map((tip, index) => (
                    <li key={index} className="flex gap-2 text-sm text-zinc-400">
                      <span className="text-orange-400">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </AnimatedCard>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

