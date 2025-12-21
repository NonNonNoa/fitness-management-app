"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Star, Lock } from "lucide-react";
import { AnimatedCard } from "@/components/ui/animated-card";
import { getUserAchievements, getAllAchievements } from "@/lib/actions/achievements";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  points: number;
}

interface UserAchievement {
  achievementId: string;
  progress: number;
  isCompleted: boolean;
  earnedAt: Date;
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<Map<string, UserAchievement>>(new Map());
  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const [allResult, userResult] = await Promise.all([
          getAllAchievements(),
          getUserAchievements(),
        ]);

        if (allResult.success && allResult.data) {
          setAchievements(allResult.data);
        }

        if (userResult.success && userResult.data) {
          const map = new Map<string, UserAchievement>();
          let points = 0;
          userResult.data.forEach((ua) => {
            map.set(ua.achievementId, {
              achievementId: ua.achievementId,
              progress: ua.progress || 0,
              isCompleted: ua.isCompleted,
              earnedAt: ua.earnedAt,
            });
            if (ua.isCompleted && ua.achievement) {
              points += ua.achievement.points;
            }
          });
          setUserAchievements(map);
          setTotalPoints(points);
        }
      } catch (error) {
        console.error("Failed to fetch achievements:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const categories = [
    { id: "workout", label: "トレーニング", icon: "🏋️" },
    { id: "meal", label: "食事", icon: "🍽️" },
    { id: "goal", label: "目標", icon: "🎯" },
    { id: "streak", label: "連続記録", icon: "🔥" },
    { id: "milestone", label: "マイルストーン", icon: "🏅" },
  ];

  if (loading) {
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

  const completedCount = Array.from(userAchievements.values()).filter(
    (ua) => ua.isCompleted
  ).length;

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white">アチーブメント</h1>
        <p className="text-zinc-400 mt-1">あなたの達成をトラッキング</p>
      </motion.div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <AnimatedCard delay={0.1} hoverable={false}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20">
              <Trophy className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {completedCount}/{achievements.length}
              </p>
              <p className="text-zinc-500 text-sm">達成済み</p>
            </div>
          </div>
        </AnimatedCard>
        <AnimatedCard delay={0.2} hoverable={false}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <Star className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalPoints}</p>
              <p className="text-zinc-500 text-sm">ポイント</p>
            </div>
          </div>
        </AnimatedCard>
      </div>

      {/* Categories */}
      {categories.map((category, catIndex) => {
        const categoryAchievements = achievements.filter(
          (a) => a.category === category.id
        );
        if (categoryAchievements.length === 0) return null;

        return (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + catIndex * 0.1 }}
          >
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span>{category.icon}</span>
              {category.label}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categoryAchievements.map((achievement, index) => {
                const userAchievement = userAchievements.get(achievement.id);
                const isCompleted = userAchievement?.isCompleted || false;
                const progress = userAchievement?.progress || 0;

                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                  >
                    <div
                      className={`p-4 rounded-xl border transition-all ${
                        isCompleted
                          ? "bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30"
                          : "bg-zinc-900/80 border-zinc-800"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`text-3xl ${
                            isCompleted ? "" : "grayscale opacity-50"
                          }`}
                        >
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3
                              className={`font-semibold ${
                                isCompleted ? "text-white" : "text-zinc-500"
                              }`}
                            >
                              {achievement.name}
                            </h3>
                            {!isCompleted && (
                              <Lock className="w-3 h-3 text-zinc-600" />
                            )}
                          </div>
                          <p className="text-sm text-zinc-500 mt-0.5">
                            {achievement.description}
                          </p>
                          {!isCompleted && progress > 0 && (
                            <div className="mt-2">
                              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <p className="text-xs text-zinc-600 mt-1">
                                {progress}% 完了
                              </p>
                            </div>
                          )}
                        </div>
                        <div
                          className={`text-sm font-medium ${
                            isCompleted ? "text-yellow-400" : "text-zinc-600"
                          }`}
                        >
                          +{achievement.points}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}


