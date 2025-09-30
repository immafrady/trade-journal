export const formatMoney = (num: number) => {
  const formatted = Math.abs(num).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
  return num < 0 ? `(${formatted})` : formatted;
};

export const formatFund = (num: number) => num.toFixed(4);

export const formatPercent = (num: number) => num.toFixed(2) + "%";

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
