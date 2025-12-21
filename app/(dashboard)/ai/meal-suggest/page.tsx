"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChefHat, Flame } from "lucide-react";
import Link from "next/link";
import { AnimatedButton } from "@/components/ui/animated-button";
import { AnimatedCard } from "@/components/ui/animated-card";
import { AnimatedSelect, AnimatedInput, AnimatedTextarea } from "@/components/ui/animated-input";
import { getMealSuggestions } from "@/lib/actions/ai";

interface MealSuggestion {
  meals: {
    name: string;
    description: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    recipe?: string[];
  }[];
  dailyPlan?: string;
}

export default function MealSuggestPage() {
  const [goalType, setGoalType] = useState<"weight_loss" | "weight_gain" | "muscle_gain" | "maintain">("muscle_gain");
  const [currentCalories, setCurrentCalories] = useState(800);
  const [targetCalories, setTargetCalories] = useState(2500);
  const [preferences, setPreferences] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MealSuggestion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await getMealSuggestions(
        goalType,
        currentCalories,
        targetCalories,
        preferences || undefined
      );
      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setError(response.error || "提案の取得に失敗しました");
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
          <h1 className="text-2xl font-bold text-white">食事提案</h1>
          <p className="text-zinc-400 text-sm">目標に合わせた食事をAIが提案</p>
        </div>
      </motion.div>

      {/* Form */}
      <AnimatedCard hoverable={false}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatedSelect
            label="目標"
            value={goalType}
            onChange={(e) => setGoalType(e.target.value as typeof goalType)}
            options={[
              { value: "muscle_gain", label: "筋肉増加" },
              { value: "weight_loss", label: "減量" },
              { value: "weight_gain", label: "増量" },
              { value: "maintain", label: "体重維持" },
            ]}
          />

          <div className="grid grid-cols-2 gap-4">
            <AnimatedInput
              label="現在のカロリー (kcal)"
              type="number"
              value={currentCalories}
              onChange={(e) => setCurrentCalories(Number(e.target.value))}
            />
            <AnimatedInput
              label="目標カロリー (kcal)"
              type="number"
              value={targetCalories}
              onChange={(e) => setTargetCalories(Number(e.target.value))}
            />
          </div>

          <AnimatedTextarea
            label="好み・制限（任意）"
            placeholder="例: 鶏肉が好き、乳製品アレルギー"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            rows={2}
          />

          <AnimatedButton
            type="submit"
            fullWidth
            loading={loading}
            icon={<ChefHat className="w-4 h-4" />}
          >
            提案を取得
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
            {result.dailyPlan && (
              <AnimatedCard hoverable={false}>
                <p className="text-zinc-300 text-sm">{result.dailyPlan}</p>
              </AnimatedCard>
            )}

            <div className="space-y-4">
              {result.meals.map((meal, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AnimatedCard
                    hoverable
                    onClick={() => setSelectedMeal(selectedMeal === index ? null : index)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{meal.name}</h3>
                        <p className="text-zinc-400 text-sm mt-1">{meal.description}</p>
                      </div>
                      <div className="flex items-center gap-1 text-orange-400">
                        <Flame className="w-4 h-4" />
                        <span className="font-bold">{meal.calories}</span>
                        <span className="text-xs text-zinc-500">kcal</span>
                      </div>
                    </div>

                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-zinc-400">P: {meal.protein}g</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-zinc-400">C: {meal.carbs}g</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-yellow-500" />
                        <span className="text-zinc-400">F: {meal.fats}g</span>
                      </div>
                    </div>

                    {/* Recipe */}
                    <AnimatePresence>
                      {selectedMeal === index && meal.recipe && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-zinc-800"
                        >
                          <h4 className="text-sm font-medium text-white mb-2">レシピ</h4>
                          <ol className="space-y-1">
                            {meal.recipe.map((step, stepIndex) => (
                              <li key={stepIndex} className="text-sm text-zinc-400 flex gap-2">
                                <span className="text-orange-400">{stepIndex + 1}.</span>
                                {step}
                              </li>
                            ))}
                          </ol>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </AnimatedCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

