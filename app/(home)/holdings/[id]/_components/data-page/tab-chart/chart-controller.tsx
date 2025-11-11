import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SkipBack, SkipForward, StepBack, StepForward } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import React from "react";
import { TradeRecord } from "@/lib/services/trade-records/trade-record";

export const ChartController = ({
  records = [],
  onRangeChange,
}: {
  records: TradeRecord[];
  onRangeChange: (range: TradeRecord[]) => void;
}) => {
  const max = records.length - 1;
  const [range, setRange] = React.useState<number[]>([
    Math.max(0, max - 10),
    max,
  ]);

  function stepChange(change: number) {
    const [start, end] = range;
    if (change > 0) {
      // 往右推
      const allowed = Math.min(change, max - end);
      updateRangeRecords([start + allowed, end + allowed]);
    } else {
      // change <= 0 往左推
      const delta = Math.min(-change, start);
      updateRangeRecords([start - delta, end - delta]);
    }
  }

  function updateRangeRecords(range: number[]) {
    setRange(range);
    onRangeChange(records.slice(range[0], range[1]));
  }
  return (
    <Card>
      <CardContent>
        <div className="flex w-full items-center gap-2 text-sm">
          <Button
            size={"sm"}
            onChange={() => {
              stepChange(-10);
            }}
          >
            <SkipBack />
          </Button>
          <Button
            size={"sm"}
            onChange={() => {
              stepChange(-1);
            }}
          >
            <StepBack />
          </Button>
          <Slider
            className={"flex-1"}
            value={range}
            onValueChange={updateRangeRecords}
            max={max}
            min={0}
            step={1}
            minStepsBetweenThumbs={10}
          />
          <Button
            size={"sm"}
            onChange={() => {
              stepChange(1);
            }}
          >
            <StepForward />
          </Button>
          <Button
            size={"sm"}
            onChange={() => {
              stepChange(10);
            }}
          >
            <SkipForward />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
