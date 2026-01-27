import { TradeRecord } from "@/lib/services/trade-records";
import { SinaTicker } from "@/lib/services/sina";

export class TradeRecordExtend {
  constructor(
    public ticker: SinaTicker,
    public record: TradeRecord,
  ) {}

  group: {
    marketValue: number;
    valueIndex: number;
  } = {
    marketValue: 0,
    valueIndex: 0,
  };
}
