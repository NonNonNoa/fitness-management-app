// 目標タイプの日本語表示
export function getGoalTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    muscle_gain: "筋肉量アップ",
    weight_loss: "減量",
    weight_gain: "増量",
    strength: "筋力向上",
  };
  return labels[type] || type;
}

// 目標の進捗率を計算
export function calculateProgress(
  goalType: string,
  currentValue?: number | null,
  targetValue?: number | null,
  startValue?: number | null
): number {
  if (!currentValue || !targetValue) return 0;

  const start = startValue || currentValue;
  const totalChange = targetValue - start;

  if (totalChange === 0) return 100;

  const currentChange = currentValue - start;
  const progress = (currentChange / totalChange) * 100;

  return Math.min(Math.max(progress, 0), 100);
}


