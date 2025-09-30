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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteHolding } from "@/lib/services/holdings/holding-apis";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const BaseInfo = ({ data }: { data: HoldingWithQuote }) => {
  const route = useRouter();
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"destructive"} className={"rounded-full"}>
                <Trash />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>确定删除?</AlertDialogTitle>
                <AlertDialogDescription>
                  一旦删除，该标的关联的持仓信息将会一并删除
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    const response = await deleteHolding(data.id);
                    const { message, error } = await response.json();
                    if (error) {
                      toast.error(error, { position: "top-center" });
                    } else {
                      toast.success(message, { position: "top-center" });
                      route.replace("/");
                    }
                  }}
                >
                  确认
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardTitle>
      </CardHeader>
    </Card>
  );
};
