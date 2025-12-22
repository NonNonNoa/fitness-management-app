# 環境変数セットアップ - ステップバイステップ

このガイドでは、環境変数を順番に設定していきます。

## 📋 セットアップの流れ

1. ✅ Tursoデータベースの設定
2. ✅ BetterAuthシークレットの生成
3. ✅ Google OAuth認証の設定
4. ✅ OpenAI APIキーの取得（オプション）
5. ✅ 環境変数ファイルの作成
6. ✅ 動作確認

---

## ステップ1: Tursoデータベースの設定

### 1.1 Tursoアカウントの作成

1. [Turso](https://turso.tech/) にアクセス
2. **Sign Up** をクリック
3. GitHubアカウントでサインアップ（推奨）またはメールアドレスで登録

### 1.2 データベースの作成

**方法A: Tursoダッシュボードを使用（推奨）**

1. Tursoダッシュボードにログイン
2. **Create Database** ボタンをクリック
3. データベース名を入力（例: `fitness-app-db`）
4. リージョンを選択（推奨: `nrt1` - 東京）
5. **Create** をクリック

**方法B: Turso CLIを使用**

```bash
# Turso CLIをインストール（Windows）
# PowerShellで実行
irm get.tur.so/install.ps1 | iex

# Tursoにログイン
turso auth login

# データベースを作成
turso db create fitness-app-db --region nrt1
```

### 1.3 接続情報の取得

**Tursoダッシュボードから取得:**

1. 作成したデータベースをクリック
2. **Connect** タブを開く
3. **Database URL** をコピー → これが `TURSO_DATABASE_URL`
4. **Generate Token** をクリックしてトークンを生成
5. 生成されたトークンをコピー → これが `TURSO_AUTH_TOKEN`

**Turso CLIから取得:**

```bash
# データベースURLを表示
turso db show fitness-app-db

# 認証トークンを生成
turso db tokens create fitness-app-db
```

### 1.4 メモ

取得した値をメモしてください：

```
TURSO_DATABASE_URL=libsql://fitness-app-db-xxxxx.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ステップ2: BetterAuthシークレットの生成

### 2.1 シークレットキーの生成

**Windows PowerShellで実行:**

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**または、オンラインツールを使用:**

- [RandomKeygen](https://randomkeygen.com/) の "Fort Knox Password" を使用
- 32文字以上のランダムな文字列を生成

### 2.2 メモ

生成されたシークレットキーをメモしてください：

```
BETTER_AUTH_SECRET=AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
```

**重要**: このキーは機密情報です。絶対に公開しないでください。

---

## ステップ3: Google OAuth認証の設定

### 3.1 Google Cloud Consoleプロジェクトの作成

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. Googleアカウントでログイン
3. プロジェクトを選択または作成:
   - 上部のプロジェクト選択ドロップダウンをクリック
   - **NEW PROJECT** をクリック
   - プロジェクト名: `Fitness App`（任意）
   - **CREATE** をクリック

### 3.2 OAuth同意画面の設定

1. 左側メニューから **APIとサービス > OAuth同意画面** を選択
2. **外部** を選択（個人開発の場合）
3. **CREATE** をクリック
4. アプリ情報を入力:
   - **アプリ名**: `Fitness Management App`
   - **ユーザーサポートメール**: あなたのメールアドレス
   - **デベロッパーの連絡先情報**: あなたのメールアドレス
5. **保存して次へ** をクリック
6. スコープはデフォルトのまま **保存して次へ**
7. テストユーザーは後で追加可能なので **保存して次へ**
8. **ダッシュボードに戻る** をクリック

### 3.3 OAuth 2.0認証情報の作成

1. 左側メニューから **APIとサービス > 認証情報** を選択
2. 上部の **+ 認証情報を作成** をクリック
3. **OAuth 2.0 クライアント ID** を選択
4. **アプリケーションの種類**: **ウェブアプリケーション** を選択
5. **名前**: `Fitness App Web Client`（任意）
6. **承認済みのリダイレクトURI** セクションで:
   - **+ URI を追加** をクリック
   - `http://localhost:3000/api/auth/callback/google` を入力
   - **+ URI を追加** を再度クリック
   - `https://your-project.vercel.app/api/auth/callback/google` を入力（後でVercel URLに更新）
7. **作成** をクリック

### 3.4 認証情報の取得

作成後、ポップアップが表示されます：
- **クライアントID** をコピー → これが `GOOGLE_CLIENT_ID`
- **クライアントシークレット** をコピー → これが `GOOGLE_CLIENT_SECRET`

**重要**: この画面を閉じると、クライアントシークレットは再表示できません。必ずコピーしてください。

### 3.5 メモ

取得した値をメモしてください：

```
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
```

---

## ステップ4: OpenAI APIキーの取得（オプション）

AI機能（食事分析、トレーニングプラン生成など）を使用する場合のみ必要です。

### 4.1 OpenAIアカウントの作成

1. [OpenAI Platform](https://platform.openai.com/) にアクセス
2. **Sign Up** をクリック
3. メールアドレスまたはGoogleアカウントでサインアップ
4. 電話番号認証を完了

### 4.2 APIキーの生成

1. ログイン後、左側メニューから **API keys** を選択
2. **+ Create new secret key** をクリック
3. キー名を入力（例: `Fitness App`）
4. **Create secret key** をクリック
5. **表示されたAPIキーをコピー**（`sk-` で始まる文字列）

**重要**: この画面を閉じると、APIキーは再表示できません。必ずコピーしてください。

### 4.3 使用量制限の設定（推奨）

1. 左側メニューから **Settings > Limits** を選択
2. **Hard limit** を設定（例: $10/月）
3. **Save** をクリック

### 4.4 メモ

取得したAPIキーをメモしてください：

```
OPENAI_API_KEY=sk-proj-abcdefghijklmnopqrstuvwxyz1234567890
```

---

## ステップ5: 環境変数ファイルの作成

### 5.1 .env.localファイルの作成

プロジェクトルートに `.env.local` ファイルを作成し、以下の内容を記入：

```env
# ============================================
# データベース (Turso)
# ============================================
TURSO_DATABASE_URL=ここにTursoデータベースURLを貼り付け
TURSO_AUTH_TOKEN=ここにTurso認証トークンを貼り付け

# ============================================
# 認証 (BetterAuth)
# ============================================
BETTER_AUTH_SECRET=ここに生成したシークレットキーを貼り付け
BETTER_AUTH_URL=http://localhost:3000

# ============================================
# Google OAuth認証
# ============================================
GOOGLE_CLIENT_ID=ここにGoogleクライアントIDを貼り付け
GOOGLE_CLIENT_SECRET=ここにGoogleクライアントシークレットを貼り付け

# ============================================
# AI機能 (OpenAI) - オプション
# ============================================
OPENAI_API_KEY=ここにOpenAI APIキーを貼り付け（AI機能を使用する場合のみ）

# ============================================
# アプリケーション設定
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5.2 ファイルの保存

`.env.local` ファイルを保存してください。

---

## ステップ6: 動作確認

### 6.1 環境変数の確認

```bash
npm run check-env
```

すべての環境変数が正しく設定されていれば、✅ が表示されます。

### 6.2 アプリケーションの起動

```bash
npm run dev
```

エラーが発生しないことを確認してください。

### 6.3 ブラウザで確認

1. [http://localhost:3000](http://localhost:3000) にアクセス
2. ログインページが表示されることを確認
3. Googleログインが動作するか確認（テストユーザーを追加する必要がある場合があります）

---

## 🎉 完了！

環境変数の設定が完了しました。次はVercelにデプロイできます。

---

## 📚 参考リンク

- [Turso Documentation](https://docs.turso.tech/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [OpenAI API Documentation](https://platform.openai.com/docs)

---

**問題が発生した場合は、`docs/env-setup-guide.md` のトラブルシューティングセクションを参照してください。**

