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
          <h1 className="text-2xl font-black text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]">トレーニング記録</h1>
          <p className="text-purple-300/70 mt-1 font-medium">日々のトレーニングを記録・管理</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/workouts/progress"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold hover:from-green-500 hover:to-emerald-500 transition-all shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:shadow-[0_0_30px_rgba(34,197,94,0.8)]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            重量変化を見る
          </Link>
          <Link
            href="/workouts/analytics"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold hover:from-blue-500 hover:to-cyan-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:shadow-[0_0_30px_rgba(37,99,235,0.8)]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            成長グラフ
          </Link>
          <Link
            href="/workouts/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:from-purple-500 hover:to-pink-500 transition-all shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.8)]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            トレーニングを記録
          </Link>
        </div>
      </div>

      {/* トレーニング一覧 */}
      {sortedDates.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-purple-400/50"
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
            <p className="text-purple-300/70 mb-4 font-medium">まだトレーニング記録がありません</p>
            <Link
              href="/workouts/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:from-purple-500 hover:to-pink-500 transition-all shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.8)]"
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
                  <h2 className="text-lg font-bold text-white">{formattedDate}</h2>
                  <span className="text-sm text-purple-300/70">
                    総ボリューム: <span className="text-purple-300 font-bold drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]">{totalVolume.toLocaleString()}</span> kg
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
      <div className="p-4 bg-black/60 border border-purple-500/30 rounded-xl hover:border-purple-400/50 transition-all group shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.6)]">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-white group-hover:text-purple-300 transition-colors">
                トレーニング
              </span>
              {workout.durationMinutes && (
                <p className="text-sm text-purple-300/60 font-medium">
                  {workout.durationMinutes}分
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-black text-white drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]">
              {(workout.totalVolume || 0).toLocaleString()}
            </div>
            <div className="text-xs text-purple-300/60 font-medium">kg (総ボリューム)</div>
          </div>
        </div>
        
        {/* 追加情報 */}
        <div className="flex gap-4 mt-3 pt-3 border-t border-purple-500/20">
          <div className="text-xs">
            <span className="text-purple-300/60 font-medium">消費カロリー</span>{" "}
            <span className="text-purple-300 font-bold">{workout.caloriesBurned || 0} kcal</span>
          </div>
          {workout.notes && (
            <div className="text-xs text-purple-300/60 truncate flex-1 font-medium">
              {workout.notes}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}


