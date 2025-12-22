/**
 * @fileoverview トレーニングの消費カロリー計算
 * 厚生労働省「健康づくりのための身体活動基準2013」のメッツ値を使用
 * 参考: https://keisan.site/exec/system/1536638935
 */

/**
 * トレーニング強度の判定
 * @param {number} totalVolume - 総ボリューム（重量 × レップ数）
 * @param {number} durationMinutes - トレーニング時間（分）
 * @param {number} setCount - セット数
 * @returns {'light' | 'intense'} トレーニング強度
 */
function determineIntensity(
  totalVolume: number,
  durationMinutes: number,
  setCount: number
): 'light' | 'intense' {
  // 高強度の判定基準
  // - 総ボリュームが高い（5000kg以上）
  // - または短時間で高ボリューム（1分あたり100kg以上）
  // - またはセット数が多い（15セット以上）
  const volumePerMinute = durationMinutes > 0 ? totalVolume / durationMinutes : 0;
  
  if (totalVolume >= 5000 || volumePerMinute >= 100 || setCount >= 15) {
    return 'intense';
  }
  return 'light';
}

/**
 * メッツ値を取得
 * @param {'light' | 'intense'} intensity - トレーニング強度
 * @returns {number} メッツ値
 */
function getMetsValue(intensity: 'light' | 'intense'): number {
  return intensity === 'intense' ? 6.0 : 3.5;
}

/**
 * トレーニングの消費カロリーを計算
 * 計算式: 消費カロリー(kcal) = メッツ × 体重kg × 運動時間(時間) × 1.05
 * 
 * @param {number} weightKg - 体重（kg）
 * @param {number} durationMinutes - トレーニング時間（分）
 * @param {number} totalVolume - 総ボリューム（重量 × レップ数）
 * @param {number} setCount - セット数
 * @returns {number} 消費カロリー（kcal）
 * @example
 * calculateCaloriesBurned(70, 60, 5000, 12) // => 約441kcal（高強度）
 * calculateCaloriesBurned(70, 60, 2000, 8) // => 約257kcal（軽・中等度）
 */
export function calculateCaloriesBurned(
  weightKg: number,
  durationMinutes: number,
  totalVolume: number,
  setCount: number
): number {
  if (!weightKg || !durationMinutes || durationMinutes <= 0) {
    return 0;
  }

  const intensity = determineIntensity(totalVolume, durationMinutes, setCount);
  const mets = getMetsValue(intensity);
  const durationHours = durationMinutes / 60;

  // 計算式: メッツ × 体重kg × 運動時間(時間) × 1.05
  const calories = mets * weightKg * durationHours * 1.05;

  return Math.round(calories);
}

