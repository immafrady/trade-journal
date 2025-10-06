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
} from "@/components/ui/carousel";
import { SimpleDisplay } from "@/components/ui/my/quote-display";
import { formatPercent, getTickerChangeColorClass } from "@/lib/market-utils";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "motion/react";
import { SinaStockTypeBadge } from "@/components/ui/my/sina-stock-type-badge";
import { TargetAndTransition } from "motion";

export const BaseInfo = ({ data }: { data: HoldingWithQuote }) => {
  const route = useRouter();
  const [expanded, setExpanded] = React.useState(false);
  const toggleExpanded = () => setExpanded(!expanded);
  const { mutate } = useHoldingList();
  const { id, ticker, quote } = data;

  const isAShare = ticker.type === SinaStockType.AShare;
  const carouselList = [];
  if (quote) {
    carouselList.push(
      <DetailDisplay
        expanded={expanded}
        title={
          <SimpleDisplay
            key={1}
            title={isAShare ? "市场价格" : "场内价格"}
            value={quote.formatter(quote.fundNav!)}
            change={formatPercent(quote.fundNavPct!)}
            colorClass={getTickerChangeColorClass(quote.fundNavPct!)}
          />
        }
        detail={
          <>
            <div>more more</div>
            <div>more more</div>
            <div>more more</div>
          </>
        }
      />,
    );
    if (!isAShare) {
      carouselList.push(
        <DetailDisplay
          expanded={expanded}
          title={
            <SimpleDisplay
              key={1}
              title={"场外价格"}
              value={quote.formatter(quote.fundNav!)}
              change={formatPercent(quote.fundNavPct!)}
              colorClass={getTickerChangeColorClass(quote.fundNavPct!)}
            />
          }
          detail={
            <>
              <div>more more</div>
              <div>more more</div>
              <div>more more</div>
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
    <Card onClick={toggleExpanded}>
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
                toast.error(error, { position: "top-center" });
              } else {
                await mutate();
                toast.success(message, { position: "top-center" });
                route.replace("/");
              }
            }}
          />
        </CardTitle>
        {quote && (
          <CardContent className={"px-0 pt-2 w-full flex items-center gap-1"}>
            <Carousel
              plugins={[Autoplay({ delay: 2500 })]}
              opts={{
                loop: true,
                align: "center",
              }}
              className={"flex-1"}
            >
              <CarouselContent onClick={toggleExpanded}>
                {carouselList.map((item, idx) => (
                  <CarouselItem key={idx}>{item}</CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <motion.div
              initial={config}
              animate={config}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <ChevronUp className={"size-5 text-gray-500"} />
            </motion.div>
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
