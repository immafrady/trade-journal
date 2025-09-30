import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getSinaStockTypeColor,
  getSinaStockTypeLabel,
  SinaStockType,
} from "@/lib/enums/sina-stock-type";
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

export const TickerCard = ({
  ticker,
  quote,
}: {
  ticker: SinaTicker;
  quote?: SinaQuote;
}) => {
  const isAShare = ticker.type === SinaStockType.AShare;
  const carouselList = [];
  if (quote) {
    carouselList.push(
      <DisplayItem
        key={0}
        title={isAShare ? "市场价格" : "场内价格"}
        value={quote.formatter(quote.current!)}
        change={formatPercent(quote.pct!)}
        colorClass={getTickerChangeColorClass(quote.pct!)}
      />,
    );
    if (!isAShare) {
      carouselList.push(
        <DisplayItem
          key={1}
          title={"场外价格"}
          value={quote.formatter(quote.fundNav!)}
          change={formatPercent(quote.fundNavPct!)}
          colorClass={getTickerChangeColorClass(quote.fundNavPct!)}
        />,
      );
    }
  }
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
      {quote && (
        <CardContent>
          <Carousel
            plugins={[Autoplay({ delay: 2500 })]}
            opts={{
              loop: true,
              align: "center",
            }}
          >
            <CarouselContent>{carouselList}</CarouselContent>
          </Carousel>
        </CardContent>
      )}
    </Card>
  );
};

function DisplayItem({
  title,
  value,
  change,
  colorClass,
}: {
  title: string;
  value: string;
  change: string;
  colorClass: string;
}) {
  return (
    <CarouselItem>
      <div className={"flex items-center justify-between"}>
        <div className={"text-muted-foreground"}>{title}</div>
        <div className={colorClass}>
          {value}({change})
        </div>
      </div>
    </CarouselItem>
  );
}
