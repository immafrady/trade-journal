import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SinaStockType } from "@/lib/enums/sina-stock-type";
import React from "react";
import { SinaTicker } from "@/lib/services/sina/ticker";
import { SinaQuote } from "@/lib/services/sina/quote";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { formatPercent, getTickerChangeColorClass } from "@/lib/market-utils";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SimpleDisplay } from "@/components/ui/my/quote-display";
import { SinaStockTypeBadge } from "@/components/ui/my/sina-stock-type-badge";
import {
  TradeRecordSummary,
  useTradeRecordSummary,
} from "@/lib/services/trade-records/use-trade-record-summary";
import { HoldingSummaryContext } from "@/app/(home)/_components/holding-summary-provider";

export const TickerCard = ({
  id,
  ticker,
  quote,
}: {
  id: string;
  ticker: SinaTicker;
  quote?: SinaQuote;
}) => {
  // 计算汇总的逻辑
  const summary = useTradeRecordSummary(id);
  const { updateMap } = React.useContext(HoldingSummaryContext);
  const prevRef = React.useRef<TradeRecordSummary | null>(null);
  React.useEffect(() => {
    if (!summary) return;
    const prev = prevRef.current;
    if (!prev || JSON.stringify(prev) !== JSON.stringify(summary)) {
      prevRef.current = summary;
      updateMap(id, summary);
    }
  }, [id, summary, updateMap]);

  const isAShare = ticker.type === SinaStockType.AShare;
  const carouselList = [];
  if (quote) {
    carouselList.push(
      <SimpleDisplay
        title={isAShare ? "市场价格" : "场内价格"}
        value={quote.formatter(quote.current!)}
        change={formatPercent(quote.pct!)}
        colorClass={getTickerChangeColorClass(quote.pct!)}
      />,
    );
    if (!isAShare) {
      carouselList.push(
        <SimpleDisplay
          title={"场外价格"}
          value={quote.formatter(quote.fundNav!)}
          change={formatPercent(quote.fundNavPct!)}
          colorClass={getTickerChangeColorClass(quote.fundNavPct!)}
        />,
      );
    }
  }
  return (
    <Card key={ticker.key} className={"gap-3 py-3"}>
      <CardHeader>
        <CardTitle className={"flex items-center justify-between"}>
          <div className={"flex items-center gap-1"}>
            <SinaStockTypeBadge type={ticker.type} />
            {ticker.label}
          </div>
          <Button asChild variant={"ghost"}>
            <Link href={`/holdings/${id}`}>
              <ArrowRight />
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      {quote && (
        <CardContent>
          <Carousel
            plugins={[Autoplay({ delay: 2500 })]}
            opts={{
              loop: true,
              align: "center",
            }}
          >
            <CarouselContent>
              {carouselList.map((item, idx) => (
                <CarouselItem key={idx}>{item}</CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </CardContent>
      )}
    </Card>
  );
};
