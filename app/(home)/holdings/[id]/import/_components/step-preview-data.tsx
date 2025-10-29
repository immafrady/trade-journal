import { TradeRecord } from "@/lib/services/trade-records/trade-record";
import { FragmentTemplate } from "@/app/(home)/holdings/[id]/import/_components/fragment-template";
import { Button, LoadingButton } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { motion } from "motion/react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { InlineDisplay } from "@/components/ui/my/inline-display";
import { TradeRecordConstants } from "@/lib/services/trade-records/constants";
import { formatMoney, formatShares } from "@/lib/market-utils";
import { Separator } from "@/components/ui/separator";
import { HoldingInfoContext } from "@/app/(home)/holdings/[id]/_providers/holding-info";

export function StepPreviewData({
  records,
  onRedo,
  onSubmit,
}: {
  records: TradeRecord[];
  onRedo: () => void;
  onSubmit: () => Promise<void>;
}) {
  const { data } = React.useContext(HoldingInfoContext);
  const quote = data!.quote!;

  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <FragmentTemplate
      title={"第二步：预览数据"}
      description={"请确认预览数据无误后，点击提交上传记录。"}
      actions={
        <div className={"flex gap-2"}>
          <motion.div layoutId={"primary-button"}>
            <LoadingButton
              loading={isLoading}
              icon={<Upload />}
              onClick={async () => {
                setIsLoading(true);
                try {
                  await onSubmit();
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              提交数据
            </LoadingButton>
          </motion.div>
          <Button variant={"ghost"} onClick={onRedo}>
            我再想想
          </Button>
        </div>
      }
    >
      <div className={"w-full flex flex-col items-center gap-2"}>
        <Carousel className={"w-full"} setApi={setApi}>
          <CarouselContent>
            {records.map((record, i) => (
              <CarouselItem key={i}>
                <Card className={"m-4"}>
                  <CardHeader>
                    <CardTitle>{record.display.tradedAt}</CardTitle>
                    <CardDescription>
                      {TradeRecordConstants.Factor}：{record.props.factor}
                    </CardDescription>
                    <CardAction>
                      <Badge>{record.display.type}</Badge>
                    </CardAction>
                  </CardHeader>
                  <CardContent>
                    <InlineDisplay
                      list={[
                        {
                          title: TradeRecordConstants.Shares,
                          content: formatShares(record.derived.shares),
                        },
                        {
                          title: TradeRecordConstants.Price,
                          content: quote.formatter(record.derived.price),
                        },
                        {
                          title: TradeRecordConstants.Amount,
                          content: formatMoney(record.derived.amount),
                        },
                        {
                          title: TradeRecordConstants.Fee,
                          content: formatMoney(record.derived.fee),
                        },
                        {
                          title: TradeRecordConstants.Comment,
                          content: record.props.comment || "-",
                        },
                      ]}
                    />
                    <Separator className={"my-2"} />
                    <InlineDisplay
                      list={[
                        {
                          title: TradeRecordConstants.AdjustedShares,
                          content: formatShares(record.adjusted.shares),
                        },
                        {
                          title: TradeRecordConstants.AdjustedAmount,
                          content: formatMoney(record.adjusted.amount),
                        },
                        {
                          title: TradeRecordConstants.AdjustedFee,
                          content: formatMoney(record.adjusted.fee),
                        },
                      ]}
                    />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className={"left-0"} />
          <CarouselNext className={"right-0"} />
        </Carousel>
        <div className={"text-muted-foreground"}>
          {current}/{count}
        </div>
      </div>
    </FragmentTemplate>
  );
}
