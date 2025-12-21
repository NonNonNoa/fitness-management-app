"use client"

import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface AnimatedCardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  children: React.ReactNode
  variant?: "default" | "glass" | "glow" | "gradient"
  hover?: boolean
  delay?: number
}

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ children, className, variant = "default", hover = true, delay = 0, ...props }, ref) => {
    const variants = {
      default: "bg-zinc-900/80 border border-zinc-800",
      glass: "glass border border-zinc-700/50",
      glow: "bg-zinc-900 border border-orange-500/30 shadow-[0_0_30px_rgba(249,115,22,0.15)]",
      gradient: "bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800"
    }

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay
        }}
        whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
        whileTap={hover ? { scale: 0.98 } : undefined}
        className={cn(
          "rounded-2xl p-6 transition-shadow duration-300",
          variants[variant],
          hover && "hover:shadow-xl hover:shadow-black/20",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
AnimatedCard.displayName = "AnimatedCard"

// カードヘッダー
export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center justify-between mb-4", className)}>
      {children}
    </div>
  )
}

// カードタイトル
export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn("text-lg font-bold text-white", className)}>
      {children}
    </h3>
  )
}

// カードの説明
export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-sm text-zinc-400", className)}>
      {children}
    </p>
  )
}

// カードコンテンツ
export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  )
}

// カードフッター
export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center justify-between mt-4 pt-4 border-t border-zinc-800", className)}>
      {children}
    </div>
  )
}

// Stats Card - 数値を表示するカード
interface StatsCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  trend?: { value: number; isPositive: boolean }
  delay?: number
  className?: string
}

export function StatsCard({ title, value, icon, trend, delay = 0, className }: StatsCardProps) {
  return (
    <AnimatedCard delay={delay} className={cn("", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-400 mb-1">{title}</p>
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.2, type: "spring", stiffness: 200 }}
            className="text-3xl font-bold text-white"
          >
            {value}
          </motion.p>
          {trend && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.4 }}
              className={cn(
                "text-sm mt-1 flex items-center gap-1",
                trend.isPositive ? "text-green-500" : "text-red-500"
              )}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </motion.p>
          )}
        </div>
        {icon && (
          <motion.div
            initial={{ opacity: 0, rotate: -20 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: delay + 0.1 }}
            className="p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 text-orange-500"
          >
            {icon}
          </motion.div>
        )}
      </div>
    </AnimatedCard>
  )
}

// Action Card - CTAを含むカード
interface ActionCardProps {
  title: string
  description: string
  icon?: React.ReactNode
  action?: React.ReactNode
  delay?: number
  className?: string
}

export function ActionCard({ title, description, icon, action, delay = 0, className }: ActionCardProps) {
  return (
    <AnimatedCard delay={delay} variant="gradient" className={cn("group", className)}>
      <div className="flex items-center gap-4">
        {icon && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 text-orange-500 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        )}
        <div className="flex-1">
          <h4 className="font-bold text-white mb-1">{title}</h4>
          <p className="text-sm text-zinc-400">{description}</p>
        </div>
        {action}
      </div>
    </AnimatedCard>
  )
}

