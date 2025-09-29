"use client";
import React from "react";
import { createClient } from "@/lib/supabase/browser-client";
import { Button } from "@/components/ui/button";
import Loading from "./loading";
import StartGuidance from "@/app/(home)/_components/start-guidance";
import { useHoldingList } from "@/lib/services/holdings/use-holding-list";
import { useRealtimeQuotes } from "@/lib/services/sina/use-realtime-quotes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getSinaStockTypeColor,
  getSinaStockTypeLabel,
} from "@/lib/enums/sina-stock-type";
import {
  Ticker,
  TickerPrice,
  TickerSymbol,
} from "@/components/ui/shadcn-io/ticker";
import { Badge } from "@/components/ui/badge";

export default function Page() {
  const { data: tickers, isLoading, mutate } = useHoldingList();
  const { data: quoteMap } = useRealtimeQuotes(tickers ?? []);
  console.log("qn:", quoteMap);
  return (
    <>
      <div>
        {tickers?.length ? (
          <>
            <div className={"p-layout flex flex-col gap-2"}>
              {tickers?.map((ticker) => {
                const quote = quoteMap?.get(ticker);
                return (
                  <Card key={ticker.key} className={"gap-2 py-4"}>
                    <CardHeader>
                      <CardTitle className={"flex items-center gap-1"}>
                        <Badge className={getSinaStockTypeColor(ticker.type)}>
                          {getSinaStockTypeLabel(ticker.type)}
                        </Badge>
                        {ticker.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {quote && (
                        <Ticker currency={"CNY"} locale={"zh-CN"}>
                          <TickerSymbol symbol={ticker.stockSymbol} />
                          <TickerPrice
                            price={quote?.close ? +quote?.close : 0}
                          />
                        </Ticker>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        ) : (
          <StartGuidance />
        )}
      </div>
      <Loading isLoading={isLoading} />
    </>
  );
}
