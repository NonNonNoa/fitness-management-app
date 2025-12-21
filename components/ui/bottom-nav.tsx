"use client"

import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { 
  Home, 
  Utensils, 
  Dumbbell, 
  Target, 
  User 
} from "lucide-react"

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "ホーム", icon: <Home size={24} /> },
  { href: "/meals", label: "食事", icon: <Utensils size={24} /> },
  { href: "/workouts", label: "筋トレ", icon: <Dumbbell size={24} /> },
  { href: "/goals", label: "目標", icon: <Target size={24} /> },
  { href: "/profile", label: "設定", icon: <User size={24} /> },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-zinc-950/90 backdrop-blur-xl",
        "border-t border-zinc-800/50",
        "pb-safe"
      )}
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center w-16 h-full"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "flex flex-col items-center gap-0.5 transition-colors",
                  isActive ? "text-orange-500" : "text-zinc-500"
                )}
              >
                {/* アクティブインジケーター */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-0.5 w-12 h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                {/* アイコン */}
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    y: isActive ? -2 : 0
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {item.icon}
                </motion.div>
                
                {/* ラベル */}
                <span className={cn(
                  "text-[10px] font-medium transition-colors",
                  isActive ? "text-orange-500" : "text-zinc-500"
                )}>
                  {item.label}
                </span>
              </motion.div>
            </Link>
          )
        })}
      </div>
    </motion.nav>
  )
}

// ページコンテンツのラッパー（ボトムナビの高さ分の余白を確保）
export function PageContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <main className={cn("pb-24 min-h-screen", className)}>
      {children}
    </main>
  )
}

