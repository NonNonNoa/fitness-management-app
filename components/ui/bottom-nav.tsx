/**
 * @fileoverview モバイル用ボトムナビゲーションコンポーネント
 * アプリの主要ページへのナビゲーションを提供する固定フッター
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Utensils, Dumbbell, Target, User } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ナビゲーションアイテムの定義
 */
const navItems = [
  { href: "/dashboard", icon: Home, label: "ホーム" },
  { href: "/meals", icon: Utensils, label: "食事" },
  { href: "/workouts", icon: Dumbbell, label: "筋トレ" },
  { href: "/goals", icon: Target, label: "目標" },
  { href: "/profile", icon: User, label: "設定" },
];

/**
 * モバイル用ボトムナビゲーションコンポーネント
 * 画面下部に固定表示され、主要ページへのナビゲーションを提供
 * md以上の画面サイズでは非表示になる
 * @returns {JSX.Element} ボトムナビゲーション要素
 * @description
 * - 現在のページに応じてアクティブ状態を表示
 * - アニメーション付きのインジケーターで現在位置を示す
 * - safe-area-bottomでノッチ付きデバイスに対応
 */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg border-t border-purple-500/30 md:hidden safe-area-bottom shadow-[0_0_30px_rgba(168,85,247,0.2)]"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center flex-1 h-full"
            >
              <motion.div
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 p-2 rounded-xl transition-colors",
                  isActive ? "text-purple-300" : "text-purple-300/50"
                )}
                whileTap={{ scale: 0.9 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute inset-x-2 top-1 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.8)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
