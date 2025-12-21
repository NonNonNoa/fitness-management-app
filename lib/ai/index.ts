import OpenAI from "openai";

// OpenAI client - initialized only when needed
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not configured");
    }
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
  const openai = getOpenAIClient();

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
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
  if (!content) {
    throw new Error("Failed to analyze image");
  }

  // Extract JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Invalid response format");
  }

  return JSON.parse(jsonMatch[0]) as CalorieAnalysis;
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
  const openai = getOpenAIClient();

  const goalDescriptions = {
    weight_loss: "減量・ダイエット",
    weight_gain: "増量・バルクアップ",
    muscle_gain: "筋肉増加",
    maintain: "体重維持",
  };

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
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
  if (!content) {
    throw new Error("Failed to generate meal suggestions");
  }

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Invalid response format");
  }

  return JSON.parse(jsonMatch[0]) as MealSuggestion;
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
  const openai = getOpenAIClient();

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

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
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
  if (!content) {
    throw new Error("Failed to generate workout plan");
  }

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Invalid response format");
  }

  return JSON.parse(jsonMatch[0]) as WorkoutPlan;
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

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
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
  if (!content) {
    throw new Error("Failed to predict progress");
  }

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Invalid response format");
  }

  return JSON.parse(jsonMatch[0]) as ProgressPrediction;
}

