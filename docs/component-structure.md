# コンポーネント構造

## ディレクトリ構造

```
app/
├── (auth)/
│   ├── login/
│   └── signup/
├── (dashboard)/
│   ├── dashboard/
│   ├── meals/
│   ├── workouts/
│   ├── goals/
│   ├── progress/
│   └── social/
├── api/
│   └── upload/
├── components/
│   ├── ui/              # 基本UIコンポーネント
│   ├── layout/          # レイアウトコンポーネント
│   ├── meals/           # 食事関連コンポーネント
│   ├── workouts/        # トレーニング関連コンポーネント
│   ├── goals/           # 目標関連コンポーネント
│   ├── ai/              # AI機能関連コンポーネント
│   ├── social/           # ソーシャル機能コンポーネント
│   └── charts/          # グラフコンポーネント
├── lib/
│   ├── db/              # データベース関連
│   ├── auth/            # 認証関連
│   ├── ai/              # AI API関連
│   └── utils/           # ユーティリティ
└── types/               # TypeScript型定義
```

## 主要コンポーネント

### UIコンポーネント (`components/ui/`)

#### `Button`
汎用ボタンコンポーネント。

```typescript
<Button variant="primary" size="md" onClick={handleClick}>
  ボタン
</Button>
```

#### `Input`
入力フィールドコンポーネント。

```typescript
<Input
  type="text"
  label="名前"
  value={value}
  onChange={handleChange}
  error={error}
/>
```

#### `Card`
カードコンポーネント。

```typescript
<Card title="タイトル" footer={<Button>アクション</Button>}>
  コンテンツ
</Card>
```

#### `Modal`
モーダルダイアログコンポーネント。

```typescript
<Modal isOpen={isOpen} onClose={handleClose} title="モーダル">
  コンテンツ
</Modal>
```

#### `Select`
セレクトボックスコンポーネント。

#### `DatePicker`
日付選択コンポーネント。

#### `LoadingSpinner`
ローディング表示コンポーネント。

### レイアウトコンポーネント (`components/layout/`)

#### `Header`
アプリケーションヘッダー。

#### `Navigation`
ナビゲーションメニュー。

#### `Sidebar`
サイドバー（必要に応じて）。

#### `Footer`
フッター。

#### `Layout`
メインレイアウトコンポーネント。

### 食事関連コンポーネント (`components/meals/`)

#### `MealForm`
食事記録フォーム。

```typescript
<MealForm
  initialData={mealData}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
/>
```

#### `MealList`
食事記録一覧。

```typescript
<MealList meals={meals} onEdit={handleEdit} onDelete={handleDelete} />
```

#### `MealItem`
個別の食事アイテム表示。

#### `MealImageUpload`
食事画像アップロード。

```typescript
<MealImageUpload
  onUpload={handleUpload}
  onAnalyze={handleAnalyze}
/>
```

#### `MealSummary`
食事サマリー（カロリー、栄養素等）。

```typescript
<MealSummary
  date={date}
  meals={meals}
  targetCalories={targetCalories}
/>
```

#### `CalorieChart`
カロリー推移グラフ。

### トレーニング関連コンポーネント (`components/workouts/`)

#### `WorkoutForm`
トレーニング記録フォーム。

```typescript
<WorkoutForm
  initialData={workoutData}
  onSubmit={handleSubmit}
  exercises={exercises}
/>
```

#### `WorkoutList`
トレーニング記録一覧。

#### `ExerciseSelector`
種目選択コンポーネント。

```typescript
<ExerciseSelector
  bodyPart={bodyPart}
  onSelect={handleSelect}
  showAIRecommendation={isBeginner}
/>
```

#### `SetForm`
セット入力フォーム。

```typescript
<SetForm
  exerciseId={exerciseId}
  setNumber={setNumber}
  initialData={setData}
  onSubmit={handleSubmit}
/>
```

#### `WorkoutSummary`
トレーニングサマリー。

#### `WeightChart`
重量推移グラフ。

#### `ExerciseHistory`
種目履歴表示。

### 目標関連コンポーネント (`components/goals/`)

#### `GoalForm`
目標設定フォーム。

```typescript
<GoalForm
  goalType={goalType}
  onSubmit={handleSubmit}
  initialData={goalData}
/>
```

#### `GoalCard`
目標カード表示。

```typescript
<GoalCard
  goal={goal}
  progress={progress}
  onEdit={handleEdit}
/>
```

#### `GoalProgress`
目標進捗表示。

#### `AchievementNotification`
達成通知コンポーネント。

```typescript
<AchievementNotification
  achievement={achievement}
  onClose={handleClose}
/>
```

### AI機能関連コンポーネント (`components/ai/`)

#### `AIChat`
AIチャットインターフェース。

```typescript
<AIChat
  conversationType="meal_suggestion"
  onSendMessage={handleSendMessage}
/>
```

#### `MealSuggestion`
AI食事提案表示。

```typescript
<MealSuggestion
  suggestion={suggestion}
  onAccept={handleAccept}
  onRegenerate={handleRegenerate}
/>
```

#### `TrainingPlanGenerator`
トレーニングプラン生成フォーム。

```typescript
<TrainingPlanGenerator
  goalType={goalType}
  onGenerate={handleGenerate}
/>
```

#### `WeightPrediction`
重量達成予測表示。

```typescript
<WeightPrediction
  exerciseId={exerciseId}
  targetWeight={targetWeight}
  prediction={prediction}
/>
```

### ソーシャル機能コンポーネント (`components/social/`)

#### `FriendList`
友達一覧。

#### `FriendRequest`
友達リクエスト表示。

#### `CompetitionCard`
競争カード表示。

```typescript
<CompetitionCard
  competition={competition}
  userProgress={userProgress}
  friendProgress={friendProgress}
/>
```

#### `Leaderboard`
ランキング表示。

### グラフコンポーネント (`components/charts/`)

#### `LineChart`
折れ線グラフ（体重推移等）。

#### `BarChart`
棒グラフ（カロリー等）。

#### `ProgressChart`
進捗グラフ。

#### `NutritionChart`
栄養素グラフ（円グラフ等）。

## ページコンポーネント

### `app/(dashboard)/dashboard/page.tsx`
ダッシュボードページ。

### `app/(dashboard)/meals/page.tsx`
食事管理ページ。

### `app/(dashboard)/meals/new/page.tsx`
食事記録作成ページ。

### `app/(dashboard)/workouts/page.tsx`
トレーニング管理ページ。

### `app/(dashboard)/workouts/new/page.tsx`
トレーニング記録作成ページ。

### `app/(dashboard)/goals/page.tsx`
目標管理ページ。

### `app/(dashboard)/progress/page.tsx`
進捗分析ページ。

### `app/(dashboard)/social/page.tsx`
ソーシャル機能ページ。

## 共通パターン

### フォームパターン
- バリデーション
- エラー表示
- ローディング状態
- 送信状態管理

### リストパターン
- ページネーション
- フィルタリング
- ソート
- 空状態表示

### データフェッチパターン
- Server Componentsでのデータ取得
- Client Componentsでのリアルタイム更新
- エラーハンドリング
- ローディング状態

## スタイリング

### Tailwind CSS使用
- ユーティリティクラス中心
- カスタムカラーパレット（筋肉質なテーマ）
- ダークモード対応（オプション）

### コンポーネントスタイル
- モダンで力強いデザイン
- ボディビル・フィジークを意識
- レスポンシブ対応

