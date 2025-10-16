import { TradeRecord } from "@/lib/services/trade-records/trade-record";
import { FragmentTemplate } from "@/app/(home)/holdings/[id]/import/_components/fragment-template";
import { Button } from "@/components/ui/button";
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
import { useHoldingInfo } from "@/app/(home)/holdings/[id]/_hooks/use-holding-info";
import { formatMoney } from "@/lib/market-utils";
import { Separator } from "@/components/ui/separator";

export function StepPreviewData({
  records,
  onRedo,
  onSubmit,
}: {
  records: TradeRecord[];
  onRedo: () => void;
  onSubmit: () => void;
}) {
  const { data } = useHoldingInfo();
  const quote = data!.quote!;

  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

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
            <Button onClick={onSubmit}>
              <Upload />
              提交数据
            </Button>
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
                      {TradeRecordConstants.Factor}：{record.props.factor}倍
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
                          content: record.props.shares,
                        },
                        {
                          title: TradeRecordConstants.Price,
                          content: quote.formatter(record.calculated.price),
                        },
                        {
                          title: TradeRecordConstants.Amount,
                          content: formatMoney(record.calculated.amount),
                        },
                        {
                          title: TradeRecordConstants.Fee,
                          content: formatMoney(record.calculated.fee),
                        },
                        {
                          title: TradeRecordConstants.Comment,
                          content: record.props.comment || "-",
                        },
                      ]}
                    />
                    <Separator className={"my-2"} />
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
