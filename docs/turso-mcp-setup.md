# Turso MCP サーバーセットアップ

## Turso MCP サーバーに接続する方法

### オプション1: Turso Dev（ローカル開発サーバー）

ローカル開発環境でTursoデータベースを使用する場合、`turso dev`コマンドでローカルサーバーを起動できます。

#### 手順

1. **ローカルデータベースの作成**
   ```bash
   # プロジェクトディレクトリで実行
   mkdir -p .turso
   turso dev --db-file .turso/local.db
   ```

2. **MCPサーバーとして設定**
   ```bash
   # Tursoのローカルデータベースファイルを指定
   claude mcp add turso-db -- turso db shell .turso/local.db
   ```

### オプション2: Tursoクラウドデータベース

Tursoのクラウドサービスを使用する場合：

#### 手順

1. **Tursoアカウントにログイン**
   - [Turso Console](https://turso.tech/)にアクセス
   - アカウントを作成またはログイン

2. **データベースを作成**
   - コンソールから新しいデータベースを作成
   - データベース名: `fitness-app`

3. **接続情報を取得**
   - データベースURL（例: `libsql://your-database.turso.io`）
   - 認証トークン

4. **環境変数に設定**
   `.env.local`ファイルを作成：
   ```env
   TURSO_DATABASE_URL=libsql://your-database.turso.io
   TURSO_AUTH_TOKEN=your-auth-token
   ```

### オプション3: SQLiteファイルとして使用

開発初期段階では、ローカルSQLiteファイルを使用する方が簡単です：

#### 手順

1. **SQLiteファイルを作成**
   ```bash
   # .tursoディレクトリを作成
   mkdir -p .turso
   
   # 空のSQLiteデータベースファイルを作成
   touch .turso/fitness-app.db
   ```

2. **MCPサーバーとして設定**
   ```bash
   # ローカルのSQLiteファイルを指定
   claude mcp add fitness-db -- sqlite3 .turso/fitness-app.db
   ```

3. **接続情報を環境変数に設定**
   `.env.local`:
   ```env
   # ローカル開発の場合
   TURSO_DATABASE_URL=file:.turso/fitness-app.db
   ```

## 推奨アプローチ（開発初期）

開発の初期段階では、**オプション3（ローカルSQLiteファイル）**を推奨します：

### メリット
- セットアップが簡単
- インターネット接続不要
- 開発速度が速い
- 後でTursoクラウドに移行可能

### セットアップコマンド

```bash
# 1. .tursoディレクトリを作成
mkdir -p .turso

# 2. .gitignoreに追加（データベースファイルをgitに含めない）
echo ".turso/" >> .gitignore

# 3. 必要なパッケージをインストール
npm install drizzle-orm @libsql/client
npm install -D drizzle-kit

# 4. .env.localを作成
cat > .env.local << EOL
TURSO_DATABASE_URL=file:.turso/fitness-app.db
EOL
```

## 次のステップ

データベースが準備できたら：

1. **Drizzle ORMでスキーマを定義**
   - `lib/db/schema.ts`を作成
   - BetterAuthのスキーマに準拠

2. **マイグレーションを実行**
   ```bash
   npx drizzle-kit generate
   npx drizzle-kit migrate
   ```

3. **データベース接続を設定**
   - `lib/db/index.ts`を作成
   - Drizzle ORMクライアントを設定

## トラブルシューティング

### MCPサーバーが見つからない場合

MCPサーバーの設定は、Cursorの設定ファイル（`~/.cursor/config.json`）に保存されます。手動で設定を確認・編集できます。

### データベースファイルが作成されない場合

Drizzle ORMが自動的にファイルを作成します。スキーマ定義とマイグレーションを実行すれば、データベースファイルが生成されます。

---

**最終更新日**: 2024年




