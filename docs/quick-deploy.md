# Vercelクイックデプロイガイド

## 🚀 デプロイ手順

### 方法1: Vercel CLIを使用（推奨）

#### ステップ1: Vercel CLIのインストール

```bash
npm install -g vercel
```

#### ステップ2: Vercelにログイン

```bash
vercel login
```

ブラウザが開き、Vercelアカウントでログインします。

#### ステップ3: プロジェクトをデプロイ

```bash
vercel
```

初回デプロイ時は、対話形式で設定を確認します：
- **Set up and deploy?** → `Y`
- **Which scope?** → あなたのアカウントを選択
- **Link to existing project?** → `N`（新規プロジェクトの場合）
- **What's your project's name?** → `fitness-management-app`（または任意の名前）
- **In which directory is your code located?** → `./`（現在のディレクトリ）

#### ステップ4: 環境変数の設定

デプロイ後、Vercelダッシュボードで環境変数を設定：

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. デプロイしたプロジェクトを選択
3. **Settings > Environment Variables** に移動
4. 以下の環境変数を追加：

```
TURSO_DATABASE_URL=libsql://your-database-url
TURSO_AUTH_TOKEN=your-turso-token
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=https://your-project.vercel.app
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
OPENAI_API_KEY=your-openai-api-key（オプション）
```

**重要**: `BETTER_AUTH_URL` と `NEXT_PUBLIC_APP_URL` は、デプロイ後にVercelが提供するURLに更新してください。

#### ステップ5: 本番環境に再デプロイ

環境変数を設定した後、再デプロイ：

```bash
vercel --prod
```

または、Vercelダッシュボードで **Redeploy** をクリック

---

### 方法2: Vercelダッシュボードを使用

#### ステップ1: GitHubにプッシュ

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

#### ステップ2: Vercelでプロジェクトをインポート

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. **Add New... > Project** をクリック
3. GitHubリポジトリを選択
4. プロジェクトをインポート

#### ステップ3: 環境変数の設定

**Settings > Environment Variables** で環境変数を設定（上記参照）

#### ステップ4: デプロイ

**Deploy** ボタンをクリック

---

## 🔧 デプロイ後の設定

### Google OAuth設定の更新

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. **APIとサービス > 認証情報** に移動
3. OAuth 2.0 クライアントIDを編集
4. **承認済みのリダイレクトURI** に以下を追加：
   - `https://your-project.vercel.app/api/auth/callback/google`

### データベーススキーマの適用

初回デプロイ時、データベーススキーマを適用する必要があります：

```bash
# ローカルで実行
npx drizzle-kit push
```

または、Turso MCP Serverを使用している場合は、自動的に適用されます。

---

## ✅ デプロイ確認

1. Vercelダッシュボードでデプロイが成功しているか確認
2. デプロイされたURLにアクセス
3. ログインページが表示されるか確認
4. Googleログインが動作するか確認

---

## 🐛 トラブルシューティング

### ビルドエラー

- ビルドログを確認
- 環境変数が正しく設定されているか確認

### ランタイムエラー

- 環境変数が正しく設定されているか確認
- データベース接続を確認
- Google OAuth設定を確認

---

**デプロイが完了したら、アプリケーションをテストしてください！**

