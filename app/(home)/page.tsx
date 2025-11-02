"use client";
import React from "react";
import StartGuidance from "@/app/(home)/_components/start-guidance";
import { useHoldingList } from "@/lib/services/holdings/use-holding-list";
import { TickerCard } from "@/app/(home)/_components/ticker-card";
import { NavigateToHoldingsAdd } from "@/app/(home)/_components/navigate-to-holdings-add";
import { useHoldingsWithQuote } from "@/lib/services/composed/use-holdings-with-quote";
import Loading from "@/components/ui/my/loading";
import {
  AppBar,
  AppBarExtraContent,
  AppContainer,
} from "@/components/ui/my/app-container";
import { HoldingSummary } from "@/app/(home)/_components/holding-summary";

export default function Page() {
  const { isLoading } = useHoldingList();
  const list = useHoldingsWithQuote();

  return isLoading ? (
    <Loading isLoading={true} />
  ) : (
    <AppContainer
      appBar={
        <AppBar bgGradient={!!list.length}>
          {list.length && (
            <AppBarExtraContent
              className={"px-2 -mb-6 relative z-50 pointer-events-auto"}
            >
              <HoldingSummary />
            </AppBarExtraContent>
          )}
        </AppBar>
      }
      hideBackButton={true}
    >
      {list.length ? (
        <>
          <div className={"common-layout flex flex-col gap-2 pt-10"}>
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
        </>
      ) : (
        <StartGuidance />
      )}
    </AppContainer>
  );
}
