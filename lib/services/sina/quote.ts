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
  public fundTime?: Date;
  public fundNav?: string;
  public preFundNav?: string;
  public fundNavPct?: string;
}
