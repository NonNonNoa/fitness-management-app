import { getMeals } from "@/lib/actions/meals";
import { getMealTypeLabel } from "@/lib/utils/meal-helpers";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default async function MealsPage() {
  const meals = await getMeals();

  // 日付ごとにグループ化
  const mealsByDate = meals.reduce((acc, meal) => {
    const date = meal.mealDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(meal);
    return acc;
  }, {} as Record<string, typeof meals>);

  const sortedDates = Object.keys(mealsByDate).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">食事記録</h1>
          <p className="text-zinc-400 mt-1">日々の食事を記録・管理</p>
        </div>
        <Link
          href="/meals/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium hover:from-orange-600 hover:to-red-700 transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          食事を記録
        </Link>
      </div>

      {/* 食事一覧 */}
      {sortedDates.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-zinc-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <p className="text-zinc-400 mb-4">まだ食事記録がありません</p>
            <Link
              href="/meals/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium hover:from-orange-600 hover:to-red-700 transition-all"
            >
              最初の食事を記録する
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => {
            const dayMeals = mealsByDate[date];
            const totalCalories = dayMeals.reduce((sum, m) => sum + (m.totalCalories || 0), 0);
            const formattedDate = new Date(date).toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "short",
            });

            return (
              <div key={date}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-white">{formattedDate}</h2>
                  <span className="text-sm text-zinc-400">
                    合計: <span className="text-orange-400 font-medium">{totalCalories}</span> kcal
                  </span>
                </div>
                <div className="grid gap-3">
                  {dayMeals.map((meal) => (
                    <MealCard key={meal.id} meal={meal} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MealCard({ meal }: { meal: Awaited<ReturnType<typeof getMeals>>[number] }) {
  const mealTypeColors: Record<string, string> = {
    breakfast: "from-yellow-500 to-orange-500",
    lunch: "from-green-500 to-emerald-500",
    dinner: "from-blue-500 to-purple-500",
    snack: "from-pink-500 to-rose-500",
  };

  const color = mealTypeColors[meal.mealType || "snack"];

  return (
    <Link href={`/meals/${meal.id}`}>
      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all group">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center`}>
              <span className="text-white text-sm font-bold">
                {getMealTypeLabel(meal.mealType || "snack").charAt(0)}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-white group-hover:text-orange-400 transition-colors">
                  {getMealTypeLabel(meal.mealType || "snack")}
                </span>
                {meal.mealTime && (
                  <span className="text-xs text-zinc-500">{meal.mealTime}</span>
                )}
              </div>
              {meal.notes && (
                <p className="text-sm text-zinc-500 mt-1 line-clamp-1">{meal.notes}</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-white">{meal.totalCalories || 0}</div>
            <div className="text-xs text-zinc-500">kcal</div>
          </div>
        </div>
        {/* 栄養素 */}
        <div className="flex gap-4 mt-3 pt-3 border-t border-zinc-800">
          <div className="text-xs">
            <span className="text-zinc-500">P</span>{" "}
            <span className="text-zinc-300">{meal.totalProtein?.toFixed(1) || 0}g</span>
          </div>
          <div className="text-xs">
            <span className="text-zinc-500">C</span>{" "}
            <span className="text-zinc-300">{meal.totalCarbs?.toFixed(1) || 0}g</span>
          </div>
          <div className="text-xs">
            <span className="text-zinc-500">F</span>{" "}
            <span className="text-zinc-300">{meal.totalFats?.toFixed(1) || 0}g</span>
          </div>
        </div>
      </div>
    </Link>
  );
}


