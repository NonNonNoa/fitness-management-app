"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getExercises, getExerciseRecordsByPeriod } from "@/lib/actions/workouts";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { Exercise } from "@/lib/db/schema";

type ChartDataPoint = {
  date: string;
  set1?: number;
  set2?: number;
  set3?: number;
  set4?: number;
  set5?: number;
  maxWeight?: number;
  avgWeight?: number;
  [key: string]: string | number | undefined;
};

export default function WorkoutAnalyticsPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>("");
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 3); // 3ヶ月前
    return date.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 種目を取得
  useEffect(() => {
    async function loadExercises() {
      const data = await getExercises();
      setExercises(data);
    }
    loadExercises();
  }, []);

  // グラフデータを取得
  useEffect(() => {
    async function loadChartData() {
      if (!selectedExerciseId || !startDate || !endDate) {
        setChartData([]);
        return;
      }

      setIsLoading(true);
      try {
        const records = await getExerciseRecordsByPeriod(selectedExerciseId, startDate, endDate);

        // 日付ごとにグループ化
        const dateMap = new Map<string, {
          sets: Map<number, number>;
          weights: number[];
        }>();

        for (const record of records) {
          if (!record.weightKg) continue;

          const date = record.workoutDate;
          if (!dateMap.has(date)) {
            dateMap.set(date, {
              sets: new Map(),
              weights: [],
            });
          }

          const dayData = dateMap.get(date)!;
          dayData.sets.set(record.setNumber, record.weightKg);
          dayData.weights.push(record.weightKg);
        }

        // チャートデータに変換（日付でソート）
        const sortedDates = Array.from(dateMap.keys()).sort((a, b) => a.localeCompare(b));
        
        const data: ChartDataPoint[] = sortedDates.map((date) => {
          const dayData = dateMap.get(date)!;
          const weights = dayData.weights;
          const maxWeight = Math.max(...weights);
          const avgWeight = weights.reduce((sum, w) => sum + w, 0) / weights.length;

          const point: ChartDataPoint = {
            date: new Date(date).toLocaleDateString("ja-JP", {
              month: "short",
              day: "numeric",
            }),
            maxWeight: Math.round(maxWeight * 10) / 10,
            avgWeight: Math.round(avgWeight * 10) / 10,
          };

          // セットごとの重量を追加（最大5セットまで）
          for (let i = 1; i <= 5; i++) {
            const weight = dayData.sets.get(i);
            if (weight !== undefined) {
              point[`set${i}` as keyof ChartDataPoint] = Math.round(weight * 10) / 10;
            }
          }

          return point;
        });

        setChartData(data);
      } catch (error) {
        console.error("グラフデータの取得に失敗しました:", error);
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadChartData();
  }, [selectedExerciseId, startDate, endDate]);

  const selectedExercise = exercises.find(e => e.id === selectedExerciseId);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 md:pb-6">
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
          <h1 className="text-2xl font-bold text-white">種目の成長グラフ</h1>
          <p className="text-zinc-400 mt-1">種目の重量推移を可視化</p>
        </div>
      </div>

      {/* 設定カード */}
      <Card>
        <div className="space-y-4">
          {/* 種目選択 */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              種目を選択
            </label>
            <select
              value={selectedExerciseId}
              onChange={(e) => setSelectedExerciseId(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">選択してください</option>
              {exercises.map((exercise) => (
                <option key={exercise.id} value={exercise.id}>
                  {exercise.name}
                </option>
              ))}
            </select>
          </div>

          {/* 期間選択 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                開始日
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                終了日
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* グラフ表示 */}
      {isLoading ? (
        <Card>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        </Card>
      ) : !selectedExerciseId ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-zinc-400">種目を選択してください</p>
          </div>
        </Card>
      ) : chartData.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-zinc-400">
              {selectedExercise?.name}の指定期間内に記録がありません
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* 最大重量・平均重量グラフ */}
          <Card>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  {selectedExercise?.name} - 最大重量・平均重量
                </h3>
                <p className="text-sm text-zinc-400">
                  {new Date(startDate).toLocaleDateString("ja-JP")} ～ {new Date(endDate).toLocaleDateString("ja-JP")}
                </p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#71717a" 
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    stroke="#71717a" 
                    fontSize={12}
                    label={{ value: "重量 (kg)", angle: -90, position: "insideLeft", style: { textAnchor: "middle", fill: "#71717a" } }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "1px solid #27272a",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#fff" }}
                    formatter={(value: number | undefined, name: string | undefined) => {
                      if (value === undefined || name === undefined) return ["", ""];
                      const labels: Record<string, string> = {
                        maxWeight: "最大重量",
                        avgWeight: "平均重量",
                      };
                      return [`${value}kg`, labels[name] || name];
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: "20px" }}
                    formatter={(value: string) => {
                      const labels: Record<string, string> = {
                        maxWeight: "最大重量",
                        avgWeight: "平均重量",
                      };
                      return labels[value] || value;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="maxWeight"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={{ fill: "#f97316", strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6 }}
                    name="maxWeight"
                  />
                  <Line
                    type="monotone"
                    dataKey="avgWeight"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: "#8b5cf6", strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6 }}
                    name="avgWeight"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* セットごとの重量グラフ */}
          <Card>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  {selectedExercise?.name} - セットごとの重量
                </h3>
                <p className="text-sm text-zinc-400">
                  各セットの重量推移を表示
                </p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#71717a" 
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    stroke="#71717a" 
                    fontSize={12}
                    label={{ value: "重量 (kg)", angle: -90, position: "insideLeft", style: { textAnchor: "middle", fill: "#71717a" } }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "1px solid #27272a",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#fff" }}
                    formatter={(value: number | undefined, name: string | undefined) => {
                      if (value === undefined || name === undefined) return ["", ""];
                      return [`${value}kg`, `セット${name.replace("set", "")}`];
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: "20px" }}
                    formatter={(value: string) => {
                      return `セット${value.replace("set", "")}`;
                    }}
                  />
                  {[1, 2, 3, 4, 5].map((setNum) => {
                    const colors = ["#f97316", "#8b5cf6", "#22c55e", "#3b82f6", "#ec4899"];
                    const hasData = chartData.some(d => d[`set${setNum}` as keyof ChartDataPoint] !== undefined);
                    if (!hasData) return null;
                    
                    return (
                      <Line
                        key={setNum}
                        type="monotone"
                        dataKey={`set${setNum}`}
                        stroke={colors[setNum - 1]}
                        strokeWidth={2}
                        dot={{ fill: colors[setNum - 1], strokeWidth: 0, r: 4 }}
                        activeDot={{ r: 6 }}
                        name={`set${setNum}`}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

