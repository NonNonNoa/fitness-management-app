// 食事タイプの日本語表示
export function getMealTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    breakfast: "朝食",
    lunch: "昼食",
    dinner: "夕食",
    snack: "間食",
  };
  return labels[type] || type;
}


