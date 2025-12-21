"use client"

import { motion, HTMLMotionProps, Variants } from "framer-motion"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

// アニメーション設定
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 }
}

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 }
}

export const slideRight: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
}

export const scale: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

// デフォルトトランジション
export const defaultTransition = {
  type: "spring",
  stiffness: 260,
  damping: 20
}

export const smoothTransition = {
  type: "spring",
  stiffness: 100,
  damping: 15
}

// Motion Div
interface MotionDivProps extends HTMLMotionProps<"div"> {
  className?: string
}

export const MotionDiv = forwardRef<HTMLDivElement, MotionDivProps>(
  ({ className, ...props }, ref) => (
    <motion.div ref={ref} className={className} {...props} />
  )
)
MotionDiv.displayName = "MotionDiv"

// Fade In コンテナ
interface FadeInProps extends HTMLMotionProps<"div"> {
  delay?: number
  children: React.ReactNode
}

export function FadeIn({ children, delay = 0, className, ...props }: FadeInProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ duration: 0.5, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Slide Up コンテナ
export function SlideUp({ children, delay = 0, className, ...props }: FadeInProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={slideUp}
      transition={{ ...defaultTransition, delay, type: "spring" as const }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Stagger コンテナ（子要素を順番にアニメーション）
interface StaggerProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function StaggerContainer({ children, className, delay = 0 }: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: delay,
            staggerChildren: 0.08
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={slideUp}
      transition={{ ...defaultTransition, type: "spring" as const }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Hover Scale
interface HoverScaleProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode
  scale?: number
}

export function HoverScale({ children, scale = 1.02, className, ...props }: HoverScaleProps) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Page Transition
export function PageTransition({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Pulse Animation（アクティブ状態を示す）
export function PulseGlow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      animate={{
        boxShadow: [
          "0 0 0 0 rgba(249, 115, 22, 0.4)",
          "0 0 0 10px rgba(249, 115, 22, 0)",
        ]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop"
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Counter Animation（数字をカウントアップ）
interface CounterProps {
  value: number
  duration?: number
  className?: string
}

export function AnimatedCounter({ value, duration = 1, className }: CounterProps) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("tabular-nums", className)}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        key={value}
      >
        {value.toLocaleString()}
      </motion.span>
    </motion.span>
  )
}

// Progress Bar Animation
interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  color?: string
}

export function AnimatedProgressBar({ value, max = 100, className, color }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)
  
  return (
    <div className={cn("h-2 bg-zinc-800 rounded-full overflow-hidden", className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={cn("h-full rounded-full", color || "bg-gradient-to-r from-orange-500 to-amber-500")}
      />
    </div>
  )
}

// Skeleton Loader
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("skeleton rounded-lg", className)} />
  )
}

// Loading Spinner
export function LoadingSpinner({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={className}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-full h-full"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="opacity-20"
        />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="text-orange-500"
        />
      </svg>
    </motion.div>
  )
}

