"use client";
import React from "react";
import StartGuidance from "@/app/(home)/_components/start-guidance";
import { useHoldingList } from "@/lib/services/holdings/use-holding-list";
import { TickerCard } from "@/app/(home)/_components/ticker-card";
import { NavigateToHoldingsAdd } from "@/app/(home)/_components/navigate-to-holdings-add";
import Loading from "@/components/ui/my/loading";
import {
  AppBar,
  AppBarExtra,
  AppContainer,
} from "@/components/layout/app-shell";
import { HomeContext, HomeProvider } from "@/app/(home)/_provider";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { HoldingSummary } from "@/app/(home)/_components/holding-summary";

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
            <AppBarExtra
              className={"-mb-8 relative z-50 pointer-events-auto"}
              title={"账户总览"}
              action={
                <Button variant={"link"} size={"sm"} asChild>
                  <Link href={"/group"}>
                    分组视图
                    <ArrowRight />
                  </Link>
                </Button>
              }
            >
              <HoldingSummary />
            </AppBarExtra>
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
