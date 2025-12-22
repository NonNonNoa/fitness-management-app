"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  title?: string;
  className?: string;
  delay?: number;
  hoverable?: boolean;
}

export function AnimatedCard({
  children,
  title,
  className,
  delay = 0,
  hoverable = true,
  ...props
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
      whileHover={hoverable ? { 
        scale: 1.02, 
        y: -4,
        transition: { duration: 0.2 }
      } : undefined}
      whileTap={hoverable ? { scale: 0.98 } : undefined}
      className={cn(
        "bg-zinc-900/90 backdrop-blur-md border border-zinc-800/50 rounded-2xl p-5",
        "shadow-xl shadow-black/30",
        "relative overflow-hidden",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-orange-500/0 before:to-purple-500/0 before:opacity-0 before:transition-opacity before:duration-300",
        hoverable && "cursor-pointer transition-all hover:border-orange-500/30 hover:shadow-orange-500/10 hover:shadow-2xl hover:before:opacity-100",
        className
      )}
      {...props}
    >
      {title && (
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-gradient-to-b from-orange-500 to-red-600 rounded-full" />
          {title}
        </h3>
      )}
      {children}
    </motion.div>
  );
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  color = "orange",
  delay = 0,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: "orange" | "green" | "blue" | "purple" | "red";
  delay?: number;
}) {
  const colorClasses = {
    orange: "from-orange-500 to-red-600",
    green: "from-green-500 to-emerald-600",
    blue: "from-blue-500 to-cyan-600",
    purple: "from-purple-500 to-pink-600",
    red: "from-red-500 to-rose-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ 
        scale: 1.03,
        y: -4,
        transition: { duration: 0.2 }
      }}
      className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800/50 rounded-2xl p-5 relative overflow-hidden group cursor-pointer
                 shadow-xl shadow-black/30
                 before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:to-transparent before:opacity-0 before:transition-opacity before:duration-300
                 hover:border-orange-500/30 hover:shadow-orange-500/10 hover:shadow-2xl hover:before:opacity-100"
      style={{
        background: `linear-gradient(135deg, rgba(39, 39, 42, 0.9) 0%, rgba(24, 24, 27, 0.9) 100%)`,
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-zinc-400 text-sm">{title}</p>
          <motion.p
            className="text-3xl font-bold text-white mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.2 }}
          >
            {value}
          </motion.p>
          {subtitle && (
            <p className="text-zinc-500 text-sm mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <motion.div 
            className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg group-hover:scale-110 transition-transform duration-300`}
            whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
          >
            {icon}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export function ProgressCard({
  title,
  current,
  target,
  unit,
  color = "orange",
  delay = 0,
}: {
  title: string;
  current: number;
  target: number;
  unit: string;
  color?: "orange" | "green" | "blue" | "purple";
  delay?: number;
}) {
  const percentage = Math.min((current / target) * 100, 100);
  
  const colorClasses = {
    orange: "from-orange-500 to-red-600",
    green: "from-green-500 to-emerald-600",
    blue: "from-blue-500 to-cyan-600",
    purple: "from-purple-500 to-pink-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-5"
    >
      <div className="flex justify-between items-start mb-3">
        <p className="text-zinc-400 text-sm">{title}</p>
        <span className="text-xs text-zinc-500">{percentage.toFixed(0)}%</span>
      </div>
      <div className="flex items-baseline gap-1 mb-3">
        <span className="text-2xl font-bold text-white">{current.toLocaleString()}</span>
        <span className="text-zinc-500">/ {target.toLocaleString()} {unit}</span>
      </div>
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, delay: delay + 0.3, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}


