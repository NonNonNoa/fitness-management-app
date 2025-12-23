"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface AnimatedButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export function AnimatedButton({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  fullWidth = false,
  className,
  disabled,
  ...props
}: AnimatedButtonProps) {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900";
  
  const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 focus:ring-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.8)]",
    secondary: "bg-black/60 text-white border border-purple-500/30 hover:bg-black/80 hover:border-purple-500/50 focus:ring-purple-500",
    ghost: "text-purple-300/70 hover:text-white hover:bg-purple-500/10 focus:ring-purple-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]",
  };
  
  const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ duration: 0.15 }}
      disabled={disabled || loading}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        (disabled || loading) && "opacity-50 cursor-not-allowed",
        "font-bold",
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : icon ? (
        icon
      ) : null}
      {children}
    </motion.button>
  );
}


