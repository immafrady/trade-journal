export enum TradeRecordType {
  Buy = 1,
  Sell,
  Subscribe,
  Redeem,
  Dividend,
  Split,
  Merge,
}

export const getTradeRecordTypeLabel = (type: TradeRecordType) => {
  switch (type) {
    case TradeRecordType.Buy:
      return "买入";
    case TradeRecordType.Sell:
      return "卖出";
    case TradeRecordType.Subscribe:
      return "申购";
    case TradeRecordType.Redeem:
      return "赎回";
    case TradeRecordType.Dividend:
      return "分红";
    case TradeRecordType.Split:
      return "拆股";
    case TradeRecordType.Merge:
      return "合股";
  }
};
