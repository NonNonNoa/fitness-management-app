"use client";

import { createAuthClient } from "better-auth/react";

// クライアント側では実行時に現在のURLを使用
// Vercelでは、NEXT_PUBLIC_APP_URLが設定されていない場合、現在のウィンドウのoriginを使用
const getBaseURL = () => {
  // ブラウザ環境では、実行時に現在のURLを使用
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  // SSR時は環境変数を使用（通常は使用されない）
  return process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
});

export const { signIn, signOut, useSession } = authClient;

