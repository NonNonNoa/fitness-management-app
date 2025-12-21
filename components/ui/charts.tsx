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
} from "recharts";
import { motion } from "framer-motion";

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  delay?: number;
}

export function ChartContainer({ title, children, delay = 0 }: ChartContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-5"
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-gradient-to-b from-orange-500 to-red-600 rounded-full" />
        {title}
      </h3>
      {children}
    </motion.div>
  );
}

interface WeightChartProps {
  data: { date: string; weight: number }[];
}

export function WeightChart({ data }: WeightChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center text-zinc-500">
        データがありません
      </div>
    );
  }

  return (
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
        <YAxis stroke="#71717a" fontSize={12} domain={["dataMin - 2", "dataMax + 2"]} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "#fff" }}
        />
        <Area
          type="monotone"
          dataKey="weight"
          stroke="#f97316"
          strokeWidth={2}
          fill="url(#weightGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface CalorieChartProps {
  data: { date: string; calories: number; target: number }[];
}

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

interface WorkoutVolumeChartProps {
  data: { date: string; volume: number }[];
}

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

interface MacroPieChartProps {
  protein: number;
  carbs: number;
  fats: number;
}

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


