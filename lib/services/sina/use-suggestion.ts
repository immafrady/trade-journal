"use client";
import useSWR from "swr";
import { SinaTicker } from "@/lib/services/sina/ticker";
import React from "react";

// 获取查询结果
export function useSuggestion(searchKey: string) {
  const key = searchKey
    ? `/api/sina/suggestion?key=${encodeURIComponent(searchKey)}`
    : null;
  const { data: text = "", ...swr } = useSWR(
    key,
    async (api) => {
      const response = await fetch(api);
      return await response.text();
    },
    {
      keepPreviousData: true,
      fallbackData: "",
    },
  );

  const data = React.useMemo(() => {
    try {
      const match = text.match(/"([^"]*)"/);
      const raw = match ? match[1] : "";
      const suggestions = raw.split(";");
      return suggestions
        .filter((suggestion) => suggestion)
        .map(SinaTicker.fromSuggestion);
    } catch (e) {
      console.error(key, e);
      return [];
    }
  }, [key, text]);

  return { ...swr, data };
}
