"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const AnimatedInput = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1.5"
      >
        {label && (
          <label className="block text-sm font-medium text-zinc-300">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500",
              "focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500",
              "transition-all duration-200",
              icon && "pl-10",
              error && "border-red-500 focus:ring-red-500/50",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-red-400"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    );
  }
);

AnimatedInput.displayName = "AnimatedInput";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const AnimatedSelect = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, ...props }, ref) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1.5"
      >
        {label && (
          <label className="block text-sm font-medium text-zinc-300">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            "w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white",
            "focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500",
            "transition-all duration-200 appearance-none cursor-pointer",
            error && "border-red-500 focus:ring-red-500/50",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-zinc-900">
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-red-400"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    );
  }
);

AnimatedSelect.displayName = "AnimatedSelect";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const AnimatedTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1.5"
      >
        {label && (
          <label className="block text-sm font-medium text-zinc-300">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500",
            "focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500",
            "transition-all duration-200 resize-none",
            error && "border-red-500 focus:ring-red-500/50",
            className
          )}
          {...props}
        />
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-red-400"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    );
  }
);

AnimatedTextarea.displayName = "AnimatedTextarea";


