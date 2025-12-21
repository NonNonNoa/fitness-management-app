import { getWorkouts } from "@/lib/actions/workouts";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default async function WorkoutsPage() {
  const workoutList = await getWorkouts();

  // 日付ごとにグループ化
  const workoutsByDate = workoutList.reduce((acc, workout) => {
    const date = workout.workoutDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(workout);
    return acc;
  }, {} as Record<string, typeof workoutList>);

  const sortedDates = Object.keys(workoutsByDate).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">トレーニング記録</h1>
          <p className="text-zinc-400 mt-1">日々のトレーニングを記録・管理</p>
        </div>
        <Link
          href="/workouts/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium hover:from-orange-600 hover:to-red-700 transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          トレーニングを記録
        </Link>
      </div>

      {/* トレーニング一覧 */}
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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <p className="text-zinc-400 mb-4">まだトレーニング記録がありません</p>
            <Link
              href="/workouts/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium hover:from-orange-600 hover:to-red-700 transition-all"
            >
              最初のトレーニングを記録する
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => {
            const dayWorkouts = workoutsByDate[date];
            const totalVolume = dayWorkouts.reduce((sum, w) => sum + (w.totalVolume || 0), 0);
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
                    総ボリューム: <span className="text-orange-400 font-medium">{totalVolume.toLocaleString()}</span> kg
                  </span>
                </div>
                <div className="grid gap-3">
                  {dayWorkouts.map((workout) => (
                    <WorkoutCard key={workout.id} workout={workout} />
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

function WorkoutCard({ workout }: { workout: Awaited<ReturnType<typeof getWorkouts>>[number] }) {
  return (
    <Link href={`/workouts/${workout.id}`}>
      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all group">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <span className="font-medium text-white group-hover:text-orange-400 transition-colors">
                トレーニング
              </span>
              {workout.durationMinutes && (
                <p className="text-sm text-zinc-500">
                  {workout.durationMinutes}分
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-white">
              {(workout.totalVolume || 0).toLocaleString()}
            </div>
            <div className="text-xs text-zinc-500">kg (総ボリューム)</div>
          </div>
        </div>
        
        {/* 追加情報 */}
        <div className="flex gap-4 mt-3 pt-3 border-t border-zinc-800">
          <div className="text-xs">
            <span className="text-zinc-500">消費カロリー</span>{" "}
            <span className="text-zinc-300">{workout.caloriesBurned || 0} kcal</span>
          </div>
          {workout.notes && (
            <div className="text-xs text-zinc-500 truncate flex-1">
              {workout.notes}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}


