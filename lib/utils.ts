import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Papa from "papaparse";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 导出为CSV
export function exportAsCSV(filename: string, data: any[]) {
  const csv = Papa.unparse(data, {
    quotes: true, // 每个字段加引号，避免逗号冲突
    delimiter: ",", // 分隔符
    header: true, // 自动使用 keys 作为表头
    skipEmptyLines: true, // 跳过空行
  });
  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  link.click();
}
