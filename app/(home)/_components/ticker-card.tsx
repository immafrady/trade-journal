import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import {
  formatMoney,
  formatPercent,
  getTickerChangeColorClass,
} from "@/lib/market-utils";
import { ArrowRight } from "lucide-react";
import { LoadingButton } from "@/components/ui/my/button";
import { SinaStockTypeBadge } from "@/components/ui/my/sina-stock-type-badge";
import { InlineDisplay } from "@/components/ui/my/inline-display";
import { useRouter } from "next/navigation";
import { HoldingWithQuoteExtend } from "@/app/(home)/_provider";

export const TickerCard = ({ data }: { data: HoldingWithQuoteExtend }) => {
  // 计算汇总的逻辑

  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle className={"flex items-center justify-between"}>
          <div className={"flex items-center gap-1"}>
            <SinaStockTypeBadge type={data.ticker.type} />
            {data.ticker.label}
          </div>
          <LoadingButton
            variant={"ghost"}
            icon={<ArrowRight />}
            onClick={() => {
              router.push(`/holdings/${data.id}`);
            }}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.profit && (
          <InlineDisplay
            className={"gap-0.5"}
            list={[
              {
                title: "市值(仓位)",
                content: (
                  <div>
                    {formatMoney(data.profit?.marketValue)}(
                    {formatPercent(data.proportion)})
                  </div>
                ),
              },
              {
                title: "累计收益/率",
                content: (
                  <div
                    className={getTickerChangeColorClass(
                      data.profit.totalProfit,
                    )}
                  >
                    {formatMoney(data.profit?.totalProfit)}/
                    {formatPercent(data.profit.totalReturnPct)}
                  </div>
                ),
              },
            ]}
          />
        )}
      </CardContent>
    </Card>
  );
};
