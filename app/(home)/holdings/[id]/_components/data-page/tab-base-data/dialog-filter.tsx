/* eslint-disable react/no-children-prop */

import { ResponsiveDialog } from "@/components/ui/my/responsive-dialog";
import { Button } from "@/components/ui/button";
import { Eraser, Filter, FunnelPlus } from "lucide-react";
import React from "react";
import { ColumnFiltersState } from "@tanstack/react-table";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { FieldLayout } from "@/components/ui/my/field-layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getColumns } from "@/app/(home)/holdings/[id]/_components/data-page/tab-base-data/columns";
import { TradeRecordConstants } from "@/lib/services/trade-records/constants";

const filterableIds = getColumns()
  .filter((item) => item.filterFn)
  .map((item) => item.id);

export const DialogFilter = ({
  columnFilters,
  onColumnFiltersChange,
}: {
  columnFilters: ColumnFiltersState;
  onColumnFiltersChange: (state: ColumnFiltersState) => void;
}) => {
  const form = useForm({
    defaultValues: {
      id: columnFilters[0]?.id ?? "",
      minValue: (columnFilters[0]?.value as [number, number])?.[0] ?? "",
      maxValue: (columnFilters[0]?.value as [number, number])?.[1] ?? "",
    },
    onSubmitInvalid: () => {
      toast.error(`校验失败，无法提交`);
    },
    onSubmit: ({ value: form }) => {
      if (form.id) {
        onColumnFiltersChange([
          {
            id: form.id,
            value: [form.minValue || null, form.maxValue || null],
          },
        ]);
      } else {
        onColumnFiltersChange([]);
      }
    },
  });
  return (
    <ResponsiveDialog
      title={"筛选过滤"}
      trigger={
        <Button
          variant={columnFilters.length ? "default" : "outline"}
          size={"sm"}
        >
          {columnFilters.length ? <FunnelPlus /> : <Filter />}
          筛选过滤
        </Button>
      }
      onSubmit={async () => {
        await form.handleSubmit();
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div className={"flex flex-col gap-4"}>
          <form.Field
            name={"id"}
            children={(field) => (
              <FieldLayout label={"过滤字段"} field={field}>
                <div className={"flex gap-2"}>
                  <Select
                    value={field.state.value}
                    onValueChange={(v) => field.handleChange(v)}
                  >
                    <SelectTrigger className={"flex-1"}>
                      <SelectValue placeholder="请选择过滤字段" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        TradeRecordConstants.Price,
                        TradeRecordConstants.CumulativeCostPrice,
                        null,
                        TradeRecordConstants.Shares,
                        TradeRecordConstants.AdjustedShares,
                        TradeRecordConstants.CumulativeTotalShares,
                        null,
                        TradeRecordConstants.Amount,
                        TradeRecordConstants.AdjustedAmount,
                        TradeRecordConstants.CumulativeTotalAmount,
                      ].map((value, idx) =>
                        value ? (
                          <SelectItem key={idx} value={value}>
                            {value}
                          </SelectItem>
                        ) : (
                          <SelectSeparator key={idx} />
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  <Button
                    disabled={!field.state.value}
                    variant={"destructive"}
                    onClick={() => field.handleChange("")}
                  >
                    <Eraser />
                  </Button>
                </div>
              </FieldLayout>
            )}
          />
        </div>
      </form>
    </ResponsiveDialog>
  );
};
