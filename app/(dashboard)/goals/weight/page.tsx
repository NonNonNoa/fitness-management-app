"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { recordBodyComposition, getBodyCompositions } from "@/lib/actions/goals";
import type { BodyComposition } from "@/lib/db/schema";

export default function WeightRecordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [recordDate, setRecordDate] = useState(new Date().toISOString().split("T")[0]);
  const [weightKg, setWeightKg] = useState<number | undefined>();
  const [bodyFatPercentage, setBodyFatPercentage] = useState<number | undefined>();
  const [muscleMassKg, setMuscleMassKg] = useState<number | undefined>();
  const [notes, setNotes] = useState("");

  const [recentRecords, setRecentRecords] = useState<BodyComposition[]>([]);

  useEffect(() => {
    async function loadRecords() {
      const records = await getBodyCompositions(7);
      setRecentRecords(records);
    }
    loadRecords();
  }, [success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!weightKg) {
      setError("体重を入力してください");
      setIsLoading(false);
      return;
    }

    const result = await recordBodyComposition({
      recordDate,
      weightKg,
      bodyFatPercentage,
      muscleMassKg,
      notes: notes || undefined,
    });

    if (result.success) {
      setSuccess(true);
      setWeightKg(undefined);
      setBodyFatPercentage(undefined);
      setMuscleMassKg(undefined);
      setNotes("");
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error || "記録に失敗しました");
    }

    setIsLoading(false);
  };

  // 前回からの変化を計算
  const lastRecord = recentRecords[0];
  const weightChange = weightKg && lastRecord?.weightKg
    ? weightKg - lastRecord.weightKg
    : null;

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
          <h1 className="text-2xl font-bold text-white">体重を記録</h1>
          <p className="text-zinc-400 mt-1">今日の体重を記録しましょう</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本情報 */}
        <Card title="体重">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="日付"
                type="date"
                value={recordDate}
                onChange={(e) => setRecordDate(e.target.value)}
                required
              />
              <Input
                label="体重 (kg)"
                type="number"
                step="0.1"
                placeholder="例: 70.5"
                value={weightKg || ""}
                onChange={(e) => setWeightKg(parseFloat(e.target.value) || undefined)}
                required
              />
            </div>

            {/* 変化表示 */}
            {weightChange !== null && (
              <div className="p-3 bg-zinc-800/50 rounded-lg">
                <p className="text-sm text-zinc-400">
                  前回からの変化:{" "}
                  <span
                    className={`font-medium ${
                      weightChange > 0
                        ? "text-red-400"
                        : weightChange < 0
                        ? "text-green-400"
                        : "text-zinc-300"
                    }`}
                  >
                    {weightChange > 0 ? "+" : ""}
                    {weightChange.toFixed(1)} kg
                  </span>
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* 追加情報 */}
        <Card title="追加情報（任意）">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="体脂肪率 (%)"
                type="number"
                step="0.1"
                placeholder="例: 15.5"
                value={bodyFatPercentage || ""}
                onChange={(e) => setBodyFatPercentage(parseFloat(e.target.value) || undefined)}
              />
              <Input
                label="筋肉量 (kg)"
                type="number"
                step="0.1"
                placeholder="例: 55.0"
                value={muscleMassKg || ""}
                onChange={(e) => setMuscleMassKg(parseFloat(e.target.value) || undefined)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                メモ
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="例: 朝食前に計測"
                className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                rows={2}
              />
            </div>
          </div>
        </Card>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
            記録しました！
          </div>
        )}

        {/* 送信ボタン */}
        <Button
          type="submit"
          size="lg"
          className="w-full"
          isLoading={isLoading}
        >
          記録する
        </Button>
      </form>

      {/* 最近の記録 */}
      {recentRecords.length > 0 && (
        <Card title="最近の記録">
          <div className="space-y-2">
            {recentRecords.map((record, index) => {
              const prevRecord = recentRecords[index + 1];
              const change = prevRecord?.weightKg && record.weightKg
                ? record.weightKg - prevRecord.weightKg
                : null;

              return (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg"
                >
                  <div>
                    <p className="text-sm text-zinc-400">
                      {new Date(record.recordDate).toLocaleDateString("ja-JP", {
                        month: "short",
                        day: "numeric",
                        weekday: "short",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-white font-medium">
                      {record.weightKg} kg
                    </span>
                    {change !== null && (
                      <span
                        className={`text-xs ${
                          change > 0
                            ? "text-red-400"
                            : change < 0
                            ? "text-green-400"
                            : "text-zinc-500"
                        }`}
                      >
                        {change > 0 ? "+" : ""}
                        {change.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}



