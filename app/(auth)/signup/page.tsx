"use client"

import { useState } from "react"
import Link from "next/link"
import { signIn } from "@/lib/auth/client"
import { motion } from "framer-motion"
import { AnimatedButton } from "@/components/ui/animated-button"
import { Dumbbell, Trophy, Flame, ChartLine } from "lucide-react"

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      })
      
      if (result.error) {
        let errorMessage = "登録に失敗しました"
        const err: unknown = result.error;
        if (typeof err === "object" && err !== null && "message" in err && typeof (err as any).message === "string") {
          errorMessage = (err as { message: string }).message;
        } else if (typeof err === "string") {
          errorMessage = err;
        } else {
          errorMessage = "登録に失敗しました";
        }
        setError(errorMessage);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "予期せぬエラーが発生しました"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const benefits = [
    { icon: <Trophy size={28} />, title: "目標達成", desc: "AIが最適なプランを提案" },
    { icon: <Flame size={28} />, title: "カロリー管理", desc: "写真で簡単記録" },
    { icon: <ChartLine size={28} />, title: "進捗分析", desc: "グラフで可視化" },
  ]

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-12 relative overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* ロゴ */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 mb-8"
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
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-3">
            新しい自分を<span className="gradient-text">作り上げる</span>
          </h1>
          <p className="text-zinc-400">
            無料で始めて、理想の体を手に入れよう
          </p>
        </motion.div>

        {/* ベネフィット */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="text-center p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800"
            >
              <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 text-orange-500 mb-2">
                {benefit.icon}
              </div>
              <h3 className="text-sm font-bold text-white mb-1">{benefit.title}</h3>
              <p className="text-xs text-zinc-500">{benefit.desc}</p>
            </motion.div>
          ))}
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

        {/* Googleサインアップボタン */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <AnimatedButton
            onClick={handleGoogleSignUp}
            isLoading={isLoading}
            variant="primary"
            size="lg"
            className="w-full mb-4"
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
            Googleで無料登録
          </AnimatedButton>
        </motion.div>

        {/* 利用規約 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-zinc-500 mb-8"
        >
          登録することで、
          <a href="#" className="text-orange-500 hover:underline">利用規約</a>
          と
          <a href="#" className="text-orange-500 hover:underline">プライバシーポリシー</a>
          に同意したものとみなされます
        </motion.p>

        {/* 区切り線 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="text-zinc-500 text-sm">すでにアカウントをお持ちの方</span>
          <div className="flex-1 h-px bg-zinc-800" />
        </motion.div>

        {/* ログインリンク */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Link href="/login">
            <AnimatedButton
              variant="outline"
              size="lg"
              className="w-full"
            >
              ログイン
            </AnimatedButton>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
