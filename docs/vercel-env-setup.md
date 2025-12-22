# Vercel環境変数設定ガイド

Vercelでビルドエラーを解決するために、環境変数を設定する必要があります。

## 🚨 エラー内容

```
Error [LibsqlError]: URL_INVALID: The URL 'undefined' is not in a valid format
```

このエラーは、Vercelビルド時に環境変数が設定されていないために発生します。

## ✅ 解決方法

### ステップ1: Vercelダッシュボードにアクセス

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. デプロイしたプロジェクトを選択

### ステップ2: 環境変数を設定

1. **Settings** タブをクリック
2. 左側メニューから **Environment Variables** を選択
3. 以下の環境変数を追加：

#### 必須環境変数

| 変数名 | 値 | 環境 |
|--------|-----|------|
| `TURSO_DATABASE_URL` | `libsql://your-database-url.turso.io` | Production, Preview, Development |
| `TURSO_AUTH_TOKEN` | `your-turso-token` | Production, Preview, Development |
| `BETTER_AUTH_SECRET` | `your-secret-key-here` | Production, Preview, Development |
| `BETTER_AUTH_URL` | `https://your-project.vercel.app` | Production, Preview, Development |
| `GOOGLE_CLIENT_ID` | `your-google-client-id` | Production, Preview, Development |
| `GOOGLE_CLIENT_SECRET` | `your-google-client-secret` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` | Production, Preview, Development |

#### オプション環境変数

| 変数名 | 値 | 環境 |
|--------|-----|------|
| `OPENAI_API_KEY` | `your-openai-api-key` | Production, Preview, Development |

### ステップ3: 環境変数の追加方法

各環境変数を追加する手順：

1. **Key** フィールドに変数名を入力（例: `TURSO_DATABASE_URL`）
2. **Value** フィールドに実際の値を入力
3. **Environment** で適用する環境を選択：
   - ✅ Production（本番環境）
   - ✅ Preview（プレビュー環境）
   - ✅ Development（開発環境）
4. **Save** をクリック

### ステップ4: 重要事項

#### BETTER_AUTH_URL と NEXT_PUBLIC_APP_URL の更新

デプロイ後、Vercelが提供するURLに更新してください：

1. デプロイが完了したら、Vercelが提供するURLを確認（例: `https://fitness-management-app.vercel.app`）
2. `BETTER_AUTH_URL` と `NEXT_PUBLIC_APP_URL` をそのURLに更新
3. 環境変数を保存

### ステップ5: 再デプロイ

環境変数を設定した後、再デプロイ：

1. **Deployments** タブをクリック
2. 最新のデプロイを選択
3. **Redeploy** をクリック
4. **Use existing Build Cache** のチェックを外す（推奨）
5. **Redeploy** をクリック

または、CLIから：

```bash
vercel --prod
```

## 🔍 環境変数の確認

### 設定が正しいか確認

1. **Settings > Environment Variables** で、すべての環境変数が表示されているか確認
2. 各環境変数の値が正しいか確認（特にURLやトークン）

### デプロイログの確認

1. **Deployments** タブをクリック
2. 最新のデプロイを選択
3. **Build Logs** を確認
4. エラーが解消されているか確認

## 🐛 トラブルシューティング

### エラーが続く場合

1. **環境変数の値が正しいか確認**
   - `TURSO_DATABASE_URL` は `libsql://` で始まるか
   - `TURSO_AUTH_TOKEN` が空でないか
   - `BETTER_AUTH_URL` が実際のVercel URLと一致しているか

2. **環境変数がすべての環境に設定されているか確認**
   - Production
   - Preview
   - Development

3. **再デプロイを実行**
   - 環境変数を設定した後、必ず再デプロイしてください

### データベース接続エラー

- Tursoダッシュボードでデータベースがアクティブか確認
- データベースURLとトークンが正しいか確認

### Google OAuthエラー

- Google Cloud ConsoleでリダイレクトURIが正しく設定されているか確認
- `BETTER_AUTH_URL` が実際のVercel URLと一致しているか確認

---

**環境変数を設定して再デプロイすれば、ビルドエラーが解消されます！**


