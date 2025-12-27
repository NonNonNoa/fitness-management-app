"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { getWorkouts, getWorkoutWithSets, getPreviousExerciseRecord } from "@/lib/actions/workouts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type ExerciseProgress = {
  exerciseId: string;
  exerciseName: string;
  sets: Array<{
    setNumber: number;
    currentWeight?: number;
    previousWeight?: number;
    weightDiff?: number;
    weightDiffPercent?: number;
    date?: string;
  }>;
};

export default function WorkoutProgressPage() {
  const [workouts, setWorkouts] = useState<Awaited<ReturnType<typeof getWorkouts>>>([]);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);
  const [progress, setProgress] = useState<ExerciseProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);

  useEffect(() => {
    async function loadWorkouts() {
      const data = await getWorkouts();
      setWorkouts(data);
      setIsLoading(false);
    }
    loadWorkouts();
  }, []);

  useEffect(() => {
    async function loadProgress() {
      if (!selectedWorkoutId) {
        setProgress([]);
        return;
      }

      setIsLoadingProgress(true);
      const workout = await getWorkoutWithSets(selectedWorkoutId);
      if (!workout) {
        setIsLoadingProgress(false);
        return;
      }

      // 種目ごとにグループ化
      const exerciseMap = new Map<string, ExerciseProgress>();

      for (const setData of workout.sets) {
        const exerciseId = setData.set.exerciseId;
        const exerciseName = setData.exercise?.name || "不明な種目";
        const setNumber = setData.set.setNumber;
        const currentWeight = setData.set.weightKg;

        if (!exerciseMap.has(exerciseId)) {
          exerciseMap.set(exerciseId, {
            exerciseId,
            exerciseName,
            sets: [],
          });
        }

        const exercise = exerciseMap.get(exerciseId)!;
        
        // 過去の記録を取得
        let previousWeight: number | undefined;
        let previousDate: string | undefined;
        if (currentWeight) {
          const previous = await getPreviousExerciseRecord(
            exerciseId,
            workout.workoutDate,
            setNumber
          );
          if (previous?.weightKg) {
            previousWeight = previous.weightKg;
            previousDate = previous.date;
          }
        }

        const weightDiff = currentWeight && previousWeight
          ? currentWeight - previousWeight
          : undefined;
        const weightDiffPercent = previousWeight && weightDiff !== undefined
          ? (weightDiff / previousWeight) * 100
          : undefined;

        exercise.sets.push({
          setNumber,
          currentWeight,
          previousWeight,
          weightDiff,
          weightDiffPercent,
          date: previousDate,
        });
      }

      // セット番号でソート
      for (const exercise of exerciseMap.values()) {
        exercise.sets.sort((a, b) => a.setNumber - b.setNumber);
      }

      setProgress(Array.from(exerciseMap.values()));
      setIsLoadingProgress(false);
    }

    loadProgress();
  }, [selectedWorkoutId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-6">
      {/* ヘッダー */}
      <div className="flex items-center gap-4">
        <Link
          href="/workouts"
          className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">重量変化の可視化</h1>
          <p className="text-zinc-400 mt-1">過去の記録と比較して重量の変化を確認</p>
        </div>
      </div>

      {/* トレーニング選択 */}
      <Card>
        <div className="space-y-4">
          <label className="block text-sm font-medium text-white">
            トレーニング記録を選択
          </label>
          <select
            value={selectedWorkoutId || ""}
            onChange={(e) => setSelectedWorkoutId(e.target.value || null)}
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">選択してください</option>
            {workouts.map((workout) => (
              <option key={workout.id} value={workout.id}>
                {new Date(workout.workoutDate).toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  weekday: "short",
                })}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* 進捗表示 */}
      {isLoadingProgress ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : progress.length === 0 && selectedWorkoutId ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-zinc-400">このトレーニング記録には種目がありません</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {progress.map((exercise) => (
            <Card key={exercise.exerciseId}>
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">{exercise.exerciseName}</h3>
                <div className="space-y-3">
                  {exercise.sets.map((set) => {
                    const hasChange = set.weightDiff !== undefined && set.currentWeight && set.previousWeight;
                    
                    return (
                      <div
                        key={set.setNumber}
                        className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-zinc-400">
                            セット {set.setNumber}
                          </span>
                          {set.date && (
                            <span className="text-xs text-zinc-500">
                              前回: {new Date(set.date).toLocaleDateString("ja-JP")}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="text-sm text-zinc-400 mb-1">現在の重量</div>
                            <div className="text-xl font-bold text-white">
                              {set.currentWeight ? `${set.currentWeight}kg` : "-"}
                            </div>
                          </div>
                          {set.previousWeight && (
                            <>
                              <div className="text-zinc-600">→</div>
                              <div className="flex-1">
                                <div className="text-sm text-zinc-400 mb-1">前回の重量</div>
                                <div className="text-xl font-bold text-zinc-300">
                                  {set.previousWeight}kg
                                </div>
                              </div>
                            </>
                          )}
                          {hasChange && (
                            <>
                              <div className="text-zinc-600">→</div>
                              <div className="flex-1">
                                <div className="text-sm text-zinc-400 mb-1">変化</div>
                                <div
                                  className={`text-xl font-bold flex items-center gap-2 ${
                                    set.weightDiff! > 0
                                      ? "text-green-400"
                                      : set.weightDiff! < 0
                                      ? "text-red-400"
                                      : "text-zinc-400"
                                  }`}
                                >
                                  {set.weightDiff! > 0 ? (
                                    <TrendingUp className="w-5 h-5" />
                                  ) : set.weightDiff! < 0 ? (
                                    <TrendingDown className="w-5 h-5" />
                                  ) : (
                                    <Minus className="w-5 h-5" />
                                  )}
                                  <span>
                                    {set.weightDiff! > 0 ? "+" : ""}
                                    {set.weightDiff!.toFixed(1)}kg
                                  </span>
                                  {set.weightDiffPercent !== undefined &&
                                    Math.abs(set.weightDiffPercent) > 1 && (
                                      <span className="text-sm opacity-70">
                                        ({set.weightDiffPercent > 0 ? "+" : ""}
                                        {set.weightDiffPercent.toFixed(0)}%)
                                      </span>
                                    )}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

