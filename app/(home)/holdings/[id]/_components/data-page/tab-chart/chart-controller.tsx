import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Minus, Plus } from "lucide-react";
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
  const [size, setSize] = React.useState(10);
  let maxPage = Math.floor(records.length / size);
  const extra = records.length - maxPage * size;
  if (extra < 5) {
    maxPage--;
  }

  const [page, setPage] = React.useState(maxPage);

  const filtered = React.useMemo(() => {
    const min = page * size;
    const max = size * (page + 1);
    if (page === maxPage && extra < 5) {
      return records.slice(min);
    } else {
      return records.slice(min, max);
    }
  }, [page, size, maxPage, extra, records]);

  React.useEffect(() => {
    onRangeChange(filtered);
  }, [filtered, onRangeChange]);

  const sizeChange = React.useCallback(
    (change: number) => {
      const s = size + change;
      setSize(s);
      const maxPage = Math.floor(records.length / s);
      if (page > maxPage) {
        setPage(maxPage);
      }
    },
    [size, page, records],
  );

  return (
    <Card>
      <CardContent>
        <div className="flex w-full items-center gap-2 text-sm">
          <Button
            disabled={page <= 0}
            size={"sm"}
            onClick={() => {
              setPage((p) => p - 1);
            }}
          >
            <ArrowLeft />
          </Button>
          <Button
            disabled={size - 5 <= 0}
            variant={"secondary"}
            size={"sm"}
            onClick={() => sizeChange(-5)}
          >
            <Minus />
          </Button>
          <Slider
            className={"flex-1"}
            value={[page]}
            onValueChange={([p]) => setPage(p)}
            max={maxPage}
            min={0}
            step={1}
          />
          <Button
            disabled={size + 5 >= 50}
            variant={"secondary"}
            size={"sm"}
            onClick={() => {
              sizeChange(5);
            }}
          >
            <Plus />
          </Button>
          <Button
            disabled={page >= maxPage}
            size={"sm"}
            onClick={() => {
              setPage((p) => p + 1);
            }}
          >
            <ArrowRight />
          </Button>
        </div>
        <div className={"text-center text-muted-foreground text-sm mt-2"}>
          第{page + 1}页，每页{size}条数据
        </div>
      </CardContent>
    </Card>
  );
};
