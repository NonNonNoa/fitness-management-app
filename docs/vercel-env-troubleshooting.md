# Vercel環境変数トラブルシューティングガイド

環境変数を設定しているのにエラーが発生する場合の対処法です。

## 🚨 よくあるエラー

### `TURSO_DATABASE_URL is not set`

このエラーが発生する場合、以下の点を確認してください。

## ✅ 確認手順

### 1. 環境変数のスコープ確認

Vercelでは、環境変数に**スコープ**（適用範囲）を設定する必要があります。

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. プロジェクトを選択
3. **Settings** → **Environment Variables** を開く
4. 各環境変数を確認し、**Environment** 列を確認：
   - ✅ **Production** にチェックが入っているか？
   - ✅ **Preview** にチェックが入っているか？
   - ✅ **Development** にチェックが入っているか？

**重要**: 本番環境で使用する場合は、**Production** に必ずチェックを入れてください。

### 2. 環境変数の値確認

各環境変数の値を確認してください：

#### TURSO_DATABASE_URL
- ✅ `libsql://` で始まっているか？
- ✅ 値が空でないか？
- ✅ スペルミスがないか？（`TURSO_DATABASE_URL` が正しい）

#### TURSO_AUTH_TOKEN
- ✅ 値が空でないか？
- ✅ トークンが有効か？（Tursoダッシュボードで再生成可能）

### 3. 再デプロイの実行

**環境変数を追加/変更した後は、必ず再デプロイが必要です。**

#### 方法1: Vercel Dashboardから再デプロイ

1. Vercel Dashboard → プロジェクトを選択
2. **Deployments** タブを開く
3. 最新のデプロイをクリック
4. **Redeploy** ボタンをクリック
5. **Use existing Build Cache** のチェックを**外す**（推奨）
6. **Redeploy** をクリック

#### 方法2: 空のコミットで再デプロイ

```bash
git commit --allow-empty -m "Trigger redeploy for environment variables"
git push
```

### 4. 環境変数の確認方法

#### Vercel CLIで確認

```bash
# Vercel CLIをインストール（未インストールの場合）
npm i -g vercel

# ログイン
vercel login

# 環境変数を確認
vercel env ls
```

#### デプロイログで確認

1. Vercel Dashboard → **Deployments**
2. 最新のデプロイをクリック
3. **Build Logs** を確認
4. エラーメッセージに環境変数に関する情報が含まれていないか確認

### 5. 環境変数の再設定

環境変数が正しく設定されていない場合、一度削除して再設定してください：

1. Vercel Dashboard → **Settings** → **Environment Variables**
2. 問題のある環境変数を削除
3. 再度追加（値とスコープを確認）
4. **再デプロイ**を実行

## 🔍 デバッグ方法

### ログで環境変数を確認

アプリケーションのコードで環境変数を確認する場合：

```typescript
// 注意: 本番環境では機密情報をログに出力しないでください
console.log('TURSO_DATABASE_URL:', process.env.TURSO_DATABASE_URL ? 'SET' : 'NOT SET');
```

### Vercel Functions ログで確認

1. Vercel Dashboard → **Functions** タブ
2. エラーが発生した関数をクリック
3. **Logs** を確認

## 📋 チェックリスト

環境変数の問題を解決するためのチェックリスト：

- [ ] すべての必須環境変数が設定されている
- [ ] 各環境変数のスコープ（Production/Preview/Development）が正しい
- [ ] 環境変数の値が正しい（空でない、形式が正しい）
- [ ] 環境変数を追加/変更した後に再デプロイを実行した
- [ ] 再デプロイ時に **Use existing Build Cache** のチェックを外した
- [ ] デプロイログでエラーがないか確認した

## 🆘 それでも解決しない場合

### 1. 環境変数の完全な再設定

すべての環境変数を一度削除して、再度設定してください：

1. **Settings** → **Environment Variables**
2. すべての環境変数を削除
3. 再度追加（以下の順序で）：
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `BETTER_AUTH_SECRET`
   - `BETTER_AUTH_URL`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXT_PUBLIC_APP_URL`
4. 各環境変数のスコープを確認
5. **再デプロイ**を実行

### 2. プロジェクトの再インポート

1. Vercel Dashboard → **Settings** → **General**
2. プロジェクトを削除（**注意**: これは最後の手段です）
3. GitHubリポジトリから再度インポート
4. 環境変数を再設定
5. デプロイ

### 3. サポートに問い合わせ

- [Vercel Support](https://vercel.com/support)
- エラーログと環境変数の設定状況を共有

## 📝 環境変数の完全なリスト

### 必須環境変数

```env
TURSO_DATABASE_URL=libsql://your-database-url.turso.io
TURSO_AUTH_TOKEN=your-turso-token
BETTER_AUTH_SECRET=your-secret-key-here-minimum-32-characters
BETTER_AUTH_URL=https://your-project.vercel.app
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

### オプション環境変数

```env
OPENAI_API_KEY=sk-your-openai-api-key
```

## 💡 ベストプラクティス

1. **環境変数の命名規則を統一**: すべて大文字、アンダースコア区切り
2. **スコープを明確に**: Production、Preview、Developmentで適切に設定
3. **機密情報の管理**: 環境変数はGitにコミットしない（`.env.local`は`.gitignore`に追加）
4. **定期的な確認**: デプロイ前に環境変数が正しく設定されているか確認
5. **ドキュメント化**: 環境変数の説明と取得方法をドキュメントに記載

