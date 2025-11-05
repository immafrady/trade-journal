import { useTradeRecordSummary } from "@/lib/services/trade-records/use-trade-record-summary";
import React from "react";
import { HoldingInfoContext } from "@/app/(home)/holdings/[id]/_providers/holding-info";
import {
  calculatePercent,
  formatMoney,
  formatPercent,
  formatShares,
  getTickerChangeColorClass,
} from "@/lib/market-utils";
import { SimpleDisplayVertical } from "@/components/ui/my/quote-display";
import { Separator } from "@/components/ui/separator";
import { AnimatePresence, motion } from "motion/react";
import { SinaStockType } from "@/lib/enums/sina-stock-type";
import { TradeRecordConstants } from "@/lib/services/trade-records/constants";
import { BottomBar } from "@/app/(home)/holdings/[id]/_components/data-page/tab-summary/bottom-bar";

export const TabSummary = () => {
  const { id, data } = React.useContext(HoldingInfoContext)!;
  const summary = useTradeRecordSummary(id);
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCount((c) => c + 1);
    }, 5000);
    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    <>
      <div className={"relative common-layout flex flex-col items-center"}>
        <div className={"w-full max-w-md"}>
          <section
            className={
              "grid justify-center place-items-center gap-2 grid-cols-2 md:grid-cols-4"
            }
          >
            <SimpleDisplayVertical title={"总支出金额"}>
              {formatMoney(summary.totalAmount)}
            </SimpleDisplayVertical>
            <SimpleDisplayVertical title={"总份额"}>
              {formatShares(summary.totalShares)}
            </SimpleDisplayVertical>
            <SimpleDisplayVertical title={"总交易费用"}>
              {formatMoney(summary.totalFee)}
            </SimpleDisplayVertical>
            <SimpleDisplayVertical title={"交易次数"}>
              {summary.count}
            </SimpleDisplayVertical>
          </section>
          <Separator className={"my-2 md:my-4"} />
          {data?.quote && (
            <div>
              {data.ticker.type === SinaStockType.AShare ? (
                <PriceCalculationBlock
                  key={0}
                  title={"收益计算"}
                  costPrice={summary.costPrice}
                  currentPrice={data.quote.current!}
                  formatter={data.quote.formatter}
                />
              ) : (
                <AnimatePresence mode={"wait"}>
                  {count % 2 === 0 ? (
                    <PriceCalculationBlock
                      key={1}
                      title={"收益计算（场内计价）"}
                      costPrice={summary.costPrice}
                      currentPrice={data.quote.current!}
                      formatter={data.quote.formatter}
                    />
                  ) : (
                    <PriceCalculationBlock
                      key={2}
                      title={"收益计算（场外计价）"}
                      costPrice={summary.costPrice}
                      currentPrice={data.quote.fundNav!}
                      formatter={data.quote.formatter}
                    />
                  )}
                </AnimatePresence>
              )}
            </div>
          )}
          <Separator className={"my-2 md:my-4"} />
          {}
          <AnimatePresence mode={"wait"}>
            {count % 2 === 0 ? (
              <DataPeakDisplayBlock
                key={4}
                title={TradeRecordConstants.Amount}
                value={formatMoney(summary.totalAmount)}
                maxValue={formatMoney(summary.maxTotalAmount)}
                valuePct={summary.totalAmountPct}
                valueTradeAt={summary.maxTotalAmountTradedAt ?? ""}
              />
            ) : (
              <DataPeakDisplayBlock
                key={5}
                title={TradeRecordConstants.Shares}
                value={formatShares(summary.totalShares)}
                maxValue={formatShares(summary.maxTotalShares)}
                valuePct={summary.totalSharesPct}
                valueTradeAt={summary.maxTotalSharesTradedAt ?? ""}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
      <BottomBar />
    </>
  );
};

const MotionBlock = ({
  title,
  config,
}: {
  title: string;
  config: { title: string; content: React.ReactNode }[];
}) => (
  <motion.section
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h5 className={"text-center my-2"}>{title}</h5>
    <div className="grid justify-center place-items-center gap-2 grid-cols-2 md:grid-cols-4">
      {config.map((item, i) => (
        <SimpleDisplayVertical key={i} title={item.title}>
          {item.content}
        </SimpleDisplayVertical>
      ))}
    </div>
  </motion.section>
);

const PriceCalculationBlock = ({
  title,
  currentPrice,
  costPrice,
  formatter,
}: {
  title: string;
  currentPrice: number;
  costPrice: number;
  formatter: (num: number) => string;
}) => {
  const diff = React.useMemo(
    () => currentPrice - costPrice,
    [currentPrice, costPrice],
  );
  const pct = React.useMemo(
    () => formatPercent(calculatePercent(currentPrice, costPrice)),
    [currentPrice, costPrice],
  );
  const changeColorClassName = React.useMemo(
    () => getTickerChangeColorClass(diff),
    [diff],
  );
  return (
    <MotionBlock
      title={title}
      config={[
        {
          title: "当前成本",
          content: formatter(costPrice),
        },
        {
          title: "市场价格",
          content: formatter(currentPrice),
        },
        {
          title: "价差",
          content: (
            <span className={changeColorClassName}>{formatter(diff)}</span>
          ),
        },
        {
          title: "收益率",
          content: <span className={changeColorClassName}>{pct}</span>,
        },
      ]}
    />
  );
};

const DataPeakDisplayBlock = ({
  title,
  value,
  maxValue,
  valuePct,
  valueTradeAt,
}: {
  title: string;
  value: string;
  maxValue: string;
  valuePct: number;
  valueTradeAt: string;
}) => (
  <MotionBlock
    key={3}
    title={title}
    config={[
      {
        title: "当前",
        content: value,
      },
      {
        title: "历史最高",
        content: maxValue,
      },
      {
        title: "百分位",
        content: formatPercent(valuePct * 100),
      },
      {
        title: "历史最高日",
        content: valueTradeAt,
      },
    ]}
  />
);
