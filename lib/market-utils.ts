import { SinaStockType } from "@/lib/enums/sina-stock-type";

export type StockValueFormatter = (num?: number) => string;

export const formatMoney: StockValueFormatter = (num?: number) => {
  if (!num) return "--";
  const formatted = Math.abs(num).toLocaleString("zh-CN", {
    style: "currency",
    currency: "CNY",
  });
  return num < 0 ? `(${formatted})` : formatted;
};

export const formatFund: StockValueFormatter = (num?: number) =>
  num ? num.toFixed(4) : "--";

export function formatStockValue(type: SinaStockType): StockValueFormatter {
  return type === SinaStockType.AShare ? formatMoney : formatFund;
}

export const formatShares = (num?: number) => (num ? num.toFixed(2) : "--");
export const formatPercent = (num?: number) => (num?.toFixed(2) ?? "--") + "%";

export const calculatePercent = (current: number, prev: number) =>
  ((current - prev) / prev) * 100;

export const getTickerChangeColorClass = (num: number) => {
  if (num > 0) {
    return "text-red-600 dark:text-red-500";
  } else if (num < 0) {
    return "text-green-600 dark:text-green-500";
  } else {
    return "text-gray-600 dark:text-gray-500";
  }
};
