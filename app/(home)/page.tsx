"use client";
import React from "react";
import StartGuidance from "@/app/(home)/_components/start-guidance";
import { useHoldingList } from "@/lib/services/holdings/use-holding-list";
import { TickerCard } from "@/components/ui/my/ticker-card";
import { NavigateToHoldingsAdd } from "@/app/(home)/_components/navigate-to-holdings-add";
import Loading from "@/components/ui/my/loading";
import {
  AppBar,
  AppBarExtra,
  AppContainer,
} from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { HoldingSummary } from "@/app/(home)/_components/holding-summary";
import { useHoldingSummary } from "@/lib/services/composed/use-holdings-summary";
import { computeDailyProfit } from "@/lib/compute";
import { useDailySummary } from "@/lib/services/composed/use-daily-summary";
import { useHoldingDetailStore } from "@/lib/services/composed/holding-detail-provider";

export default function Page() {
  const { isLoading, data: list } = useHoldingList();
  const holdingIds = list.map((holding) => holding.id);
  const summary = useHoldingSummary(holdingIds);
  const quoteMap = useHoldingDetailStore((s) => s.quoteStore);
  const dailySummary = useDailySummary(holdingIds);
  const daily = React.useMemo(() => {
    return dailySummary[0]
      ? computeDailyProfit(dailySummary[0], quoteMap)
      : null;
  }, [dailySummary, quoteMap]);
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
                  <Link href={"/groups"}>
                    组合视图
                    <ArrowRight />
                  </Link>
                </Button>
              }
            >
              <HoldingSummary summary={summary} daily={daily} />
            </AppBarExtra>
          )}
        </AppBar>
      }
      hideBackButton={true}
    >
      {summary.holdings.length ? (
        <>
          <div className={"common-layout flex flex-col gap-2 pt-10 pb-20"}>
            {summary.holdings.map((hwq) => {
              return (
                <TickerCard
                  key={hwq.id}
                  id={hwq.id}
                  ticker={hwq.ticker}
                  weightPct={hwq.weightPct}
                  profit={hwq.profit}
                  daily={daily?.holdingMap[hwq.id]}
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
