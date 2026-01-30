import { GroupModel } from "@/lib/services/group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingButton } from "@/components/ui/my/button";
import { ArrowRight } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import { SinaStockTypeBadge } from "@/components/ui/my/sina-stock-type-badge";
import { Separator } from "@/components/ui/separator";
import { InlineDisplay } from "@/components/ui/my/inline-display";
import {
  formatMoney,
  formatPercent,
  getTickerChangeColorClass,
} from "@/lib/market-utils";
import { useHoldingList } from "@/lib/services/holdings/use-holding-list";
import { useGroupSummary } from "@/lib/services/group/hooks/use-group-summary";

export const GroupCard = ({ model }: { model: GroupModel }) => {
  const router = useRouter();
  const { data: holdingList } = useHoldingList() ?? [];
  const summary = useGroupSummary(model);

  return (
    <Card>
      <CardHeader>
        <CardTitle className={"flex items-center justify-between"}>
          <div className={"flex items-center gap-1"}>{model.label}</div>
          <LoadingButton
            variant={"ghost"}
            icon={<ArrowRight />}
            onClick={() => {
              router.push(`/groups/${model.id!}`);
            }}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <InlineDisplay
          list={[
            {
              title: "投入/预算",
              content: `${formatMoney(summary.totalAmount)}/${formatMoney(model.budget)}`,
            },
            {
              title: "市值(收益率)",
              content: (
                <div>
                  {formatMoney(summary.marketValue)}(
                  <span
                    className={getTickerChangeColorClass(summary.valueDiff!)}
                  >
                    {formatPercent(summary.valuePct)}
                  </span>
                  )
                </div>
              ),
            },
          ]}
        ></InlineDisplay>
        <Separator className={"my-2"}></Separator>
        <div className={"flex flex-col gap-1"}>
          {summary.summaries.map((s) => (
            <div key={s.id} className={"flex items-center gap-1"}>
              <SinaStockTypeBadge type={s.ticker.type} />
              {s.ticker.label}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
