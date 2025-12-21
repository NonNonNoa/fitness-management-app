# データベーススキーマ設計

## 概要

Turso (SQLite) を使用したデータベース設計書。

## テーブル一覧

### 1. users（ユーザー）
ユーザー基本情報を格納。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | TEXT | PRIMARY KEY | ユーザーID（UUID） |
| email | TEXT | UNIQUE, NOT NULL | メールアドレス |
| name | TEXT | | ユーザー名 |
| image | TEXT | | プロフィール画像URL |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 更新日時 |

### 2. goals（目標）
ユーザーの目標設定を格納。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | TEXT | PRIMARY KEY | 目標ID（UUID） |
| user_id | TEXT | NOT NULL, FOREIGN KEY | ユーザーID |
| goal_type | TEXT | NOT NULL | 目標タイプ（muscle_gain, weight_loss, weight_gain, strength, endurance） |
| target_value | REAL | | 目標値（体重、重量など） |
| current_value | REAL | | 現在値 |
| start_date | DATE | NOT NULL | 開始日 |
| target_date | DATE | | 目標達成日 |
| is_active | INTEGER | NOT NULL, DEFAULT 1 | アクティブフラグ（0 or 1） |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 更新日時 |

**インデックス**: user_id, goal_type, is_active

### 3. exercises（種目マスタ）
トレーニング種目のマスタデータ。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | TEXT | PRIMARY KEY | 種目ID（UUID） |
| name | TEXT | NOT NULL | 種目名 |
| name_en | TEXT | | 英語名 |
| body_part | TEXT | NOT NULL | 部位（chest, back, legs, shoulders, arms, core） |
| equipment | TEXT | | 必要な器具（barbell, dumbbell, bodyweight, machine等） |
| difficulty | TEXT | | 難易度（beginner, intermediate, advanced） |
| description | TEXT | | 説明 |
| image_url | TEXT | | 画像URL |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 作成日時 |

**インデックス**: body_part, difficulty

### 4. workouts（トレーニングセッション）
トレーニングセッション（1回のトレーニング）を格納。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | TEXT | PRIMARY KEY | セッションID（UUID） |
| user_id | TEXT | NOT NULL, FOREIGN KEY | ユーザーID |
| workout_date | DATE | NOT NULL | トレーニング日 |
| duration_minutes | INTEGER | | トレーニング時間（分） |
| total_volume | REAL | | 総ボリューム（重量×レップ×セット） |
| calories_burned | INTEGER | | 消費カロリー |
| notes | TEXT | | メモ |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 更新日時 |

**インデックス**: user_id, workout_date

### 5. workout_sets（トレーニングセット）
個別のセット情報を格納。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | TEXT | PRIMARY KEY | セットID（UUID） |
| workout_id | TEXT | NOT NULL, FOREIGN KEY | トレーニングセッションID |
| exercise_id | TEXT | NOT NULL, FOREIGN KEY | 種目ID |
| set_number | INTEGER | NOT NULL | セット番号 |
| weight_kg | REAL | | 重量（kg） |
| reps | INTEGER | | レップ数 |
| rest_seconds | INTEGER | | 休憩時間（秒） |
| rpe | REAL | | RPE（1-10） |
| notes | TEXT | | メモ |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 作成日時 |

**インデックス**: workout_id, exercise_id

### 6. meals（食事）
食事セッション（1回の食事）を格納。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | TEXT | PRIMARY KEY | 食事ID（UUID） |
| user_id | TEXT | NOT NULL, FOREIGN KEY | ユーザーID |
| meal_date | DATE | NOT NULL | 食事日 |
| meal_time | TIME | | 食事時間 |
| meal_type | TEXT | | 食事タイプ（breakfast, lunch, dinner, snack） |
| total_calories | INTEGER | | 総カロリー |
| total_protein | REAL | | 総タンパク質（g） |
| total_carbs | REAL | | 総炭水化物（g） |
| total_fats | REAL | | 総脂質（g） |
| image_url | TEXT | | 食事画像URL（AI解析用） |
| notes | TEXT | | メモ |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 更新日時 |

**インデックス**: user_id, meal_date

### 7. meal_items（食事アイテム）
食事に含まれる個別の食品を格納。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | TEXT | PRIMARY KEY | アイテムID（UUID） |
| meal_id | TEXT | NOT NULL, FOREIGN KEY | 食事ID |
| food_name | TEXT | NOT NULL | 食品名 |
| quantity | REAL | | 数量 |
| unit | TEXT | | 単位（g, ml, 個等） |
| calories | INTEGER | | カロリー |
| protein | REAL | | タンパク質（g） |
| carbs | REAL | | 炭水化物（g） |
| fats | REAL | | 脂質（g） |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 作成日時 |

**インデックス**: meal_id

### 8. body_compositions（体組成）
体重・体組成データを格納。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | TEXT | PRIMARY KEY | 記録ID（UUID） |
| user_id | TEXT | NOT NULL, FOREIGN KEY | ユーザーID |
| record_date | DATE | NOT NULL | 記録日 |
| weight_kg | REAL | | 体重（kg） |
| body_fat_percentage | REAL | | 体脂肪率（%） |
| muscle_mass_kg | REAL | | 筋肉量（kg） |
| notes | TEXT | | メモ |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 作成日時 |

**インデックス**: user_id, record_date

### 9. training_plans（トレーニングプラン）
AI生成または手動作成のトレーニングプラン。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | TEXT | PRIMARY KEY | プランID（UUID） |
| user_id | TEXT | NOT NULL, FOREIGN KEY | ユーザーID |
| plan_name | TEXT | NOT NULL | プラン名 |
| plan_type | TEXT | NOT NULL | プランタイプ（weekly, split, custom） |
| goal_type | TEXT | NOT NULL | 目標タイプ |
| is_active | INTEGER | NOT NULL, DEFAULT 1 | アクティブフラグ |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 更新日時 |

**インデックス**: user_id, is_active

### 10. plan_exercises（プラン種目）
トレーニングプランに含まれる種目情報。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | TEXT | PRIMARY KEY | ID（UUID） |
| plan_id | TEXT | NOT NULL, FOREIGN KEY | プランID |
| exercise_id | TEXT | NOT NULL, FOREIGN KEY | 種目ID |
| day_of_week | INTEGER | | 曜日（0=日曜日） |
| sets | INTEGER | | セット数 |
| reps | INTEGER | | レップ数 |
| weight_kg | REAL | | 目標重量（kg） |
| order | INTEGER | | 順序 |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 作成日時 |

**インデックス**: plan_id, day_of_week

### 11. friendships（友達関係）
ユーザー間の友達関係を格納。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | TEXT | PRIMARY KEY | ID（UUID） |
| user_id | TEXT | NOT NULL, FOREIGN KEY | ユーザーID |
| friend_id | TEXT | NOT NULL, FOREIGN KEY | 友達のユーザーID |
| status | TEXT | NOT NULL | ステータス（pending, accepted, blocked） |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 更新日時 |

**インデックス**: user_id, friend_id, status
**ユニーク制約**: (user_id, friend_id)

### 12. competitions（競争）
友達間の競争データを格納。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | TEXT | PRIMARY KEY | 競争ID（UUID） |
| user_id | TEXT | NOT NULL, FOREIGN KEY | ユーザーID |
| friend_id | TEXT | NOT NULL, FOREIGN KEY | 友達のユーザーID |
| competition_type | TEXT | NOT NULL | 競争タイプ（weight, weight_loss, exercise） |
| exercise_id | TEXT | FOREIGN KEY | 種目ID（競争タイプがexerciseの場合） |
| start_date | DATE | NOT NULL | 開始日 |
| end_date | DATE | | 終了日 |
| user_value | REAL | | ユーザーの値 |
| friend_value | REAL | | 友達の値 |
| is_active | INTEGER | NOT NULL, DEFAULT 1 | アクティブフラグ |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 更新日時 |

**インデックス**: user_id, friend_id, is_active

### 13. ai_conversations（AI会話履歴）
AIとのチャット履歴を格納。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | TEXT | PRIMARY KEY | 会話ID（UUID） |
| user_id | TEXT | NOT NULL, FOREIGN KEY | ユーザーID |
| conversation_type | TEXT | NOT NULL | 会話タイプ（meal_suggestion, training_plan, general） |
| messages | TEXT | NOT NULL | メッセージ履歴（JSON） |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 更新日時 |

**インデックス**: user_id, conversation_type

### 14. achievements（達成記録）
目標達成やモチベーション機能用の達成記録。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | TEXT | PRIMARY KEY | 達成ID（UUID） |
| user_id | TEXT | NOT NULL, FOREIGN KEY | ユーザーID |
| achievement_type | TEXT | NOT NULL | 達成タイプ（weight_milestone, athlete_match等） |
| achievement_data | TEXT | | 達成データ（JSON） |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 作成日時 |

**インデックス**: user_id, achievement_type

## リレーション図

```
users
  ├── goals (1:N)
  ├── workouts (1:N)
  ├── meals (1:N)
  ├── body_compositions (1:N)
  ├── training_plans (1:N)
  ├── friendships (1:N) [as user_id]
  ├── friendships (1:N) [as friend_id]
  ├── competitions (1:N) [as user_id]
  ├── competitions (1:N) [as friend_id]
  ├── ai_conversations (1:N)
  └── achievements (1:N)

workouts
  └── workout_sets (1:N)

meals
  └── meal_items (1:N)

training_plans
  └── plan_exercises (1:N)

exercises
  ├── workout_sets (1:N)
  └── plan_exercises (1:N)
```

## マイグレーション戦略

1. 初期スキーマの作成
2. 種目マスタデータの投入
3. インデックスの最適化
4. 必要に応じてスキーマ変更のマイグレーション

## 注意事項

- SQLiteの制約を考慮した設計
- 外部キー制約はアプリケーションレベルで管理（SQLiteの制約はオプション）
- UUIDはTEXT型で保存
- 日時はISO 8601形式で保存
- 論理削除が必要な場合は`deleted_at`カラムを追加

