/**
 * @fileoverview トレーニング関連のヘルパー関数
 * 部位名のラベル変換などを提供する
 */

/**
 * トレーニング部位を日本語ラベルに変換する
 * @param {string} part - 部位 (chest, back, legs, shoulders, arms, core)
 * @returns {string} 日本語ラベル
 * @example
 * getBodyPartLabel("chest") // => "胸"
 * getBodyPartLabel("legs") // => "脚"
 */
export function getBodyPartLabel(part: string): string {
  const labels: Record<string, string> = {
    chest: "胸",
    back: "背中",
    legs: "脚",
    shoulders: "肩",
    arms: "腕",
    core: "体幹",
  };
  return labels[part] || part;
}
