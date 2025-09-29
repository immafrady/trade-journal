import { SinaTicker } from "@/lib/services/sina/ticker";

export class SinaQuote {
  constructor(public readonly ticker: SinaTicker) {}

  // 股票相关
  public time?: Date;
  public open?: string;
  public close?: string;
  public high?: string;
  public low?: string;
  public prevClose?: string;
  // 基金相关
  public fundDate?: Date;
  public fundNav?: string;
  public preFundNav?: string;
  public fundNavPct?: string;

  parseStock(text: string) {
    const match = text.match(/"([^"]*)"/);
    const raw = match ? match[1] : "";
    if (raw) {
      const list = raw.split(",");
      this.time = new Date(`${list[30]} ${list[31]}`);
      this.open = list[1];
      this.prevClose = list[2];
      this.close = list[3];
      this.high = list[4];
      this.low = list[5];
    }
  }

  parseFundNav(text: string) {
    const match = text.match(/"([^"]*)"/);
    const raw = match ? match[1] : "";
    if (raw) {
      const list = raw.split(",");
      this.fundDate = new Date(list[5]);
      this.fundNav = list[1];
      this.preFundNav = list[3];
      this.fundNavPct = list[4] + "%";
    }
  }
}
