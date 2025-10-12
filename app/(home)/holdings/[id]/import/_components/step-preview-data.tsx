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
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

export function StepPreviewData({
  records,
  onRedo,
}: {
  records: TradeRecord[];
  onRedo: () => void;
}) {
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
            <Button>
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
                    <CardTitle>{record.tradedAt}</CardTitle>
                    <CardDescription>{record.props.type.label}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Card Content</p>
                  </CardContent>
                  <CardFooter>
                    <p>Card Footer</p>
                  </CardFooter>
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
