"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, TrendingUp, Target, Calendar, Sparkles } from "lucide-react";
import Link from "next/link";
import { AnimatedButton } from "@/components/ui/animated-button";
import { AnimatedCard } from "@/components/ui/animated-card";
import { ChartContainer, WeightChart } from "@/components/ui/charts";
import { getProgressPrediction } from "@/lib/actions/ai";
import { getActiveGoals, getRecentBodyCompositions } from "@/lib/actions/goals";

interface ProgressPrediction {
  predictedDate: string;
  predictedValue: number;
  confidence: number;
  milestones: { date: string; value: number; description: string }[];
  recommendations: string[];
}

export default function ProgressPredictPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [result, setResult] = useState<ProgressPrediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [goalData, setGoalData] = useState<{
    type: string;
    current: number;
    target: number;
  } | null>(null);
  const [historyData, setHistoryData] = useState<{ date: string; value: number }[]>([]);
  const [weightHistory, setWeightHistory] = useState<{ date: string; weight: number }[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [goals, bodyComps] = await Promise.all([
          getActiveGoals(),
          getRecentBodyCompositions(30),
        ]);

        if (goals.success && goals.data && goals.data.length > 0) {
          const goal = goals.data[0];
          setGoalData({
            type: goal.goalType,
            current: goal.currentValue || 0,
            target: goal.targetValue || 0,
          });
        }

        if (bodyComps.success && bodyComps.data) {
          const history = bodyComps.data
            .filter((bc: { weightKg?: number | null }) => bc.weightKg)
            .map((bc: { recordDate: string; weightKg?: number | null }) => ({
              date: bc.recordDate,
              value: bc.weightKg!,
              weight: bc.weightKg!,
            }))
            .reverse();
          setHistoryData(history);
          setWeightHistory(
            history.map((h: { date: string; value: number }) => ({ date: h.date.slice(5), weight: h.value }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setFetching(false);
      }
    }

    fetchData();
  }, []);

  const handlePredict = async () => {
    if (!goalData) {
      setError("目標を設定してください");
      return;
    }

    if (historyData.length < 3) {
      setError("予測には少なくとも3日分のデータが必要です");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await getProgressPrediction(
        goalData.type,
        goalData.current,
        goalData.target,
        historyData
      );
      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setError(response.error || "予測に失敗しました");
      }
    } catch (err) {
      setError("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const getGoalTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      weight_loss: "減量",
      weight_gain: "増量",
      muscle_gain: "筋肉増加",
      strength: "筋力向上",
    };
    return labels[type] || type;
  };

  if (fetching) {
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
        className="flex items-center gap-4"
      >
        <Link href="/ai">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-400" />
          </motion.div>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">進捗予測</h1>
          <p className="text-zinc-400 text-sm">AIがあなたの目標達成時期を予測</p>
        </div>
      </motion.div>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatedCard delay={0.1} hoverable={false}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Target className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-zinc-400 text-sm">現在の目標</span>
          </div>
          {goalData ? (
            <div>
              <p className="text-white font-semibold">
                {getGoalTypeLabel(goalData.type)}
              </p>
              <p className="text-zinc-500 text-sm">
                {goalData.current} → {goalData.target}
              </p>
            </div>
          ) : (
            <p className="text-zinc-500 text-sm">
              <Link href="/goals/new" className="text-orange-400 hover:underline">
                目標を設定してください
              </Link>
            </p>
          )}
        </AnimatedCard>

        <AnimatedCard delay={0.2} hoverable={false}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-zinc-400 text-sm">データポイント</span>
          </div>
          <p className="text-2xl font-bold text-white">{historyData.length}</p>
          <p className="text-zinc-500 text-sm">日分の記録</p>
        </AnimatedCard>
      </div>

      {/* Chart */}
      <ChartContainer title="体重推移" delay={0.3}>
        <WeightChart data={weightHistory} />
      </ChartContainer>

      {/* Predict Button */}
      <AnimatedButton
        fullWidth
        onClick={handlePredict}
        loading={loading}
        disabled={!goalData || historyData.length < 3}
        icon={<Sparkles className="w-4 h-4" />}
      >
        AIで予測する
      </AnimatedButton>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Prediction */}
            <AnimatedCard hoverable={false}>
              <div className="text-center">
                <p className="text-zinc-400 text-sm mb-2">目標達成予定日</p>
                <p className="text-3xl font-bold text-white mb-2">
                  {new Date(result.predictedDate).toLocaleDateString("ja-JP", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-zinc-500 text-sm">
                  予測値: {result.predictedValue} | 信頼度: {(result.confidence * 100).toFixed(0)}%
                </p>
              </div>
            </AnimatedCard>

            {/* Milestones */}
            {result.milestones && result.milestones.length > 0 && (
              <AnimatedCard title="マイルストーン" hoverable={false}>
                <div className="space-y-3">
                  {result.milestones.map((milestone, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl"
                    >
                      <div className="p-2 rounded-lg bg-orange-500/20">
                        <Calendar className="w-4 h-4 text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm">{milestone.description}</p>
                        <p className="text-zinc-500 text-xs">
                          {new Date(milestone.date).toLocaleDateString("ja-JP")} - {milestone.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedCard>
            )}

            {/* Recommendations */}
            {result.recommendations && result.recommendations.length > 0 && (
              <AnimatedCard title="アドバイス" hoverable={false}>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex gap-2 text-sm text-zinc-400">
                      <span className="text-orange-400">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </AnimatedCard>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

