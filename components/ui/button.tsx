/**
 * @fileoverview 再利用可能なボタンコンポーネント
 * 複数のバリアントとサイズをサポートするカスタムボタン
 */
"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";

/**
 * ボタンコンポーネントのプロパティ
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** ボタンのスタイルバリアント */
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  /** ボタンのサイズ */
  size?: "sm" | "md" | "lg";
  /** ローディング状態 */
  isLoading?: boolean;
}

/**
 * カスタマイズ可能なボタンコンポーネント
 * @param {ButtonProps} props - ボタンのプロパティ
 * @returns {JSX.Element} ボタン要素
 * @example
 * // プライマリボタン
 * <Button variant="primary" size="lg">送信</Button>
 * 
 * // ローディング状態
 * <Button isLoading>処理中</Button>
 * 
 * // アウトラインボタン
 * <Button variant="outline">キャンセル</Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 focus:ring-purple-500 shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70",
      secondary:
        "bg-black/60 border border-purple-500/30 text-white hover:bg-black/80 hover:border-purple-500/50 focus:ring-purple-500",
      outline:
        "border-2 border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 focus:ring-purple-500",
      ghost:
        "text-purple-300 hover:bg-purple-500/10 hover:text-white focus:ring-purple-500",
      danger:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg shadow-red-500/50",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            読み込み中...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
