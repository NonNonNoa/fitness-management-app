import OpenAI from "openai";

// OpenAI client - initialized only when needed
let openaiClient: OpenAI | null = null;
let ollamaClient: OpenAI | null = null;

// Ollamaを使用するかどうかを判定
function shouldUseOllama(): boolean {
  const hasOllamaBaseURL = !!process.env.OLLAMA_BASE_URL && process.env.OLLAMA_BASE_URL.trim() !== "";
  const hasOllamaModel = !!process.env.OLLAMA_MODEL && process.env.OLLAMA_MODEL.trim() !== "";
  return hasOllamaBaseURL && hasOllamaModel;
}

// 使用するモデル名を取得
function getModelName(): string {
  if (shouldUseOllama()) {
    return process.env.OLLAMA_MODEL || "llama3.2";
  }
  return "gpt-4o";
}

function getOpenAIClient(): OpenAI {
  // Ollamaを使用する場合
  if (shouldUseOllama()) {
    if (!ollamaClient) {
      const baseURL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
      const model = process.env.OLLAMA_MODEL || "llama3.2";
      console.log(`[AI] Using Ollama: ${baseURL}/v1, model: ${model}`);
      ollamaClient = new OpenAI({
        baseURL: `${baseURL}/v1`,
        apiKey: "ollama", // OllamaはAPIキー不要だが、OpenAI SDKの要件で必要
      });
    }
    return ollamaClient;
  }

  // OpenAI APIを使用する場合（従来通り）
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey.trim() === "") {
      throw new Error(
        "OPENAI_API_KEY is not configured. " +
        "Please set OPENAI_API_KEY in your environment variables, " +
        "or set OLLAMA_BASE_URL and OLLAMA_MODEL to use Ollama instead."
      );
    }
    console.log("[AI] Using OpenAI API");
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

export interface CalorieAnalysis {
  totalCalories: number;
  protein: number;
  carbs: number;
  fats: number;
  foods: { name: string; calories: number; portion: string }[];
  confidence: number;
}

export async function analyzeImageForCalories(
  imageBase64: string
): Promise<CalorieAnalysis> {
  // 画像分析はOpenAIのみ対応（Llamaは画像入力非対応のため）
  if (shouldUseOllama()) {
    throw new Error("画像分析機能はOllamaでは使用できません。OpenAI APIを使用してください。");
  }

  const openai = getOpenAIClient();
  const model = getModelName();
  console.log(`[AI] analyzeImageForCalories: Using model ${model}`);

  const response = await openai.chat.completions.create({
    model: model,
    messages: [
      {
        role: "system",
        content: `あなたは栄養士です。食事の写真から栄養素を分析してください。
回答は必ず以下のJSON形式で返してください：
{
  "totalCalories": 数値,
  "protein": 数値(g),
  "carbs": 数値(g),
  "fats": 数値(g),
  "foods": [{ "name": "食品名", "calories": 数値, "portion": "分量" }],
  "confidence": 0.0-1.0
}`,
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
          },
          {
            type: "text",
            text: "この食事のカロリーと栄養素を分析してください。",
          },
        ],
      },
    ],
    max_tokens: 1000,
  });

  const content = response.choices[0]?.message?.content;
  console.log("[AI] Raw response:", JSON.stringify(response, null, 2));
  console.log("[AI] Generated content:", content);

  if (!content) {
    throw new Error("Failed to analyze image");
  }

  // Extract JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error("[AI] Invalid response format. Content:", content);
    throw new Error("Invalid response format");
  }

  const parsed = JSON.parse(jsonMatch[0]) as CalorieAnalysis;
  console.log("[AI] Parsed calorie analysis:", JSON.stringify(parsed, null, 2));
  return parsed;
}

export interface MealSuggestion {
  meals: {
    name: string;
    description: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    recipe?: string[];
  }[];
  dailyPlan?: string;
}

export async function suggestMeals(
  goalType: "weight_loss" | "weight_gain" | "muscle_gain" | "maintain",
  currentCalories: number,
  targetCalories: number,
  preferences?: string
): Promise<MealSuggestion> {
  try {
    const openai = getOpenAIClient();
    const model = getModelName();
    console.log(`[AI] suggestMeals: Using model ${model}`);

    const goalDescriptions = {
      weight_loss: "減量・ダイエット",
      weight_gain: "増量・バルクアップ",
      muscle_gain: "筋肉増加",
      maintain: "体重維持",
    };

    console.log(`[AI] suggestMeals: Using model ${model}`);
    console.log("[AI] Request params:", { goalType, currentCalories, targetCalories, preferences });

    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: `あなたはフィットネス栄養士です。ユーザーの目標に合わせた食事プランを提案してください。
回答は必ず以下のJSON形式で返してください：
{
  "meals": [
    {
      "name": "料理名",
      "description": "説明",
      "calories": 数値,
      "protein": 数値,
      "carbs": 数値,
      "fats": 数値,
      "recipe": ["手順1", "手順2"]
    }
  ],
  "dailyPlan": "1日の食事プラン概要"
}`,
      },
      {
        role: "user",
        content: `目標: ${goalDescriptions[goalType]}
現在のカロリー摂取: ${currentCalories} kcal
目標カロリー: ${targetCalories} kcal
${preferences ? `好み・制限: ${preferences}` : ""}

残りのカロリーで最適な食事を3つ提案してください。`,
      },
    ],
    max_tokens: 2000,
  });

  const content = response.choices[0]?.message?.content;
  console.log("[AI] Raw response:", JSON.stringify(response, null, 2));
  console.log("[AI] Generated content:", content);

  if (!content) {
    throw new Error("Failed to generate meal suggestions");
  }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[AI] Invalid response format. Content:", content);
      throw new Error("Invalid response format");
    }

    const parsed = JSON.parse(jsonMatch[0]) as MealSuggestion;
    console.log("[AI] Parsed meal suggestion:", JSON.stringify(parsed, null, 2));
    return parsed;
  } catch (error) {
    console.error("[AI] Error in suggestMeals:", error);
    if (error instanceof Error) {
      // より詳細なエラーメッセージを提供
      if (error.message.includes("OPENAI_API_KEY")) {
        throw new Error("AI設定エラー: OPENAI_API_KEYが設定されていません。環境変数を確認してください。");
      }
      if (error.message.includes("fetch failed") || error.message.includes("ECONNREFUSED")) {
        throw new Error("AI接続エラー: Ollamaサーバーに接続できません。Ollamaが起動しているか確認してください。");
      }
      throw error;
    }
    throw new Error("食事提案の生成に失敗しました");
  }
}

export interface WorkoutPlan {
  name: string;
  description: string;
  durationWeeks: number;
  daysPerWeek: number;
  schedule: {
    day: string;
    focus: string;
    exercises: {
      name: string;
      sets: number;
      reps: string;
      restSeconds: number;
      notes?: string;
    }[];
  }[];
  tips: string[];
}

export async function generateWorkoutPlan(
  goalType: "muscle_gain" | "strength" | "weight_loss" | "endurance",
  level: "beginner" | "intermediate" | "advanced",
  daysPerWeek: number,
  equipment: string[],
  focusAreas?: string[]
): Promise<WorkoutPlan> {
  try {
    const openai = getOpenAIClient();
    const model = getModelName();
    console.log(`[AI] generateWorkoutPlan: Using model ${model}`);

    const goalDescriptions = {
      muscle_gain: "筋肥大",
      strength: "筋力向上",
      weight_loss: "脂肪燃焼",
      endurance: "持久力向上",
    };

    const levelDescriptions = {
      beginner: "初心者",
      intermediate: "中級者",
      advanced: "上級者",
    };

    console.log(`[AI] generateWorkoutPlan: Using model ${model}`);
    console.log("[AI] Request params:", { goalType, level, daysPerWeek, equipment, focusAreas });

    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: `あなたは経験豊富なパーソナルトレーナーです。
回答は必ず以下のJSON形式で返してください：
{
  "name": "プラン名",
  "description": "プラン説明",
  "durationWeeks": 数値,
  "daysPerWeek": 数値,
  "schedule": [
    {
      "day": "Day 1",
      "focus": "胸・三頭筋",
      "exercises": [
        { "name": "種目名", "sets": 数値, "reps": "8-12", "restSeconds": 数値, "notes": "備考" }
      ]
    }
  ],
  "tips": ["アドバイス1", "アドバイス2"]
}`,
      },
      {
        role: "user",
        content: `以下の条件でトレーニングプランを作成してください：
- 目標: ${goalDescriptions[goalType]}
- レベル: ${levelDescriptions[level]}
- 週${daysPerWeek}日のトレーニング
- 使用可能器具: ${equipment.join(", ")}
${focusAreas ? `- 重点部位: ${focusAreas.join(", ")}` : ""}`,
      },
    ],
    max_tokens: 3000,
  });

    const content = response.choices[0]?.message?.content;
    console.log("response", JSON.stringify(response, null, 2));
    console.log("[AI] Raw response:", JSON.stringify(response, null, 2));
    console.log("[AI] Generated content:", content);

    if (!content) {
      throw new Error("Failed to generate workout plan");
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[AI] Invalid response format. Content:", content);
      throw new Error("Invalid response format");
    }

    const parsed = JSON.parse(jsonMatch[0]) as WorkoutPlan;
    console.log("[AI] Parsed workout plan:", JSON.stringify(parsed, null, 2));
    return parsed;
  } catch (error) {
    console.error("[AI] Error in generateWorkoutPlan:", error);
    if (error instanceof Error) {
      if (error.message.includes("OPENAI_API_KEY")) {
        throw new Error("AI設定エラー: OPENAI_API_KEYが設定されていません。環境変数を確認してください。");
      }
      if (error.message.includes("fetch failed") || error.message.includes("ECONNREFUSED")) {
        throw new Error("AI接続エラー: Ollamaサーバーに接続できません。Ollamaが起動しているか確認してください。");
      }
      throw error;
    }
    throw new Error("トレーニングプランの生成に失敗しました");
  }
}

export interface ProgressPrediction {
  predictedDate: string;
  predictedValue: number;
  confidence: number;
  milestones: { date: string; value: number; description: string }[];
  recommendations: string[];
}

export async function predictProgress(
  goalType: string,
  currentValue: number,
  targetValue: number,
  historicalData: { date: string; value: number }[]
): Promise<ProgressPrediction> {
  const openai = getOpenAIClient();
  const model = getModelName();

  const response = await openai.chat.completions.create({
    model: model,
    messages: [
      {
        role: "system",
        content: `あなたはフィットネスデータアナリストです。過去のデータから進捗を予測してください。
回答は必ず以下のJSON形式で返してください：
{
  "predictedDate": "YYYY-MM-DD",
  "predictedValue": 数値,
  "confidence": 0.0-1.0,
  "milestones": [{ "date": "YYYY-MM-DD", "value": 数値, "description": "説明" }],
  "recommendations": ["アドバイス1", "アドバイス2"]
}`,
      },
      {
        role: "user",
        content: `目標タイプ: ${goalType}
現在の値: ${currentValue}
目標値: ${targetValue}
過去データ: ${JSON.stringify(historicalData.slice(-30))}

目標達成時期を予測し、マイルストーンとアドバイスを提供してください。`,
      },
    ],
    max_tokens: 1500,
  });

  const content = response.choices[0]?.message?.content;
  console.log("[AI] Raw response:", JSON.stringify(response, null, 2));
  console.log("[AI] Generated content:", content);

  if (!content) {
    throw new Error("Failed to predict progress");
  }

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error("[AI] Invalid response format. Content:", content);
    throw new Error("Invalid response format");
  }

  const parsed = JSON.parse(jsonMatch[0]) as ProgressPrediction;
  console.log("[AI] Parsed progress prediction:", JSON.stringify(parsed, null, 2));
  return parsed;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatResponse {
  message: string;
  timestamp: string;
}

/**
 * 筋肉マッチョキャラクターとしてモチベーションを上げるメッセージを生成
 */
export async function getMotivationMessage(
  userMessage: string,
  userProgress?: {
    workoutsThisWeek?: number;
    caloriesToday?: number;
    activeGoals?: number;
  }
): Promise<ChatResponse> {
  const openai = getOpenAIClient();
  const model = getModelName();

  const systemPrompt = `あなたは「マッスルマスター」という名前の、超筋肉質で熱血なパーソナルトレーナーです。

【キャラクター設定】
- 筋肉質で、いつも「💪」「🔥」「⚡」などの絵文字を使う
- 熱血でポジティブ、常にユーザーを励ます
- 「お前」「お前の」「やるぞ」「行くぞ」などのカジュアルで熱い口調
- 時々「マッスル！」「パワー！」「XPLOSION！」などの掛け声
- ユーザーの努力を認め、さらに上を目指すよう激励する
- 挫折しそうな時は優しくも熱く励ます

【話し方の例】
- 「お前、今日も頑張ってるな！💪 その調子だ！」
- 「マッスル！お前の努力は必ず結果になる！🔥」
- 「ちょっと疲れた？大丈夫だ！お前は強い！一緒に乗り越えよう！⚡」
- 「今日のトレーニング、完璧だったな！次はもっと上を目指そう！XPLOSION！」

ユーザーのメッセージに対して、このキャラクターとして応答してください。
短めで熱いメッセージを心がけてください（50-100文字程度）。`;

  const userContext = userProgress
    ? `\n\n【ユーザーの現在の状況】
- 今週のトレーニング回数: ${userProgress.workoutsThisWeek || 0}回
- 今日のカロリー: ${userProgress.caloriesToday || 0}kcal
- アクティブな目標: ${userProgress.activeGoals || 0}個`
    : "";

  console.log(`[AI] getMotivationMessage: Using model ${model}`);
  console.log("[AI] User message:", userMessage);
  console.log("[AI] User progress:", userProgress);

  const response = await openai.chat.completions.create({
    model: model,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userMessage + userContext,
      },
    ],
    max_tokens: 200,
    temperature: 0.9, // より創造的で熱い応答のため
  });

  const content = response.choices[0]?.message?.content;
  console.log("[AI] Raw response:", JSON.stringify(response, null, 2));
  console.log("[AI] Generated message:", content);

  if (!content) {
    throw new Error("Failed to generate motivation message");
  }

  return {
    message: content,
    timestamp: new Date().toISOString(),
  };
}

