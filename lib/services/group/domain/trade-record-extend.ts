import { TradeRecord } from "@/lib/services/trade-records";
import { SinaTicker } from "@/lib/services/sina";

export class TradeRecordExtend {
  constructor(
    public holdingId: string,
    public ticker: SinaTicker,
    public record: TradeRecord,
  ) {}

  group: {
    totalMarketValue: number;
    totalAmount: number; // 实际支出
    valueIndex: number;
  } = {
    totalMarketValue: 0,
    totalAmount: 0,
    valueIndex: 0,
  };
}
