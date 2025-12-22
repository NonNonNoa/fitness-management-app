"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getMealWithItems, updateMeal, deleteMeal, MealFormData } from "@/lib/actions/meals";

type MealItem = {
  id: string;
  foodName: string;
  quantity?: number;
  unit?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
};

export default function EditMealPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [mealDate, setMealDate] = useState("");
  const [mealTime, setMealTime] = useState("");
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("lunch");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<MealItem[]>([]);

  // 既存データを読み込み
  useEffect(() => {
    async function loadMeal() {
      const meal = await getMealWithItems(id);
      if (!meal) {
        setError("食事記録が見つかりません");
        setIsInitialLoading(false);
        return;
      }

      setMealDate(meal.mealDate);
      setMealTime(meal.mealTime || "");
      setMealType((meal.mealType as typeof mealType) || "lunch");
      setNotes(meal.notes || "");
      setItems(
        meal.items.length > 0
          ? meal.items.map((item) => ({
              id: item.id,
              foodName: item.foodName,
              quantity: item.quantity || undefined,
              unit: item.unit || undefined,
              calories: item.calories || undefined,
              protein: item.protein || undefined,
              carbs: item.carbs || undefined,
              fats: item.fats || undefined,
            }))
          : [{ id: "1", foodName: "", calories: undefined }]
      );
      setIsInitialLoading(false);
    }
    loadMeal();
  }, [id]);

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), foodName: "", calories: undefined },
    ]);
  };

  const removeItem = (itemId: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== itemId));
    }
  };

  const updateItem = (itemId: string, field: keyof MealItem, value: string | number) => {
    setItems(
      items.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // バリデーション
    const validItems = items.filter((item) => item.foodName.trim() !== "");
    if (validItems.length === 0) {
      setError("少なくとも1つの食品を入力してください");
      setIsLoading(false);
      return;
    }

    const data: MealFormData = {
      mealDate,
      mealTime,
      mealType,
      notes: notes || undefined,
      items: validItems.map((item) => ({
        foodName: item.foodName,
        quantity: item.quantity,
        unit: item.unit,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fats: item.fats,
      })),
    };

    const result = await updateMeal(id, data);

    if (result.success) {
      router.push("/meals");
    } else {
      setError(result.error || "食事の更新に失敗しました");
    }

    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("この食事記録を削除しますか？")) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteMeal(id);

    if (result.success) {
      router.push("/meals");
    } else {
      setError(result.error || "削除に失敗しました");
      setIsDeleting(false);
    }
  };

  const mealTypeOptions = [
    { value: "breakfast", label: "朝食", icon: "🌅" },
    { value: "lunch", label: "昼食", icon: "☀️" },
    { value: "dinner", label: "夕食", icon: "🌙" },
    { value: "snack", label: "間食", icon: "🍪" },
  ];

  // 合計カロリーを計算
  const totalCalories = items.reduce((sum, item) => sum + (item.calories || 0), 0);

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error && isInitialLoading === false && items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/meals"
            className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">エラー</h1>
          </div>
        </div>
        <Card>
          <div className="text-center py-8">
            <p className="text-red-400">{error}</p>
            <Link
              href="/meals"
              className="mt-4 inline-block text-orange-400 hover:text-orange-300"
            >
              食事記録一覧に戻る
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/meals"
            className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">食事を編集</h1>
            <p className="text-zinc-400 mt-1">食事記録を更新します</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
          title="削除"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 日時と種類 */}
        <Card>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="日付"
                type="date"
                value={mealDate}
                onChange={(e) => setMealDate(e.target.value)}
                required
              />
              <Input
                label="時間"
                type="time"
                value={mealTime}
                onChange={(e) => setMealTime(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                食事の種類
              </label>
              <div className="grid grid-cols-4 gap-2">
                {mealTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setMealType(option.value as typeof mealType)}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      mealType === option.value
                        ? "border-orange-500 bg-orange-500/10 text-orange-400"
                        : "border-zinc-700 hover:border-zinc-600 text-zinc-400"
                    }`}
                  >
                    <span className="text-lg block mb-1">{option.icon}</span>
                    <span className="text-xs">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* 食品リスト */}
        <Card title="食品">
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="p-4 bg-zinc-800/50 rounded-lg space-y-3"
              >
                <div className="flex items-start justify-between">
                  <span className="text-sm text-zinc-500">食品 {index + 1}</span>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-zinc-500 hover:text-red-400 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                <Input
                  placeholder="食品名（例：ご飯、鶏肉など）"
                  value={item.foodName}
                  onChange={(e) => updateItem(item.id, "foodName", e.target.value)}
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="カロリー"
                    type="number"
                    placeholder="kcal"
                    value={item.calories || ""}
                    onChange={(e) => updateItem(item.id, "calories", parseInt(e.target.value) || 0)}
                  />
                  <Input
                    label="数量"
                    type="number"
                    placeholder="g / ml / 個"
                    value={item.quantity || ""}
                    onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Input
                    label="タンパク質 (g)"
                    type="number"
                    step="0.1"
                    value={item.protein || ""}
                    onChange={(e) => updateItem(item.id, "protein", parseFloat(e.target.value) || 0)}
                  />
                  <Input
                    label="炭水化物 (g)"
                    type="number"
                    step="0.1"
                    value={item.carbs || ""}
                    onChange={(e) => updateItem(item.id, "carbs", parseFloat(e.target.value) || 0)}
                  />
                  <Input
                    label="脂質 (g)"
                    type="number"
                    step="0.1"
                    value={item.fats || ""}
                    onChange={(e) => updateItem(item.id, "fats", parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addItem}
              className="w-full p-3 border-2 border-dashed border-zinc-700 rounded-lg text-zinc-400 hover:border-zinc-600 hover:text-zinc-300 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              食品を追加
            </button>
          </div>
        </Card>

        {/* メモ */}
        <Card title="メモ（任意）">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="食事に関するメモ..."
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            rows={3}
          />
        </Card>

        {/* 合計とエラー */}
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">合計カロリー</span>
            <span className="text-2xl font-bold text-orange-400">{totalCalories} kcal</span>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* 送信ボタン */}
        <div className="flex gap-3">
          <Link
            href="/meals"
            className="flex-1 py-3 px-4 border border-zinc-700 rounded-lg text-zinc-300 hover:bg-zinc-800 transition-all text-center"
          >
            キャンセル
          </Link>
          <Button
            type="submit"
            size="lg"
            className="flex-1"
            isLoading={isLoading}
          >
            更新する
          </Button>
        </div>
      </form>
    </div>
  );
}

