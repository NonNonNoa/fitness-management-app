import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  footer?: ReactNode;
}

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

