"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { signIn } from "@/lib/auth/client";

interface AuthError {
  message?: string;
  code?: string;
}

export default function LoginPage() {
  // クライアントサイドでのみURLパラメータを取得（初期値として設定）
  const [callbackUrl] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("callbackUrl") || "/dashboard";
    }
    return "/dashboard";
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Starting Google sign in...");
      console.log("Callback URL:", callbackUrl);
      
      const result = await signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });
      
      console.log("Sign in result:", result);
      
      // エラーがある場合
      if (result?.error) {
        // エラーオブジェクトを詳細に解析
        let errorMessage: string;
        const authError = result.error as AuthError;
        if (typeof authError === "string") {
          errorMessage = authError;
        } else if (authError?.message) {
          errorMessage = authError.message;
        } else if (authError?.code) {
          errorMessage = `エラーコード: ${authError.code}`;
        } else {
          errorMessage = JSON.stringify(result.error);
        }
        console.error("Auth error details:", result.error);
        setError(`ログインエラー: ${errorMessage}`);
        setIsLoading(false);
      }
      // リダイレクトが発生しない場合（設定の問題）
    } catch (err) {
      console.error("Sign in error:", err);
      const errorMessage = err instanceof Error ? err.message : "不明なエラー";
      setError(`ログインに失敗しました: ${errorMessage}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center p-4">
      {/* 背景のグラデーション効果 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/20 via-transparent to-transparent" />
      
      <div className="relative z-10 w-full max-w-md">
        {/* ロゴ・タイトル */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-600 mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            フィットネスAI
          </h1>
          <p className="text-zinc-400">
            AIでトレーニングと食事を最適化
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-zinc-900/80">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white">
                ログイン
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                アカウントにログインして始めましょう
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <Button
              variant="outline"
              size="lg"
              className="w-full flex items-center justify-center gap-3 bg-white text-zinc-900 hover:bg-zinc-100 border-0"
              onClick={handleGoogleSignIn}
              isLoading={isLoading}
            >
              {!isLoading && (
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
              )}
              Googleでログイン
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-zinc-900 text-zinc-500">
                  または
                </span>
              </div>
            </div>

            <p className="text-center text-sm text-zinc-400">
              アカウントをお持ちでない方は{" "}
              <Link
                href="/signup"
                className="text-orange-400 hover:text-orange-300 font-medium"
              >
                新規登録
              </Link>
            </p>
          </div>
        </Card>

        <p className="mt-8 text-center text-xs text-zinc-500">
          ログインすることで、
          <Link href="#" className="underline hover:text-zinc-400">
            利用規約
          </Link>
          と
          <Link href="#" className="underline hover:text-zinc-400">
            プライバシーポリシー
          </Link>
          に同意したことになります。
        </p>
      </div>
    </div>
  );
}

