import {
  HoldingInfo,
  useHoldingList,
} from "@/lib/services/holdings/use-holding-list";
import {
  TradeRecordSummary,
  useTradeRecordSummary,
} from "@/lib/services/trade-records/use-trade-record-summary";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type TradeRecordSummaryMap = Record<string, TradeRecordSummary>;
export const HoldingSummary = () => {
  const { data } = useHoldingList();
  const [map, setMap] = React.useState<TradeRecordSummaryMap>({});
  const onChange = React.useCallback(
    (id: string, summary: TradeRecordSummary) => {
      setMap((m) => ({ ...m, [id]: summary }));
    },
    [],
  );
  return (
    <>
      <Card className={"py-4"}>
        <CardContent>
          <Carousel
            opts={{
              loop: true,
              align: "center",
            }}
            className={"flex-1 mx-4"}
          >
            <CarouselContent>
              <Summary map={map} list={data} />
              <Graph map={map} list={data} />
              <Rank map={map} list={data} />
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </CardContent>
      </Card>
      {data?.map((holding) => (
        <HoldingFetchItem
          key={holding.id}
          id={holding.id}
          onChange={onChange}
        />
      ))}
    </>
  );
};

const HoldingFetchItem = ({
  id,
  onChange,
}: {
  id: string;
  onChange: (id: string, summary: TradeRecordSummary) => void;
}) => {
  const summary = useTradeRecordSummary(id);
  const prevRef = React.useRef<TradeRecordSummary | null>(null);

  React.useEffect(() => {
    if (!summary) return;
    const prev = prevRef.current;
    if (!prev || JSON.stringify(prev) !== JSON.stringify(summary)) {
      prevRef.current = summary;
      onChange(id, summary);
    }
  }, [id, summary, onChange]);

  return null;
};

const Template = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <CarouselItem>
      <div>
        <h3 className={"font-medium text-lg mb-2"}>{title}</h3>
        <div>{children}</div>
      </div>
    </CarouselItem>
  );
};

const Summary = ({
  map,
}: {
  map: TradeRecordSummaryMap;
  list: HoldingInfo[];
}) => {
  return <Template title={"账户总览"}>1</Template>;
};

const Graph = ({
  map,
}: {
  map: TradeRecordSummaryMap;
  list: HoldingInfo[];
}) => {
  return <Template title={"持仓分布"}>2</Template>;
};

const Rank = ({ map }: { map: TradeRecordSummaryMap; list: HoldingInfo[] }) => {
  return <Template title={"仓位榜单"}>3</Template>;
};
