"use client";
import { SinaTicker } from "@/lib/services/sina/ticker";
import useSWR from "swr";
import { SinaQuote } from "@/lib/services/sina/quote";
import { SinaStockType } from "@/lib/enums/sina-stock-type";

export function useRealtimeQuotes(tickers: SinaTicker[]) {
  const key = tickers.length
    ? tickers.map((ticker) => ticker.searchCode).join(",")
    : null;
  return useSWR(
    `/api/sina/quotes?list=${key}`,
    async (api) => {
      const response = await fetch(api);
      const result: Record<string, SinaQuote> = {};
      const text = await response.text();
      const lines = text.split("\n").filter(Boolean);
      for (let i = 0, j = 0; i < lines.length; i++, j++) {
        const ticker = tickers[j];
        const quote = new SinaQuote(ticker);
        // 处理股票
        quote.parseStock(lines[i]);
        if (ticker.type !== SinaStockType.AShare) {
          // 处理of
          i++;
          quote.parseFundNav(lines[i]);
        }
        result[ticker.searchCode] = quote;
      }
      return result;
    },
    {
      refreshInterval: 5000,
    },
  );
}
