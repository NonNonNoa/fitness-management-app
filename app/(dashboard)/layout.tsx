"use client";

import { useSession } from "@/lib/auth/client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Home, Utensils, Dumbbell, Target, User, Zap, 
  Menu, X 
} from "lucide-react";
import { BottomNav } from "@/components/ui/bottom-nav";
import { MusicPlayer } from "@/components/ui/music-player";
import { useState } from "react";

const sidebarItems = [
  { href: "/dashboard", icon: Home, label: "ダッシュボード" },
  { href: "/meals", icon: Utensils, label: "食事管理" },
  { href: "/workouts", icon: Dumbbell, label: "トレーニング" },
  { href: "/goals", icon: Target, label: "目標" },
  { href: "/ai", icon: Zap, label: "AI機能" },
  { href: "/profile", icon: User, label: "プロフィール" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  // モバイルでページ遷移時にサイドバーを閉じる
  const prevPathname = pathname;
  if (prevPathname !== pathname && sidebarOpen) {
    // 非同期でstateを更新してカスケードを避ける
    queueMicrotask(() => setSidebarOpen(false));
  }

  if (isPending) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full shadow-[0_0_20px_rgba(168,85,247,0.6)]"
        />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black relative">
      {/* アニメーション背景オーバーレイ - Phonkテーマ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-black/80 backdrop-blur-lg border-r border-purple-500/30 flex-col shadow-[0_0_30px_rgba(168,85,247,0.2)]">
        {/* Logo */}
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.6)]">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-white tracking-tight">XPLOSION</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                        : "text-purple-300/70 hover:text-white hover:bg-purple-500/10"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="sidebarIndicator"
                        className="absolute left-0 w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-r-full shadow-[0_0_10px_rgba(168,85,247,0.8)]"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User */}
        <div className="p-4 border-t border-purple-500/30">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-10 h-10 rounded-full bg-black/60 border border-purple-500/30 overflow-hidden">
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">
                {session.user?.name}
              </p>
              <p className="text-xs text-purple-300/70 truncate">
                {session.user?.email}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg border-b border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.6)]">
              <Dumbbell className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-black text-white tracking-tight">XPLOSION</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 text-zinc-400" />
            ) : (
              <Menu className="w-5 h-5 text-zinc-400" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="md:hidden fixed inset-0 z-40 bg-black/60"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed left-0 top-0 bottom-0 w-64 z-50 bg-black/95 backdrop-blur-lg border-r border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.3)]"
            >
              <div className="p-6">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.6)]">
                    <Dumbbell className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-black text-white tracking-tight">XPLOSION</span>
                </Link>
              </div>
              <nav className="px-3 py-4">
                <ul className="space-y-1">
                  {sidebarItems.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                    const Icon = item.icon;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                            isActive
                              ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                              : "text-purple-300/70 hover:text-white hover:bg-purple-500/10"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="md:ml-64 pt-14 md:pt-0 pb-20 md:pb-0 relative z-10">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ 
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1]
              }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Nav (Mobile) */}
      <BottomNav />

      {/* Music Player */}
      <MusicPlayer />
    </div>
  );
}
