# 環境変数チェックリスト

Vercelデプロイ前に、すべての環境変数が正しく設定されているか確認してください。

## ✅ チェックリスト

### ローカル開発環境

- [ ] `.env.local` ファイルが存在する
- [ ] `TURSO_DATABASE_URL` が設定されている（`libsql://` で始まる）
- [ ] `TURSO_AUTH_TOKEN` が設定されている（空でない）
- [ ] `BETTER_AUTH_SECRET` が設定されている（32文字以上）
- [ ] `BETTER_AUTH_URL` が `http://localhost:3000` に設定されている
- [ ] `GOOGLE_CLIENT_ID` が設定されている（`.apps.googleusercontent.com` で終わる）
- [ ] `GOOGLE_CLIENT_SECRET` が設定されている（空でない）
- [ ] `NEXT_PUBLIC_APP_URL` が `http://localhost:3000` に設定されている
- [ ] `OPENAI_API_KEY` が設定されている（AI機能を使用する場合）

### Vercel本番環境

- [ ] Vercelダッシュボードで環境変数が設定されている
- [ ] `TURSO_DATABASE_URL` が本番用データベースのURLに設定されている
- [ ] `TURSO_AUTH_TOKEN` が本番用トークンに設定されている
- [ ] `BETTER_AUTH_SECRET` が設定されている（ローカルとは異なる値推奨）
- [ ] `BETTER_AUTH_URL` が実際のVercel URLに設定されている（例: `https://your-project.vercel.app`）
- [ ] `GOOGLE_CLIENT_ID` が設定されている
- [ ] `GOOGLE_CLIENT_SECRET` が設定されている
- [ ] `NEXT_PUBLIC_APP_URL` が実際のVercel URLに設定されている
- [ ] `OPENAI_API_KEY` が設定されている（AI機能を使用する場合）
- [ ] すべての環境変数が **Production** 環境に設定されている
- [ ] 必要に応じて **Preview** と **Development** 環境にも設定されている

### Google OAuth設定

- [ ] Google Cloud ConsoleでOAuth 2.0認証情報が作成されている
- [ ] 承認済みのリダイレクトURIに以下が追加されている:
  - [ ] `http://localhost:3000/api/auth/callback/google` (ローカル)
  - [ ] `https://your-project.vercel.app/api/auth/callback/google` (本番)

### データベース

- [ ] Tursoデータベースが作成されている
- [ ] データベースURLが正しい
- [ ] 認証トークンが有効
- [ ] データベーススキーマが適用されている（初回デプロイ時）

## 🔍 環境変数の確認方法

### ローカル環境

```bash
# 環境変数チェックスクリプトを実行
npm run check-env
```

### Vercel環境

1. Vercelダッシュボードにアクセス
2. プロジェクトを選択
3. **Settings > Environment Variables** を確認
4. すべての必須環境変数が表示されているか確認

## 📝 環境変数の値の例

### 正しい形式

```env
TURSO_DATABASE_URL=libsql://fitness-app-db-xxxxx.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
BETTER_AUTH_SECRET=AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
BETTER_AUTH_URL=https://your-project.vercel.app
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
OPENAI_API_KEY=sk-proj-abcdefghijklmnopqrstuvwxyz1234567890
```

### 間違った形式（設定しない）

```env
# ❌ デフォルト値のまま
TURSO_DATABASE_URL=libsql://your-database-url
TURSO_AUTH_TOKEN=your-turso-token

# ❌ 空の値
BETTER_AUTH_SECRET=

# ❌ ローカルURLのまま（本番環境）
BETTER_AUTH_URL=http://localhost:3000
```

## 🚨 よくあるエラー

### "Environment variable not found"

- 環境変数名が正しいか確認（大文字小文字を区別）
- `.env.local` ファイルがプロジェクトルートにあるか確認
- アプリケーションを再起動

### "Database connection failed"

- `TURSO_DATABASE_URL` が正しい形式か確認（`libsql://` で始まる）
- `TURSO_AUTH_TOKEN` が有効か確認
- Tursoダッシュボードでデータベースがアクティブか確認

### "Google OAuth error"

- `GOOGLE_CLIENT_ID` と `GOOGLE_CLIENT_SECRET` が正しいか確認
- Google Cloud ConsoleでリダイレクトURIが正しく設定されているか確認
- OAuth同意画面が正しく設定されているか確認

## 📚 詳細なセットアップ手順

詳細なセットアップ手順は `docs/env-setup-guide.md` を参照してください。

---

**すべてのチェック項目が完了したら、Vercelにデプロイできます！**


