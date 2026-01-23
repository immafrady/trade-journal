/* eslint-disable react/no-children-prop */

import {
  ResponsiveDialog,
  ResponsiveDialogRef,
} from "@/components/ui/my/responsive-dialog";
import { Button } from "@/components/ui/button";
import { Eraser, Filter, FunnelPlus } from "lucide-react";
import React from "react";
import { ColumnFiltersState } from "@tanstack/react-table";
import { useForm, useStore } from "@tanstack/react-form";
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
import { TradeRecordConstants } from "@/lib/services/trade-records";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { DatePicker } from "@/components/ui/my/date-picker";

export const DialogFilter = ({
  columnFilters,
  onColumnFiltersChange,
  filterCount,
}: {
  columnFilters: ColumnFiltersState;
  onColumnFiltersChange: (state: ColumnFiltersState) => void;
  filterCount?: number;
}) => {
  const dialogRef = React.useRef<ResponsiveDialogRef>(null);

  const form = useForm({
    defaultValues: getDefaultValue([]),
    onSubmitInvalid: () => {
      toast.error(`校验失败，无法提交`);
    },
    onSubmit: ({ value: form }) => {
      const filters: ColumnFiltersState = [];
      const dateMin = form.dateMin;
      const dateMax = form.dateMax;
      if (dateMin || dateMax) {
        filters.push({
          id: TradeRecordConstants.TradedAt,
          value: [dateMin, dateMax],
        });
      }
      if (form.id) {
        const type = form.type as ActionType;
        const num1 = +form.num1;
        const num2 = +form.num2;
        filters.push({
          id: form.id,
          value:
            type === ActionType.Equal
              ? [num1, num1]
              : type === ActionType.InBetween
                ? [num1, num2]
                : type === ActionType.Less
                  ? [null, num1]
                  : [num1, null],
        });
      }
      onColumnFiltersChange(filters);
      dialogRef.current?.setOpen(false);
    },
  });

  const id = useStore(form.store, (state) => state.values.id);
  const type = useStore(form.store, (state) => state.values.type) as ActionType;

  return (
    <ResponsiveDialog
      ref={dialogRef}
      title={"筛选过滤"}
      trigger={
        <Button
          variant={columnFilters.length ? "default" : "outline"}
          size={"sm"}
        >
          {columnFilters.length ? (
            <>
              <FunnelPlus />
              过滤中({filterCount ?? 0}条)
            </>
          ) : (
            <>
              <Filter />
              筛选过滤
            </>
          )}
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
            name={"dateMin"}
            children={(field) => (
              <FieldLayout label={"开始日期"} field={field}>
                <div className={"flex gap-2"}>
                  <DatePicker
                    className={"flex-1"}
                    date={field.state.value}
                    onChange={(v) => field.handleChange(v)}
                  />
                  <Button
                    disabled={!field.state.value}
                    variant={"destructive"}
                    onClick={() => {
                      form.setFieldValue("dateMin", undefined);
                    }}
                  >
                    <Eraser />
                  </Button>
                </div>
              </FieldLayout>
            )}
          />
          <form.Field
            name={"dateMax"}
            children={(field) => (
              <FieldLayout label={"截止日期"} field={field}>
                <div className={"flex gap-2"}>
                  <DatePicker
                    className={"flex-1"}
                    date={field.state.value}
                    onChange={(v) => field.handleChange(v)}
                  />
                  <Button
                    disabled={!field.state.value}
                    variant={"destructive"}
                    onClick={() => {
                      form.setFieldValue("dateMax", undefined);
                    }}
                  >
                    <Eraser />
                  </Button>
                </div>
              </FieldLayout>
            )}
          />
          <Separator />
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
                        TradeRecordConstants.Amount,
                        TradeRecordConstants.Shares,
                        null,
                        TradeRecordConstants.AdjustedAmount,
                        TradeRecordConstants.AdjustedShares,
                        null,
                        TradeRecordConstants.CumulativeCostPrice,
                        TradeRecordConstants.CumulativeValueIndex,
                        TradeRecordConstants.CumulativeTotalAmount,
                        TradeRecordConstants.CumulativeTotalMarketValue,
                        TradeRecordConstants.CumulativeTotalShares,
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
                    onClick={() => {
                      form.setFieldValue("id", "");
                      form.setFieldValue("type", "");
                      form.setFieldValue("num1", "");
                      form.setFieldValue("num2", "");
                    }}
                  >
                    <Eraser />
                  </Button>
                </div>
              </FieldLayout>
            )}
          />
          {id && (
            <>
              <form.Field
                name={"type"}
                validators={{
                  onChangeListenTo: ["id"],
                  onChange: ({ value, fieldApi }) => {
                    if (fieldApi.form.getFieldValue("id")) {
                      if (!value) {
                        return "必选项";
                      }
                    }
                  },
                }}
                children={(field) => (
                  <FieldLayout label={"过滤类型"} field={field}>
                    <Select
                      value={field.state.value}
                      onValueChange={(v) => field.handleChange(v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="请选择过滤类型" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          ActionType.Equal,
                          ActionType.Less,
                          ActionType.More,
                          ActionType.InBetween,
                        ].map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldLayout>
                )}
              />
              {type && (
                <form.Field
                  name={"num1"}
                  validators={{
                    onChangeListenTo: ["id", "type"],
                    onChange: ({ value, fieldApi }) => {
                      const type = fieldApi.form.getFieldValue(
                        "type",
                      ) as ActionType;
                      if (
                        fieldApi.form.getFieldValue("id") &&
                        type &&
                        type !== ActionType.More
                      ) {
                        if (value == "") {
                          return "必填项";
                        }
                        if (Number.isNaN(+value)) {
                          return "请输入数字";
                        }
                      }
                    },
                  }}
                  children={(field) => (
                    <FieldLayout
                      label={
                        type === ActionType.InBetween ? "最小值" : "目标值"
                      }
                      field={field}
                    >
                      <Input
                        value={field.state.value}
                        type={"number"}
                        placeholder={"请输入"}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </FieldLayout>
                  )}
                />
              )}
              {ActionType.InBetween === type && (
                <form.Field
                  name={"num2"}
                  validators={{
                    onChangeListenTo: ["id", "type"],
                    onChange: ({ value, fieldApi }) => {
                      const type = fieldApi.form.getFieldValue(
                        "type",
                      ) as ActionType;
                      if (
                        fieldApi.form.getFieldValue("id") &&
                        [ActionType.More, ActionType.InBetween].includes(type)
                      ) {
                        if (value == "") {
                          return "必填项";
                        }
                        if (Number.isNaN(+value)) {
                          return "请输入数字";
                        }
                      }
                    },
                  }}
                  children={(field) => (
                    <FieldLayout label={"最大值"} field={field}>
                      <Input
                        value={field.state.value}
                        type={"number"}
                        placeholder={"请输入"}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </FieldLayout>
                  )}
                />
              )}
            </>
          )}
        </div>
      </form>
    </ResponsiveDialog>
  );
};

enum ActionType {
  Equal = "相等",
  More = "大于",
  Less = "小于",
  InBetween = "区间",
}

function getDefaultValue(filters: ColumnFiltersState) {
  // 处理日期
  const dateFilter = filters[0];
  let date: { dateMin?: Date; dateMax?: Date } = {
    dateMin: undefined,
    dateMax: undefined,
  };
  if (dateFilter) {
    const [dateMin, dateMax] = dateFilter.value as [Date?, Date?];
    date = { dateMin, dateMax };
  }

  // 处理别的
  const otherFilter = filters[1];
  let other = {
    id: "",
    type: "",
    num1: "",
    num2: "",
  };
  if (otherFilter) {
    const id = otherFilter.id;
    const value = otherFilter.value as [number, number];
    const min = value[0] + "";
    const max = value[1] + "";
    if (min && max) {
      other = {
        id,
        type: min === max ? ActionType.Equal : ActionType.InBetween,
        num1: min,
        num2: max,
      };
    } else if (min) {
      other = {
        id,
        type: ActionType.More,
        num1: min,
        num2: "",
      };
    } else if (max) {
      other = {
        id,
        type: ActionType.Less,
        num1: max,
        num2: "",
      };
    }
  }

  return {
    ...date,
    ...other,
  };
}
