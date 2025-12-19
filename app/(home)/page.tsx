"use client";
import React from "react";
import StartGuidance from "@/app/(home)/_components/start-guidance";
import { useHoldingList } from "@/lib/services/holdings/use-holding-list";
import { TickerCard } from "@/app/(home)/_components/ticker-card";
import { NavigateToHoldingsAdd } from "@/app/(home)/_components/navigate-to-holdings-add";
import Loading from "@/components/ui/my/loading";
import {
  AppBar,
  AppBarExtraContent,
  AppContainer,
} from "@/components/ui/my/app-container";
import { HoldingSummary } from "@/app/(home)/_components/holding-summary";
import { HomeContext, HomeProvider } from "@/app/(home)/_provider";

export default function Page() {
  return (
    <HomeProvider>
      <InnerPage />
    </HomeProvider>
  );
}

function InnerPage() {
  const { list } = React.useContext(HomeContext);

  const { isLoading } = useHoldingList();
  const [loadingId, setLoadingId] = React.useState<string>("");

  return isLoading ? (
    <Loading isLoading={true} />
  ) : (
    <AppContainer
      appBar={
        <AppBar bgGradient={!!list.length}>
          {!!list.length && (
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
          <div className={"common-layout flex flex-col gap-2 pt-10 pb-20"}>
            {list?.map(({ id, ticker, quote, proportion }) => {
              return (
                <TickerCard
                  key={ticker.key}
                  id={id}
                  loadingId={loadingId}
                  ticker={ticker}
                  quote={quote}
                  proportion={proportion}
                  onLinkClick={setLoadingId}
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
