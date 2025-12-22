# Vercelデプロイガイド

このドキュメントでは、フィットネス管理アプリをVercelにデプロイする手順を説明します。

## 前提条件

- Vercelアカウント（[vercel.com](https://vercel.com)で無料作成可能）
- GitHub、GitLab、またはBitbucketアカウント（リポジトリをホストするため）
- すべての環境変数が準備されていること

## デプロイ手順

### 方法1: Vercel CLIを使用（推奨）

#### 1. Vercel CLIのインストール

```bash
npm install -g vercel
```

#### 2. Vercelにログイン

```bash
vercel login
```

#### 3. プロジェクトをデプロイ

プロジェクトルートで以下を実行：

```bash
vercel
```

初回デプロイ時は、対話形式で設定を確認します：
- **Set up and deploy?** → `Y`
- **Which scope?** → あなたのアカウントを選択
- **Link to existing project?** → `N`（新規プロジェクトの場合）
- **What's your project's name?** → `fitness-management-app`（または任意の名前）
- **In which directory is your code located?** → `./`（現在のディレクトリ）

#### 4. 本番環境にデプロイ

```bash
vercel --prod
```

### 方法2: Vercelダッシュボードを使用

#### 1. GitHubリポジトリにプッシュ

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

#### 2. Vercelダッシュボードでプロジェクトをインポート

1. [Vercel Dashboard](https://vercel.com/dashboard)にアクセス
2. **Add New...** → **Project** をクリック
3. GitHubリポジトリを選択
4. プロジェクトをインポート

#### 3. 環境変数を設定

**Settings** → **Environment Variables** で以下の環境変数を追加：

```
TURSO_DATABASE_URL=libsql://your-database-url
TURSO_AUTH_TOKEN=your-turso-token
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=https://your-project.vercel.app
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OPENAI_API_KEY=your-openai-api-key
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

**重要**: 各環境（Production、Preview、Development）に適切な値を設定してください。

#### 4. デプロイ

**Deploy** ボタンをクリックしてデプロイを開始します。

## 環境変数の設定

### 必須環境変数

| 変数名 | 説明 | 例 |
|--------|------|-----|
| `TURSO_DATABASE_URL` | TursoデータベースのURL | `libsql://your-db.turso.io` |
| `TURSO_AUTH_TOKEN` | Turso認証トークン | `your-token-here` |
| `BETTER_AUTH_SECRET` | BetterAuthのシークレットキー | ランダムな文字列（32文字以上推奨） |
| `BETTER_AUTH_URL` | BetterAuthのURL | `https://your-project.vercel.app` |
| `GOOGLE_CLIENT_ID` | Google OAuth クライアントID | `your-client-id.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth クライアントシークレット | `your-client-secret` |
| `NEXT_PUBLIC_APP_URL` | アプリケーションの公開URL | `https://your-project.vercel.app` |

### オプション環境変数

| 変数名 | 説明 | 例 |
|--------|------|-----|
| `OPENAI_API_KEY` | OpenAI APIキー（AI機能を使用する場合） | `sk-...` |

### BETTER_AUTH_SECRETの生成

```bash
# macOS/Linux
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### Google OAuth設定の更新

Vercelにデプロイ後、Google Cloud ConsoleでリダイレクトURIを更新：

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. **APIとサービス > 認証情報** に移動
3. OAuth 2.0 クライアントIDを編集
4. **承認済みのリダイレクトURI** に以下を追加：
   - `https://your-project.vercel.app/api/auth/callback/google`

## デプロイ後の確認事項

### 1. データベース接続の確認

- Tursoデータベースが正しく接続されているか確認
- 必要に応じて、Drizzleマイグレーションを実行

### 2. 認証の確認

- Google OAuthログインが動作するか確認
- セッション管理が正しく機能しているか確認

### 3. 環境変数の確認

Vercelダッシュボードで環境変数が正しく設定されているか確認：
- **Settings** → **Environment Variables**

### 4. ビルドログの確認

デプロイが失敗した場合、ビルドログを確認：
- **Deployments** → デプロイを選択 → **Build Logs**

## トラブルシューティング

### ビルドエラー

#### エラー: `Module not found`

```bash
# ローカルでビルドをテスト
npm run build
```

#### エラー: `Environment variable not found`

Vercelダッシュボードで環境変数が設定されているか確認してください。

### ランタイムエラー

#### データベース接続エラー

- `TURSO_DATABASE_URL` と `TURSO_AUTH_TOKEN` が正しいか確認
- Tursoダッシュボードでデータベースがアクティブか確認

#### 認証エラー

- `BETTER_AUTH_URL` がデプロイされたURLと一致しているか確認
- Google OAuthのリダイレクトURIが正しく設定されているか確認

### パフォーマンス最適化

#### ビルド時間の短縮

- 不要な依存関係を削除
- `package.json` の `dependencies` と `devDependencies` を適切に分離

#### ランタイム最適化

- 画像最適化（Next.js Imageコンポーネントを使用）
- 静的生成の活用（可能な箇所で）

## カスタムドメインの設定

1. Vercelダッシュボードでプロジェクトを選択
2. **Settings** → **Domains** に移動
3. カスタムドメインを追加
4. DNS設定を更新（Vercelが指示を提供）

## 継続的デプロイ（CI/CD）

Vercelは自動的にGitリポジトリと連携します：

- **mainブランチへのプッシュ** → 本番環境に自動デプロイ
- **その他のブランチへのプッシュ** → プレビュー環境に自動デプロイ

### プレビューデプロイ

プルリクエストを作成すると、自動的にプレビューURLが生成されます。

## 環境別の設定

### Production（本番環境）

- 本番用のデータベースURL
- 本番用のAPIキー
- 本番用のOAuth設定

### Preview（プレビュー環境）

- 開発用のデータベースURL（または本番の読み取り専用）
- 開発用のAPIキー

### Development（開発環境）

- ローカル開発用の設定

## 参考リンク

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Deployment](https://vercel.com/docs/concepts/deployments)

## サポート

問題が発生した場合：

1. Vercelダッシュボードのビルドログを確認
2. [Vercel Community](https://github.com/vercel/vercel/discussions)で質問
3. [Vercel Support](https://vercel.com/support)に連絡

---

**Happy Deploying! 🚀**

