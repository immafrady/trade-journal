"use client";
import React from "react";
import StartGuidance from "@/app/(home)/_components/start-guidance";
import { useHoldingList } from "@/lib/services/holdings/use-holding-list";
import { TickerCard } from "@/app/(home)/_components/ticker-card";
import { NavigateToHoldingsAdd } from "@/app/(home)/_components/navigate-to-holdings-add";
import { useHoldingsWithQuote } from "@/lib/services/composed/use-holdings-with-quote";
import Loading from "@/components/ui/my/loading";
import { AppBar, AppContainer } from "@/components/ui/my/app-container";

export default function Page() {
  const { isLoading } = useHoldingList();
  const list = useHoldingsWithQuote();

  return list.length ? (
    <AppContainer appBar={<AppBar />} hideBackButton={true}>
      <div className={"common-layout flex flex-col gap-2"}>
        {list?.map(({ id, ticker, quote }) => {
          return (
            <TickerCard
              key={ticker.key}
              id={id}
              ticker={ticker}
              quote={quote}
            />
          );
        })}
      </div>
      <NavigateToHoldingsAdd />
      <Loading isLoading={isLoading} />
    </AppContainer>
  ) : (
    <StartGuidance />
  );
}
