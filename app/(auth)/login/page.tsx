"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { signIn } from "@/lib/auth/client";

interface AuthError {
  message?: string;
  code?: string;
}

interface SignInData {
  url?: string;
  redirectUrl?: string;
  redirect?: boolean;
  session?: unknown;
  user?: unknown;
  [key: string]: unknown;
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
    setIsLoading(true);
    setError(null);
    
    console.log("Starting Google sign in...");
    console.log("Callback URL:", callbackUrl);
    
    try {
      const result = await signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });
      
      console.log("Sign in result:", result);
      console.log("Result data:", result?.data);
      
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
        return;
      }
      
      // 成功した場合、OAuthプロバイダーにリダイレクト
      // BetterAuthが自動的にGoogleの認証URLを返す
      if (result?.data) {
        const data = result.data as SignInData;
        
        // redirect: true の場合、OAuthプロバイダーにリダイレクト
        // コールバック後のリダイレクトはBetterAuthのcallbacks.onOAuthCallback.redirectが処理する
        if (data.redirect && (data.url || data.redirectUrl)) {
          const redirectUrl = data.url || data.redirectUrl;
          if (redirectUrl && typeof redirectUrl === "string") {
            console.log("Redirecting to OAuth provider:", redirectUrl);
            // OAuthプロバイダーにリダイレクト（ここで処理を停止）
            // コールバック後のリダイレクトはBetterAuthが自動的に処理する
            if (typeof window !== "undefined") {
              window.location.href = redirectUrl;
            }
            return;
          }
        }
        
        // redirect: false の場合もリダイレクトURLがあれば使用
        const redirectUrl = data.url || data.redirectUrl;
        if (redirectUrl && typeof redirectUrl === "string") {
          console.log("Redirecting to:", redirectUrl);
          if (typeof window !== "undefined") {
            window.location.href = redirectUrl;
          }
          return;
        }
      }
      
      // 通常はここに到達しない（OAuthプロバイダーにリダイレクトされるため）
      console.warn("Unexpected state: No redirect URL found");
      setIsLoading(false);
    } catch (err) {
      console.error("Sign in error:", err);
      const errorMessage = err instanceof Error ? err.message : "不明なエラー";
      setError(`ログインに失敗しました: ${errorMessage}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* 背景のグラデーション効果 - Phonkテーマ */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-pink-900/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-pink-500/20" />
      
      {/* グロー効果 */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10 w-full max-w-md">
        {/* ロゴ・タイトル - Phonkテーマ */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 mb-4 shadow-[0_0_30px_rgba(168,85,247,0.6)] animate-glow">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h1 className="text-5xl font-black text-white mb-2 tracking-tight drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">
            XPLOSION
          </h1>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-2">
            FITNESS
          </h2>
          <p className="text-purple-300 font-medium">
            EXPLODE YOUR LIMITS
          </p>
        </div>

        <Card className="backdrop-blur-md bg-black/60 border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                LOGIN
              </h2>
              <p className="mt-2 text-sm text-purple-300">
                アカウントにログインして始めましょう
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-sm text-center shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                {error}
              </div>
            )}

            <Button
              variant="outline"
              size="lg"
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 border-0 font-bold shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] transition-all duration-300"
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
                <div className="w-full border-t border-purple-500/30" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black/60 text-purple-300">
                  または
                </span>
              </div>
            </div>

            <p className="text-center text-sm text-purple-300">
              アカウントをお持ちでない方は{" "}
              <Link
                href="/signup"
                className="text-pink-400 hover:text-pink-300 font-bold underline decoration-pink-400/50 hover:decoration-pink-300 transition-colors"
              >
                新規登録
              </Link>
            </p>
          </div>
        </Card>

        <p className="mt-8 text-center text-xs text-purple-400/70">
          ログインすることで、
          <Link href="#" className="underline hover:text-purple-300 transition-colors">
            利用規約
          </Link>
          と
          <Link href="#" className="underline hover:text-purple-300 transition-colors">
            プライバシーポリシー
          </Link>
          に同意したことになります。
        </p>
      </div>
    </div>
  );
}

