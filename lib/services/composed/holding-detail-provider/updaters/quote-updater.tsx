import React from "react";
import { useHoldingDetailStore } from "@/lib/services/composed/holding-detail-provider/subscribe";
import { useHoldingList } from "@/lib/services/holdings/use-holding-list";
import { SinaQuote, useRealtimeQuotes } from "@/lib/services/sina";

export const QuoteUpdater = () => {
  const updateQuotes = useHoldingDetailStore((s) => s.updateQuotes);
  const { data: holdings } = useHoldingList();
  const tickers = React.useMemo(
    () => holdings.map((h) => h.ticker),
    [holdings],
  );
  const { data: quoteMap, mutate } = useRealtimeQuotes(tickers);
  React.useEffect(() => {
    const map: Record<string, SinaQuote> = {};
    holdings.forEach((holding) => {
      map[holding.id] = quoteMap[holding.ticker.searchCode];
    });
    updateQuotes(map);
  }, [holdings, quoteMap, updateQuotes]);

  React.useEffect(() => {
    mutate();
    const id = setInterval(() => {
      if (isTradingTime() && document.visibilityState === "visible") {
        mutate();
      }
    }, 5000);
    return () => clearInterval(id);
  }, [mutate]);
  return null;
};

function isTradingTime() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const t = h * 60 + m;
  return t >= 9 * 60 && t <= 15 * 60;
}
