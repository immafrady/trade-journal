import { useHoldingList } from "@/lib/services/holdings/use-holding-list";
import { SinaQuote, SinaTicker, useRealtimeQuotes } from "@/lib/services/sina";

export interface HoldingWithQuote {
  id: string;
  ticker: SinaTicker;
  quote?: SinaQuote;
}

export const useHoldingsWithQuote = (): HoldingWithQuote[] => {
  const { data: holdings } = useHoldingList();
  const { data: quoteMap } = useRealtimeQuotes(
    holdings ? holdings.map((holding) => holding.ticker) : [],
  );
  return (
    holdings?.map((holding) => ({
      ...holding,
      quote: quoteMap ? quoteMap[holding.ticker.searchCode] : undefined,
    })) ?? []
  );
};
