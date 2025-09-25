// 新浪股票类型
export enum SinaStockType {
  AShare = 11,
  ETF = 22,
  LOF = 23,
}

// export
export const SINA_SEARCH_VALUES = [
  SinaStockType.AShare,
  SinaStockType.ETF,
  SinaStockType.LOF,
].join(",");
