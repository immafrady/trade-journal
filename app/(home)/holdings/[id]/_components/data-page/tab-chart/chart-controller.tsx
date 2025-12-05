import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import React from "react";
import { TradeRecordChart } from "@/app/(home)/holdings/[id]/_components/data-page/tab-chart/use-trade-record-chart";
import { useElementWidth } from "@/hooks/use-element-width";

export const ChartController = ({
  records = [],
  onRangeChange,
}: {
  records: TradeRecordChart[];
  onRangeChange: (range: TradeRecordChart[]) => void;
}) => {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const pageWidth = useElementWidth(cardRef);
  const size = pageWidth ? Math.round(pageWidth / 30) : 20;
  const max = records.length > size ? records.length - size : 0;
  const [startIndex, setStartIndex] = React.useState(max);

  const filtered = React.useMemo(() => {
    if (max > 0) {
      const endIndex = startIndex + size - 1;
      return records.slice(startIndex, endIndex);
    } else {
      return records;
    }
  }, [max, records, size, startIndex]);

  React.useEffect(() => {
    onRangeChange(filtered);
  }, [filtered, onRangeChange]);

  const onIndexChange = (isUp: boolean, isFast = false) => {
    let change = isFast ? Math.round((size * 2) / 3) : 1;
    change = isUp ? change : -change;
    const newStartIndex = startIndex + change;
    if (newStartIndex < 0) {
      setStartIndex(0);
    } else if (newStartIndex > max) {
      setStartIndex(max);
    } else {
      setStartIndex(newStartIndex);
    }
  };

  return (
    <Card ref={cardRef}>
      <CardContent>
        <div className="flex w-full items-center gap-2 text-sm">
          <Button
            disabled={startIndex <= 0}
            size={"sm"}
            onClick={() => {
              onIndexChange(false, true);
            }}
          >
            <ChevronsLeft />
          </Button>
          <Button
            disabled={startIndex <= 0}
            variant={"secondary"}
            size={"sm"}
            onClick={() => {
              onIndexChange(false);
            }}
          >
            <ChevronLeft />
          </Button>
          <Slider
            className={"flex-1"}
            disabled={records.length <= size}
            value={[startIndex]}
            onValueChange={([p]) => setStartIndex(p)}
            max={max}
            min={0}
            step={1}
          />
          <Button
            disabled={startIndex >= max}
            variant={"secondary"}
            size={"sm"}
            onClick={() => {
              onIndexChange(true);
            }}
          >
            <ChevronRight />
          </Button>
          <Button
            disabled={startIndex >= max}
            size={"sm"}
            onClick={() => {
              onIndexChange(true, true);
            }}
          >
            <ChevronsRight />
          </Button>
        </div>
        <div className={"text-center text-muted-foreground text-sm mt-2"}>
          展示第{startIndex + 1}~{startIndex + size}条，共{records.length}条数据
        </div>
      </CardContent>
    </Card>
  );
};
