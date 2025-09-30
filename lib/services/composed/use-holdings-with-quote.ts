import { useHoldingList } from "@/lib/services/holdings/use-holding-list";
import { useRealtimeQuotes } from "@/lib/services/sina/use-realtime-quotes";
import { SinaTicker } from "@/lib/services/sina/ticker";
import { SinaQuote } from "@/lib/services/sina/quote";

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
      quote: quoteMap?.get(holding.ticker),
    })) ?? []
  );
};
