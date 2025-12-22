/**
 * @fileoverview 食事関連のヘルパー関数
 * 食事タイプのラベル変換などを提供する
 */

/**
 * 食事タイプを日本語ラベルに変換する
 * @param {string} type - 食事タイプ (breakfast, lunch, dinner, snack)
 * @returns {string} 日本語ラベル
 * @example
 * getMealTypeLabel("breakfast") // => "朝食"
 * getMealTypeLabel("snack") // => "間食"
 */
export function getMealTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    breakfast: "朝食",
    lunch: "昼食",
    dinner: "夕食",
    snack: "間食",
  };
  return labels[type] || type;
}
