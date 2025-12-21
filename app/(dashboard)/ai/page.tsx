"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Camera, Utensils, Dumbbell, TrendingUp, Zap, ChevronRight } from "lucide-react";

const aiFeatures = [
  {
    id: "food-scan",
    title: "写真でカロリー計算",
    description: "食事を撮影するだけでAIがカロリーと栄養素を自動計算",
    icon: Camera,
    color: "from-green-500 to-emerald-600",
    href: "/ai/food-scan",
  },
  {
    id: "meal-suggest",
    title: "食事提案",
    description: "目標に合わせた最適な食事をAIがレコメンド",
    icon: Utensils,
    color: "from-blue-500 to-cyan-600",
    href: "/ai/meal-suggest",
  },
  {
    id: "workout-plan",
    title: "トレーニングプラン生成",
    description: "あなた専用のトレーニングプランをAIが作成",
    icon: Dumbbell,
    color: "from-orange-500 to-red-600",
    href: "/ai/workout-plan",
  },
  {
    id: "progress-predict",
    title: "進捗予測",
    description: "過去のデータから目標達成時期をAIが予測",
    icon: TrendingUp,
    color: "from-purple-500 to-pink-600",
    href: "/ai/progress-predict",
  },
];

export default function AIFeaturesPage() {
  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-purple-400 font-medium">AI機能</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          AIがトレーニングをサポート
        </h1>
        <p className="text-zinc-400 mt-2">
          最新のAI技術で、効率的な食事管理とトレーニングを実現
        </p>
      </motion.div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {aiFeatures.map((feature, index) => (
          <Link key={feature.id} href={feature.href}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all"
            >
              <div className="relative z-10">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-400 mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center gap-1 text-sm text-orange-400 group-hover:gap-2 transition-all">
                  <span>使ってみる</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
              <div className={`absolute -right-10 -bottom-10 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
            </motion.div>
          </Link>
        ))}
      </div>

      {/* API Key Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4"
      >
        <p className="text-sm text-zinc-400">
          <span className="text-yellow-400">⚠️</span> AI機能を使用するには、環境変数に
          <code className="mx-1 px-2 py-0.5 bg-zinc-800 rounded text-orange-400">OPENAI_API_KEY</code>
          を設定してください。
        </p>
      </motion.div>
    </div>
  );
}

