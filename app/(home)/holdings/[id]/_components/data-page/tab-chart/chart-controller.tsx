import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SkipBack, SkipForward, StepBack, StepForward } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import React from "react";
import { TradeRecordChart } from "@/app/(home)/holdings/[id]/_components/data-page/tab-chart/use-trade-record-chart";

export const ChartController = ({
  records = [],
  onRangeChange,
}: {
  records: TradeRecordChart[];
  onRangeChange: (range: TradeRecordChart[]) => void;
}) => {
  const max = records.length - 1;
  const [range, setRange] = React.useState<number[]>([
    Math.max(0, max - 10),
    max,
  ]);

  const filtered = React.useMemo(() => {
    return records.slice(range[0], range[1]);
  }, [records, range]);

  React.useEffect(() => {
    onRangeChange(filtered);
  }, [filtered, onRangeChange]);

  function stepChange(change: number) {
    const [start, end] = range;
    if (change > 0) {
      // 往右推
      const allowed = Math.min(change, max - end);
      setRange([start + allowed, end + allowed]);
    } else {
      // change <= 0 往左推
      const delta = Math.min(-change, start);
      setRange([start - delta, end - delta]);
    }
  }

  return (
    <Card>
      <CardContent>
        <div className="flex w-full items-center gap-2 text-sm">
          <Button
            size={"sm"}
            onClick={() => {
              stepChange(-10);
            }}
          >
            <SkipBack />
          </Button>
          <Button
            size={"sm"}
            onClick={() => {
              stepChange(-1);
            }}
          >
            <StepBack />
          </Button>
          <Slider
            className={"flex-1"}
            value={range}
            onValueChange={setRange}
            max={max}
            min={0}
            step={1}
            minStepsBetweenThumbs={10}
          />
          <Button
            size={"sm"}
            onClick={() => {
              stepChange(1);
            }}
          >
            <StepForward />
          </Button>
          <Button
            size={"sm"}
            onClick={() => {
              stepChange(10);
            }}
          >
            <SkipForward />
          </Button>
        </div>
        <div className={"text-center text-muted-foreground text-sm mt-2"}>
          第{range[0] + 1}至{range[1] + 1}数据，共{range[1] - range[0]}条
        </div>
      </CardContent>
    </Card>
  );
};
