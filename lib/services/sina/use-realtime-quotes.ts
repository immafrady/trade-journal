"use client";
import { SinaTicker } from "@/lib/services/sina/ticker";
import useSWR from "swr";
import { SinaQuote } from "@/lib/services/sina/quote";
import { SinaStockType } from "@/lib/enums/sina-stock-type";
import React from "react";

export function useRealtimeQuotes(tickers: SinaTicker[]) {
  const searchCodes = tickers.length
    ? tickers.map((ticker) => ticker.searchCode).join(",")
    : null;
  const key = searchCodes ? `/api/sina/quotes?list=${searchCodes}` : null;

  const { data: text = "", ...swr } = useSWR(
    key,
    async (api) => {
      const response = await fetch(api);
      return await response.text();
    },
    {
      refreshInterval: 5000,
    },
  );
  const data = React.useMemo(() => {
    try {
      const lines = text.split("\n").filter(Boolean);
      const result: Record<string, SinaQuote> = {};
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
    } catch (e) {
      console.error(key, e);
      return {};
    }
  }, [key, text, tickers]);

  return { ...swr, data };
}
