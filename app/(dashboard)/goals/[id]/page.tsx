"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getGoal, updateGoal, deleteGoal, toggleGoalActive, GoalType, GoalFormData } from "@/lib/actions/goals";

const goalTypeOptions: { value: GoalType; label: string; description: string; icon: string }[] = [
  {
    value: "muscle_gain",
    label: "筋肉量アップ",
    description: "筋肉量を増やすことを目標に",
    icon: "💪",
  },
  {
    value: "weight_loss",
    label: "減量",
    description: "体重を減らすことを目標に",
    icon: "📉",
  },
  {
    value: "weight_gain",
    label: "増量",
    description: "体重を増やすことを目標に",
    icon: "📈",
  },
  {
    value: "strength",
    label: "筋力向上",
    description: "重量を伸ばすことを目標に",
    icon: "🏋️",
  },
];

export default function EditGoalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingActive, setIsTogglingActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [goalType, setGoalType] = useState<GoalType | null>(null);
  const [startDate, setStartDate] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [isActive, setIsActive] = useState(true);

  // 減量・増量用
  const [currentWeightKg, setCurrentWeightKg] = useState<number | undefined>();
  const [targetWeightKg, setTargetWeightKg] = useState<number | undefined>();

  // 筋力向上用
  const [exerciseName, setExerciseName] = useState<string>("");
  const [currentValue, setCurrentValue] = useState<number | undefined>();
  const [targetValue, setTargetValue] = useState<number | undefined>();

  // 筋肉量アップ用
  const [currentMuscleMassKg, setCurrentMuscleMassKg] = useState<number | undefined>();
  const [targetMuscleMassKg, setTargetMuscleMassKg] = useState<number | undefined>();
  const [currentArmCm, setCurrentArmCm] = useState<number | undefined>();
  const [targetArmCm, setTargetArmCm] = useState<number | undefined>();
  const [currentChestCm, setCurrentChestCm] = useState<number | undefined>();
  const [targetChestCm, setTargetChestCm] = useState<number | undefined>();
  const [currentWaistCm, setCurrentWaistCm] = useState<number | undefined>();
  const [targetWaistCm, setTargetWaistCm] = useState<number | undefined>();

  // 既存データを読み込み
  useEffect(() => {
    async function loadGoal() {
      const goal = await getGoal(id);
      if (!goal) {
        setError("目標が見つかりません");
        setIsInitialLoading(false);
        return;
      }

      setGoalType(goal.goalType as GoalType);
      setStartDate(goal.startDate);
      setTargetDate(goal.targetDate || "");
      setIsActive(goal.isActive);

      // 減量・増量
      setCurrentWeightKg(goal.currentWeightKg || undefined);
      setTargetWeightKg(goal.targetWeightKg || undefined);

      // 筋力向上
      setExerciseName(goal.exerciseName || "");
      setCurrentValue(goal.currentValue || undefined);
      setTargetValue(goal.targetValue || undefined);

      // 筋肉量アップ
      setCurrentMuscleMassKg(goal.currentMuscleMassKg || undefined);
      setTargetMuscleMassKg(goal.targetMuscleMassKg || undefined);
      setCurrentArmCm(goal.currentArmCm || undefined);
      setTargetArmCm(goal.targetArmCm || undefined);
      setCurrentChestCm(goal.currentChestCm || undefined);
      setTargetChestCm(goal.targetChestCm || undefined);
      setCurrentWaistCm(goal.currentWaistCm || undefined);
      setTargetWaistCm(goal.targetWaistCm || undefined);

      setIsInitialLoading(false);
    }
    loadGoal();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!goalType) {
      setError("目標タイプを選択してください");
      setIsLoading(false);
      return;
    }

    const data: GoalFormData = {
      goalType,
      startDate,
      targetDate: targetDate || undefined,
      // 減量・増量
      currentWeightKg,
      targetWeightKg,
      // 筋力向上
      exerciseName: exerciseName || undefined,
      currentValue,
      targetValue,
      // 筋肉量アップ
      currentMuscleMassKg,
      targetMuscleMassKg,
      currentArmCm,
      targetArmCm,
      currentChestCm,
      targetChestCm,
      currentWaistCm,
      targetWaistCm,
    };

    const result = await updateGoal(id, data);

    if (result.success) {
      router.push("/goals");
    } else {
      setError(result.error || "目標の更新に失敗しました");
    }

    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("この目標を削除しますか？")) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteGoal(id);

    if (result.success) {
      router.push("/goals");
    } else {
      setError(result.error || "削除に失敗しました");
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async () => {
    setIsTogglingActive(true);
    const result = await toggleGoalActive(id);

    if (result.success) {
      setIsActive(!isActive);
    } else {
      setError(result.error || "状態の変更に失敗しました");
    }
    setIsTogglingActive(false);
  };

  // 体重変化量の計算
  const getWeightDiff = () => {
    if (!currentWeightKg || !targetWeightKg) return null;
    const diff = targetWeightKg - currentWeightKg;
    return {
      value: Math.abs(diff).toFixed(1),
      label: goalType === "weight_loss" ? "減量目標" : "増量目標",
    };
  };

  // 筋力変化量の計算
  const getStrengthDiff = () => {
    if (!currentValue || !targetValue) return null;
    const diff = targetValue - currentValue;
    return {
      value: Math.abs(diff).toFixed(1),
      isPositive: diff > 0,
    };
  };

  // 進捗計算
  const getProgress = () => {
    if (goalType === "weight_loss" || goalType === "weight_gain") {
      if (!currentWeightKg || !targetWeightKg) return null;
      // 開始時の体重がない場合は現在値を使う
      const progress = Math.min(100, Math.max(0, 50)); // 仮の進捗（実際は開始時体重が必要）
      return progress;
    }
    if (goalType === "strength") {
      if (!currentValue || !targetValue) return null;
      const progress = Math.min(100, Math.max(0, (currentValue / targetValue) * 100));
      return progress;
    }
    return null;
  };

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error && isInitialLoading === false && !goalType) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/goals"
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
              href="/goals"
              className="mt-4 inline-block text-orange-400 hover:text-orange-300"
            >
              目標一覧に戻る
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
            href="/goals"
            className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">目標を編集</h1>
            <p className="text-zinc-400 mt-1">目標設定を更新します</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleActive}
            disabled={isTogglingActive}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
              isActive
                ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
            }`}
          >
            {isActive ? "アクティブ" : "完了"}
          </button>
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
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 目標タイプ選択 */}
        <Card title="目標タイプ">
          <div className="grid grid-cols-2 gap-3">
            {goalTypeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setGoalType(option.value)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  goalType === option.value
                    ? "border-orange-500 bg-orange-500/10"
                    : "border-zinc-700 hover:border-zinc-600"
                }`}
              >
                <span className="text-2xl block mb-2">{option.icon}</span>
                <span
                  className={`font-medium block ${
                    goalType === option.value ? "text-orange-400" : "text-white"
                  }`}
                >
                  {option.label}
                </span>
                <span className="text-xs text-zinc-500">{option.description}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* 減量・増量の場合：体重入力 */}
        {(goalType === "weight_loss" || goalType === "weight_gain") && (
          <Card title="体重目標">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="現在の体重 (kg)"
                  type="number"
                  step="0.1"
                  placeholder="例: 70"
                  value={currentWeightKg || ""}
                  onChange={(e) => setCurrentWeightKg(parseFloat(e.target.value) || undefined)}
                />
                <Input
                  label="目標体重 (kg)"
                  type="number"
                  step="0.1"
                  placeholder={goalType === "weight_loss" ? "例: 65" : "例: 75"}
                  value={targetWeightKg || ""}
                  onChange={(e) => setTargetWeightKg(parseFloat(e.target.value) || undefined)}
                />
              </div>

              {getWeightDiff() && (
                <div className="p-3 bg-zinc-800/50 rounded-lg">
                  <p className="text-sm text-zinc-400">
                    {getWeightDiff()?.label}:{" "}
                    <span className="text-orange-400 font-medium">
                      {getWeightDiff()?.value} kg
                    </span>
                  </p>
                </div>
              )}

              <p className="text-xs text-zinc-500">
                💡 ダッシュボードの体重グラフに目標ラインが表示されます
              </p>
            </div>
          </Card>
        )}

        {/* 筋力向上の場合：種目と重量入力 */}
        {goalType === "strength" && (
          <Card title="筋力目標">
            <div className="space-y-4">
              <Input
                label="種目名"
                type="text"
                placeholder="例: ベンチプレス、スクワット、デッドリフト"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="現在の重量 (kg)"
                  type="number"
                  step="0.5"
                  placeholder="例: 60"
                  value={currentValue || ""}
                  onChange={(e) => setCurrentValue(parseFloat(e.target.value) || undefined)}
                />
                <Input
                  label="目標重量 (kg)"
                  type="number"
                  step="0.5"
                  placeholder="例: 100"
                  value={targetValue || ""}
                  onChange={(e) => setTargetValue(parseFloat(e.target.value) || undefined)}
                />
              </div>

              {getStrengthDiff() && (
                <div className="p-3 bg-zinc-800/50 rounded-lg">
                  <p className="text-sm text-zinc-400">
                    目標達成まで:{" "}
                    <span className={`font-medium ${getStrengthDiff()?.isPositive ? "text-green-400" : "text-orange-400"}`}>
                      +{getStrengthDiff()?.value} kg
                    </span>
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* 筋肉量アップの場合：各種サイズ入力 */}
        {goalType === "muscle_gain" && (
          <>
            <Card title="筋肉量（任意）">
              <div className="space-y-4">
                <p className="text-sm text-zinc-400">
                  体組成計で測定した筋肉量を入力してください
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="現在の筋肉量 (kg)"
                    type="number"
                    step="0.1"
                    placeholder="例: 30"
                    value={currentMuscleMassKg || ""}
                    onChange={(e) => setCurrentMuscleMassKg(parseFloat(e.target.value) || undefined)}
                  />
                  <Input
                    label="目標筋肉量 (kg)"
                    type="number"
                    step="0.1"
                    placeholder="例: 35"
                    value={targetMuscleMassKg || ""}
                    onChange={(e) => setTargetMuscleMassKg(parseFloat(e.target.value) || undefined)}
                  />
                </div>
              </div>
            </Card>

            <Card title="ボディサイズ（任意）">
              <div className="space-y-4">
                <p className="text-sm text-zinc-400">
                  測定したサイズを入力してください。必要な項目だけでOKです
                </p>
                
                {/* 腕回り */}
                <div>
                  <h4 className="text-sm font-medium text-zinc-300 mb-2">💪 腕回り</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="現在 (cm)"
                      type="number"
                      step="0.1"
                      placeholder="例: 32"
                      value={currentArmCm || ""}
                      onChange={(e) => setCurrentArmCm(parseFloat(e.target.value) || undefined)}
                    />
                    <Input
                      label="目標 (cm)"
                      type="number"
                      step="0.1"
                      placeholder="例: 38"
                      value={targetArmCm || ""}
                      onChange={(e) => setTargetArmCm(parseFloat(e.target.value) || undefined)}
                    />
                  </div>
                </div>

                {/* 胸囲 */}
                <div>
                  <h4 className="text-sm font-medium text-zinc-300 mb-2">🎽 胸囲</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="現在 (cm)"
                      type="number"
                      step="0.1"
                      placeholder="例: 90"
                      value={currentChestCm || ""}
                      onChange={(e) => setCurrentChestCm(parseFloat(e.target.value) || undefined)}
                    />
                    <Input
                      label="目標 (cm)"
                      type="number"
                      step="0.1"
                      placeholder="例: 100"
                      value={targetChestCm || ""}
                      onChange={(e) => setTargetChestCm(parseFloat(e.target.value) || undefined)}
                    />
                  </div>
                </div>

                {/* ウエスト */}
                <div>
                  <h4 className="text-sm font-medium text-zinc-300 mb-2">📏 ウエスト</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="現在 (cm)"
                      type="number"
                      step="0.1"
                      placeholder="例: 80"
                      value={currentWaistCm || ""}
                      onChange={(e) => setCurrentWaistCm(parseFloat(e.target.value) || undefined)}
                    />
                    <Input
                      label="目標 (cm)"
                      type="number"
                      step="0.1"
                      placeholder="例: 75"
                      value={targetWaistCm || ""}
                      onChange={(e) => setTargetWaistCm(parseFloat(e.target.value) || undefined)}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </>
        )}

        {/* 期間 */}
        <Card title="期間">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="開始日"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <Input
              label="目標達成日（任意）"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              min={startDate}
            />
          </div>
        </Card>

        {/* 進捗状況 */}
        {getProgress() !== null && (
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-400">進捗状況</span>
              <span className="text-lg font-bold text-orange-400">
                {getProgress()?.toFixed(0)}%
              </span>
            </div>
            <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                style={{
                  width: `${getProgress()}%`,
                }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* 送信ボタン */}
        <div className="flex gap-3">
          <Link
            href="/goals"
            className="flex-1 py-3 px-4 border border-zinc-700 rounded-lg text-zinc-300 hover:bg-zinc-800 transition-all text-center"
          >
            キャンセル
          </Link>
          <Button
            type="submit"
            size="lg"
            className="flex-1"
            isLoading={isLoading}
            disabled={!goalType}
          >
            更新する
          </Button>
        </div>
      </form>
    </div>
  );
}
