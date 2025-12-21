# 開発環境セットアップガイド

## 前提条件

- Node.js 18以上
- npm または yarn
- Git
- Tursoアカウント（データベース用）
- Google Cloud Consoleアカウント（認証用）
- OpenAI APIアカウント（AI機能用）

## 初期セットアップ

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd fitness-management-app
```

### 2. 依存関係のインストール

```bash
npm install
# または
yarn install
```

### 3. 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定：

```env
# データベース
TURSO_DATABASE_URL=libsql://your-database-url
TURSO_AUTH_TOKEN=your-turso-token

# 認証 (BetterAuth)
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AI機能 (OpenAI)
OPENAI_API_KEY=your-openai-api-key

# アプリケーション
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Tursoデータベースのセットアップ

#### 4.1 Tursoアカウント作成
1. [Turso](https://turso.tech/)にアクセス
2. アカウントを作成
3. 新しいデータベースを作成

#### 4.2 データベース接続情報の取得
```bash
# Turso CLIをインストール（オプション）
curl -sSfL https://get.tur.so/install.sh | bash

# データベースURLとトークンを取得
turso db show <database-name>
```

#### 4.3 スキーマの適用
データベーススキーマを適用（マイグレーションツールを使用）。

### 5. BetterAuthのセットアップ

#### 5.1 Google認証の設定
1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成
3. OAuth 2.0認証情報を作成
4. 承認済みのリダイレクトURIを設定：
   - `http://localhost:3000/api/auth/callback/google`
   - 本番環境のURLも追加

#### 5.2 BetterAuthのインストール
```bash
npm install better-auth
```

#### 5.3 BetterAuthの設定
`lib/auth/config.ts`を作成して設定。

### 6. OpenAI APIのセットアップ

#### 6.1 APIキーの取得
1. [OpenAI Platform](https://platform.openai.com/)にアクセス
2. アカウントを作成
3. APIキーを生成
4. 使用量制限を設定（推奨）

#### 6.2 OpenAI SDKのインストール
```bash
npm install openai
```

## 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
```

ブラウザで `http://localhost:3000` にアクセス。

## データベースマイグレーション

### Drizzle ORMの使用（推奨）

```bash
# Drizzle ORMをインストール
npm install drizzle-orm @libsql/client
npm install -D drizzle-kit

# マイグレーションファイルの生成
npx drizzle-kit generate

# マイグレーションの実行
npx drizzle-kit migrate
```

### 手動マイグレーション

Turso CLIを使用：

```bash
turso db shell <database-name> < schema.sql
```

## 開発ツール

### コードフォーマッター
```bash
npm install -D prettier
```

### リンター
ESLintは既に設定済み：
```bash
npm run lint
```

### TypeScript型チェック
```bash
npx tsc --noEmit
```

## テスト環境のセットアップ（将来）

### Jestのセットアップ
```bash
npm install -D jest @testing-library/react @testing-library/jest-dom
```

### Playwrightのセットアップ（E2Eテスト）
```bash
npm install -D @playwright/test
npx playwright install
```

## トラブルシューティング

### ポートが既に使用されている場合
```bash
# ポート3000が使用中の場合、別のポートを指定
npm run dev -- -p 3001
```

### データベース接続エラー
- Tursoの認証トークンが正しいか確認
- データベースURLが正しいか確認
- ネットワーク接続を確認

### 認証エラー
- Google OAuth設定を確認
- リダイレクトURIが正しく設定されているか確認
- BetterAuthの設定を確認

### AI APIエラー
- APIキーが正しいか確認
- API使用量制限に達していないか確認
- ネットワーク接続を確認

## 本番環境へのデプロイ

### Vercelへのデプロイ（推奨）

1. Vercelアカウントを作成
2. プロジェクトをインポート
3. 環境変数を設定
4. デプロイ

### 環境変数の設定（本番）
本番環境でも同様の環境変数を設定する必要があります。

## 参考リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [Turso Documentation](https://docs.turso.tech/)
- [BetterAuth Documentation](https://www.better-auth.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)

