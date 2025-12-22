/**
 * @fileoverview 目標関連のヘルパー関数
 * 目標タイプのラベル変換や進捗率計算などを提供する
 */

/**
 * 目標タイプを日本語ラベルに変換する
 * @param {string} type - 目標タイプ (muscle_gain, weight_loss, weight_gain, strength)
 * @returns {string} 日本語ラベル
 * @example
 * getGoalTypeLabel("weight_loss") // => "減量"
 */
export function getGoalTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    muscle_gain: "筋肉量アップ",
    weight_loss: "減量",
    weight_gain: "増量",
    strength: "筋力向上",
  };
  return labels[type] || type;
}

/**
 * 目標の進捗率を計算する
 * @param {string} goalType - 目標タイプ
 * @param {number | null | undefined} currentValue - 現在値
 * @param {number | null | undefined} targetValue - 目標値
 * @param {number | null | undefined} [startValue] - 開始値（省略時はcurrentValueを使用）
 * @returns {number} 進捗率 (0-100)
 * @description
 * 開始値から目標値への変化に対する現在の進捗を計算する。
 * 結果は0%から100%の範囲にクランプされる。
 * @example
 * // 70kgから60kgへの減量目標で、現在65kg
 * calculateProgress("weight_loss", 65, 60, 70) // => 50
 */
export function calculateProgress(
  goalType: string,
  currentValue?: number | null,
  targetValue?: number | null,
  startValue?: number | null
): number {
  if (!currentValue || !targetValue) return 0;

  const start = startValue || currentValue;
  const totalChange = targetValue - start;

  // 変化量がゼロの場合は100%とする
  if (totalChange === 0) return 100;

  const currentChange = currentValue - start;
  const progress = (currentChange / totalChange) * 100;

  // 0-100の範囲にクランプ
  return Math.min(Math.max(progress, 0), 100);
}
