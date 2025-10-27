import { SinaTicker } from "@/lib/services/sina/ticker";
import { SinaStockType } from "@/lib/enums/sina-stock-type";
import {
  calculatePercent,
  formatFund,
  formatMoney,
  StockValueFormatter,
} from "@/lib/market-utils";

export class SinaQuote {
  constructor(public readonly ticker: SinaTicker) {
    this.formatter =
      ticker.type === SinaStockType.AShare ? formatMoney : formatFund;
  }

  public formatter: StockValueFormatter;
  // 股票相关
  public time?: string;
  public open?: number;
  public current?: number;
  public high?: number;
  public low?: number;
  public prevClose?: number;
  public diff?: number;
  public pct?: number;
  // 基金相关
  public fundDate?: string;
  public fundNav?: number;
  public preFundNav?: number;
  public fundNavPct?: number;
  public fundNavDiff?: number;

  parseStock(text: string) {
    const match = text.match(/"([^"]*)"/);
    const raw = match ? match[1] : "";
    if (raw) {
      const list = raw.split(",");
      this.time = `${list[30]} ${list[31]}`;
      this.open = +list[1];
      this.prevClose = +list[2];
      this.current = +list[3];
      this.high = +list[4];
      this.low = +list[5];
      this.diff = this.current - this.prevClose;
      this.pct = calculatePercent(this.current, this.prevClose);
    }
  }

  parseFundNav(text: string) {
    const match = text.match(/"([^"]*)"/);
    const raw = match ? match[1] : "";
    if (raw) {
      const list = raw.split(",");
      this.fundDate = list[5];
      this.fundNav = +list[1];
      this.preFundNav = +list[3];
      this.fundNavPct = +list[4];
      this.fundNavDiff = this.fundNav - +this.preFundNav;
    }
  }
}
