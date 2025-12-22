g# API設計書

## 概要

Next.js App RouterのServer ActionsとAPI Routesを使用したAPI設計。

## 認証

### BetterAuth統合
- すべてのAPIエンドポイントは認証が必要
- セッション管理はBetterAuthが担当

## Server Actions

### 食事管理

#### `createMeal(userId, mealData)`
新しい食事記録を作成。

**パラメータ**:
```typescript
{
  userId: string;
  mealData: {
    mealDate: string; // YYYY-MM-DD
    mealTime?: string; // HH:mm
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    items: Array<{
      foodName: string;
      quantity: number;
      unit: string;
      calories: number;
      protein?: number;
      carbs?: number;
      fats?: number;
    }>;
    imageUrl?: string;
    notes?: string;
  };
}
```

**戻り値**: `{ success: boolean; mealId?: string; error?: string }`

#### `getMeals(userId, startDate, endDate)`
期間内の食事記録を取得。

**パラメータ**:
```typescript
{
  userId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}
```

**戻り値**: `Meal[]`

#### `updateMeal(mealId, mealData)`
食事記録を更新。

#### `deleteMeal(mealId)`
食事記録を削除。

#### `analyzeMealImage(imageFile)`
AIによる食事画像解析。

**パラメータ**:
```typescript
{
  imageFile: File;
}
```

**戻り値**: 
```typescript
{
  success: boolean;
  analysis?: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    items: Array<{
      foodName: string;
      quantity: number;
      calories: number;
    }>;
  };
  error?: string;
}
```

### トレーニング管理

#### `createWorkout(userId, workoutData)`
新しいトレーニングセッションを作成。

**パラメータ**:
```typescript
{
  userId: string;
  workoutData: {
    workoutDate: string; // YYYY-MM-DD
    sets: Array<{
      exerciseId: string;
      setNumber: number;
      weightKg: number;
      reps: number;
      restSeconds?: number;
      rpe?: number;
      notes?: string;
    }>;
    durationMinutes?: number;
    notes?: string;
  };
}
```

**戻り値**: `{ success: boolean; workoutId?: string; error?: string }`

#### `getWorkouts(userId, startDate, endDate)`
期間内のトレーニング記録を取得。

#### `updateWorkout(workoutId, workoutData)`
トレーニング記録を更新。

#### `deleteWorkout(workoutId)`
トレーニング記録を削除。

#### `getExercises(filters?)`
種目一覧を取得（フィルタリング可能）。

**パラメータ**:
```typescript
{
  bodyPart?: string;
  difficulty?: string;
  equipment?: string;
  search?: string;
}
```

**戻り値**: `Exercise[]`

#### `getExerciseHistory(userId, exerciseId, limit?)`
特定種目の履歴を取得。

### 目標管理

#### `createGoal(data)`
新しい目標を作成。目標タイプによって使用するパラメータが異なる。

**パラメータ**:
```typescript
{
  goalType: 'muscle_gain' | 'weight_loss' | 'weight_gain' | 'strength';
  startDate: string;      // YYYY-MM-DD
  targetDate?: string;    // YYYY-MM-DD

  // 減量・増量（weight_loss, weight_gain）の場合
  currentWeightKg?: number;   // 現在体重（kg）
  targetWeightKg?: number;    // 目標体重（kg）

  // 筋力向上（strength）の場合
  exerciseName?: string;      // 種目名（ベンチプレス等）
  currentValue?: number;      // 現在重量（kg）
  targetValue?: number;       // 目標重量（kg）

  // 筋肉量アップ（muscle_gain）の場合（すべて任意）
  currentMuscleMassKg?: number;  // 現在筋肉量（kg）
  targetMuscleMassKg?: number;   // 目標筋肉量（kg）
  currentArmCm?: number;         // 現在腕回り（cm）
  targetArmCm?: number;          // 目標腕回り（cm）
  currentChestCm?: number;       // 現在胸囲（cm）
  targetChestCm?: number;        // 目標胸囲（cm）
  currentWaistCm?: number;       // 現在ウエスト（cm）
  targetWaistCm?: number;        // 目標ウエスト（cm）
}
```

**戻り値**: `{ success: boolean; goalId?: string; error?: string }`

**目標タイプ別の必須/推奨パラメータ**:
- **weight_loss/weight_gain**: currentWeightKg, targetWeightKg（体重グラフに目標ライン表示）
- **strength**: exerciseName, currentValue, targetValue
- **muscle_gain**: 各サイズ項目は任意、必要なものだけ設定可能

#### `getGoals(activeOnly?)`
ユーザーの目標一覧を取得。

#### `getGoal(goalId)`
指定IDの目標を取得。

#### `updateGoal(goalId, data)`
目標を更新。パラメータはcreateGoalと同じ。

#### `deleteGoal(goalId)`
目標を削除。

#### `toggleGoalActive(goalId)`
目標のアクティブ状態を切り替え。

### 体組成管理

#### `createBodyComposition(userId, data)`
体組成データを記録。

**パラメータ**:
```typescript
{
  userId: string;
  data: {
    recordDate: string;
    weightKg?: number;
    bodyFatPercentage?: number;
    muscleMassKg?: number;
    notes?: string;
  };
}
```

#### `getBodyCompositions(userId, startDate, endDate)`
期間内の体組成データを取得。

### AI機能

#### `generateMealSuggestion(userId, context)`
AIによる食事提案。

**パラメータ**:
```typescript
{
  userId: string;
  context: {
    goalType: string;
    currentCalories?: number;
    targetCalories?: number;
    preferences?: string[];
  };
}
```

**戻り値**: 
```typescript
{
  success: boolean;
  suggestion?: {
    meals: Array<{
      mealType: string;
      items: Array<{
        foodName: string;
        quantity: number;
        calories: number;
        protein: number;
        carbs: number;
        fats: number;
      }>;
    }>;
    totalCalories: number;
    explanation: string;
  };
  error?: string;
}
```

#### `generateTrainingPlan(userId, requirements)`
AIによるトレーニングプラン生成。

**パラメータ**:
```typescript
{
  userId: string;
  requirements: {
    goalType: string;
    planType: 'weekly' | 'split' | 'custom';
    daysPerWeek: number;
    experienceLevel: 'beginner' | 'intermediate' | 'advanced';
    availableEquipment?: string[];
    bodyParts?: string[];
  };
}
```

**戻り値**: 
```typescript
{
  success: boolean;
  plan?: {
    planId: string;
    planName: string;
    exercises: Array<{
      exerciseId: string;
      dayOfWeek: number;
      sets: number;
      reps: number;
      weightKg?: number;
    }>;
    explanation: string;
  };
  error?: string;
}
```

#### `predictWeightAchievement(userId, exerciseId, targetWeight)`
目標重量達成時期を予測。

**パラメータ**:
```typescript
{
  userId: string;
  exerciseId: string;
  targetWeight: number;
}
```

**戻り値**:
```typescript
{
  success: boolean;
  prediction?: {
    estimatedDate: string;
    recommendedSets: number;
    recommendedReps: number;
    recommendedFrequency: number;
    explanation: string;
  };
  error?: string;
}
```

#### `chatWithAI(userId, message, conversationType)`
AIとのチャット対話。

**パラメータ**:
```typescript
{
  userId: string;
  message: string;
  conversationType: 'meal_suggestion' | 'training_plan' | 'general';
  conversationId?: string; // 既存の会話を続ける場合
}
```

**戻り値**:
```typescript
{
  success: boolean;
  response?: {
    message: string;
    conversationId: string;
  };
  error?: string;
}
```

### ソーシャル機能

#### `sendFriendRequest(userId, friendEmail)`
友達リクエストを送信。

#### `acceptFriendRequest(friendshipId)`
友達リクエストを承認。

#### `getFriends(userId)`
友達一覧を取得。

#### `createCompetition(userId, competitionData)`
競争を作成。

**パラメータ**:
```typescript
{
  userId: string;
  competitionData: {
    friendId: string;
    competitionType: 'weight' | 'weight_loss' | 'exercise';
    exerciseId?: string;
    startDate: string;
    endDate?: string;
  };
}
```

#### `getCompetitions(userId)`
ユーザーの競争一覧を取得。

### ダッシュボード・統計

#### `getDashboardData(userId, date?)`
ダッシュボード用のデータを取得。

**戻り値**:
```typescript
{
  todayCalories: number;
  targetCalories?: number;
  recentWorkouts: Workout[];
  activeGoals: Goal[];
  bodyWeightTrend: Array<{ date: string; weight: number }>;
  progressSummary: {
    weightChange: number;
    strengthProgress: Array<{ exercise: string; progress: number }>;
  };
}
```

#### `getProgressReport(userId, startDate, endDate)`
進捗レポートを生成。

**戻り値**:
```typescript
{
  period: { start: string; end: string };
  calories: {
    average: number;
    total: number;
    trend: 'up' | 'down' | 'stable';
  };
  workouts: {
    total: number;
    averagePerWeek: number;
    totalVolume: number;
  };
  bodyComposition: {
    weightChange: number;
    bodyFatChange?: number;
    muscleMassChange?: number;
  };
  achievements: Achievement[];
}
```

## API Routes（必要に応じて）

### `/api/upload/image`
画像アップロード用エンドポイント（必要に応じて外部ストレージを使用する場合）。

### `/api/export/data`
データエクスポート用エンドポイント（CSV、PDF等）。

## エラーハンドリング

### エラーレスポンス形式
```typescript
{
  success: false;
  error: string;
  code?: string; // エラーコード
}
```

### エラーコード
- `AUTH_REQUIRED`: 認証が必要
- `NOT_FOUND`: リソースが見つからない
- `VALIDATION_ERROR`: バリデーションエラー
- `DATABASE_ERROR`: データベースエラー
- `AI_API_ERROR`: AI APIエラー
- `RATE_LIMIT_EXCEEDED`: レート制限超過

## レート制限

- AI API呼び出し: ユーザーあたり1日50回まで（初期）
- 通常のAPI: 1分あたり100リクエスト

## セキュリティ

- すべてのServer Actionで認証チェック
- ユーザーIDの検証（他ユーザーのデータにアクセスできないように）
- 入力値のバリデーション
- SQLインジェクション対策（パラメータ化クエリ）
- XSS対策（出力エスケープ）

