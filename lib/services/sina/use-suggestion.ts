"use client";
import useSWR from "swr";
import { SinaTicker } from "@/lib/services/sina/ticker";

// 获取查询结果
export function useSuggestion(key: string) {
  return useSWR(
    key,
    async (key) => {
      const response = await fetch(
        `/api/sina/get-suggestion?key=${encodeURIComponent(key)}`,
      );
      const text = await response.text();
      const match = text.match(/"([^"]*)"/);
      const raw = match ? match[1] : "";
      const suggestions = raw.split(";");
      return suggestions
        .filter((suggestion) => suggestion)
        .map(SinaTicker.fromSuggestion);
    },
    {
      keepPreviousData: true,
      fallbackData: [],
    },
  );
}
