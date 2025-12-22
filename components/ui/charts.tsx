/**
 * @fileoverview チャートコンポーネント
 * 体重推移、カロリー、トレーニングボリューム、マクロ栄養素などのグラフを提供
 */
"use client";

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
} from "recharts";
import { motion } from "framer-motion";

/**
 * チャートコンテナのプロパティ
 */
interface ChartContainerProps {
  /** チャートのタイトル */
  title: string;
  /** チャートコンテンツ */
  children: React.ReactNode;
  /** アニメーションの遅延時間（秒） */
  delay?: number;
}

/**
 * アニメーション付きチャートコンテナ
 * @param {ChartContainerProps} props - コンテナのプロパティ
 * @returns {JSX.Element} チャートコンテナ要素
 * @example
 * <ChartContainer title="体重推移" delay={0.2}>
 *   <WeightChart data={weightData} />
 * </ChartContainer>
 */
export function ChartContainer({ title, children, delay = 0 }: ChartContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ scale: 1.01, y: -2 }}
      className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800/50 rounded-2xl p-5
                 shadow-xl shadow-black/30
                 relative overflow-hidden group
                 before:absolute before:inset-0 before:bg-gradient-to-br before:from-orange-500/0 before:to-red-500/0 before:opacity-0 before:transition-opacity before:duration-300
                 hover:border-orange-500/30 hover:shadow-orange-500/10 hover:shadow-2xl hover:before:opacity-100
                 transition-all duration-300"
    >
      <motion.h3 
        className="text-lg font-semibold text-white mb-4 flex items-center gap-2"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delay + 0.1 }}
      >
        <motion.span 
          className="w-1 h-5 bg-gradient-to-b from-orange-500 to-red-600 rounded-full"
          animate={{ height: [20, 24, 20] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        {title}
      </motion.h3>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.2 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/**
 * 体重チャートのプロパティ
 */
interface WeightChartProps {
  /** 体重データの配列 */
  data: { date: string; weight: number }[];
  /** 目標体重 (kg) */
  targetWeight?: number;
}

/**
 * 体重推移エリアチャート（目標体重ライン付き）
 * @param {WeightChartProps} props - チャートのプロパティ
 * @returns {JSX.Element} 体重チャート要素
 * @example
 * const data = [
 *   { date: "1/1", weight: 70.5 },
 *   { date: "1/2", weight: 70.3 },
 * ];
 * <WeightChart data={data} targetWeight={65} />
 */
export function WeightChart({ data, targetWeight }: WeightChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-[200px] flex flex-col items-center justify-center text-zinc-500">
        <p>データがありません</p>
        {targetWeight && (
          <p className="text-sm mt-2 text-orange-400">目標体重: {targetWeight}kg</p>
        )}
      </div>
    );
  }

  // Y軸の範囲を計算（目標体重も考慮）
  const weights = data.map(d => d.weight);
  const minWeight = Math.min(...weights, targetWeight || Infinity);
  const maxWeight = Math.max(...weights, targetWeight || -Infinity);
  const yDomain = [Math.floor(minWeight - 2), Math.ceil(maxWeight + 2)];

  return (
    <div className="space-y-2">
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
          <YAxis stroke="#71717a" fontSize={12} domain={yDomain} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #27272a",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#fff" }}
            formatter={(value) => [`${value}kg`, "体重"]}
          />
          {targetWeight && (
            <ReferenceLine 
              y={targetWeight} 
              stroke="#22c55e" 
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{
                value: `目標: ${targetWeight}kg`,
                position: "right",
                fill: "#22c55e",
                fontSize: 11,
              }}
            />
          )}
          <Area
            type="monotone"
            dataKey="weight"
            stroke="#f97316"
            strokeWidth={2}
            fill="url(#weightGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
      {targetWeight && (
        <div className="flex items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-orange-500 rounded" />
            <span className="text-zinc-400">現在の体重</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-green-500 rounded" style={{ borderStyle: "dashed" }} />
            <span className="text-zinc-400">目標体重 ({targetWeight}kg)</span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * カロリーチャートのプロパティ
 */
interface CalorieChartProps {
  /** カロリーデータの配列 */
  data: { date: string; calories: number; target: number }[];
}

/**
 * カロリー摂取バーチャート（目標ライン付き）
 * @param {CalorieChartProps} props - チャートのプロパティ
 * @returns {JSX.Element} カロリーチャート要素
 * @example
 * const data = [
 *   { date: "1/1", calories: 1800, target: 2000 },
 *   { date: "1/2", calories: 2100, target: 2000 },
 * ];
 * <CalorieChart data={data} />
 */
export function CalorieChart({ data }: CalorieChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center text-zinc-500">
        データがありません
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
        <YAxis stroke="#71717a" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "#fff" }}
        />
        <Bar dataKey="calories" fill="#22c55e" radius={[4, 4, 0, 0]} />
        <Line type="monotone" dataKey="target" stroke="#f97316" strokeDasharray="5 5" />
      </BarChart>
    </ResponsiveContainer>
  );
}

/**
 * トレーニングボリュームチャートのプロパティ
 */
interface WorkoutVolumeChartProps {
  /** ボリュームデータの配列 */
  data: { date: string; volume: number }[];
}

/**
 * トレーニングボリューム推移ラインチャート
 * @param {WorkoutVolumeChartProps} props - チャートのプロパティ
 * @returns {JSX.Element} ボリュームチャート要素
 * @example
 * const data = [
 *   { date: "1/1", volume: 5000 },
 *   { date: "1/2", volume: 6200 },
 * ];
 * <WorkoutVolumeChart data={data} />
 */
export function WorkoutVolumeChart({ data }: WorkoutVolumeChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center text-zinc-500">
        データがありません
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
        <YAxis stroke="#71717a" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "#fff" }}
        />
        <Line
          type="monotone"
          dataKey="volume"
          stroke="#8b5cf6"
          strokeWidth={2}
          dot={{ fill: "#8b5cf6", strokeWidth: 0, r: 4 }}
          activeDot={{ r: 6, fill: "#a78bfa" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

/**
 * マクロ栄養素パイチャートのプロパティ
 */
interface MacroPieChartProps {
  /** タンパク質量 (g) */
  protein: number;
  /** 炭水化物量 (g) */
  carbs: number;
  /** 脂質量 (g) */
  fats: number;
}

/**
 * マクロ栄養素（PFC）パイチャート
 * @param {MacroPieChartProps} props - チャートのプロパティ
 * @returns {JSX.Element} パイチャート要素
 * @description タンパク質、炭水化物、脂質の割合をドーナツチャートで表示
 * @example
 * <MacroPieChart protein={150} carbs={200} fats={60} />
 */
export function MacroPieChart({ protein, carbs, fats }: MacroPieChartProps) {
  const total = protein + carbs + fats;
  if (total === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center text-zinc-500">
        データがありません
      </div>
    );
  }

  const data = [
    { name: "タンパク質", value: protein, color: "#ef4444" },
    { name: "炭水化物", value: carbs, color: "#3b82f6" },
    { name: "脂質", value: fats, color: "#eab308" },
  ];

  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width={120} height={120}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={35}
            outerRadius={55}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-zinc-400">{item.name}</span>
            <span className="text-sm font-medium text-white">{item.value}g</span>
          </div>
        ))}
      </div>
    </div>
  );
}
