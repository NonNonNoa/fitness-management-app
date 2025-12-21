# 開発ガイドライン

## 重要: ベストプラクティスへの準拠

**開発時は以下のドキュメントに必ず準拠してください：**

1. **[Next.js App Router ベストプラクティス](./nextjs-app-router-best-practices.md)**
   - Server ComponentsとClient Componentsの使い分け
   - データフェッチングの方法
   - Server Actionsの実装
   - エラーハンドリング
   - その他のApp Routerのベストプラクティス

2. **[BetterAuth ユーザースキーマ](./betterauth-user-schema.md)**
   - データベーススキーマの定義
   - 必須テーブルとカラム
   - マイグレーション方法
   - セキュリティ考慮事項

これらのドキュメントに記載されている内容は、このプロジェクトの開発標準です。必ず遵守してください。

## コーディング規約

### TypeScript

#### 型定義
- すべての関数、変数に型を明示
- `any`の使用を避ける
- インターフェースとタイプエイリアスを適切に使用

```typescript
// 良い例
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  // ...
}

// 悪い例
function getUser(id: any): any {
  // ...
}
```

#### 命名規則
- **変数・関数**: camelCase
- **コンポーネント**: PascalCase
- **定数**: UPPER_SNAKE_CASE
- **型・インターフェース**: PascalCase

```typescript
// 変数
const userName = "John";
const maxRetries = 3;

// 関数
function calculateTotal(items: Item[]): number {
  // ...
}

// コンポーネント
function UserProfile({ user }: { user: User }) {
  // ...
}

// 定数
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// 型
type MealType = "breakfast" | "lunch" | "dinner" | "snack";
```

### React

#### コンポーネント設計
- **関数コンポーネント**: 関数コンポーネントを使用
- **Server Components**: デフォルトでServer Componentsを使用
- **Client Components**: インタラクティブな機能が必要な場合のみ使用

```typescript
// Server Component (デフォルト)
export default async function MealList() {
  const meals = await getMeals();
  return <div>{/* ... */}</div>;
}

// Client Component (必要に応じて)
"use client";
export default function MealForm() {
  const [value, setValue] = useState("");
  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
}
```

#### Props
- Propsの型を明示
- デフォルト値を使用可能な場合は使用

```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

function Button({ label, onClick, variant = "primary", disabled = false }: ButtonProps) {
  // ...
}
```

#### Hooks
- カスタムフックは`use`で始める
- Hooksのルールを遵守

```typescript
function useMeals(userId: string) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // ...
  }, [userId]);
  
  return { meals, loading };
}
```

### ファイル構造

#### ディレクトリ命名
- **小文字**: ディレクトリ名は小文字
- **ハイフン区切り**: 複数単語はハイフンで区切る

```
app/
├── (auth)/
├── (dashboard)/
│   ├── meals/
│   ├── workouts/
│   └── goals/
└── components/
    ├── ui/
    ├── meals/
    └── workouts/
```

#### ファイル命名
- **コンポーネント**: PascalCase（例: `MealForm.tsx`）
- **ユーティリティ**: camelCase（例: `formatDate.ts`）
- **型定義**: PascalCase（例: `types.ts`）

### インポート順序

1. React関連
2. 外部ライブラリ
3. 内部コンポーネント
4. ユーティリティ
5. 型定義
6. スタイル

```typescript
// 1. React関連
import { useState, useEffect } from "react";

// 2. 外部ライブラリ
import { format } from "date-fns";

// 3. 内部コンポーネント
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

// 4. ユーティリティ
import { calculateCalories } from "@/lib/utils/calculations";

// 5. 型定義
import type { Meal } from "@/types";

// 6. スタイル
import styles from "./MealForm.module.css";
```

## データベース

### クエリ
- **パラメータ化クエリ**: SQLインジェクション対策
- **トランザクション**: 複数の操作はトランザクションで囲む
- **エラーハンドリング**: 適切なエラーハンドリング

```typescript
// 良い例
async function createMeal(userId: string, mealData: MealData) {
  try {
    await db.transaction(async (tx) => {
      const meal = await tx.insert(meals).values({
        userId,
        ...mealData,
      });
      
      for (const item of mealData.items) {
        await tx.insert(mealItems).values({
          mealId: meal.id,
          ...item,
        });
      }
    });
  } catch (error) {
    console.error("Failed to create meal:", error);
    throw error;
  }
}
```

### マイグレーション
- **バージョン管理**: すべてのスキーマ変更をマイグレーションで管理
- **ロールバック**: ロールバック可能なマイグレーション

## API設計

### Server Actions
- **命名規則**: 動詞で始める（`create`, `get`, `update`, `delete`）
- **エラーハンドリング**: 統一されたエラーレスポンス
- **バリデーション**: 入力値のバリデーション

```typescript
"use server";

export async function createMeal(formData: FormData) {
  // バリデーション
  const mealData = {
    mealDate: formData.get("mealDate") as string,
    // ...
  };
  
  if (!mealData.mealDate) {
    return { success: false, error: "食事日が必須です" };
  }
  
  try {
    // データベース操作
    const meal = await db.insert(meals).values(mealData);
    return { success: true, mealId: meal.id };
  } catch (error) {
    console.error("Failed to create meal:", error);
    return { success: false, error: "食事記録の作成に失敗しました" };
  }
}
```

## エラーハンドリング

### エラー処理パターン
- **try-catch**: 非同期処理はtry-catchで囲む
- **エラーメッセージ**: ユーザーフレンドリーなエラーメッセージ
- **ログ**: 開発環境では詳細なログを出力

```typescript
try {
  const result = await someAsyncOperation();
  return { success: true, data: result };
} catch (error) {
  console.error("Operation failed:", error);
  
  if (error instanceof ValidationError) {
    return { success: false, error: error.message };
  }
  
  return { success: false, error: "操作に失敗しました" };
}
```

## テスト

### テストファイル
- **命名**: `*.test.ts` または `*.spec.ts`
- **場所**: テスト対象ファイルと同じディレクトリまたは`__tests__`ディレクトリ

```typescript
// MealForm.test.tsx
import { render, screen } from "@testing-library/react";
import { MealForm } from "./MealForm";

describe("MealForm", () => {
  it("renders meal form", () => {
    render(<MealForm />);
    expect(screen.getByLabelText("食事日")).toBeInTheDocument();
  });
});
```

## パフォーマンス

### 最適化
- **コード分割**: 動的インポートを使用
- **画像最適化**: Next.js Imageを使用
- **キャッシュ**: 適切なキャッシュ戦略

```typescript
// 動的インポート
const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});
```

### データフェッチ
- **Server Components**: 可能な限りServer Componentsでデータフェッチ
- **キャッシュ**: 適切なキャッシュ設定

```typescript
// Server Componentでのデータフェッチ
export default async function MealList() {
  const meals = await getMeals(); // 自動的にキャッシュされる
  return <MealListComponent meals={meals} />;
}
```

## セキュリティ

### 認証
- **認証チェック**: すべてのServer Actionで認証チェック
- **ユーザー検証**: 他ユーザーのデータにアクセスできないように

```typescript
"use server";

export async function getMeals(userId: string) {
  const session = await auth();
  if (!session || session.user.id !== userId) {
    throw new Error("Unauthorized");
  }
  
  return await db.select().from(meals).where(eq(meals.userId, userId));
}
```

### 入力値検証
- **バリデーション**: すべての入力値をバリデーション
- **サニタイゼーション**: XSS対策

```typescript
import { z } from "zod";

const mealSchema = z.object({
  mealDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  calories: z.number().min(0).max(10000),
});

export async function createMeal(data: unknown) {
  const validated = mealSchema.parse(data);
  // ...
}
```

## Git

### コミットメッセージ
- **形式**: `type: description`
- **タイプ**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

```
feat: 食事記録機能を追加
fix: トレーニング記録のバグを修正
docs: API設計書を更新
```

### ブランチ戦略
- **main**: 本番環境
- **develop**: 開発環境
- **feature/**: 機能開発
- **fix/**: バグ修正

```
feature/meal-tracking
fix/workout-form-validation
```

## ドキュメント

### コメント
- **関数**: JSDocコメント
- **複雑なロジック**: 説明コメント

```typescript
/**
 * 食事のカロリーを計算します
 * @param items - 食事アイテムの配列
 * @returns 総カロリー
 */
function calculateTotalCalories(items: MealItem[]): number {
  return items.reduce((total, item) => total + item.calories, 0);
}
```

## レビュー

### コードレビュー
- **必須**: すべてのPRはレビューが必要
- **フィードバック**: 建設的なフィードバック
- **承認**: 最低1人の承認が必要

### チェックリスト
- [ ] コードが動作する
- [ ] テストが通る
- [ ] 型エラーがない
- [ ] リンターエラーがない
- [ ] ドキュメントが更新されている

