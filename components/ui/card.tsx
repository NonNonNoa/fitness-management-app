/**
 * @fileoverview カードコンポーネント
 * コンテンツを囲むためのカードUIコンポーネント
 */

import { ReactNode } from "react";

/**
 * カードコンポーネントのプロパティ
 */
interface CardProps {
  /** カードの内容 */
  children: ReactNode;
  /** 追加のCSSクラス */
  className?: string;
  /** カードのタイトル */
  title?: string;
  /** カードの説明文 */
  description?: string;
  /** カードのフッター */
  footer?: ReactNode;
}

/**
 * 汎用カードコンポーネント
 * タイトル、説明、フッターをオプションで表示可能
 * @param {CardProps} props - カードのプロパティ
 * @returns {JSX.Element} カード要素
 * @example
 * // シンプルなカード
 * <Card>
 *   <p>コンテンツ</p>
 * </Card>
 * 
 * // タイトル付きカード
 * <Card title="設定" description="アカウント設定を管理します">
 *   <form>...</form>
 * </Card>
 * 
 * // フッター付きカード
 * <Card footer={<Button>保存</Button>}>
 *   <p>編集内容</p>
 * </Card>
 */
export function Card({
  children,
  className = "",
  title,
  description,
  footer,
}: CardProps) {
  return (
    <div
      className={`bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden ${className}`}
    >
      {(title || description) && (
        <div className="px-6 py-4 border-b border-zinc-800">
          {title && (
            <h3 className="text-lg font-bold text-white">{title}</h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-zinc-400">{description}</p>
          )}
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
      {footer && (
        <div className="px-6 py-4 bg-zinc-950 border-t border-zinc-800">
          {footer}
        </div>
      )}
    </div>
  );
}
