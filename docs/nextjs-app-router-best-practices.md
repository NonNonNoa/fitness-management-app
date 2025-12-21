# Next.js App Router ベストプラクティス

## 概要

このドキュメントは、Next.js 16 App Routerを使用した開発におけるベストプラクティスをまとめたものです。開発時はこのドキュメントに準拠してください。

## 1. ディレクトリ構成

### 1.1 App Routerの基本構造

```
app/
├── (auth)/              # Route Groups（URLに影響しない）
│   ├── login/
│   │   └── page.tsx
│   └── signup/
│       └── page.tsx
├── (dashboard)/         # Route Groups
│   ├── layout.tsx       # ダッシュボード用レイアウト
│   ├── dashboard/
│   │   └── page.tsx
│   ├── meals/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   └── workouts/
│       └── page.tsx
├── layout.tsx           # ルートレイアウト
├── page.tsx             # ホームページ
├── error.tsx            # エラーページ
├── loading.tsx           # ローディングページ
└── not-found.tsx        # 404ページ
```

### 1.2 ルーティング規則

- **ファイルベースルーティング**: `app/`ディレクトリ内のフォルダ構造がそのままURLパスになる
- **特殊ファイル**:
  - `page.tsx`: ページコンポーネント
  - `layout.tsx`: レイアウトコンポーネント
  - `loading.tsx`: ローディングUI
  - `error.tsx`: エラーUI
  - `not-found.tsx`: 404 UI
  - `route.ts`: API Route（必要に応じて）

### 1.3 Route Groups

- **`(groupName)`**: URLに影響しないグループ化
- 異なるレイアウトを適用したい場合に使用
- 例: `(auth)`と`(dashboard)`で異なるレイアウトを適用

## 2. Server Components vs Client Components

### 2.1 デフォルトはServer Components

```typescript
// app/meals/page.tsx
// デフォルトでServer Component
export default async function MealsPage() {
  const meals = await getMeals(); // サーバーサイドでデータ取得
  return <MealList meals={meals} />;
}
```

### 2.2 Client Componentsが必要な場合

以下の場合のみ`"use client"`を使用：

1. **インタラクティブな機能**（onClick, onChange等）
2. **ブラウザAPI**（localStorage, window等）
3. **状態管理**（useState, useEffect等）
4. **カスタムフック**（useContext等）

```typescript
// components/MealForm.tsx
"use client";

import { useState } from "react";

export function MealForm() {
  const [value, setValue] = useState("");
  return (
    <form>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </form>
  );
}
```

### 2.3 コンポーネントの分割戦略

- **Server Component**: データフェッチ、SEO重要部分
- **Client Component**: インタラクティブな部分のみ
- **境界の明確化**: Client Componentは必要最小限に

```typescript
// ✅ 良い例: Server Componentでデータ取得、Client Componentでインタラクション
// app/meals/page.tsx (Server Component)
export default async function MealsPage() {
  const meals = await getMeals();
  return <MealList meals={meals} />;
}

// components/MealList.tsx (Client Component)
"use client";
export function MealList({ meals }: { meals: Meal[] }) {
  const [filter, setFilter] = useState("");
  // インタラクティブな機能
}
```

## 3. データフェッチング

### 3.1 Server Componentsでのデータ取得

```typescript
// app/meals/page.tsx
export default async function MealsPage() {
  // サーバーサイドで直接データ取得
  const meals = await getMeals();
  
  return (
    <div>
      {meals.map(meal => (
        <MealCard key={meal.id} meal={meal} />
      ))}
    </div>
  );
}
```

### 3.2 キャッシュ戦略

```typescript
// デフォルト: 自動キャッシュ（force-cache）
const data = await fetch("https://api.example.com/data");

// 動的データ: キャッシュしない
const data = await fetch("https://api.example.com/data", {
  cache: "no-store",
});

// 時間ベースの再検証
const data = await fetch("https://api.example.com/data", {
  next: { revalidate: 3600 }, // 1時間ごとに再検証
});

// タグベースの再検証
const data = await fetch("https://api.example.com/data", {
  next: { tags: ["meals"] },
});

// 後で再検証
import { revalidateTag } from "next/cache";
revalidateTag("meals");
```

### 3.3 並列データフェッチング

```typescript
// Promise.allで並列実行
export default async function DashboardPage() {
  const [meals, workouts, goals] = await Promise.all([
    getMeals(),
    getWorkouts(),
    getGoals(),
  ]);
  
  return <Dashboard meals={meals} workouts={workouts} goals={goals} />;
}
```

### 3.4 ストリーミングとSuspense

```typescript
import { Suspense } from "react";

export default function Page() {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <MealList />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <WorkoutList />
      </Suspense>
    </div>
  );
}

async function MealList() {
  const meals = await getMeals(); // 非同期処理
  return <div>{/* ... */}</div>;
}
```

## 4. Server Actions

### 4.1 Server Actionsの定義

```typescript
// app/actions/meals.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createMeal(formData: FormData) {
  const mealData = {
    mealDate: formData.get("mealDate") as string,
    calories: Number(formData.get("calories")),
  };
  
  // バリデーション
  if (!mealData.mealDate || !mealData.calories) {
    return { success: false, error: "必須項目が入力されていません" };
  }
  
  try {
    // データベース操作
    const meal = await db.insert(meals).values(mealData);
    
    // キャッシュの再検証
    revalidatePath("/meals");
    
    return { success: true, mealId: meal.id };
  } catch (error) {
    return { success: false, error: "食事記録の作成に失敗しました" };
  }
}
```

### 4.2 Server Actionsの使用

```typescript
// app/meals/new/page.tsx
import { createMeal } from "@/app/actions/meals";

export default function NewMealPage() {
  return (
    <form action={createMeal}>
      <input name="mealDate" type="date" required />
      <input name="calories" type="number" required />
      <button type="submit">作成</button>
    </form>
  );
}
```

### 4.3 プログレッシブエンハンスメント

```typescript
"use client";

import { useTransition } from "react";
import { createMeal } from "@/app/actions/meals";

export function MealForm() {
  const [isPending, startTransition] = useTransition();
  
  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createMeal(formData);
      if (result.success) {
        // 成功時の処理
      }
    });
  }
  
  return (
    <form action={handleSubmit}>
      {/* ... */}
      <button type="submit" disabled={isPending}>
        {isPending ? "作成中..." : "作成"}
      </button>
    </form>
  );
}
```

## 5. ルーティングとナビゲーション

### 5.1 Linkコンポーネント

```typescript
import Link from "next/link";

// 基本的な使用
<Link href="/meals">食事管理</Link>

// 動的ルート
<Link href={`/meals/${mealId}`}>詳細</Link>

// プリフェッチの無効化（必要に応じて）
<Link href="/meals" prefetch={false}>食事管理</Link>
```

### 5.2 useRouter（Client Components）

```typescript
"use client";

import { useRouter } from "next/navigation";

export function NavigationButton() {
  const router = useRouter();
  
  function handleClick() {
    router.push("/meals");
    // または
    router.replace("/meals");
    // または
    router.refresh();
  }
  
  return <button onClick={handleClick}>移動</button>;
}
```

### 5.3 動的ルート

```typescript
// app/meals/[id]/page.tsx
export default async function MealDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const meal = await getMeal(params.id);
  
  if (!meal) {
    notFound(); // not-found.tsxを表示
  }
  
  return <MealDetail meal={meal} />;
}
```

## 6. メタデータとSEO

### 6.1 静的メタデータ

```typescript
// app/meals/page.tsx
export const metadata = {
  title: "食事管理",
  description: "日々の食事を記録・管理",
};

export default function MealsPage() {
  // ...
}
```

### 6.2 動的メタデータ

```typescript
// app/meals/[id]/page.tsx
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const meal = await getMeal(params.id);
  
  return {
    title: meal?.name || "食事詳細",
    description: meal?.description,
  };
}
```

### 6.3 Open Graph

```typescript
export const metadata: Metadata = {
  openGraph: {
    title: "食事管理",
    description: "日々の食事を記録・管理",
    images: ["/og-image.png"],
  },
};
```

## 7. エラーハンドリング

### 7.1 error.tsx

```typescript
// app/meals/error.tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>エラーが発生しました</h2>
      <p>{error.message}</p>
      <button onClick={reset}>再試行</button>
    </div>
  );
}
```

### 7.2 not-found.tsx

```typescript
// app/meals/[id]/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h2>食事記録が見つかりません</h2>
      <Link href="/meals">一覧に戻る</Link>
    </div>
  );
}
```

### 7.3 loading.tsx

```typescript
// app/meals/loading.tsx
export default function Loading() {
  return (
    <div>
      <div className="animate-pulse">読み込み中...</div>
    </div>
  );
}
```

## 8. ミドルウェア

### 8.1 middleware.ts

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 認証チェック
  const token = request.cookies.get("auth-token");
  
  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/meals/:path*",
    "/workouts/:path*",
  ],
};
```

## 9. パフォーマンス最適化

### 9.1 画像最適化

```typescript
import Image from "next/image";

<Image
  src="/meal-image.jpg"
  alt="食事"
  width={500}
  height={300}
  priority // 重要画像の場合
  placeholder="blur" // ブラー効果
/>
```

### 9.2 動的インポート

```typescript
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <LoadingSpinner />,
  ssr: false, // サーバーサイドレンダリングを無効化
});
```

### 9.3 フォント最適化

```typescript
// app/layout.tsx
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

## 10. 型安全性

### 10.1 型定義

```typescript
// types/meal.ts
export type Meal = {
  id: string;
  userId: string;
  mealDate: string;
  calories: number;
  createdAt: Date;
};

// app/meals/page.tsx
import type { Meal } from "@/types/meal";

export default async function MealsPage() {
  const meals: Meal[] = await getMeals();
  // ...
}
```

### 10.2 Server Actionsの型

```typescript
"use server";

export async function createMeal(
  formData: FormData
): Promise<{ success: boolean; mealId?: string; error?: string }> {
  // ...
}
```

## 11. 開発時の注意事項

### 11.1 禁止事項

- ❌ Client Componentから直接データベースにアクセス
- ❌ Server ComponentでブラウザAPIを使用
- ❌ `use client`を不必要に使用
- ❌ 大きなClient Component（小さく分割）

### 11.2 推奨事項

- ✅ Server Componentsをデフォルトで使用
- ✅ データフェッチはServer Componentsで
- ✅ インタラクションはClient Componentsで
- ✅ 適切なキャッシュ戦略の使用
- ✅ エラーハンドリングの実装
- ✅ 型安全性の確保

## 12. 参考リソース

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)

---

**最終更新日**: 2024年
**バージョン**: Next.js 16.1.0





