"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn } from "@/lib/auth/client"
import { motion } from "framer-motion"
import { AnimatedButton } from "@/components/ui/animated-button"
import { Dumbbell, Zap, Target, TrendingUp } from "lucide-react"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      })
      
      if (result.error) {
        let errorMessage = "ログインに失敗しました"
        // 型エラー回避のため result の型をアサート
        const errorVal: unknown = (result as any).error
        if (typeof errorVal === "object" && errorVal !== null) {
          errorMessage = (errorVal as { message?: string }).message || JSON.stringify(errorVal)
        } else if (typeof errorVal === "string") {
          errorMessage = errorVal
        }
        setError(errorMessage)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "予期せぬエラーが発生しました"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    { icon: <Dumbbell size={24} />, text: "トレーニング管理" },
    { icon: <Zap size={24} />, text: "カロリー計算" },
    { icon: <Target size={24} />, text: "目標設定" },
    { icon: <TrendingUp size={24} />, text: "進捗分析" },
  ]

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* 左側: ブランディング（PC表示） */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-900 to-orange-950/20">
        {/* 背景装飾 */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-16 py-12">
          {/* ロゴ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3 mb-12"
          >
            <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500">
              <Dumbbell size={32} className="text-white" />
            </div>
            <span className="text-3xl font-bold text-white">FORGE</span>
          </motion.div>

          {/* メインコピー */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold text-white leading-tight mb-6"
          >
            理想の体を<br />
            <span className="gradient-text">鍛え上げろ</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-zinc-400 mb-12 max-w-md"
          >
            AIがあなたのトレーニングと食事を最適化。
            目標達成への最短ルートを提案します。
          </motion.p>

          {/* 機能リスト */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 gap-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50"
              >
                <div className="text-orange-500">{feature.icon}</div>
                <span className="text-zinc-300 font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* 右側: ログインフォーム */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-md mx-auto">
          {/* モバイル用ロゴ */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-8 lg:hidden"
          >
            <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500">
              <Dumbbell size={28} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white">FORGE</span>
          </motion.div>

          {/* ヘッダー */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center lg:text-left mb-10"
          >
            <h2 className="text-3xl font-bold text-white mb-3">
              おかえりなさい 💪
            </h2>
            <p className="text-zinc-400">
              アカウントにログインして、トレーニングを続けましょう
            </p>
          </motion.div>

          {/* エラー表示 */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30"
            >
              <p className="text-red-500 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Googleログインボタン */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AnimatedButton
              onClick={handleGoogleSignIn}
              isLoading={isLoading}
              variant="secondary"
              size="lg"
              className="w-full"
              leftIcon={
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              }
            >
              Googleでログイン
            </AnimatedButton>
          </motion.div>

          {/* 区切り線 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4 my-8"
          >
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-zinc-500 text-sm">または</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </motion.div>

          {/* 新規登録リンク */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-zinc-400"
          >
            アカウントをお持ちでない方は{" "}
            <Link
              href="/signup"
              className="text-orange-500 hover:text-orange-400 font-medium transition-colors"
            >
              新規登録
            </Link>
          </motion.p>
        </div>
      </div>
    </div>
  )
}
