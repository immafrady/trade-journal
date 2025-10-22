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

export const TabSummary = () => {
  const { id, data } = React.useContext(HoldingInfoContext)!;
  if (!data) return null;
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
    <div className={"relative common-layout flex flex-col items-center"}>
      <div className={"w-full max-w-md"}>
        <div
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
        </div>
        <Separator className={"my-2 md:my-4"} />
        {data.quote && (
          <div>
            {data.ticker.type === SinaStockType.AShare ? (
              <PriceCalculationBlock
                key={0}
                title={"收益计算"}
                shares={summary.totalShares}
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
                    shares={summary.totalShares}
                    costPrice={summary.costPrice}
                    currentPrice={data.quote.current!}
                    formatter={data.quote.formatter}
                  />
                ) : (
                  <PriceCalculationBlock
                    key={2}
                    title={"收益计算（场外计价）"}
                    shares={summary.totalShares}
                    costPrice={summary.costPrice}
                    currentPrice={data.quote.fundNav!}
                    formatter={data.quote.formatter}
                  />
                )}
              </AnimatePresence>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const PriceCalculationBlock = ({
  title,
  shares,
  currentPrice,
  costPrice,
  formatter,
}: {
  title: string;
  shares: number;
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
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h5 className={"text-center my-2"}>{title}</h5>
      <div className="grid justify-center place-items-center gap-2 grid-cols-2 md:grid-cols-4">
        <SimpleDisplayVertical title={"当前成本"}>
          {formatter(costPrice)}
        </SimpleDisplayVertical>
        <SimpleDisplayVertical title={"市场价格"}>
          {formatter(currentPrice)}
        </SimpleDisplayVertical>
        <SimpleDisplayVertical title={"价差"}>
          <span className={changeColorClassName}>{formatter(diff)}</span>
        </SimpleDisplayVertical>
        <SimpleDisplayVertical title={"收益率"}>
          <span className={changeColorClassName}>{pct}</span>
        </SimpleDisplayVertical>
      </div>
    </motion.section>
  );
};
