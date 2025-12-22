# フィットネスAI管理アプリ

個人向けのフィットネス管理アプリケーション。AIを活用した食事管理とトレーニング管理により、ユーザーの目標達成をサポートします。

## 📋 目次

- [プロジェクト概要](#プロジェクト概要)
- [技術スタック](#技術スタック)
- [前提条件](#前提条件)
- [セットアップ手順](#セットアップ手順)
- [環境変数の設定](#環境変数の設定)
- [データベースのセットアップ](#データベースのセットアップ)
- [開発サーバーの起動](#開発サーバーの起動)
- [プロジェクト構造](#プロジェクト構造)
- [開発フロー](#開発フロー)
- [テスト](#テスト)
- [トラブルシューティング](#トラブルシューティング)
- [参考資料](#参考資料)

## 🎯 プロジェクト概要

このアプリケーションは以下の機能を提供します：

- **食事管理**: カロリー・栄養計算、写真撮影による自動カロリー計算
- **トレーニング管理**: 種目別重量管理、トレーニング記録
- **目標設定**: 減量・増量・筋力向上・筋肉量アップの目標管理
- **AI機能**: 食事提案、トレーニングプラン生成、進捗予測
- **ダッシュボード**: 体重推移グラフ、カロリー摂取グラフ、目標進捗表示

## 🛠 技術スタック

### フロントエンド
- **Next.js 15.5.9** (App Router)
- **React 19.2.3**
- **TypeScript 5**
- **Tailwind CSS 4**
- **Framer Motion** (アニメーション)
- **Recharts** (グラフ)

### バックエンド
- **Next.js Server Actions** (API)
- **Turso** (SQLite エッジデータベース)
- **Drizzle ORM** (データベースORM)

### 認証
- **BetterAuth** (Google OAuth認証)

### AI機能
- **OpenAI API** (GPT-4 Vision, GPT-4)

### 開発ツール
- **Vitest** (テスト)
- **ESLint** (リンター)
- **TypeScript** (型チェック)

## 📦 前提条件

開発を始める前に、以下のツールがインストールされている必要があります：

- **Node.js 18以上** ([ダウンロード](https://nodejs.org/))
- **npm または yarn** (Node.jsに含まれています)
- **Git** ([ダウンロード](https://git-scm.com/))

以下のアカウントも必要です（後でセットアップします）：

- **Tursoアカウント** (データベース用)
- **Google Cloud Consoleアカウント** (認証用)
- **OpenAI APIアカウント** (AI機能用、オプション)

## 🚀 セットアップ手順

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd fitness-management-app
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成し、以下の環境変数を設定します：

```env
# データベース (Turso)
TURSO_DATABASE_URL=libsql://your-database-url
TURSO_AUTH_TOKEN=your-turso-token

# 認証 (BetterAuth)
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AI機能 (OpenAI) - オプション
OPENAI_API_KEY=your-openai-api-key

# アプリケーション
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

各環境変数の取得方法は後述の[環境変数の設定](#環境変数の設定)セクションを参照してください。

### 4. データベースのセットアップ

データベースのセットアップ方法は[データベースのセットアップ](#データベースのセットアップ)セクションを参照してください。

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスします。

## 🔐 環境変数の設定

### Tursoデータベース

1. [Turso](https://turso.tech/)にアクセスしてアカウントを作成
2. ダッシュボードで新しいデータベースを作成
3. データベースのURLとトークンを取得：
   - データベースURL: `libsql://your-database-url`
   - 認証トークン: `your-turso-token`

**または、Turso MCP Serverを使用している場合：**
- MCP Server経由でデータベースに接続できます
- 詳細は `docs/turso-mcp-setup.md` を参照

### BetterAuth認証

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成（または既存のプロジェクトを選択）
3. **APIとサービス > 認証情報** に移動
4. **認証情報を作成 > OAuth 2.0 クライアント ID** を選択
5. アプリケーションの種類を選択（Webアプリケーション）
6. 承認済みのリダイレクトURIを追加：
   - `http://localhost:3000/api/auth/callback/google`
   - 本番環境のURLも追加（例: `https://your-domain.com/api/auth/callback/google`）
7. クライアントIDとクライアントシークレットを取得

**BETTER_AUTH_SECRETの生成：**
```bash
# ランダムなシークレットキーを生成
openssl rand -base64 32
```

### OpenAI API（オプション）

AI機能を使用する場合のみ必要です：

1. [OpenAI Platform](https://platform.openai.com/)にアクセス
2. アカウントを作成（またはログイン）
3. **API keys** セクションで新しいAPIキーを生成
4. 使用量制限を設定することを推奨

## 💾 データベースのセットアップ

### 方法1: Turso MCP Serverを使用（推奨）

MCP Serverが設定されている場合、データベース操作は自動的に行われます。

### 方法2: Turso CLIを使用

1. Turso CLIをインストール：
```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

2. Tursoにログイン：
```bash
turso auth login
```

3. データベースを作成：
```bash
turso db create fitness-app-db
```

4. データベースURLとトークンを取得：
```bash
turso db show fitness-app-db
turso db tokens create fitness-app-db
```

5. スキーマを適用：
   - データベーススキーマは `lib/db/schema.ts` に定義されています
   - 初回起動時に自動的に適用されます（Drizzle ORMを使用）

### 方法3: Drizzle Kitを使用

```bash
# マイグレーションファイルの生成（必要に応じて）
npx drizzle-kit generate

# データベースにスキーマを適用
npx drizzle-kit push
```

**注意**: 環境変数 `TURSO_DATABASE_URL` と `TURSO_AUTH_TOKEN` が設定されている必要があります。

## 🏃 開発サーバーの起動

### 開発モード

```bash
npm run dev
```

開発サーバーが起動し、[http://localhost:3000](http://localhost:3000) でアプリケーションにアクセスできます。

### その他のコマンド

```bash
# 本番ビルド
npm run build

# 本番サーバーの起動
npm start

# リンターの実行
npm run lint

# リンターの自動修正
npm run lint:fix

# TypeScript型チェック
npm run type-check

# テストの実行
npm test

# テストのウォッチモード
npm run test:watch

# テストカバレッジ
npm run test:coverage
```

## 📁 プロジェクト構造

```
fitness-management-app/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # 認証関連ページ
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/               # ダッシュボード関連ページ
│   │   ├── dashboard/            # ホームダッシュボード
│   │   ├── meals/                # 食事管理
│   │   ├── workouts/             # トレーニング管理
│   │   ├── goals/                # 目標設定
│   │   ├── ai/                   # AI機能
│   │   └── profile/              # プロフィール
│   ├── api/                      # API Routes
│   │   └── auth/                 # 認証API
│   └── layout.tsx                # ルートレイアウト
├── components/                    # Reactコンポーネント
│   └── ui/                       # UIコンポーネント
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── charts.tsx
│       └── ...
├── lib/                          # ライブラリ・ユーティリティ
│   ├── actions/                  # Server Actions
│   │   ├── meals.ts
│   │   ├── workouts.ts
│   │   ├── goals.ts
│   │   └── ai.ts
│   ├── auth/                     # 認証設定
│   ├── db/                       # データベース
│   │   ├── schema.ts             # スキーマ定義
│   │   └── index.ts              # DB接続
│   └── utils/                    # ユーティリティ関数
│       ├── calorie-calculator.ts
│       ├── goal-helpers.ts
│       └── ...
├── docs/                         # ドキュメント
│   ├── requirement.md            # 要件定義
│   ├── api-design.md             # API設計
│   ├── database-schema.md        # データベース設計
│   └── ...
├── tests/                        # テストファイル
├── public/                       # 静的ファイル
├── drizzle.config.ts             # Drizzle設定
├── next.config.ts               # Next.js設定
├── tsconfig.json                 # TypeScript設定
└── package.json                  # 依存関係
```

## 🔄 開発フロー

### ブランチ戦略

- `main`: 本番環境用ブランチ
- `develop`: 開発用ブランチ
- `feature/*`: 新機能開発用ブランチ
- `fix/*`: バグ修正用ブランチ

### コード規約

- **TypeScript**: 厳密な型チェックを有効化
- **ESLint**: コード品質チェック
- **JSDoc**: 関数・型にJSDocコメントを追加
- **命名規則**: 
  - コンポーネント: PascalCase
  - 関数・変数: camelCase
  - 定数: UPPER_SNAKE_CASE

### コミットメッセージ

```
feat: 新機能の追加
fix: バグ修正
docs: ドキュメントの更新
style: コードフォーマット
refactor: リファクタリング
test: テストの追加・修正
chore: その他の変更
```

### プルリクエスト

1. 機能ブランチを作成
2. 変更をコミット
3. プッシュしてプルリクエストを作成
4. コードレビューを受ける
5. 承認後にマージ

## 🧪 テスト

### テストの実行

```bash
# すべてのテストを実行
npm test

# ウォッチモード
npm run test:watch

# カバレッジレポート
npm run test:coverage
```

### テストファイルの場所

- `tests/`: テストファイル
- `tests/components/`: コンポーネントテスト
- `tests/helpers.test.ts`: ヘルパー関数のテスト

## 🐛 トラブルシューティング

### ポートが既に使用されている場合

```bash
# 別のポートを指定
npm run dev -- -p 3001
```

### データベース接続エラー

1. 環境変数 `TURSO_DATABASE_URL` と `TURSO_AUTH_TOKEN` が正しく設定されているか確認
2. Tursoダッシュボードでデータベースが存在するか確認
3. ネットワーク接続を確認

### 認証エラー

1. Google OAuth設定を確認：
   - リダイレクトURIが正しく設定されているか
   - クライアントIDとシークレットが正しいか
2. `BETTER_AUTH_SECRET` が設定されているか確認
3. `BETTER_AUTH_URL` が正しいか確認

### AI APIエラー

1. `OPENAI_API_KEY` が正しく設定されているか確認
2. API使用量制限に達していないか確認
3. ネットワーク接続を確認

### 型エラー

```bash
# TypeScript型チェックを実行
npm run type-check
```

### 依存関係のエラー

```bash
# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

### ビルドエラー

```bash
# キャッシュをクリアして再ビルド
rm -rf .next
npm run build
```

## 📚 参考資料

### 公式ドキュメント

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Turso Documentation](https://docs.turso.tech/)
- [BetterAuth Documentation](https://www.better-auth.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)

### プロジェクト内ドキュメント

- `docs/requirement.md`: 要件定義書
- `docs/api-design.md`: API設計書
- `docs/database-schema.md`: データベーススキーマ設計
- `docs/tech-stack.md`: 技術スタック詳細
- `docs/setup-guide.md`: セットアップガイド（詳細版）
- `docs/development-guidelines.md`: 開発ガイドライン

### その他の参考リンク

- [メッツ値によるカロリー計算](https://keisan.site/exec/system/1536638935)
- [厚生労働省「健康づくりのための身体活動基準2013」](http://www.mhlw.go.jp/stf/houdou/2r9852000002xple-att/2r9852000002xpqt.pdf)

## 🤝 コントリビューション

プロジェクトへの貢献を歓迎します！以下の手順に従ってください：

1. リポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'feat: Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📝 ライセンス

このプロジェクトはプライベートプロジェクトです。

## 📧 お問い合わせ

質問や問題がある場合は、Issueを作成するか、プロジェクトメンテナーに連絡してください。

---

**Happy Coding! 🚀**
