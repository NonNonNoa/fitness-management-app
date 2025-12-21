"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { 
  Dumbbell, 
  Flame, 
  Target, 
  ChartLine, 
  ArrowRight,
  Zap,
  Users,
  Sparkles
} from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"

export default function LandingPage() {
  const features = [
    {
      icon: <Flame size={32} />,
      title: "カロリー管理",
      description: "AIが写真から自動でカロリーを計算。手動入力も簡単",
      color: "from-orange-500 to-amber-500"
    },
    {
      icon: <Dumbbell size={32} />,
      title: "トレーニング記録",
      description: "種目・重量・セット数を記録。進捗をグラフで可視化",
      color: "from-cyan-500 to-blue-500"
    },
    {
      icon: <Target size={32} />,
      title: "目標設定",
      description: "減量・増量・筋力向上。AIが最適なプランを提案",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <ChartLine size={32} />,
      title: "進捗分析",
      description: "詳細なレポートとAIアドバイスで成長を実感",
      color: "from-purple-500 to-pink-500"
    },
  ]

  return (
    <div className="min-h-screen overflow-hidden">
      {/* ヒーローセクション */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 py-20">
        {/* 背景エフェクト */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-orange-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* ロゴ */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <motion.div 
              className="p-4 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/30"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Dumbbell size={40} className="text-white" />
            </motion.div>
            <span className="text-4xl font-bold text-white">FORGE</span>
          </motion.div>

          {/* メインコピー */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6"
          >
            理想の体を
            <br />
            <span className="gradient-text">鍛え上げろ</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto"
          >
            AIがあなたのトレーニングと食事を最適化。
            <br />
            目標達成への最短ルートを提案します。
          </motion.p>

          {/* CTA ボタン */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/signup">
              <AnimatedButton 
                variant="primary" 
                size="lg"
                rightIcon={<ArrowRight size={20} />}
                className="w-full sm:w-auto"
              >
                無料で始める
              </AnimatedButton>
            </Link>
            <Link href="/login">
              <AnimatedButton 
                variant="outline" 
                size="lg"
                className="w-full sm:w-auto"
              >
                ログイン
              </AnimatedButton>
            </Link>
          </motion.div>

          {/* ソーシャルプルーフ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-12 flex items-center justify-center gap-8 text-sm text-zinc-500"
          >
            <div className="flex items-center gap-2">
              <Users size={18} />
              <span>1,000+ ユーザー</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={18} />
              <span>AI搭載</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={18} />
              <span>永久無料</span>
            </div>
          </motion.div>
        </div>

        {/* スクロールインジケーター */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-zinc-700 flex justify-center pt-2"
          >
            <motion.div className="w-1 h-2 rounded-full bg-orange-500" />
          </motion.div>
        </motion.div>
      </section>

      {/* 機能セクション */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              すべてを<span className="gradient-text">一つのアプリ</span>で
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              トレーニング、食事、目標管理をシームレスに統合。
              AIがあなたの成長をサポートします。
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all group"
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} bg-opacity-20 mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-zinc-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="relative py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center p-12 rounded-3xl bg-gradient-to-br from-orange-500/20 via-orange-500/5 to-transparent border border-orange-500/20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            今すぐ始めよう
          </h2>
          <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
            無料で全機能を利用可能。
            理想の体への第一歩を踏み出そう。
          </p>
          <Link href="/signup">
            <AnimatedButton 
              variant="primary" 
              size="lg"
              rightIcon={<ArrowRight size={20} />}
            >
              無料で始める
            </AnimatedButton>
          </Link>
        </motion.div>
      </section>

      {/* フッター */}
      <footer className="border-t border-zinc-800 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <Dumbbell size={20} className="text-orange-500" />
            <span className="font-bold text-white">FORGE</span>
          </div>
          <p>© 2024 FORGE. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
