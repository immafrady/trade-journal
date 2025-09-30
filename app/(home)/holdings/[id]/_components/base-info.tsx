"use client";
import { HoldingWithQuote } from "@/lib/services/composed/use-holdings-with-quote";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getSinaStockTypeColor,
  getSinaStockTypeLabel,
} from "@/lib/enums/sina-stock-type";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import React from "react";
import { deleteHolding } from "@/lib/services/holdings/holding-apis";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { MyAlertDialog } from "@/components/ui/my/alert-dialog";
import { useHoldingList } from "@/lib/services/holdings/use-holding-list";

export const BaseInfo = ({ data }: { data: HoldingWithQuote }) => {
  const route = useRouter();
  const { mutate } = useHoldingList();
  return (
    <Card>
      <CardHeader>
        <CardTitle className={"flex items-center justify-between"}>
          <div className={"flex items-center gap-1"}>
            <Badge className={getSinaStockTypeColor(data.ticker.type)}>
              {getSinaStockTypeLabel(data.ticker.type)}
            </Badge>
            {data.ticker.label}
          </div>
          <MyAlertDialog
            trigger={
              <Button variant={"destructive"} className={"rounded-full"}>
                <Trash />
              </Button>
            }
            title={"确定删除?"}
            description={"一旦删除，该标的关联的持仓信息将会一并删除"}
            showCancel={true}
            onConfirm={async () => {
              const response = await deleteHolding(data.id);
              const { message, error } = await response.json();
              if (error) {
                toast.error(error, { position: "top-center" });
              } else {
                await mutate();
                toast.success(message, { position: "top-center" });
                route.replace("/");
              }
            }}
          />
        </CardTitle>
      </CardHeader>
    </Card>
  );
};
