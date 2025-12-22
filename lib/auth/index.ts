import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { headers } from "next/headers";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || (process.env.NODE_ENV === "production" 
    ? undefined 
    : "dev-secret-key-minimum-32-characters-long-for-development-only"),
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000"),
  basePath: "/api/auth",
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  callbacks: {
    onOAuthCallback: {
      redirect: {
        onSuccess: "/dashboard",
        onError: "/login",
      },
    },
  },
  trustedOrigins: (() => {
    const origins: string[] = [];
    
    // ローカル開発環境
    if (process.env.NODE_ENV !== "production") {
      origins.push("http://localhost:3000");
    }
    
    // 本番環境のURL（BETTER_AUTH_URL）
    if (process.env.BETTER_AUTH_URL) {
      origins.push(process.env.BETTER_AUTH_URL);
    }
    
    // VercelのプレビューURL（VERCEL_URL環境変数から自動取得）
    // Vercelは自動的にVERCEL_URL環境変数を設定します
    if (process.env.VERCEL_URL) {
      origins.push(`https://${process.env.VERCEL_URL}`);
    }
    
    // NEXT_PUBLIC_APP_URLも追加
    if (process.env.NEXT_PUBLIC_APP_URL) {
      origins.push(process.env.NEXT_PUBLIC_APP_URL);
    }
    
    // 重複を削除
    return [...new Set(origins)];
  })(),
});

export async function getSession() {
  const headersList = await headers();
  return auth.api.getSession({ headers: headersList });
}

export async function requireSession() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}
