"use client";
import { HoldingWithQuote } from "@/lib/services/composed/use-holdings-with-quote";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SinaStockType } from "@/lib/enums/sina-stock-type";
import { Button } from "@/components/ui/button";
import { ChevronUp, Trash } from "lucide-react";
import React from "react";
import { deleteHolding } from "@/lib/services/holdings/holding-apis";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { MyAlertDialog } from "@/components/ui/my/alert-dialog";
import { useHoldingList } from "@/lib/services/holdings/use-holding-list";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SimpleDisplay } from "@/components/ui/my/quote-display";
import {
  formatFund,
  formatPercent,
  getTickerChangeColorClass,
} from "@/lib/market-utils";
import { motion } from "motion/react";
import { SinaStockTypeBadge } from "@/components/ui/my/sina-stock-type-badge";
import { TargetAndTransition } from "motion";

export const BaseInfo = ({ data }: { data: HoldingWithQuote }) => {
  const route = useRouter();
  const [expanded, setExpanded] = React.useState(true);
  const toggleExpanded = () => setExpanded(!expanded);
  const { mutate } = useHoldingList();
  const { id, ticker, quote } = data;

  const isAShare = ticker.type === SinaStockType.AShare;
  const carouselList = [];
  if (quote) {
    carouselList.push(
      <DetailDisplay
        key={1}
        expanded={expanded}
        title={
          <SimpleDisplay
            title={isAShare ? "市场价格" : "场内价格"}
            value={quote.formatter(quote.current!)}
            colorClass={getTickerChangeColorClass(quote.pct!)}
          />
        }
        detail={
          <div className={"grid grid-cols-2"}>
            <div className={"col-span-full"}>时间：{quote.time}</div>
            <div>涨跌：{quote.formatter(quote.diff!)}</div>
            <div>涨幅：{formatPercent(quote.pct)}</div>
            <div>最高：{quote.formatter(quote.high!)}</div>
            <div>最低：{quote.formatter(quote.low!)}</div>
            <div>今开：{quote.formatter(quote.open!)}</div>
            <div>昨收：{quote.formatter(quote.prevClose!)}</div>
          </div>
        }
      />,
    );
    if (!isAShare) {
      carouselList.push(
        <DetailDisplay
          key={2}
          expanded={expanded}
          title={
            <SimpleDisplay
              title={"场外价格"}
              value={quote.formatter(quote.fundNav!)}
              colorClass={getTickerChangeColorClass(quote.fundNavPct!)}
            />
          }
          detail={
            <>
              <div>净值日期： {quote.fundDate}</div>
              <div>前一日净值： {formatFund(quote.preFundNav)}</div>
              <div>
                净值变化：
                {formatPercent(quote.fundNavPct)}
              </div>
            </>
          }
        />,
      );
    }
  }

  const config: TargetAndTransition = {
    rotateZ: expanded ? 180 : 0,
  };

  return (
    <Card className={quote ? "pb-0" : ""}>
      <CardHeader>
        <CardTitle className={"flex items-center justify-between"}>
          <div className={"flex items-center gap-1"}>
            <SinaStockTypeBadge type={ticker.type} />
            {ticker.label}
          </div>
          <MyAlertDialog
            trigger={
              <Button variant={"destructive"} className={"rounded-full"}>
                <Trash />
              </Button>
            }
            title={"确定删除?"}
            description={"一旦删除，该标的关联的持仓信息将会一并删除"}
            showCancel={true}
            onConfirm={async () => {
              const response = await deleteHolding(id);
              const { message, error } = await response.json();
              if (error) {
                toast.error(error);
              } else {
                await mutate();
                toast.success(message);
                route.replace("/");
              }
            }}
          />
        </CardTitle>
        {quote && (
          <CardContent className={"px-0 pt-2 w-full"}>
            <Carousel
              opts={{
                loop: true,
                align: "center",
              }}
              className={"flex-1 mx-8"}
            >
              <CarouselContent>
                {carouselList.map((item, idx) => (
                  <CarouselItem key={idx}>{item}</CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious size={"sm"} />
              <CarouselNext />
            </Carousel>

            <Button
              variant={"ghost"}
              className={"w-full"}
              onClick={toggleExpanded}
            >
              <motion.div
                initial={config}
                animate={config}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <ChevronUp className={"size-5 text-gray-500"} />
              </motion.div>
            </Button>
          </CardContent>
        )}
      </CardHeader>
    </Card>
  );
};

function DetailDisplay({
  expanded,
  title,
  detail,
}: {
  expanded: boolean;
  title: React.ReactNode;
  detail: React.ReactNode;
}) {
  const config: TargetAndTransition = {
    height: expanded ? "auto" : 0,
  };

  return (
    <>
      {title}
      <motion.div
        initial={config}
        animate={config}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {detail}
      </motion.div>
    </>
  );
}
