"use client";
import React from "react";
import Loading from "./loading";
import StartGuidance from "@/app/(home)/_components/start-guidance";
import { useHoldingList } from "@/lib/services/holdings/use-holding-list";
import { useRealtimeQuotes } from "@/lib/services/sina/use-realtime-quotes";
import { TickerCard } from "@/app/(home)/_components/ticker-card";
import { NavigateToHoldingsAdd } from "@/app/(home)/_components/navigate-to-holdings-add";

export default function Page() {
  const { data: tickers, isLoading, mutate } = useHoldingList();
  const { data: quoteMap } = useRealtimeQuotes(tickers ?? []);

  return (
    <>
      <div>
        {tickers?.length ? (
          <>
            <div className={"p-layout flex flex-col gap-2"}>
              {tickers?.map((ticker) => {
                const quote = quoteMap?.get(ticker);
                return (
                  <TickerCard key={ticker.key} ticker={ticker} quote={quote} />
                );
              })}
            </div>
            <NavigateToHoldingsAdd />
          </>
        ) : (
          <StartGuidance />
        )}
      </div>
      <Loading isLoading={isLoading} />
    </>
  );
}
