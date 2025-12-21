"use client"

import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface AnimatedButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger"
  size?: "sm" | "md" | "lg" | "icon"
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ 
    children, 
    className, 
    variant = "primary", 
    size = "md",
    isLoading = false,
    leftIcon,
    rightIcon,
    disabled,
    ...props 
  }, ref) => {
    const variants = {
      primary: "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/25",
      secondary: "bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700",
      ghost: "bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white",
      outline: "bg-transparent border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white",
      danger: "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/30"
    }

    const sizes = {
      sm: "px-3 py-1.5 text-sm rounded-lg gap-1.5",
      md: "px-5 py-2.5 text-base rounded-xl gap-2",
      lg: "px-8 py-4 text-lg rounded-2xl gap-3",
      icon: "p-3 rounded-xl"
    }

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        disabled={disabled || isLoading}
        className={cn(
          "font-semibold inline-flex items-center justify-center transition-all duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            />
            <span className="ml-2">読み込み中...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    )
  }
)
AnimatedButton.displayName = "AnimatedButton"

// Icon Button
interface IconButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  icon: React.ReactNode
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
  label?: string
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, className, variant = "ghost", size = "md", label, ...props }, ref) => {
    const variants = {
      primary: "bg-orange-500 text-white hover:bg-orange-600",
      secondary: "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white",
      ghost: "text-zinc-400 hover:text-white hover:bg-zinc-800"
    }

    const sizes = {
      sm: "p-2",
      md: "p-3",
      lg: "p-4"
    }

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={cn(
          "rounded-xl transition-colors",
          variants[variant],
          sizes[size],
          className
        )}
        aria-label={label}
        {...props}
      >
        {icon}
      </motion.button>
    )
  }
)
IconButton.displayName = "IconButton"

// Floating Action Button
interface FABProps extends Omit<HTMLMotionProps<"button">, "children"> {
  icon: React.ReactNode
  label?: string
}

export const FloatingActionButton = forwardRef<HTMLButtonElement, FABProps>(
  ({ icon, className, label, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={cn(
          "fixed bottom-24 right-6 z-40",
          "w-14 h-14 rounded-full",
          "bg-gradient-to-r from-orange-500 to-amber-500",
          "text-white shadow-lg shadow-orange-500/30",
          "flex items-center justify-center",
          "hover:shadow-xl hover:shadow-orange-500/40",
          className
        )}
        aria-label={label}
        {...props}
      >
        {icon}
      </motion.button>
    )
  }
)
FloatingActionButton.displayName = "FloatingActionButton"

