import { GroupModel } from "@/lib/services/group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingButton } from "@/components/ui/my/button";
import { ArrowRight } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import { SinaStockTypeBadge } from "@/components/ui/my/sina-stock-type-badge";
import { Separator } from "@/components/ui/separator";
import { InlineDisplay } from "@/components/ui/my/inline-display";
import { formatMoney } from "@/lib/market-utils";
import { useHoldingList } from "@/lib/services/holdings/use-holding-list";

export const GroupCard = ({ model }: { model: GroupModel }) => {
  const router = useRouter();
  const { data: holdingList } = useHoldingList() ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className={"flex items-center justify-between"}>
          <div className={"flex items-center gap-1"}>{model.label}</div>
          <LoadingButton
            variant={"ghost"}
            icon={<ArrowRight />}
            onClick={() => {
              router.push(`/group/${model.id!}`);
            }}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <InlineDisplay
          list={[
            {
              title: "预算",
              content: formatMoney(model.budget),
            },
            {
              title: "投入",
              content: formatMoney(),
            },
            {
              title: "市值",
              content: formatMoney(),
            },
          ]}
        ></InlineDisplay>
        <Separator className={"my-2"}></Separator>
        <div className={"flex flex-col gap-1"}>
          {model.holdingIds?.map((holdingId) => {
            const hwq = holdingList.find((h) => h.id === holdingId);
            if (hwq) {
              return (
                <div key={holdingId} className={"flex items-center gap-1"}>
                  <SinaStockTypeBadge type={hwq.ticker.type} />
                  {hwq.ticker.label}
                </div>
              );
            }
          })}
        </div>
      </CardContent>
    </Card>
  );
};
