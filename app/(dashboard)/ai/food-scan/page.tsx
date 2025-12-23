"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, X, Check, Loader2, ArrowLeft } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { AnimatedCard } from "@/components/ui/animated-card";
import { MacroPieChart } from "@/components/ui/charts";
import { analyzeFood } from "@/lib/actions/ai";
import { createMeal } from "@/lib/actions/meals";
import Link from "next/link";

interface AnalysisResult {
  totalCalories: number;
  protein: number;
  carbs: number;
  fats: number;
  foods: { name: string; calories: number; portion: string }[];
  confidence: number;
}

export default function FoodScanPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read file as base64
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = (event.target?.result as string).split(",")[1];
      setImage(event.target?.result as string);
      setError(null);
      setResult(null);

      // Analyze image
      setAnalyzing(true);
      try {
        const response = await analyzeFood(base64);
        console.log("=== AI食事画像分析レスポンス ===");
        console.log("Success:", response.success);
        if (response.success && response.data) {
          console.log("分析データ:", JSON.stringify(response.data, null, 2));
          setResult(response.data);
        } else {
          console.error("エラー:", response.error);
          setError(response.error || "分析に失敗しました");
        }
      } catch (err) {
        console.error("Error in food analysis:", err);
        setError(
          err instanceof Error 
            ? err.message 
            : "分析中にエラーが発生しました。コンソールを確認してください。"
        );
      } finally {
        setAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!result) return;

    setSaving(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      await createMeal({
        mealDate: today,
        mealType: "snack",
        items: result.foods.map((f) => ({
          foodName: f.name,
          calories: f.calories,
        })),
        notes: result.foods.map((f) => `${f.name} (${f.portion})`).join(", "),
      });
      router.push("/meals");
    } catch (err) {
      setError("保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Link href="/ai">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-400" />
          </motion.div>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">写真でカロリー計算</h1>
          <p className="text-zinc-400 text-sm">食事を撮影してAIに分析させましょう</p>
        </div>
      </motion.div>

      {/* Upload Area */}
      <AnimatePresence mode="wait">
        {!image ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-zinc-700 rounded-2xl p-12 text-center cursor-pointer hover:border-orange-500/50 transition-colors"
            >
              <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-600/20 mb-4">
                <Camera className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                写真をアップロード
              </h3>
              <p className="text-zinc-400 text-sm mb-4">
                タップして撮影するか、ファイルを選択
              </p>
              <AnimatedButton icon={<Upload className="w-4 h-4" />}>
                ファイルを選択
              </AnimatedButton>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-4"
          >
            {/* Image Preview */}
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src={image}
                alt="Food"
                className="w-full h-64 object-cover"
              />
              <button
                onClick={reset}
                className="absolute top-3 right-3 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              {analyzing && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-2" />
                    <p className="text-white">分析中...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Results */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Summary */}
                <AnimatedCard hoverable={false}>
                  <div className="text-center mb-4">
                    <p className="text-4xl font-bold text-white">
                      {result.totalCalories}
                      <span className="text-lg text-zinc-400 ml-1">kcal</span>
                    </p>
                    <p className="text-sm text-zinc-500 mt-1">
                      信頼度: {(result.confidence * 100).toFixed(0)}%
                    </p>
                  </div>
                  <MacroPieChart
                    protein={result.protein}
                    carbs={result.carbs}
                    fats={result.fats}
                  />
                </AnimatedCard>

                {/* Food Items */}
                <AnimatedCard title="検出された食品" hoverable={false}>
                  <div className="space-y-2">
                    {result.foods.map((food, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl"
                      >
                        <div>
                          <p className="text-white text-sm">{food.name}</p>
                          <p className="text-zinc-500 text-xs">{food.portion}</p>
                        </div>
                        <p className="text-orange-400 font-medium">
                          {food.calories} kcal
                        </p>
                      </div>
                    ))}
                  </div>
                </AnimatedCard>

                {/* Actions */}
                <div className="flex gap-3">
                  <AnimatedButton
                    variant="secondary"
                    fullWidth
                    onClick={reset}
                  >
                    やり直す
                  </AnimatedButton>
                  <AnimatedButton
                    fullWidth
                    onClick={handleSave}
                    loading={saving}
                    icon={<Check className="w-4 h-4" />}
                  >
                    保存する
                  </AnimatedButton>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

