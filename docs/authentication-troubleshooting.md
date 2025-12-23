# 認証・セッション管理 トラブルシューティングガイド

## 📋 目次

- [概要](#概要)
- [BetterAuthのセッション管理の仕組み](#betterauthのセッション管理の仕組み)
- [よくある問題と解決策](#よくある問題と解決策)
- [デバッグ方法](#デバッグ方法)
- [参考資料](#参考資料)

---

## 概要

このドキュメントでは、BetterAuthを使用した認証システムにおけるセッション管理の問題とその解決方法を説明します。

### 主な問題

1. **ログイン後にダッシュボードにリダイレクトされない**
2. **画面遷移時にログイン画面が開く（セッションが失われる）**
3. **保護されたルートにアクセスできない**

---

## BetterAuthのセッション管理の仕組み

### セッションの保存方法

BetterAuthは2つの方法でセッションを管理します：

1. **データベース（Turso）**
   - `sessions`テーブルにセッション情報を保存
   - `token`: セッショントークン（一意）
   - `userId`: ユーザーID
   - `expiresAt`: 有効期限（デフォルト: 7日間）

2. **ブラウザのクッキー**
   - セッショントークンをクッキーに保存
   - **HTTP環境**: `better-auth.session_token`
   - **HTTPS環境**: `__Secure-better-auth.session_token`（`__Secure-`プレフィックス付き）

### OAuth認証フロー

```
1. ユーザーが「Googleでログイン」をクリック
   ↓
2. signIn.social() が Googleの認証URLを返す
   ↓
3. ブラウザが Googleの認証ページにリダイレクト
   ↓
4. ユーザーが Googleで認証
   ↓
5. Googleが /api/auth/callback/google にリダイレクト
   ↓
6. BetterAuthがコールバックを処理
   - セッションをデータベースに保存
   - セッションクッキーを設定（Set-Cookieヘッダー）
   ↓
7. BetterAuthの callbacks.onOAuthCallback.redirect.onSuccess が実行
   - /dashboard にリダイレクト
```

### 重要な設定ファイル

#### `lib/auth/index.ts` - BetterAuthの設定

```typescript
export const auth = betterAuth({
  // セッション設定
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7日間
    updateAge: 60 * 60 * 24, // 1日ごとに更新
  },
  
  // OAuthコールバック後のリダイレクト設定
  callbacks: {
    onOAuthCallback: {
      redirect: {
        onSuccess: "/dashboard",  // 成功時
        onError: "/login",         // エラー時
      },
    },
  },
});
```

#### `middleware.ts` - ルート保護

```typescript
// セッションクッキーを確認
const sessionToken = 
  request.cookies.get("__Secure-better-auth.session_token")?.value ||  // HTTPS環境用
  request.cookies.get("better-auth.session_token")?.value ||         // HTTP環境用
  request.cookies.get("better-auth.session-token")?.value ||
  request.cookies.get("better_auth_session_token")?.value;
```

---

## よくある問題と解決策

### 問題1: ログイン後にダッシュボードにリダイレクトされない

#### 症状

- Googleでログイン後、`/login`ページに戻ってくる
- ダッシュボードに遷移しない

#### 原因

1. **ログインページのリダイレクト処理が複雑すぎる**
   - BetterAuthの自動リダイレクトと競合している
   - 複数のリダイレクト処理が混在している

2. **BetterAuthのコールバック設定が正しくない**
   - `callbacks.onOAuthCallback.redirect.onSuccess`が設定されていない

#### 解決策

**ログインページのリダイレクト処理を簡素化**

```typescript:app/(auth)/login/page.tsx
const handleGoogleSignIn = async () => {
  // ... エラーハンドリング ...
  
  // OAuthプロバイダーへのリダイレクトのみ処理
  if (data.redirect && (data.url || data.redirectUrl)) {
    const redirectUrl = data.url || data.redirectUrl;
    if (redirectUrl && typeof redirectUrl === "string") {
      // シンプルにGoogleの認証ページにリダイレクト
      window.location.href = redirectUrl;
      return;  // ここで処理を停止
    }
  }
  
  // コールバック後のリダイレクトはBetterAuthが自動的に処理
};
```

**BetterAuthの設定を確認**

```typescript:lib/auth/index.ts
callbacks: {
  onOAuthCallback: {
    redirect: {
      onSuccess: "/dashboard",  // 必ず設定する
      onError: "/login",
    },
  },
},
```

---

### 問題2: 画面遷移時にログイン画面が開く（セッションが失われる）

#### 症状

- ログイン後、`/meals`や`/workouts`などの保護されたルートにアクセスできない
- 毎回ログイン画面が表示される

#### 原因

1. **ミドルウェアがセッションクッキーを検出できない**
   - HTTPS環境では`__Secure-better-auth.session_token`という名前のクッキーが使用される
   - ミドルウェアが`better-auth.session_token`のみをチェックしている

2. **クッキーの属性が原因で送信されない**
   - `SameSite`、`Secure`、`Domain`の設定が不適切

#### 解決策

**ミドルウェアで複数のクッキー名をチェック**

```typescript:middleware.ts
// BetterAuthのセッションクッキーを確認
// HTTPS環境では "__Secure-better-auth.session_token" が使用される
const sessionToken = 
  request.cookies.get("__Secure-better-auth.session_token")?.value ||  // HTTPS環境用
  request.cookies.get("better-auth.session_token")?.value ||            // HTTP環境用
  request.cookies.get("__Secure-better-auth.session-token")?.value ||
  request.cookies.get("better-auth.session-token")?.value ||
  request.cookies.get("better_auth_session_token")?.value;
```

**クッキーの設定を確認**

BetterAuthは自動的に適切なクッキー属性を設定しますが、環境変数が正しく設定されているか確認してください：

```env
BETTER_AUTH_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

---

### 問題3: セッションクッキーが設定されない

#### 症状

- ログイン後もクッキーがブラウザに保存されない
- セッションが維持されない

#### 原因

1. **BetterAuthの設定が不適切**
   - `baseURL`が正しく設定されていない
   - `trustedOrigins`に現在のURLが含まれていない

2. **環境変数が設定されていない**
   - `BETTER_AUTH_SECRET`が設定されていない
   - `BETTER_AUTH_URL`が設定されていない

#### 解決策

**BetterAuthの設定を確認**

```typescript:lib/auth/index.ts
export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || "...",
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  basePath: "/api/auth",
  
  // trustedOriginsに現在のURLを含める
  trustedOrigins: (() => {
    const origins: string[] = [];
    
    if (process.env.NODE_ENV !== "production") {
      origins.push("http://localhost:3000");
    }
    
    if (process.env.BETTER_AUTH_URL) {
      origins.push(process.env.BETTER_AUTH_URL);
    }
    
    if (process.env.VERCEL_URL) {
      origins.push(`https://${process.env.VERCEL_URL}`);
    }
    
    if (process.env.NEXT_PUBLIC_APP_URL) {
      origins.push(process.env.NEXT_PUBLIC_APP_URL);
    }
    
    return [...new Set(origins)];
  })(),
});
```

**環境変数を確認**

```bash
# 必須の環境変数
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

---

## デバッグ方法

### 1. ブラウザの開発者ツールで確認

#### Application タブ → Cookies

- セッションクッキーが存在するか確認
- クッキー名: `__Secure-better-auth.session_token`（HTTPS環境）または`better-auth.session_token`（HTTP環境）
- 属性（SameSite、Secure、Domain、Path）を確認

#### Network タブ

1. `/api/auth/callback/google`へのリクエストを確認
   - Response Headersの`Set-Cookie`ヘッダーを確認
   - セッションクッキーが設定されているか確認

2. `/dashboard`へのリクエストを確認
   - Request Headersの`Cookie`ヘッダーを確認
   - セッションクッキーが送信されているか確認

### 2. サーバーログで確認

#### VercelのFunction Logs

1. Vercelダッシュボード → プロジェクト → Functions
2. `/api/auth/callback/google`の実行ログを確認
3. エラーがないか確認

### 3. コンソールログで確認

ログインページにデバッグログを追加：

```typescript
console.log("Sign in result:", result);
console.log("Result data:", result?.data);
console.log("Redirecting to OAuth provider:", redirectUrl);
```

---

## チェックリスト

問題が発生した場合、以下を確認してください：

### 環境変数

- [ ] `BETTER_AUTH_SECRET`が設定されている
- [ ] `BETTER_AUTH_URL`が正しく設定されている（HTTPS）
- [ ] `NEXT_PUBLIC_APP_URL`が正しく設定されている
- [ ] `GOOGLE_CLIENT_ID`が設定されている
- [ ] `GOOGLE_CLIENT_SECRET`が設定されている

### BetterAuthの設定

- [ ] `lib/auth/index.ts`の`baseURL`が正しく設定されている
- [ ] `callbacks.onOAuthCallback.redirect.onSuccess`が設定されている
- [ ] `trustedOrigins`に現在のURLが含まれている

### ミドルウェア

- [ ] `middleware.ts`で`__Secure-better-auth.session_token`をチェックしている
- [ ] 保護されたルートが正しく定義されている

### ログインページ

- [ ] リダイレクト処理が簡素化されている
- [ ] BetterAuthの自動リダイレクトに任せている

---

## 参考資料

- [BetterAuth公式ドキュメント](https://www.better-auth.com/docs)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Vercel環境変数の設定](https://vercel.com/docs/concepts/projects/environment-variables)

---

## まとめ

### 重要なポイント

1. **ログインページはOAuthプロバイダーへのリダイレクトのみを担当**
   - コールバック後のリダイレクトはBetterAuthの`callbacks.onOAuthCallback.redirect`に任せる

2. **ミドルウェアで複数のクッキー名をチェック**
   - HTTPS環境では`__Secure-better-auth.session_token`が使用される
   - HTTP環境では`better-auth.session_token`が使用される

3. **環境変数を正しく設定**
   - `BETTER_AUTH_URL`と`NEXT_PUBLIC_APP_URL`を設定する
   - `trustedOrigins`に現在のURLを含める

4. **デバッグツールを活用**
   - ブラウザの開発者ツールでクッキーとネットワークリクエストを確認
   - サーバーログでエラーを確認

これらのポイントを守ることで、認証とセッション管理の問題を回避できます。

