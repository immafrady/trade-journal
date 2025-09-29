"use client";
import { SinaTicker } from "@/lib/services/sina/ticker";
import useSWR from "swr";
import { SinaQuote } from "@/lib/services/sina/quote";
import { SinaStockType } from "@/lib/enums/sina-stock-type";

export function useRealtimeQuotes(tickers: SinaTicker[]) {
  return useSWR(
    tickers.map((ticker) => ticker.searchCode).join(","),
    async (list) => {
      const response = await fetch(`/api/sina/quotes?list=${list}`);
      const result = new Map<SinaTicker, SinaQuote>();
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
        result.set(ticker, quote);
      }
      console.log("before", result);
      return result;
    },
  );
}
