/**
 * @fileoverview 入力フィールドコンポーネント
 * ラベル、エラー表示、ヘルパーテキストをサポートする入力フィールド
 */
"use client";

import { forwardRef, InputHTMLAttributes } from "react";

/**
 * 入力フィールドのプロパティ
 */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** ラベルテキスト */
  label?: string;
  /** エラーメッセージ */
  error?: string;
  /** ヘルパーテキスト（エラーがない場合に表示） */
  helperText?: string;
}

/**
 * スタイル付き入力フィールドコンポーネント
 * @param {InputProps} props - 入力フィールドのプロパティ
 * @returns {JSX.Element} 入力フィールド要素
 * @example
 * // 基本的な使用
 * <Input label="メールアドレス" type="email" placeholder="example@mail.com" />
 * 
 * // エラー表示
 * <Input label="パスワード" type="password" error="パスワードが短すぎます" />
 * 
 * // ヘルパーテキスト付き
 * <Input label="ユーザー名" helperText="3-20文字で入力してください" />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-zinc-300 mb-1"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-2.5 
            bg-zinc-800 border border-zinc-700 
            text-white placeholder-zinc-500
            rounded-lg
            focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-red-500 focus:ring-red-500" : ""}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-zinc-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
