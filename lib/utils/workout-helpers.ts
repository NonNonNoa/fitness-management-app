// 部位の日本語表示
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


