/**
 * @fileoverview トースト通知コンポーネント
 * 成功、エラー、警告、情報などのトースト通知を提供
 */
"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * トーストのタイプ
 */
type ToastType = "success" | "error" | "warning" | "info";

/**
 * トーストオブジェクトの型
 */
interface Toast {
  /** トーストID */
  id: string;
  /** トーストタイプ */
  type: ToastType;
  /** 表示メッセージ */
  message: string;
  /** 表示時間（ミリ秒） */
  duration?: number;
}

/**
 * トーストコンテキストの型
 */
interface ToastContextType {
  /** 現在表示中のトースト一覧 */
  toasts: Toast[];
  /** トーストを追加する関数 */
  addToast: (type: ToastType, message: string, duration?: number) => void;
  /** トーストを削除する関数 */
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * トーストプロバイダーコンポーネント
 * アプリケーションのルートでラップして使用する
 * @param {Object} props - プロパティ
 * @param {React.ReactNode} props.children - 子要素
 * @returns {JSX.Element} プロバイダー要素
 * @example
 * // layout.tsx
 * <ToastProvider>
 *   {children}
 * </ToastProvider>
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  /**
   * トーストを追加する
   * @param {ToastType} type - トーストタイプ
   * @param {string} message - 表示メッセージ
   * @param {number} duration - 表示時間（デフォルト5000ms）
   */
  const addToast = useCallback((type: ToastType, message: string, duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  /**
   * トーストを削除する
   * @param {string} id - 削除するトーストのID
   */
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

/**
 * トースト機能を使用するためのフック
 * @returns {ToastContextType} トーストコンテキスト
 * @throws {Error} ToastProviderの外で使用した場合
 * @example
 * const { addToast } = useToast();
 * addToast("success", "保存しました！");
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

/**
 * トースト表示コンテナ（内部コンポーネント）
 */
function ToastContainer({
  toasts,
  removeToast,
}: {
  toasts: Toast[];
  removeToast: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-20 md:bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * 個別のトーストアイテム（内部コンポーネント）
 */
function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  const colors = {
    success: "bg-green-500/10 border-green-500/30 text-green-400",
    error: "bg-red-500/10 border-red-500/30 text-red-400",
    warning: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
    info: "bg-blue-500/10 border-blue-500/30 text-blue-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={cn(
        "pointer-events-auto flex items-center gap-3 p-4 rounded-xl border backdrop-blur-lg shadow-lg",
        colors[toast.type]
      )}
    >
      {icons[toast.type]}
      <p className="flex-1 text-sm">{toast.message}</p>
      <button
        onClick={onClose}
        className="p-1 rounded-lg hover:bg-white/10 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
