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
const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

/**
 * Drizzle ORMデータベースインスタンス
 * アプリケーション全体で使用するDBクライアント
 * @example
 * import { db } from "@/lib/db";
 * const users = await db.select().from(schema.users);
 */
export const db = drizzle(client, { schema });

// スキーマの全エクスポート
export * from "./schema";
