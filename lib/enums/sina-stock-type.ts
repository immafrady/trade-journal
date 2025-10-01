// 新浪股票类型
export enum SinaStockType {
  AShare = "11",
  ETF = "22",
  LOF = "23",
}

// export
export const SINA_SEARCH_VALUES = [
  SinaStockType.AShare,
  SinaStockType.ETF,
  SinaStockType.LOF,
].join(",");

export const getSinaStockTypeLabel = (type: SinaStockType) => {
  switch (type) {
    case SinaStockType.AShare:
      return "A股";
    case SinaStockType.ETF:
      return "ETF";
    case SinaStockType.LOF:
      return "LOF";
  }
};

export const getSinaStockTypeColor = (type: SinaStockType) => {
  switch (type) {
    case SinaStockType.AShare:
      return "";
    case SinaStockType.ETF:
      return "bg-blue-500";
    case SinaStockType.LOF:
      return "bg-purple-500";
  }
};
