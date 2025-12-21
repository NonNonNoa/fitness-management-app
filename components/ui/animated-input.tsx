"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { forwardRef, useState } from "react"
import { Eye, EyeOff, Search, X } from "lucide-react"

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, type, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const isPassword = type === "password"
    const inputType = isPassword && showPassword ? "text" : type

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        {label && (
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
              {leftIcon}
            </div>
          )}
          
          <motion.div
            animate={{
              boxShadow: isFocused
                ? "0 0 0 2px rgba(249, 115, 22, 0.3)"
                : error
                  ? "0 0 0 2px rgba(239, 68, 68, 0.3)"
                  : "none"
            }}
            className="rounded-xl"
          >
            <input
              ref={ref}
              type={inputType}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={cn(
                "w-full px-4 py-3.5 rounded-xl",
                "bg-zinc-900 border border-zinc-800",
                "text-white placeholder:text-zinc-500",
                "transition-all duration-200",
                "focus:outline-none focus:border-orange-500/50",
                "hover:border-zinc-700",
                leftIcon && "pl-12",
                (rightIcon || isPassword) && "pr-12",
                error && "border-red-500/50",
                className
              )}
              {...props}
            />
          </motion.div>
          
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
          
          {rightIcon && !isPassword && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm mt-2"
          >
            {error}
          </motion.p>
        )}
        
        {helperText && !error && (
          <p className="text-zinc-500 text-sm mt-2">{helperText}</p>
        )}
      </motion.div>
    )
  }
)
AnimatedInput.displayName = "AnimatedInput"

// Search Input
interface SearchInputProps extends Omit<AnimatedInputProps, "leftIcon" | "rightIcon"> {
  onClear?: () => void
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onClear, ...props }, ref) => {
    return (
      <div className="relative">
        <AnimatedInput
          ref={ref}
          type="search"
          value={value}
          leftIcon={<Search size={20} />}
          rightIcon={
            value ? (
              <button
                type="button"
                onClick={onClear}
                className="p-1 hover:bg-zinc-800 rounded-full transition-colors"
              >
                <X size={16} />
              </button>
            ) : null
          }
          className={cn("", className)}
          {...props}
        />
      </div>
    )
  }
)
SearchInput.displayName = "SearchInput"

// Number Input with + / - buttons
interface NumberInputProps extends Omit<AnimatedInputProps, "type" | "onChange" | "value"> {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  unit?: string
}

export function NumberInput({ 
  value, 
  onChange, 
  min = 0, 
  max = 9999, 
  step = 1,
  unit,
  label,
  className,
  ...props 
}: NumberInputProps) {
  const handleIncrement = () => {
    const newValue = Math.min(value + step, max)
    onChange(newValue)
  }

  const handleDecrement = () => {
    const newValue = Math.max(value - step, min)
    onChange(newValue)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("w-full", className)}
    >
      {label && (
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          {label}
        </label>
      )}
      
      <div className="flex items-center gap-3">
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDecrement}
          disabled={value <= min}
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            "bg-zinc-800 text-white text-xl font-bold",
            "hover:bg-zinc-700 transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          −
        </motion.button>
        
        <div className="flex-1 flex items-center justify-center gap-2">
          <input
            type="number"
            value={value}
            onChange={(e) => {
              const newValue = parseFloat(e.target.value) || min
              onChange(Math.min(Math.max(newValue, min), max))
            }}
            className={cn(
              "w-20 text-center py-3 rounded-xl",
              "bg-zinc-900 border border-zinc-800",
              "text-2xl font-bold text-white",
              "focus:outline-none focus:border-orange-500/50"
            )}
            {...props}
          />
          {unit && (
            <span className="text-lg text-zinc-400 font-medium">{unit}</span>
          )}
        </div>
        
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleIncrement}
          disabled={value >= max}
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            "bg-zinc-800 text-white text-xl font-bold",
            "hover:bg-zinc-700 transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          +
        </motion.button>
      </div>
    </motion.div>
  )
}

// Textarea
interface AnimatedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const AnimatedTextarea = forwardRef<HTMLTextAreaElement, AnimatedTextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        {label && (
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            {label}
          </label>
        )}
        
        <motion.div
          animate={{
            boxShadow: isFocused
              ? "0 0 0 2px rgba(249, 115, 22, 0.3)"
              : error
                ? "0 0 0 2px rgba(239, 68, 68, 0.3)"
                : "none"
          }}
          className="rounded-xl"
        >
          <textarea
            ref={ref}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              "w-full px-4 py-3.5 rounded-xl resize-none",
              "bg-zinc-900 border border-zinc-800",
              "text-white placeholder:text-zinc-500",
              "transition-all duration-200",
              "focus:outline-none focus:border-orange-500/50",
              "hover:border-zinc-700",
              "min-h-[120px]",
              error && "border-red-500/50",
              className
            )}
            {...props}
          />
        </motion.div>
        
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm mt-2"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    )
  }
)
AnimatedTextarea.displayName = "AnimatedTextarea"

// Select Input
interface SelectOption {
  value: string
  label: string
  icon?: React.ReactNode
}

interface AnimatedSelectProps {
  label?: string
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  className?: string
}

export function AnimatedSelect({ 
  label, 
  options, 
  value, 
  onChange, 
  placeholder = "選択してください",
  error,
  className 
}: AnimatedSelectProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("w-full", className)}
    >
      {label && (
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          {label}
        </label>
      )}
      
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full px-4 py-3.5 rounded-xl appearance-none cursor-pointer",
          "bg-zinc-900 border border-zinc-800",
          "text-white",
          "transition-all duration-200",
          "focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20",
          "hover:border-zinc-700",
          error && "border-red-500/50",
          !value && "text-zinc-500"
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 1rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em'
        }}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm mt-2"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  )
}

