"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createGoal, GoalType, GoalFormData } from "@/lib/actions/goals";

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

export default function NewGoalPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [goalType, setGoalType] = useState<GoalType | null>(null);
  const [targetValue, setTargetValue] = useState<number | undefined>();
  const [currentValue, setCurrentValue] = useState<number | undefined>();
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [targetDate, setTargetDate] = useState<string>("");

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
      targetValue,
      currentValue,
      startDate,
      targetDate: targetDate || undefined,
    };

    const result = await createGoal(data);

    if (result.success) {
      router.push("/goals");
    } else {
      setError(result.error || "目標の設定に失敗しました");
    }

    setIsLoading(false);
  };

  // 目標値の単位を取得
  const getUnit = () => {
    if (goalType === "strength") return "kg";
    if (goalType?.includes("weight")) return "kg";
    return "";
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* ヘッダー */}
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
          <h1 className="text-2xl font-bold text-white">新しい目標を設定</h1>
          <p className="text-zinc-400 mt-1">あなたの目標を設定しましょう</p>
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

        {/* 目標値 */}
        {goalType && (
          <Card title="目標値">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label={`現在値 ${getUnit() ? `(${getUnit()})` : ""}`}
                  type="number"
                  step="0.1"
                  placeholder="例: 70"
                  value={currentValue || ""}
                  onChange={(e) => setCurrentValue(parseFloat(e.target.value) || undefined)}
                />
                <Input
                  label={`目標値 ${getUnit() ? `(${getUnit()})` : ""}`}
                  type="number"
                  step="0.1"
                  placeholder="例: 65"
                  value={targetValue || ""}
                  onChange={(e) => setTargetValue(parseFloat(e.target.value) || undefined)}
                />
              </div>

              {currentValue && targetValue && (
                <div className="p-3 bg-zinc-800/50 rounded-lg">
                  <p className="text-sm text-zinc-400">
                    {goalType === "weight_loss" ? "減量目標: " : "変化量: "}
                    <span className="text-orange-400 font-medium">
                      {Math.abs(targetValue - currentValue).toFixed(1)} {getUnit()}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </Card>
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
            目標を設定
          </Button>
        </div>
      </form>
    </div>
  );
}



