export enum TradeRecordType {
  Buy = 1,
  Sell,
  Subscribe,
  Redeem,
  Dividend,
  Split,
  Merge,
}

export const TradeRecordTypeLabelMap = {
  [TradeRecordType.Buy]: "买入",
  [TradeRecordType.Sell]: "卖出",
  [TradeRecordType.Subscribe]: "申购",
  [TradeRecordType.Redeem]: "赎回",
  [TradeRecordType.Dividend]: "分红",
  [TradeRecordType.Split]: "拆股",
  [TradeRecordType.Merge]: "合股",
};

export const getTradeRecordTypeLabel = (type: TradeRecordType) => {
  return TradeRecordTypeLabelMap[type];
};
