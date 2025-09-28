import { SinaTicker } from "@/lib/services/sina/ticker";
import useSWR from "swr";

export function useRealtimeQuotes(list: SinaTicker[]) {
  return useSWR(
    list.map((ticker) => ticker.searchCode).join(","),
    async (list) => {
      const response = await fetch(`/api/sina/quotes?list=${list}`);
      const text = await response.text();
    },
  );
}
