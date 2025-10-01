"use client";
import { HoldingWithQuote } from "@/lib/services/composed/use-holdings-with-quote";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getSinaStockTypeColor,
  getSinaStockTypeLabel,
  SinaStockType,
} from "@/lib/enums/sina-stock-type";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SinaStockTypeBadge } from "@/components/ui/my/sina-stock-type-badge";
export const BaseInfo = ({
  data,
  expanded,
}: {
  data: HoldingWithQuote;
  expanded: boolean;
}) => {
  const route = useRouter();
  const { mutate } = useHoldingList();
  const { id, ticker, quote } = data;

  const isAShare = ticker.type === SinaStockType.AShare;
  const carouselList = [];
  if (quote) {
    carouselList.push(
      <>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <SimpleDisplay
                key={0}
                title={isAShare ? "市场价格" : "场内价格"}
                value={quote.formatter(quote.current!)}
                change={formatPercent(quote.pct!)}
                colorClass={getTickerChangeColorClass(quote.pct!)}
              />
            </AccordionTrigger>
            <AccordionContent>
              <div>more more</div>
              <div>more more</div>
              <div>more more</div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </>,
    );
    if (!isAShare) {
      carouselList.push(
        <>
          <motion.div animate={{ height: "auto" }}>
            <SimpleDisplay
              key={1}
              title={"场外价格"}
              value={quote.formatter(quote.fundNav!)}
              change={formatPercent(quote.fundNavPct!)}
              colorClass={getTickerChangeColorClass(quote.fundNavPct!)}
            />
            {expanded && (
              <>
                <div>more more</div>
                <div>more more</div>
                <div>more more</div>
              </>
            )}
          </motion.div>
        </>,
      );
    }
  }

  return (
    <Card>
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
          <CardContent className={"px-0 pt-2"}>
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
      </CardHeader>
    </Card>
  );
};
