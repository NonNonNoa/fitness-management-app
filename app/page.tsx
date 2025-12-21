import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      {/* 背景エフェクト */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/20 via-transparent to-transparent" />
      
      {/* ヘッダー */}
      <header className="relative z-10 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">フィットネスAI</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                ログイン
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium hover:from-orange-600 hover:to-red-700 transition-all"
              >
                始める
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ヒーローセクション */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight">
              AIで最適化する
              <span className="block mt-2 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                あなたのフィットネス
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto">
              食事管理からトレーニングまで、AIがあなたの目標達成をサポート。
              筋力アップ、ダイエット、体重増加。あなたの目標に合わせた最適なプランを提案します。
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold text-lg hover:from-orange-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
              >
                無料で始める
                <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg border-2 border-zinc-700 text-white font-semibold text-lg hover:bg-zinc-800 transition-all"
              >
                機能を見る
              </Link>
            </div>
          </div>
        </div>

        {/* 機能セクション */}
        <section id="features" className="py-24 border-t border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                主な機能
              </h2>
              <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
                あなたのフィットネスジャーニーをサポートする機能
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
                title="写真でカロリー計算"
                description="食事の写真を撮るだけで、AIが自動でカロリーと栄養素を計算。外出先でも簡単に記録できます。"
              />
              <FeatureCard
                icon={
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                }
                title="トレーニング記録"
                description="種目、重量、セット数、レップ数を記録。部位別の種目選択や、重量の推移をグラフで確認できます。"
              />
              <FeatureCard
                icon={
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                }
                title="AIトレーニングプラン"
                description="目標に応じたトレーニングプランをAIが自動生成。初心者から上級者まで対応します。"
              />
              <FeatureCard
                icon={
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                title="重量達成予測"
                description="トレーニングデータから、目標重量の達成時期をAIが予測。モチベーションを維持できます。"
              />
              <FeatureCard
                icon={
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
                title="友達と競争"
                description="友達と重量やダイエットを競い合えます。ランキング機能でモチベーションアップ。"
              />
              <FeatureCard
                icon={
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                }
                title="達成通知"
                description="目標達成時に有名アスリートの記録と比較。「あなたのベンチプレス100kgは○○選手と同じ！」"
              />
            </div>
          </div>
        </section>

        {/* CTAセクション */}
        <section className="py-24 border-t border-zinc-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              今すぐ始めよう
            </h2>
            <p className="mt-4 text-lg text-zinc-400">
              無料で始められます。あなたのフィットネスを次のレベルへ。
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center mt-8 px-8 py-4 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold text-lg hover:from-orange-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
            >
              Googleでログイン
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      {/* フッター */}
      <footer className="relative z-10 border-t border-zinc-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-bold text-white">フィットネスAI</span>
            </div>
            <p className="text-sm text-zinc-500">
              © 2024 フィットネスAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all">
      <div className="inline-flex p-3 rounded-lg bg-gradient-to-r from-orange-500/20 to-red-600/20 text-orange-400 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm">{description}</p>
    </div>
  );
}
