import { useHoldingList } from "@/lib/services/holdings/use-holding-list";
import { useRealtimeQuotes } from "@/lib/services/sina/use-realtime-quotes";

export const useHoldingsWithQuote = () => {
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
