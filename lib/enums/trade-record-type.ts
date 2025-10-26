export enum TradeRecordTypeValue {
  Buy = 1,
  Sell,
  Subscribe,
  Redeem,
  Dividend,
  Split,
  Merge,
}

export class TradeRecordType {
  static readonly Buy = new TradeRecordType(TradeRecordTypeValue.Buy, "买入");
  static readonly Sell = new TradeRecordType(TradeRecordTypeValue.Sell, "卖出");
  static readonly Subscribe = new TradeRecordType(
    TradeRecordTypeValue.Subscribe,
    "申购",
  );
  static readonly Redeem = new TradeRecordType(
    TradeRecordTypeValue.Redeem,
    "赎回",
  );
  static readonly Dividend = new TradeRecordType(
    TradeRecordTypeValue.Dividend,
    "分红",
  );
  static readonly Split = new TradeRecordType(
    TradeRecordTypeValue.Split,
    "拆股",
  );
  static readonly Merge = new TradeRecordType(
    TradeRecordTypeValue.Merge,
    "合股",
  );
  static readonly values = [
    TradeRecordType.Buy,
    TradeRecordType.Sell,
    TradeRecordType.Subscribe,
    TradeRecordType.Redeem,
    TradeRecordType.Dividend,
    TradeRecordType.Split,
    TradeRecordType.Merge,
  ] as const;

  private constructor(
    public readonly value: TradeRecordTypeValue,
    public readonly label: string,
  ) {}

  static parseFromLabel(label?: string) {
    return this.values.find((record) => record.label === label);
  }

  static parseFromStringValue(value?: string) {
    return value ? this.parseFromValue(+value) : undefined;
  }

  static parseFromValue(value?: number) {
    return this.values.find((record) => record.value === value);
  }

  equal(other: TradeRecordType) {
    return other.value === this.value;
  }
}
