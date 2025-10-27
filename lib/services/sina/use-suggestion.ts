"use client";
import useSWR from "swr";
import { SinaTicker } from "@/lib/services/sina/ticker";
import React from "react";

// 获取查询结果
export function useSuggestion(key: string) {
  const { data: text = "", ...swr } = useSWR(
    key ? `/api/sina/suggestion?key=${encodeURIComponent(key)}` : null,
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
    const match = text.match(/"([^"]*)"/);
    const raw = match ? match[1] : "";
    const suggestions = raw.split(";");
    return suggestions
      .filter((suggestion) => suggestion)
      .map(SinaTicker.fromSuggestion);
  }, [text]);

  return { ...swr, data };
}
