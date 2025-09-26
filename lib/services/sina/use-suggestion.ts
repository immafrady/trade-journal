"use client";
import useSWR from "swr";
import { SinaStockType } from "@/lib/enums/sina-stock-type";

export interface SinaSuggestion {
  type: SinaStockType;
  label: string;
  code: string;
  rawCode: string;
  raw: string;
}

// 格式化Sina的搜索推荐
export function parseSinaSuggestion(raw: string) {
  const slugs = raw.split(",");
  return {
    type: slugs[1],
    label: slugs[4],
    code: slugs[2],
    rawCode: slugs[3],
    raw: raw,
  } as SinaSuggestion;
}

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
        .map(parseSinaSuggestion);
    },
    {
      keepPreviousData: true,
      fallbackData: [],
    },
  );
}
