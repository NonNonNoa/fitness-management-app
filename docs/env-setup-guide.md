# 環境変数セットアップガイド

このガイドでは、アプリケーションに必要な環境変数を設定する手順を説明します。

## 📋 必要な環境変数一覧

### 必須環境変数

| 変数名 | 説明 | 取得方法 |
|--------|------|----------|
| `TURSO_DATABASE_URL` | TursoデータベースのURL | [Tursoセットアップ](#1-tursoデータベース) |
| `TURSO_AUTH_TOKEN` | Turso認証トークン | [Tursoセットアップ](#1-tursoデータベース) |
| `BETTER_AUTH_SECRET` | BetterAuthのシークレットキー | [BetterAuthセットアップ](#2-betterauthシークレット) |
| `BETTER_AUTH_URL` | BetterAuthのURL | [BetterAuthセットアップ](#3-betterauth-url) |
| `GOOGLE_CLIENT_ID` | Google OAuth クライアントID | [Google OAuthセットアップ](#4-google-oauth) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth クライアントシークレット | [Google OAuthセットアップ](#4-google-oauth) |
| `NEXT_PUBLIC_APP_URL` | アプリケーションの公開URL | [アプリケーションURL](#5-アプリケーションurl) |

### オプション環境変数

| 変数名 | 説明 | 取得方法 |
|--------|------|----------|
| `OPENAI_API_KEY` | OpenAI APIキー | [OpenAI APIセットアップ](#6-openai-api-オプション) |

## 🔧 セットアップ手順

### 1. Tursoデータベース

#### 1.1 Tursoアカウントの作成

1. [Turso](https://turso.tech/)にアクセス
2. **Sign Up** をクリックしてアカウントを作成
3. GitHubアカウントでサインアップ可能

#### 1.2 データベースの作成

**方法A: Tursoダッシュボードを使用**

1. Tursoダッシュボードにログイン
2. **Create Database** をクリック
3. データベース名を入力（例: `fitness-app-db`）
4. リージョンを選択（例: `nrt1` - 東京）
5. **Create** をクリック

**方法B: Turso CLIを使用**

```bash
# Turso CLIをインストール
curl -sSfL https://get.tur.so/install.sh | bash

# Tursoにログイン
turso auth login

# データベースを作成
turso db create fitness-app-db --region nrt1
```

#### 1.3 接続情報の取得

**Tursoダッシュボードから取得:**

1. 作成したデータベースをクリック
2. **Connect** タブを開く
3. **Database URL** をコピー → `TURSO_DATABASE_URL`
4. **Auth Token** を生成してコピー → `TURSO_AUTH_TOKEN`

**Turso CLIから取得:**

```bash
# データベースURLを取得
turso db show fitness-app-db

# 認証トークンを生成
turso db tokens create fitness-app-db
```

#### 1.4 環境変数に設定

```env
TURSO_DATABASE_URL=libsql://fitness-app-db-xxxxx.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 2. BetterAuthシークレット

BetterAuthのセッション暗号化に使用するシークレットキーを生成します。

#### 2.1 シークレットキーの生成

**macOS/Linux:**

```bash
openssl rand -base64 32
```

**Windows (PowerShell):**

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**オンラインツール:**

- [RandomKeygen](https://randomkeygen.com/)
- 32文字以上のランダムな文字列を生成

#### 2.2 環境変数に設定

```env
BETTER_AUTH_SECRET=your-generated-secret-key-here-minimum-32-characters
```

**重要**: このシークレットキーは機密情報です。絶対に公開しないでください。

---

### 3. BetterAuth URL

BetterAuthのURLを設定します。

#### 3.1 ローカル開発環境

```env
BETTER_AUTH_URL=http://localhost:3000
```

#### 3.2 本番環境（Vercel）

デプロイ後にVercelが提供するURLを使用：

```env
BETTER_AUTH_URL=https://your-project.vercel.app
```

---

### 4. Google OAuth

#### 4.1 Google Cloud Consoleプロジェクトの作成

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. プロジェクトを選択または作成
   - プロジェクト名: `Fitness App`（任意）
   - プロジェクトID: 自動生成

#### 4.2 OAuth同意画面の設定

1. **APIとサービス > OAuth同意画面** に移動
2. **外部** を選択（個人開発の場合）
3. アプリ情報を入力:
   - アプリ名: `Fitness Management App`
   - ユーザーサポートメール: あなたのメールアドレス
   - デベロッパーの連絡先情報: あなたのメールアドレス
4. **保存して次へ** をクリック
5. スコープはデフォルトのまま **保存して次へ**
6. テストユーザーを追加（必要に応じて）
7. **ダッシュボードに戻る** をクリック

#### 4.3 OAuth 2.0認証情報の作成

1. **APIとサービス > 認証情報** に移動
2. **認証情報を作成 > OAuth 2.0 クライアント ID** を選択
3. アプリケーションの種類: **ウェブアプリケーション**
4. 名前: `Fitness App Web Client`（任意）
5. **承認済みのリダイレクトURI** を追加:
   - ローカル開発: `http://localhost:3000/api/auth/callback/google`
   - 本番環境: `https://your-project.vercel.app/api/auth/callback/google`
6. **作成** をクリック

#### 4.4 認証情報の取得

作成後、以下が表示されます：
- **クライアントID** → `GOOGLE_CLIENT_ID`
- **クライアントシークレット** → `GOOGLE_CLIENT_SECRET`

#### 4.5 環境変数に設定

```env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
```

**重要**: クライアントシークレットは機密情報です。絶対に公開しないでください。

---

### 5. アプリケーションURL

#### 5.1 ローカル開発環境

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### 5.2 本番環境（Vercel）

デプロイ後にVercelが提供するURLを使用：

```env
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

---

### 6. OpenAI API（オプション）

AI機能（食事分析、トレーニングプラン生成など）を使用する場合のみ必要です。

#### 6.1 OpenAIアカウントの作成

1. [OpenAI Platform](https://platform.openai.com/)にアクセス
2. **Sign Up** をクリックしてアカウントを作成
3. メールアドレスまたはGoogleアカウントでサインアップ

#### 6.2 APIキーの生成

1. ログイン後、**API keys** に移動
2. **Create new secret key** をクリック
3. キー名を入力（例: `Fitness App`）
4. **Create secret key** をクリック
5. **表示されたAPIキーをコピー**（後で表示されません）

#### 6.3 使用量制限の設定（推奨）

1. **Settings > Limits** に移動
2. 月次使用量制限を設定（例: $10）
3. レート制限を設定

#### 6.4 環境変数に設定

```env
OPENAI_API_KEY=sk-proj-abcdefghijklmnopqrstuvwxyz1234567890
```

**重要**: APIキーは機密情報です。絶対に公開しないでください。

---

## 📝 環境変数ファイルの作成

### ローカル開発環境

1. `.env.example` を `.env.local` にコピー:

```bash
# macOS/Linux
cp .env.example .env.local

# Windows
copy .env.example .env.local
```

2. `.env.local` を開いて、各環境変数に実際の値を設定

3. ファイルを保存

### Vercel本番環境

1. [Vercel Dashboard](https://vercel.com/dashboard)にアクセス
2. プロジェクトを選択
3. **Settings > Environment Variables** に移動
4. 各環境変数を追加:
   - **Key**: 環境変数名（例: `TURSO_DATABASE_URL`）
   - **Value**: 実際の値
   - **Environment**: Production, Preview, Development を選択
5. **Save** をクリック

---

## ✅ 環境変数の確認

### ローカル環境での確認

```bash
# 環境変数が正しく読み込まれているか確認
npm run dev
```

エラーが発生しないことを確認してください。

### Vercel環境での確認

1. Vercelダッシュボードで **Settings > Environment Variables** を確認
2. すべての必須環境変数が設定されているか確認
3. デプロイログでエラーがないか確認

---

## 🔒 セキュリティのベストプラクティス

1. **`.env.local` をGitにコミットしない**
   - `.gitignore` に既に含まれています
   - 誤ってコミットしないよう注意

2. **環境変数を共有する際は安全な方法を使用**
   - 直接メールやチャットで送信しない
   - パスワードマネージャーや暗号化された共有ツールを使用

3. **本番環境と開発環境で異なる認証情報を使用**
   - 本番環境用のデータベースと開発環境用のデータベースを分ける
   - Google OAuthで異なるクライアントIDを使用

4. **定期的に認証情報をローテーション**
   - 定期的にAPIキーやトークンを更新

---

## 🐛 トラブルシューティング

### エラー: "Environment variable not found"

- `.env.local` ファイルがプロジェクトルートに存在するか確認
- 環境変数名が正しいか確認（大文字小文字を区別）
- アプリケーションを再起動

### エラー: "Database connection failed"

- `TURSO_DATABASE_URL` と `TURSO_AUTH_TOKEN` が正しいか確認
- Tursoダッシュボードでデータベースがアクティブか確認
- ネットワーク接続を確認

### エラー: "Google OAuth error"

- `GOOGLE_CLIENT_ID` と `GOOGLE_CLIENT_SECRET` が正しいか確認
- Google Cloud ConsoleでリダイレクトURIが正しく設定されているか確認
- OAuth同意画面が正しく設定されているか確認

### エラー: "OpenAI API error"

- `OPENAI_API_KEY` が正しいか確認
- APIキーの有効期限を確認
- 使用量制限に達していないか確認

---

## 📚 参考リンク

- [Turso Documentation](https://docs.turso.tech/)
- [BetterAuth Documentation](https://www.better-auth.com/docs)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

---

**環境変数の設定が完了したら、アプリケーションを起動して動作確認を行ってください！**


