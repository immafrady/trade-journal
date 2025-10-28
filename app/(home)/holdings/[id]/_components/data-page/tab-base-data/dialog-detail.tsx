import { ResponsiveDialog } from "@/components/ui/my/responsive-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { View } from "lucide-react";
import { InlineDisplay } from "@/components/ui/my/inline-display";
import { TradeRecordConstants } from "@/lib/services/trade-records/constants";
import {
  formatMoney,
  formatShares,
  StockValueFormatter,
} from "@/lib/market-utils";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { TradeRecord } from "@/lib/services/trade-records/trade-record";

export const DialogDetail = ({
  record,
  formatter,
}: {
  record: TradeRecord;
  formatter: StockValueFormatter;
}) => {
  formatter ??= (num) => num + "";
  return (
    <ResponsiveDialog
      trigger={
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <View />
          查看详情
        </DropdownMenuItem>
      }
      title={"查看详情"}
    >
      <InlineDisplay
        list={[
          {
            title: TradeRecordConstants.TradedAt,
            content: record.display.tradedAt,
          },
          {
            title: TradeRecordConstants.Type,
            content: record.display.type,
          },
          {
            title: TradeRecordConstants.Shares,
            content: formatShares(record.derived.shares),
          },
          {
            title: TradeRecordConstants.Price,
            content: formatter(record.derived.price),
          },
          {
            title: TradeRecordConstants.Amount,
            content: formatMoney(record.derived.amount),
          },
          {
            title: TradeRecordConstants.Fee,
            content: formatMoney(record.derived.fee),
          },
          {
            title: TradeRecordConstants.Comment,
            content: record.props.comment || "-",
          },
        ]}
      />
      <Separator className={"my-2"} />
      <InlineDisplay
        list={[
          {
            title: TradeRecordConstants.Factor,
            content: record.props.factor,
          },
          {
            title: TradeRecordConstants.AdjustedShares,
            content: formatShares(record.adjusted.shares),
          },
          {
            title: TradeRecordConstants.AdjustedAmount,
            content: formatMoney(record.adjusted.amount),
          },
          {
            title: TradeRecordConstants.AdjustedFee,
            content: formatMoney(record.adjusted.fee),
          },
        ]}
      />
      <Separator className={"my-2"} />
      <h3 className={"text-center font-medium"}>建仓以来</h3>
      <InlineDisplay
        list={[
          {
            title: TradeRecordConstants.CumulativeCostPrice,
            content: formatter(record.cumulative.costPrice),
          },
          {
            title: TradeRecordConstants.CumulativeTotalAmount,
            content: formatMoney(record.cumulative.totalAmount),
          },
          {
            title: TradeRecordConstants.CumulativeTotalShares,
            content: formatShares(record.cumulative.totalShares),
          },
        ]}
      />
    </ResponsiveDialog>
  );
};
