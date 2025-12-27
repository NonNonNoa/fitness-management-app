"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createWorkout, getExercises, createExercise, updateExercise, deleteExercise, WorkoutFormData } from "@/lib/actions/workouts";
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

export default function NewWorkoutPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [workoutDate, setWorkoutDate] = useState(new Date().toISOString().split("T")[0]);
  const [durationMinutes, setDurationMinutes] = useState<number | undefined>();
  const [notes, setNotes] = useState("");
  const [sets, setSets] = useState<WorkoutSet[]>([]);

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [showCustomExerciseForm, setShowCustomExerciseForm] = useState(false);
  const [customExerciseName, setCustomExerciseName] = useState("");
  const [customExerciseBodyPart, setCustomExerciseBodyPart] = useState<string>("chest");
  const [customExerciseEquipment, setCustomExerciseEquipment] = useState<string>("");
  const [isCreatingExercise, setIsCreatingExercise] = useState(false);
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [editingExerciseName, setEditingExerciseName] = useState<string>("");
  const [isUpdatingExercise, setIsUpdatingExercise] = useState(false);
  const [deletingExerciseId, setDeletingExerciseId] = useState<string | null>(null);

  // 種目を取得
  useEffect(() => {
    async function loadExercises() {
      const data = await getExercises(selectedBodyPart || undefined);
      setExercises(data);
    }
    loadExercises();
  }, [selectedBodyPart]);

  const handleCreateCustomExercise = async () => {
    if (!customExerciseName.trim()) {
      setError("種目名を入力してください");
      return;
    }

    setIsCreatingExercise(true);
    setError(null);

    const result = await createExercise({
      name: customExerciseName.trim(),
      bodyPart: customExerciseBodyPart,
      equipment: customExerciseEquipment || undefined,
    });

    if (result.success && result.exerciseId) {
      // 新しく作成した種目を取得して追加
      const newExercises = await getExercises(selectedBodyPart || undefined);
      setExercises(newExercises);
      
      // 作成した種目を自動的にセットに追加
      const newExercise = newExercises.find(e => e.id === result.exerciseId);
      if (newExercise) {
        addSet(newExercise);
      }

      // フォームをリセット
      setCustomExerciseName("");
      setCustomExerciseBodyPart("chest");
      setCustomExerciseEquipment("");
      setShowCustomExerciseForm(false);
    } else {
      setError(result.error || "種目の作成に失敗しました");
    }

    setIsCreatingExercise(false);
  };

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

  const removeSet = (id: string) => {
    const setToRemove = sets.find((s) => s.id === id);
    if (!setToRemove) return;

    // セット番号を更新
    const updatedSets = sets
      .filter((s) => s.id !== id)
      .map((s) => {
        if (s.exerciseId === setToRemove.exerciseId && s.setNumber > setToRemove.setNumber) {
          return { ...s, setNumber: s.setNumber - 1 };
        }
        return s;
      });

    setSets(updatedSets);
  };

  const updateSet = (id: string, field: keyof WorkoutSet, value: string | number) => {
    setSets(
      sets.map((set) => (set.id === id ? { ...set, [field]: value } : set))
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

    const result = await createWorkout(data);

    if (result.success) {
      router.push("/workouts");
    } else {
      setError(result.error || "トレーニングの記録に失敗しました");
    }

    setIsLoading(false);
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

  const handleStartEditExercise = (exerciseId: string, currentName: string) => {
    setEditingExerciseId(exerciseId);
    setEditingExerciseName(currentName);
  };

  const handleSaveExerciseName = async (exerciseId: string) => {
    if (!editingExerciseName.trim()) {
      setError("種目名を入力してください");
      return;
    }

    setIsUpdatingExercise(true);
    setError(null);

    const result = await updateExercise(exerciseId, editingExerciseName.trim());

    if (result.success) {
      // セットの種目名を更新
      setSets(sets.map(set => 
        set.exerciseId === exerciseId 
          ? { ...set, exerciseName: editingExerciseName.trim() }
          : set
      ));
      // 種目リストも更新
      setExercises(exercises.map(ex => 
        ex.id === exerciseId 
          ? { ...ex, name: editingExerciseName.trim() }
          : ex
      ));
      setEditingExerciseId(null);
      setEditingExerciseName("");
    } else {
      setError(result.error || "種目名の更新に失敗しました");
    }

    setIsUpdatingExercise(false);
  };

  const handleCancelEditExercise = () => {
    setEditingExerciseId(null);
    setEditingExerciseName("");
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    // この種目が使用されているかチェック
    const isUsedInSets = sets.some(set => set.exerciseId === exerciseId);
    
    if (isUsedInSets) {
      if (!confirm("この種目は現在のトレーニングで使用されています。削除すると、この種目のセットも削除されます。削除しますか？")) {
        return;
      }
    } else {
      if (!confirm("この種目を削除しますか？")) {
        return;
      }
    }

    setDeletingExerciseId(exerciseId);
    setError(null);

    const result = await deleteExercise(exerciseId);

    if (result.success) {
      // この種目のセットを削除（使用されている場合）
      const updatedSets = sets.filter(set => set.exerciseId !== exerciseId);
      setSets(updatedSets);
      
      // 種目リストからも削除
      setExercises(exercises.filter(ex => ex.id !== exerciseId));
    } else {
      setError(result.error || "種目の削除に失敗しました");
    }

    setDeletingExerciseId(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
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
          <h1 className="text-2xl font-bold text-white">トレーニングを記録</h1>
          <p className="text-zinc-400 mt-1">今日のトレーニングを記録しましょう</p>
        </div>
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
              Object.entries(setsByExercise).map(([exerciseId, { name, sets: exerciseSets }]) => {
                const exercise = exercises.find((e) => e.id === exerciseId);
                const isUserExercise = exercise?.userId !== null && exercise?.userId !== undefined;
                const isEditing = editingExerciseId === exerciseId;
                
                return (
                <div key={exerciseId} className="p-4 bg-zinc-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    {isEditing ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          value={editingExerciseName}
                          onChange={(e) => setEditingExerciseName(e.target.value)}
                          className="flex-1"
                          placeholder="種目名"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveExerciseName(exerciseId)}
                          disabled={isUpdatingExercise}
                          className="px-3 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
                        >
                          保存
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEditExercise}
                          className="px-3 py-1 text-xs bg-zinc-700 text-white rounded hover:bg-zinc-600"
                        >
                          キャンセル
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-white">{name}</h3>
                          {isUserExercise && (
                            <span className="px-1.5 py-0.5 text-xs bg-orange-500/20 text-orange-400 rounded border border-orange-500/30">
                              追加種目
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {isUserExercise && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleStartEditExercise(exerciseId, name)}
                                className="text-xs text-zinc-400 hover:text-zinc-300"
                                title="種目名を編集"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteExercise(exerciseId)}
                                disabled={deletingExerciseId === exerciseId}
                                className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
                                title="種目を削除"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              if (exercise) addSet(exercise);
                            }}
                            className="text-xs text-orange-400 hover:text-orange-300"
                          >
                            + セット追加
                          </button>
                        </div>
                      </>
                    )}
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
                );
              })
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

              {/* カスタム種目追加フォーム */}
              {showCustomExerciseForm ? (
                <div className="p-4 bg-zinc-800/50 rounded-lg space-y-4 border border-zinc-700">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      種目名
                    </label>
                    <Input
                      placeholder="例: カスタムベンチプレス"
                      value={customExerciseName}
                      onChange={(e) => setCustomExerciseName(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      部位
                    </label>
                    <select
                      value={customExerciseBodyPart}
                      onChange={(e) => setCustomExerciseBodyPart(e.target.value)}
                      className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      {bodyParts.map((part) => (
                        <option key={part} value={part}>
                          {getBodyPartLabel(part)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      器具（任意）
                    </label>
                    <select
                      value={customExerciseEquipment}
                      onChange={(e) => setCustomExerciseEquipment(e.target.value)}
                      className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">指定なし</option>
                      <option value="barbell">バーベル</option>
                      <option value="dumbbell">ダンベル</option>
                      <option value="machine">マシン</option>
                      <option value="cable">ケーブル</option>
                      <option value="bodyweight">自重</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={handleCreateCustomExercise}
                      isLoading={isCreatingExercise}
                      className="flex-1"
                    >
                      作成して追加
                    </Button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCustomExerciseForm(false);
                        setCustomExerciseName("");
                        setCustomExerciseBodyPart("chest");
                        setCustomExerciseEquipment("");
                      }}
                      className="px-4 py-2 border border-zinc-700 rounded-lg text-zinc-300 hover:bg-zinc-800 transition-colors"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowCustomExerciseForm(true)}
                  className="w-full p-3 border-2 border-dashed border-orange-500/50 rounded-lg text-orange-400 hover:border-orange-500 hover:bg-orange-500/10 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  新しい種目を追加
                </button>
              )}

              {/* 種目リスト */}
              <div className="max-h-64 overflow-y-auto space-y-1">
                {exercises.map((exercise) => {
                  const isUserExercise = exercise.userId !== null && exercise.userId !== undefined;
                  return (
                    <div
                      key={exercise.id}
                      className="flex items-center gap-2 p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors group"
                    >
                      <button
                        type="button"
                        onClick={() => addSet(exercise)}
                        className="flex-1 text-left"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{exercise.name}</span>
                          {isUserExercise && (
                            <span className="px-1.5 py-0.5 text-xs bg-orange-500/20 text-orange-400 rounded border border-orange-500/30">
                              追加種目
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-zinc-500">
                          {getBodyPartLabel(exercise.bodyPart)} • {exercise.equipment || "器具なし"}
                        </div>
                      </button>
                      {isUserExercise && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteExercise(exercise.id);
                          }}
                          disabled={deletingExerciseId === exercise.id}
                          className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                          title="種目を削除"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowExerciseSelector(false);
                  setShowCustomExerciseForm(false);
                }}
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
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none overflow-y-auto"
            rows={3}
            style={{ minHeight: "80px", maxHeight: "200px" }}
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
            記録する
          </Button>
        </div>
      </form>
    </div>
  );
}



