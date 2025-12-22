/**
 * @fileoverview データベース接続とスキーマのエクスポート
 * Turso (libSQL) を使用したDrizzle ORMクライアントを提供する
 */

import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

/**
 * libSQLクライアントの作成
 * 環境変数からTursoの接続情報を取得する
 * - TURSO_DATABASE_URL: データベースURL
 * - TURSO_AUTH_TOKEN: 認証トークン
 */
function createDbClient() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error(
      "TURSO_DATABASE_URL is not set. Please set it in your environment variables."
    );
  }

  return createClient({
    url,
    authToken,
  });
}

// クライアントを遅延初期化（ビルド時ではなくランタイム時に作成）
let client: ReturnType<typeof createDbClient> | null = null;
let dbInstance: ReturnType<typeof drizzle> | null = null;

function getDb() {
  if (!dbInstance) {
    client = createDbClient();
    dbInstance = drizzle(client, { schema });
  }
  return dbInstance;
}

/**
 * Drizzle ORMデータベースインスタンス
 * アプリケーション全体で使用するDBクライアント
 * ビルド時には初期化されず、ランタイム時に初期化されます
 * @example
 * import { db } from "@/lib/db";
 * const users = await db.select().from(schema.users);
 */
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop: string | symbol) {
    const instance = getDb();
    return instance[prop as keyof typeof instance];
  },
});

// スキーマの全エクスポート
export * from "./schema";
