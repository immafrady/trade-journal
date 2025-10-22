import { useTradeRecordSummary } from "@/lib/services/trade-records/use-trade-record-summary";
import React from "react";
import { HoldingInfoContext } from "@/app/(home)/holdings/[id]/_providers/holding-info";
import { formatMoney, formatShares } from "@/lib/market-utils";
import { SimpleDisplayVertical } from "@/components/ui/my/quote-display";
import { Separator } from "@/components/ui/separator";
import { AnimatePresence, motion } from "motion/react";

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
    <div className={"relative common-layout flex flex-col items-center"}>
      <div className={"w-full max-w-md"}>
        <div
          className={
            "grid justify-center place-items-center gap-2 grid-cols-2 md:grid-cols-4"
          }
        >
          <SimpleDisplayVertical
            title={"总支出金额"}
            content={formatMoney(summary.totalAmount)}
          />
          <SimpleDisplayVertical
            title={"当前成本"}
            content={data?.quote?.formatter(summary.avgPrice)}
          />

          <SimpleDisplayVertical
            title={"总份额"}
            content={formatShares(summary.totalShares)}
          />
          <SimpleDisplayVertical
            title={"总交易费用"}
            content={formatMoney(summary.totalFee)}
          />
        </div>
        <Separator className={"my-2 md:my-4"} />
        <div>
          <AnimatePresence mode={"wait"}>
            {count % 2 === 0 ? (
              <PriceCalculationBlock key={1} title={"场内计价"} />
            ) : (
              <PriceCalculationBlock key={2} title={"场外计价"} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const PriceCalculationBlock = ({ title }: { title: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {title}
    </motion.div>
  );
};
