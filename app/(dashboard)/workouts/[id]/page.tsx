"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getWorkoutWithSets, updateWorkout, deleteWorkout, getExercises, WorkoutFormData } from "@/lib/actions/workouts";
import { getBodyPartLabel } from "@/lib/utils/workout-helpers";
import type { Exercise } from "@/lib/db/schema";

type WorkoutSet = {
  id: string;
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  weightKg?: number;
  reps?: number;
  rpe?: number;
};

const bodyParts = ["chest", "back", "legs", "shoulders", "arms", "core"];

export default function EditWorkoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [workoutDate, setWorkoutDate] = useState("");
  const [durationMinutes, setDurationMinutes] = useState<number | undefined>();
  const [notes, setNotes] = useState("");
  const [sets, setSets] = useState<WorkoutSet[]>([]);

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);

  // 種目を取得
  useEffect(() => {
    async function loadExercises() {
      const data = await getExercises(selectedBodyPart || undefined);
      setExercises(data);
    }
    loadExercises();
  }, [selectedBodyPart]);

  // 既存データを読み込み
  useEffect(() => {
    async function loadWorkout() {
      const workout = await getWorkoutWithSets(id);
      if (!workout) {
        setError("トレーニング記録が見つかりません");
        setIsInitialLoading(false);
        return;
      }

      setWorkoutDate(workout.workoutDate);
      setDurationMinutes(workout.durationMinutes || undefined);
      setNotes(workout.notes || "");
      setSets(
        workout.sets.map((s) => ({
          id: s.set.id,
          exerciseId: s.set.exerciseId,
          exerciseName: s.exercise?.name || "不明な種目",
          setNumber: s.set.setNumber,
          weightKg: s.set.weightKg || undefined,
          reps: s.set.reps || undefined,
          rpe: s.set.rpe || undefined,
        }))
      );
      setIsInitialLoading(false);
    }
    loadWorkout();
  }, [id]);

  const addSet = (exercise: Exercise) => {
    // 同じ種目の最後のセット番号を取得
    const sameExerciseSets = sets.filter((s) => s.exerciseId === exercise.id);
    const nextSetNumber = sameExerciseSets.length + 1;

    // 前のセットの重量とレップ数を引き継ぐ
    const lastSet = sameExerciseSets[sameExerciseSets.length - 1];

    setSets([
      ...sets,
      {
        id: crypto.randomUUID(),
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        setNumber: nextSetNumber,
        weightKg: lastSet?.weightKg,
        reps: lastSet?.reps,
      },
    ]);
    setShowExerciseSelector(false);
  };

  const removeSet = (setId: string) => {
    const setToRemove = sets.find((s) => s.id === setId);
    if (!setToRemove) return;

    // セット番号を更新
    const updatedSets = sets
      .filter((s) => s.id !== setId)
      .map((s) => {
        if (s.exerciseId === setToRemove.exerciseId && s.setNumber > setToRemove.setNumber) {
          return { ...s, setNumber: s.setNumber - 1 };
        }
        return s;
      });

    setSets(updatedSets);
  };

  const updateSet = (setId: string, field: keyof WorkoutSet, value: string | number) => {
    setSets(
      sets.map((set) => (set.id === setId ? { ...set, [field]: value } : set))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (sets.length === 0) {
      setError("少なくとも1セット追加してください");
      setIsLoading(false);
      return;
    }

    const data: WorkoutFormData = {
      workoutDate,
      durationMinutes,
      notes: notes || undefined,
      sets: sets.map((set) => ({
        exerciseId: set.exerciseId,
        setNumber: set.setNumber,
        weightKg: set.weightKg,
        reps: set.reps,
        rpe: set.rpe,
      })),
    };

    const result = await updateWorkout(id, data);

    if (result.success) {
      router.push("/workouts");
    } else {
      setError(result.error || "トレーニングの更新に失敗しました");
    }

    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("このトレーニング記録を削除しますか？")) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteWorkout(id);

    if (result.success) {
      router.push("/workouts");
    } else {
      setError(result.error || "削除に失敗しました");
      setIsDeleting(false);
    }
  };

  // 総ボリュームを計算
  const totalVolume = sets.reduce(
    (sum, set) => sum + (set.weightKg || 0) * (set.reps || 0),
    0
  );

  // 種目ごとにセットをグループ化
  const setsByExercise = sets.reduce((acc, set) => {
    if (!acc[set.exerciseId]) {
      acc[set.exerciseId] = { name: set.exerciseName, sets: [] };
    }
    acc[set.exerciseId].sets.push(set);
    return acc;
  }, {} as Record<string, { name: string; sets: WorkoutSet[] }>);

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error && isInitialLoading === false && sets.length === 0) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
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
            <h1 className="text-2xl font-bold text-white">エラー</h1>
          </div>
        </div>
        <Card>
          <div className="text-center py-8">
            <p className="text-red-400">{error}</p>
            <Link
              href="/workouts"
              className="mt-4 inline-block text-orange-400 hover:text-orange-300"
            >
              トレーニング記録一覧に戻る
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
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
            <h1 className="text-2xl font-bold text-white">トレーニングを編集</h1>
            <p className="text-zinc-400 mt-1">トレーニング記録を更新します</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
          title="削除"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 日付と時間 */}
        <Card>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="日付"
              type="date"
              value={workoutDate}
              onChange={(e) => setWorkoutDate(e.target.value)}
              required
            />
            <Input
              label="トレーニング時間（分）"
              type="number"
              placeholder="60"
              value={durationMinutes || ""}
              onChange={(e) => setDurationMinutes(parseInt(e.target.value) || undefined)}
            />
          </div>
        </Card>

        {/* セット一覧 */}
        <Card title="セット">
          <div className="space-y-4">
            {Object.keys(setsByExercise).length === 0 ? (
              <p className="text-center text-zinc-500 py-4">
                種目を選択してセットを追加してください
              </p>
            ) : (
              Object.entries(setsByExercise).map(([exerciseId, { name, sets: exerciseSets }]) => (
                <div key={exerciseId} className="p-4 bg-zinc-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-white">{name}</h3>
                    <button
                      type="button"
                      onClick={() => {
                        const exercise = exercises.find((e) => e.id === exerciseId);
                        if (exercise) addSet(exercise);
                      }}
                      className="text-xs text-orange-400 hover:text-orange-300"
                    >
                      + セット追加
                    </button>
                  </div>

                  <div className="space-y-2">
                    {exerciseSets.map((set) => (
                      <div key={set.id} className="flex items-center gap-2">
                        <span className="w-8 text-xs text-zinc-500 text-center">
                          {set.setNumber}
                        </span>
                        <Input
                          placeholder="kg"
                          type="number"
                          step="0.5"
                          value={set.weightKg || ""}
                          onChange={(e) =>
                            updateSet(set.id, "weightKg", parseFloat(e.target.value) || 0)
                          }
                          className="flex-1"
                        />
                        <span className="text-zinc-500">×</span>
                        <Input
                          placeholder="回"
                          type="number"
                          value={set.reps || ""}
                          onChange={(e) =>
                            updateSet(set.id, "reps", parseInt(e.target.value) || 0)
                          }
                          className="flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => removeSet(set.id)}
                          className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}

            {/* 種目追加ボタン */}
            <button
              type="button"
              onClick={() => setShowExerciseSelector(!showExerciseSelector)}
              className="w-full p-3 border-2 border-dashed border-zinc-700 rounded-lg text-zinc-400 hover:border-zinc-600 hover:text-zinc-300 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              種目を追加
            </button>
          </div>
        </Card>

        {/* 種目選択モーダル */}
        {showExerciseSelector && (
          <Card title="種目を選択">
            <div className="space-y-4">
              {/* 部位フィルター */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBodyPart(null)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedBodyPart === null
                      ? "bg-orange-500 text-white"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  }`}
                >
                  すべて
                </button>
                {bodyParts.map((part) => (
                  <button
                    key={part}
                    type="button"
                    onClick={() => setSelectedBodyPart(part)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedBodyPart === part
                        ? "bg-orange-500 text-white"
                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                    }`}
                  >
                    {getBodyPartLabel(part)}
                  </button>
                ))}
              </div>

              {/* 種目リスト */}
              <div className="max-h-64 overflow-y-auto space-y-1">
                {exercises.map((exercise) => (
                  <button
                    key={exercise.id}
                    type="button"
                    onClick={() => addSet(exercise)}
                    className="w-full p-3 text-left bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                  >
                    <div className="font-medium text-white">{exercise.name}</div>
                    <div className="text-xs text-zinc-500">
                      {getBodyPartLabel(exercise.bodyPart)} • {exercise.equipment || "器具なし"}
                    </div>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowExerciseSelector(false)}
                className="w-full py-2 text-zinc-400 hover:text-white transition-colors"
              >
                閉じる
              </button>
            </div>
          </Card>
        )}

        {/* メモ */}
        <Card title="メモ（任意）">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="トレーニングに関するメモ..."
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            rows={3}
          />
        </Card>

        {/* 合計とエラー */}
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">総ボリューム</span>
            <span className="text-2xl font-bold text-orange-400">{totalVolume.toLocaleString()} kg</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-zinc-400">セット数</span>
            <span className="text-lg font-medium text-white">{sets.length} セット</span>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* 送信ボタン */}
        <div className="flex gap-3">
          <Link
            href="/workouts"
            className="flex-1 py-3 px-4 border border-zinc-700 rounded-lg text-zinc-300 hover:bg-zinc-800 transition-all text-center"
          >
            キャンセル
          </Link>
          <Button
            type="submit"
            size="lg"
            className="flex-1"
            isLoading={isLoading}
          >
            更新する
          </Button>
        </div>
      </form>
    </div>
  );
}

