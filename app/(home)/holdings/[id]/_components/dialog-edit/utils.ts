import { TradeRecordType } from "@/lib/enums/trade-record-type";

export const requireAmount = (type?: TradeRecordType) =>
  type && [TradeRecordType.Merge, TradeRecordType.Split].includes(type);

export const requireFee = (type?: TradeRecordType) =>
  type &&
  [
    TradeRecordType.Buy,
    TradeRecordType.Sell,
    TradeRecordType.Subscribe,
    TradeRecordType.Redeem,
  ].includes(type);

export const requirePrice = (type?: TradeRecordType) =>
  type &&
  [
    TradeRecordType.Buy,
    TradeRecordType.Sell,
    TradeRecordType.Subscribe,
    TradeRecordType.Redeem,
  ].includes(type);

export const requireShares = (type?: TradeRecordType) =>
  type &&
  TradeRecordType.values
    .filter((t) => t !== TradeRecordType.Dividend)
    .includes(type);

export const inputPositive = (type?: TradeRecordType) =>
  type &&
  [
    TradeRecordType.Buy,
    TradeRecordType.Subscribe,
    TradeRecordType.Split,
  ].includes(type);

// 计算份额
export const calcShares = (price: number, amount: number, fee: number = 0) =>
  (amount - fee) / price;

// 计算金额
export const calcAmount = (price: number, shares: number, fee: number = 0) =>
  price * shares + fee;

// 计算费用
export const calcFee = (shares: number, price: number, amount: number) =>
  amount - shares * price;

// 计算成交价格
export const calcPrice = (amount: number, shares: number, fee: number = 0) =>
  (amount - fee) / shares;
