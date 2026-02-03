import { TradeRecord } from "@/lib/services/trade-records";
import { SinaTicker } from "@/lib/services/sina";
import { TradeRecordExtendConstants } from "@/lib/services/group";
import { formatFund, formatMoney, formatShares } from "@/lib/market-utils";

export class TradeRecordExtend {
  constructor(
    public holdingId: string,
    public ticker: SinaTicker,
    public record: TradeRecord,
  ) {}

  group: {
    marketValue: number;
    totalAmount: number; // 实际支出
    valueIndex: number;
  } = {
    marketValue: 0,
    totalAmount: 0,
    valueIndex: 0,
  };

  toCSVObject() {
    return {
      [TradeRecordExtendConstants.Label]: this.ticker.label,
      [TradeRecordExtendConstants.TradedAt]: this.record.display.tradedAt,
      [TradeRecordExtendConstants.Type]: this.record.display.type,
      [TradeRecordExtendConstants.ValueIndex]: formatFund(
        this.group.valueIndex,
      ),
      [TradeRecordExtendConstants.MarketValue]: formatMoney(
        this.group.marketValue,
      ),
      [TradeRecordExtendConstants.TotalAmount]: formatMoney(
        this.group.totalAmount,
      ),
      [TradeRecordExtendConstants.Price]: this.ticker.formatter(
        this.record.derived.price,
      ),
      [TradeRecordExtendConstants.Shares]: formatShares(
        this.record.derived.shares,
      ),
      [TradeRecordExtendConstants.Amount]: formatMoney(
        this.record.derived.amount,
      ),
      [TradeRecordExtendConstants.Fee]: formatMoney(this.record.derived.fee),
      [TradeRecordExtendConstants.Factor]: this.record.props.factor,
      [TradeRecordExtendConstants.Comment]: this.record.props.comment,
    };
  }
}
