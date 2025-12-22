/**
 * @fileoverview ローディング関連コンポーネント
 * スピナー、ページローディング、オーバーレイ、スケルトンなどを提供
 */
"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ローディングスピナーのプロパティ
 */
interface LoadingSpinnerProps {
  /** スピナーのサイズ */
  size?: "sm" | "md" | "lg";
  /** 追加のCSSクラス */
  className?: string;
}

/**
 * アニメーション付きローディングスピナー
 * @param {LoadingSpinnerProps} props - スピナーのプロパティ
 * @returns {JSX.Element} スピナー要素
 * @example
 * <LoadingSpinner size="lg" />
 */
export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={cn(
        "border-4 border-orange-500 border-t-transparent rounded-full",
        sizeClasses[size],
        className
      )}
    />
  );
}

/**
 * ページ全体のローディング表示
 * @returns {JSX.Element} ページローディング要素
 * @example
 * if (isLoading) return <LoadingPage />;
 */
export function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <LoadingSpinner size="lg" />
    </div>
  );
}

/**
 * ローディングオーバーレイのプロパティ
 */
interface LoadingOverlayProps {
  /** オプションのメッセージ */
  message?: string;
}

/**
 * 画面全体を覆うローディングオーバーレイ
 * @param {LoadingOverlayProps} props - オーバーレイのプロパティ
 * @returns {JSX.Element} オーバーレイ要素
 * @example
 * <LoadingOverlay message="データを保存中..." />
 */
export function LoadingOverlay({ message }: LoadingOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-sm"
    >
      <LoadingSpinner size="lg" />
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-zinc-400"
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );
}

/**
 * ローディング状態を持つボタンのプロパティ
 */
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** ローディング状態 */
  loading?: boolean;
  /** ボタンの内容 */
  children: React.ReactNode;
}

/**
 * ローディング状態を表示できるボタン
 * @param {LoadingButtonProps} props - ボタンのプロパティ
 * @returns {JSX.Element} ボタン要素
 * @example
 * <LoadingButton loading={isSubmitting}>送信</LoadingButton>
 */
export function LoadingButton({
  loading,
  children,
  ...props
}: LoadingButtonProps) {
  return (
    <button
      disabled={loading}
      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50"
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}

/**
 * コンテンツ読み込み中のスケルトン表示
 * @param {React.HTMLAttributes<HTMLDivElement>} props - divのプロパティ
 * @returns {JSX.Element} スケルトン要素
 * @example
 * <Skeleton className="h-4 w-32" />
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-zinc-800",
        className
      )}
      {...props}
    />
  );
}

/**
 * カード型コンテンツのスケルトン
 * @returns {JSX.Element} カードスケルトン要素
 * @example
 * {isLoading ? <CardSkeleton /> : <ActualCard />}
 */
export function CardSkeleton() {
  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-24" />
    </div>
  );
}

/**
 * リスト型コンテンツのスケルトンのプロパティ
 */
interface ListSkeletonProps {
  /** スケルトンアイテムの数 */
  count?: number;
}

/**
 * リスト型コンテンツのスケルトン
 * @param {ListSkeletonProps} props - スケルトンのプロパティ
 * @returns {JSX.Element} リストスケルトン要素
 * @example
 * <ListSkeleton count={5} />
 */
export function ListSkeleton({ count = 3 }: ListSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl"
        >
          <Skeleton className="w-12 h-12 rounded-lg" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="w-16 h-6" />
        </div>
      ))}
    </div>
  );
}
