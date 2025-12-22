/**
 * @fileoverview 汎用ユーティリティ関数
 * 日付フォーマット、ID生成、進捗計算などの共通関数を提供する
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSSクラスを結合する
 * clsxとtailwind-mergeを組み合わせて、重複クラスを適切にマージする
 * @param {...ClassValue[]} inputs - 結合するクラス名
 * @returns {string} マージされたクラス名
 * @example
 * cn("p-4", "p-2") // => "p-2"
 * cn("bg-red-500", isActive && "bg-blue-500") // => "bg-blue-500" (isActive=true時)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 日付を日本語形式でフォーマットする
 * @param {Date | string} date - フォーマットする日付
 * @param {Intl.DateTimeFormatOptions} [options] - フォーマットオプション
 * @returns {string} フォーマットされた日付文字列
 * @example
 * formatDate(new Date()) // => "2024年1月1日"
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("ja-JP", options ?? {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * 日付を短い形式でフォーマットする
 * @param {Date | string} date - フォーマットする日付
 * @returns {string} 短い形式の日付文字列
 * @example
 * formatDateShort(new Date()) // => "1月1日"
 */
export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("ja-JP", {
    month: "short",
    day: "numeric",
  });
}

/**
 * 一意のIDを生成する
 * @returns {string} UUID v4形式のID
 * @example
 * generateId() // => "550e8400-e29b-41d4-a716-446655440000"
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * 進捗率を計算する
 * @param {number} current - 現在値
 * @param {number} target - 目標値
 * @param {number} start - 開始値
 * @returns {number} 進捗率 (0-100)
 * @description 結果は0%から100%の範囲にクランプされる
 * @example
 * calculateProgress(65, 60, 70) // => 50 (70から60への目標で現在65)
 */
export function calculateProgress(current: number, target: number, start: number): number {
  if (target === start) return 100;
  const progress = ((current - start) / (target - start)) * 100;
  return Math.min(Math.max(progress, 0), 100);
}

/**
 * 今日の日付をYYYY-MM-DD形式で取得する
 * @returns {string} 今日の日付文字列
 * @example
 * getToday() // => "2024-01-01"
 */
export function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * 今週の開始日と終了日を取得する
 * @returns {{start: string, end: string}} 週の範囲
 * @description 週の開始を日曜日として計算する
 * @example
 * getThisWeekRange() // => { start: "2024-01-07", end: "2024-01-13" }
 */
export function getThisWeekRange(): { start: string; end: string } {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const start = new Date(now);
  start.setDate(now.getDate() - dayOfWeek);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
}
