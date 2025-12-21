# BetterAuth ユーザースキーマ

## 概要

このドキュメントは、BetterAuthを使用する際に必要なデータベーススキーマをまとめたものです。新規ユーザー作成時やデータベースセットアップ時に、このスキーマに準拠する必要があります。

## 必須テーブル

BetterAuthが正常に動作するために、以下のテーブルが必須です。

### 1. users テーブル

ユーザー基本情報を格納するテーブル。

#### SQLite (Turso) スキーマ

```sql
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  email_verified INTEGER DEFAULT 0,
  image TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);
```

#### カラム詳細

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| `id` | TEXT | PRIMARY KEY | ユーザーの一意な識別子（UUID推奨） |
| `name` | TEXT | | ユーザーの表示名（オプション） |
| `email` | TEXT | UNIQUE, NOT NULL | ユーザーのメールアドレス（必須、ユニーク） |
| `email_verified` | INTEGER | DEFAULT 0 | メールアドレスの確認状態（0: 未確認, 1: 確認済み） |
| `image` | TEXT | | プロフィール画像のURL（オプション） |
| `created_at` | INTEGER | NOT NULL | 作成日時（Unix timestamp） |
| `updated_at` | INTEGER | NOT NULL | 更新日時（Unix timestamp） |

### 2. sessions テーブル

ユーザーセッション情報を格納するテーブル。

#### SQLite (Turso) スキーマ

```sql
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  token TEXT UNIQUE NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_token_idx ON sessions(token);
```

#### カラム詳細

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| `id` | TEXT | PRIMARY KEY | セッションの一意な識別子（UUID推奨） |
| `user_id` | TEXT | NOT NULL, FOREIGN KEY | ユーザーID（users.idへの外部キー） |
| `expires_at` | INTEGER | NOT NULL | セッションの有効期限（Unix timestamp） |
| `token` | TEXT | UNIQUE, NOT NULL | セッショントークン（ユニーク） |
| `ip_address` | TEXT | | セッション作成時のIPアドレス（オプション） |
| `user_agent` | TEXT | | セッション作成時のUser Agent（オプション） |
| `created_at` | INTEGER | NOT NULL | 作成日時（Unix timestamp） |
| `updated_at` | INTEGER | NOT NULL | 更新日時（Unix timestamp） |

### 3. accounts テーブル（OAuth認証の場合）

OAuthプロバイダー（Google等）のアカウント情報を格納するテーブル。

#### SQLite (Turso) スキーマ

```sql
CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at INTEGER,
  scope TEXT,
  password TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(provider_id, account_id)
);

CREATE INDEX IF NOT EXISTS accounts_user_id_idx ON accounts(user_id);
CREATE INDEX IF NOT EXISTS accounts_provider_id_idx ON accounts(provider_id);
```

#### カラム詳細

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| `id` | TEXT | PRIMARY KEY | アカウントの一意な識別子（UUID推奨） |
| `user_id` | TEXT | NOT NULL, FOREIGN KEY | ユーザーID（users.idへの外部キー） |
| `account_id` | TEXT | NOT NULL | プロバイダー側のアカウントID |
| `provider_id` | TEXT | NOT NULL | プロバイダーID（例: "google", "github"） |
| `access_token` | TEXT | | OAuthアクセストークン（暗号化推奨） |
| `refresh_token` | TEXT | | OAuthリフレッシュトークン（暗号化推奨） |
| `expires_at` | INTEGER | | トークンの有効期限（Unix timestamp） |
| `scope` | TEXT | | OAuthスコープ |
| `password` | TEXT | | パスワードハッシュ（email/password認証の場合） |
| `created_at` | INTEGER | NOT NULL | 作成日時（Unix timestamp） |
| `updated_at` | INTEGER | NOT NULL | 更新日時（Unix timestamp） |

**ユニーク制約**: `(provider_id, account_id)` の組み合わせは一意である必要があります。

### 4. verifications テーブル（メール確認等）

メール確認やパスワードリセット用のトークンを格納するテーブル。

#### SQLite (Turso) スキーマ

```sql
CREATE TABLE IF NOT EXISTS verifications (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS verifications_identifier_idx ON verifications(identifier);
CREATE INDEX IF NOT EXISTS verifications_value_idx ON verifications(value);
```

#### カラム詳細

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| `id` | TEXT | PRIMARY KEY | 検証レコードの一意な識別子（UUID推奨） |
| `identifier` | TEXT | NOT NULL | 識別子（メールアドレス等） |
| `value` | TEXT | NOT NULL | 検証トークン |
| `expires_at` | INTEGER | NOT NULL | トークンの有効期限（Unix timestamp） |
| `created_at` | INTEGER | NOT NULL | 作成日時（Unix timestamp） |
| `updated_at` | INTEGER | NOT NULL | 更新日時（Unix timestamp） |

## データ型の注意事項

### SQLite (Turso) の場合

- **TEXT**: 文字列型（UUID、メールアドレス等）
- **INTEGER**: 数値型（Unix timestamp、フラグ等）
- **Unix timestamp**: `unixepoch()`関数を使用して生成

### 日時の扱い

SQLiteでは日時をUnix timestamp（INTEGER）で保存します：

```typescript
// 現在時刻の取得
const now = Math.floor(Date.now() / 1000); // Unix timestamp

// 日時の変換
const date = new Date(timestamp * 1000); // JavaScript Date
```

## BetterAuth設定との連携

### 設定例

```typescript
// lib/auth/config.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
```

## マイグレーション

### Drizzle ORMを使用したマイグレーション

```typescript
// lib/db/schema.ts
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).default(false),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    token: text("token").notNull().unique(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (table) => ({
    userIdIdx: index("sessions_user_id_idx").on(table.userId),
    tokenIdx: index("sessions_token_idx").on(table.token),
  })
);

// accounts, verifications も同様に定義
```

## 新規ユーザー作成時のフロー

### 1. Google認証の場合

1. ユーザーがGoogleでログイン
2. BetterAuthが`accounts`テーブルにレコードを作成
3. 新規ユーザーの場合、`users`テーブルにレコードを作成
4. `sessions`テーブルにセッションを作成

### 2. Email/Password認証の場合

1. ユーザーがサインアップ
2. パスワードをハッシュ化して`accounts`テーブルに保存
3. `users`テーブルにレコードを作成
4. メール確認が必要な場合、`verifications`テーブルにトークンを作成
5. `sessions`テーブルにセッションを作成

## セキュリティ考慮事項

### 1. パスワードハッシュ

- BetterAuthが自動的にハッシュ化を処理
- `accounts.password`にはハッシュ化されたパスワードが保存される

### 2. トークンの管理

- セッショントークンはランダムで安全に生成される
- 有効期限を適切に設定
- 期限切れトークンは自動的に削除

### 3. 外部キー制約

- `ON DELETE CASCADE`を設定して、ユーザー削除時に関連データも削除
- データ整合性を保つ

## カスタムフィールドの追加

アプリケーション固有のフィールドを追加する場合：

```sql
-- usersテーブルにカスタムフィールドを追加
ALTER TABLE users ADD COLUMN phone_number TEXT;
ALTER TABLE users ADD COLUMN date_of_birth INTEGER;
```

ただし、BetterAuthの動作に影響を与えないよう注意が必要です。

## トラブルシューティング

### よくある問題

1. **ユニーク制約エラー**
   - `email`フィールドがユニークであることを確認
   - 重複するメールアドレスがないか確認

2. **外部キーエラー**
   - `sessions.user_id`が`users.id`を参照しているか確認
   - `ON DELETE CASCADE`が設定されているか確認

3. **日時エラー**
   - Unix timestamp形式で保存されているか確認
   - タイムゾーンの問題がないか確認

## 参考リソース

- [BetterAuth Documentation](https://www.better-auth.com/docs)
- [BetterAuth GitHub](https://github.com/better-auth/better-auth)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)

---

**最終更新日**: 2024年
**BetterAuthバージョン**: 最新版
**データベース**: Turso (SQLite)





