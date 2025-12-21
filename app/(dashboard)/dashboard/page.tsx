"use client";

import { useSession } from "@/lib/auth/client";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const today = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          こんにちは、{session?.user?.name?.split(" ")[0] || "ユーザー"}さん！
        </h1>
        <p className="text-zinc-400 mt-1">{today}</p>
      </div>

      {/* クイックアクション */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickActionCard
          title="食事を記録"
          description="今日の食事を記録しましょう"
          href="/meals/new"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          }
          color="from-green-500 to-emerald-600"
        />
        <QuickActionCard
          title="トレーニング開始"
          description="今日のトレーニングを記録"
          href="/workouts/new"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
          color="from-orange-500 to-red-600"
        />
        <QuickActionCard
          title="体重を記録"
          description="今日の体重を記録"
          href="/goals"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          }
          color="from-blue-500 to-cyan-600"
        />
        <QuickActionCard
          title="目標を設定"
          description="新しい目標を設定"
          href="/goals/new"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          }
          color="from-purple-500 to-pink-600"
        />
      </div>

      {/* 今日のサマリー */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="今日のカロリー">
          <div className="text-center py-4">
            <div className="text-4xl font-bold text-white">0</div>
            <div className="text-zinc-400 mt-1">/ 2,000 kcal</div>
            <div className="mt-4 h-2 bg-zinc-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-500 to-red-600 w-0"></div>
            </div>
          </div>
        </Card>

        <Card title="今日のトレーニング">
          <div className="text-center py-4">
            <div className="text-4xl font-bold text-white">0</div>
            <div className="text-zinc-400 mt-1">セット完了</div>
            <p className="mt-4 text-sm text-zinc-500">
              まだトレーニングを記録していません
            </p>
          </div>
        </Card>

        <Card title="目標達成状況">
          <div className="text-center py-4">
            <div className="text-4xl font-bold text-white">-</div>
            <div className="text-zinc-400 mt-1">目標未設定</div>
            <Link
              href="/goals/new"
              className="inline-block mt-4 text-sm text-orange-400 hover:text-orange-300"
            >
              目標を設定する →
            </Link>
          </div>
        </Card>
      </div>

      {/* 最近のアクティビティ */}
      <Card title="最近のアクティビティ">
        <div className="text-center py-8 text-zinc-500">
          <svg className="w-12 h-12 mx-auto mb-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p>まだアクティビティがありません</p>
          <p className="text-sm mt-2">食事やトレーニングを記録して始めましょう！</p>
        </div>
      </Card>
    </div>
  );
}

function QuickActionCard({
  title,
  description,
  href,
  icon,
  color,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Link href={href}>
      <div className="group p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all duration-200 hover:shadow-lg">
        <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${color} mb-3`}>
          <div className="text-white">{icon}</div>
        </div>
        <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-zinc-500 mt-1">{description}</p>
      </div>
    </Link>
  );
}

