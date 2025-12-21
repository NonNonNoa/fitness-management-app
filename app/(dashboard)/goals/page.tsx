import { getGoals, getBodyCompositions } from "@/lib/actions/goals";
import { getGoalTypeLabel, calculateProgress } from "@/lib/utils/goal-helpers";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default async function GoalsPage() {
  const [goalsList, bodyComps] = await Promise.all([
    getGoals(),
    getBodyCompositions(7),
  ]);

  const activeGoals = goalsList.filter((g) => g.isActive);
  const completedGoals = goalsList.filter((g) => !g.isActive);
  const latestWeight = bodyComps[0]?.weightKg;

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">目標設定</h1>
          <p className="text-zinc-400 mt-1">あなたの目標を設定・管理</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/goals/weight"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
            体重記録
          </Link>
          <Link
            href="/goals/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium hover:from-orange-600 hover:to-red-700 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            新しい目標
          </Link>
        </div>
      </div>

      {/* 現在の体重 */}
      {latestWeight && (
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">現在の体重</p>
              <p className="text-3xl font-bold text-white">{latestWeight} kg</p>
            </div>
            <Link
              href="/goals/weight"
              className="text-sm text-orange-400 hover:text-orange-300"
            >
              体重を記録 →
            </Link>
          </div>
        </Card>
      )}

      {/* アクティブな目標 */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">アクティブな目標</h2>
        {activeGoals.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <svg
                className="w-12 h-12 mx-auto mb-4 text-zinc-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
              <p className="text-zinc-400 mb-4">まだ目標が設定されていません</p>
              <Link
                href="/goals/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium hover:from-orange-600 hover:to-red-700 transition-all"
              >
                目標を設定する
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {activeGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        )}
      </div>

      {/* 完了した目標 */}
      {completedGoals.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">完了した目標</h2>
          <div className="grid gap-4">
            {completedGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} isCompleted />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function GoalCard({
  goal,
  isCompleted = false,
}: {
  goal: Awaited<ReturnType<typeof getGoals>>[number];
  isCompleted?: boolean;
}) {
  const progress = calculateProgress(
    goal.goalType,
    goal.currentValue,
    goal.targetValue
  );

  const goalTypeColors: Record<string, string> = {
    muscle_gain: "from-purple-500 to-pink-500",
    weight_loss: "from-blue-500 to-cyan-500",
    weight_gain: "from-green-500 to-emerald-500",
    strength: "from-orange-500 to-red-500",
  };

  const color = goalTypeColors[goal.goalType] || "from-zinc-500 to-zinc-600";

  return (
    <Link href={`/goals/${goal.id}`}>
      <div
        className={`p-4 bg-zinc-900 border rounded-xl transition-all group ${
          isCompleted
            ? "border-zinc-800 opacity-60"
            : "border-zinc-800 hover:border-zinc-700"
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center`}
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
            <div>
              <span
                className={`font-medium ${
                  isCompleted
                    ? "text-zinc-400"
                    : "text-white group-hover:text-orange-400"
                } transition-colors`}
              >
                {getGoalTypeLabel(goal.goalType)}
              </span>
              <p className="text-sm text-zinc-500">
                開始日: {new Date(goal.startDate).toLocaleDateString("ja-JP")}
              </p>
            </div>
          </div>
          <div className="text-right">
            {goal.targetValue && (
              <>
                <div className="text-lg font-bold text-white">
                  {goal.currentValue || "-"} / {goal.targetValue}
                </div>
                <div className="text-xs text-zinc-500">
                  {goal.goalType.includes("weight") ? "kg" : ""}
                </div>
              </>
            )}
          </div>
        </div>

        {/* 進捗バー */}
        {goal.targetValue && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-zinc-500">進捗</span>
              <span className="text-xs text-zinc-400">{progress.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${color} transition-all duration-500`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* 目標日 */}
        {goal.targetDate && (
          <p className="text-xs text-zinc-500 mt-3">
            目標日: {new Date(goal.targetDate).toLocaleDateString("ja-JP")}
          </p>
        )}
      </div>
    </Link>
  );
}


