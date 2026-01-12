import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SinaQuote, SinaStockType, SinaTicker } from "@/lib/services/sina";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import {
  formatMoney,
  formatPercent,
  getTickerChangeColorClass,
} from "@/lib/market-utils";
import { ArrowRight } from "lucide-react";
import { LoadingButton } from "@/components/ui/my/button";
import { SimpleDisplay } from "@/components/ui/my/quote-display";
import { SinaStockTypeBadge } from "@/components/ui/my/sina-stock-type-badge";
import {
  TradeRecordSummary,
  useTradeRecordSummary,
} from "@/lib/services/trade-records";
import { InlineDisplay } from "@/components/ui/my/inline-display";
import { useRouter } from "next/navigation";
import { HomeContext } from "@/app/(home)/_provider";

export const TickerCard = ({
  id,
  ticker,
  quote,
  loadingId,
  onLinkClick,
  proportion = 0,
}: {
  id: string;
  ticker: SinaTicker;
  quote?: SinaQuote;
  proportion?: number;
  loadingId: string;
  onLinkClick: (id: string) => void;
}) => {
  // 计算汇总的逻辑
  const summary = useTradeRecordSummary(id);
  const { updateData } = React.useContext(HomeContext);
  const prevRef = React.useRef<TradeRecordSummary | null>(null);
  React.useEffect(() => {
    if (!summary) return;
    const prev = prevRef.current;
    if (!prev || JSON.stringify(prev) !== JSON.stringify(summary)) {
      prevRef.current = summary;
      updateData(id, summary);
    }
  }, [id, summary, updateData]);

  const router = useRouter();
  const isAShare = ticker.type === SinaStockType.AShare;
  const carouselList = [];
  if (quote) {
    carouselList.push(
      <SimpleDisplay
        title={isAShare ? "市场价格" : "场内价格"}
        value={ticker.formatter(quote.current!)}
        change={formatPercent(quote.pct!)}
        colorClass={getTickerChangeColorClass(quote.pct!)}
      />,
    );
    if (!isAShare) {
      carouselList.push(
        <SimpleDisplay
          title={"场外价格"}
          value={ticker.formatter(quote.fundNav!)}
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
          <LoadingButton
            loading={!!loadingId && loadingId === id}
            disabled={!!loadingId && loadingId !== id}
            variant={"ghost"}
            icon={<ArrowRight />}
            onClick={() => {
              onLinkClick(id);
              router.push(`/holdings/${id}`);
            }}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {quote && (
          <>
            {summary && (
              <InlineDisplay
                className={"gap-0.5"}
                list={[
                  {
                    title: "成本价格",
                    content: ticker.formatter(summary.costPrice),
                  },
                  {
                    title: "仓位",
                    content: formatMoney(summary.totalAmount),
                  },
                  {
                    title: "仓位占比",
                    content: formatPercent(proportion),
                  },
                ]}
              />
            )}
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
          </>
        )}
      </CardContent>
    </Card>
  );
};
