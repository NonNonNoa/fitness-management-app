"use client";

import { useState } from "react";
import { useSession, signOut } from "@/lib/auth/client";
import { motion } from "framer-motion";
import { 
  User, Mail, Calendar, LogOut, Moon, Bell, 
  Shield, HelpCircle, ChevronRight, Settings, RefreshCw
} from "lucide-react";
import { AnimatedCard } from "@/components/ui/animated-card";
import { AnimatedButton } from "@/components/ui/animated-button";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const [loggingOut, setLoggingOut] = useState(false);

  const [switchingAccount, setSwitchingAccount] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      // セッションをクリア
      await signOut();
      // 通常のログアウト時は、通常通りログインページにリダイレクト
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      // エラーが発生してもログインページにリダイレクト
      window.location.href = "/login";
    }
  };

  const handleSwitchAccount = async () => {
    setSwitchingAccount(true);
    try {
      // セッションをクリア
      await signOut();
      
      // アカウント選択を促すログインページにリダイレクト
      // Googleのセッションは、ログイン時にprompt=select_accountで強制的にアカウント選択画面を表示することでクリアされる
      window.location.href = "/login?prompt=select_account";
    } catch (error) {
      console.error("Switch account failed:", error);
      // エラーが発生してもアカウント選択を促すログインページにリダイレクト
      window.location.href = "/login?prompt=select_account";
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 md:pb-6 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white">プロフィール</h1>
        <p className="text-zinc-400 mt-1">アカウント設定を管理</p>
      </motion.div>

      {/* Profile Card */}
      <AnimatedCard delay={0.1} hoverable={false}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || ""}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white truncate">
              {session?.user?.name || "ユーザー"}
            </h2>
            <p className="text-zinc-400 text-sm truncate">
              {session?.user?.email}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-zinc-800 space-y-4">
          <div className="flex items-center gap-3 text-zinc-400">
            <Mail className="w-5 h-5" />
            <span className="text-sm">{session?.user?.email}</span>
          </div>
          <div className="flex items-center gap-3 text-zinc-400">
            <Calendar className="w-5 h-5" />
            <span className="text-sm">
              登録日: {new Date(session?.user?.createdAt || "").toLocaleDateString("ja-JP")}
            </span>
          </div>
        </div>
      </AnimatedCard>

      {/* Settings */}
      <AnimatedCard title="設定" delay={0.2} hoverable={false}>
        <div className="space-y-1">
          <SettingItem
            icon={<Moon className="w-5 h-5" />}
            label="ダークモード"
            description="常にオン"
            disabled
          />
          <SettingItem
            icon={<Bell className="w-5 h-5" />}
            label="通知"
            description="近日公開"
            disabled
          />
          <SettingItem
            icon={<Settings className="w-5 h-5" />}
            label="カロリー目標"
            description="2,000 kcal"
            href="/settings/calories"
          />
        </div>
      </AnimatedCard>

      {/* Support */}
      <AnimatedCard title="サポート" delay={0.3} hoverable={false}>
        <div className="space-y-1">
          <SettingItem
            icon={<HelpCircle className="w-5 h-5" />}
            label="ヘルプ"
            description="使い方ガイド"
            href="/help"
          />
          <SettingItem
            icon={<Shield className="w-5 h-5" />}
            label="プライバシーポリシー"
            href="/privacy"
          />
        </div>
      </AnimatedCard>

      {/* Switch Account */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <AnimatedButton
          variant="outline"
          fullWidth
          onClick={handleSwitchAccount}
          loading={switchingAccount}
          icon={<RefreshCw className="w-4 h-4" />}
          className="backdrop-blur-md bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:border-purple-500/50 font-medium transition-all duration-200"
        >
          別のアカウントに切り替える
        </AnimatedButton>
      </motion.div>

      {/* Logout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <AnimatedButton
          variant="danger"
          fullWidth
          onClick={handleLogout}
          loading={loggingOut}
          icon={<LogOut className="w-4 h-4" />}
        >
          ログアウト
        </AnimatedButton>
      </motion.div>

      {/* App Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-zinc-600 text-sm"
      >
        <p>Fitness Management App</p>
        <p>Version 1.0.0</p>
      </motion.div>
    </div>
  );
}

function SettingItem({
  icon,
  label,
  description,
  href,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  description?: string;
  href?: string;
  disabled?: boolean;
}) {
  const content = (
    <motion.div
      whileHover={disabled ? undefined : { x: 4 }}
      className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
        disabled 
          ? "opacity-50 cursor-not-allowed" 
          : "hover:bg-zinc-800/50 cursor-pointer"
      }`}
    >
      <div className="text-zinc-400">{icon}</div>
      <div className="flex-1">
        <p className="text-white text-sm">{label}</p>
        {description && (
          <p className="text-zinc-500 text-xs">{description}</p>
        )}
      </div>
      {!disabled && <ChevronRight className="w-4 h-4 text-zinc-600" />}
    </motion.div>
  );

  if (href && !disabled) {
    return <a href={href}>{content}</a>;
  }

  return content;
}


