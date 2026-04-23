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
  columnFilters = [],
  onColumnFiltersChange,
  filterCount,
}: {
  columnFilters: ColumnFiltersState;
  onColumnFiltersChange: (state: ColumnFiltersState) => void;
  filterCount?: number;
}) => {
  const dialogRef = React.useRef<ResponsiveDialogRef>(null);

  const form = useForm({
    defaultValues: getDefaultValue(columnFilters),
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
        if (form.id === TradeRecordConstants.Comment) {
          filters.push({
            id: form.id,
            value: form.comment,
          });
        } else {
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
      cancelText={"清除过滤项"}
      submitText={"开始过滤"}
      onCancel={() => {
        onColumnFiltersChange([]);
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
                    date={field.state.value!}
                    defaultMonth={field.state.value!}
                    onChange={(v) => field.handleChange(v ?? null)}
                  />
                  <Button
                    disabled={!field.state.value}
                    variant={"destructive"}
                    onClick={() => {
                      form.setFieldValue("dateMin", () => null);
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
                    date={field.state.value!}
                    defaultMonth={field.state.value!}
                    onChange={(v) => field.handleChange(v ?? null)}
                  />
                  <Button
                    disabled={!field.state.value}
                    variant={"destructive"}
                    onClick={() => {
                      form.setFieldValue("dateMax", () => null);
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
            listeners={{
              onChange: ({ value }) => {
                if (value === TradeRecordConstants.Comment) {
                  form.setFieldValue("type", "");
                  form.setFieldValue("num1", "");
                  form.setFieldValue("num2", "");
                } else {
                  form.setFieldValue("comment", "");
                }
              },
            }}
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
                        TradeRecordConstants.CumulativeCostPrice,
                        TradeRecordConstants.CumulativeValueIndex,
                        TradeRecordConstants.CumulativeTotalAmount,
                        TradeRecordConstants.CumulativeMarketValue,
                        TradeRecordConstants.CumulativeTotalShares,
                        null,
                        TradeRecordConstants.Comment,
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
                      form.setFieldValue("comment", "");
                    }}
                  >
                    <Eraser />
                  </Button>
                </div>
              </FieldLayout>
            )}
          />
          {id && id === TradeRecordConstants.Comment && (
            <>
              <form.Field
                name={"comment"}
                validators={{
                  onChangeListenTo: ["id"],
                  onChange: ({ value, fieldApi }) => {
                    const id = fieldApi.form.getFieldValue("id");

                    // 👇 第一行就直接挡掉
                    if (id !== TradeRecordConstants.Comment) return;

                    if (value === "") {
                      return "必填项";
                    }
                  },
                }}
                children={(field) => (
                  <FieldLayout label={"模糊搜索"} field={field}>
                    <Input
                      value={field.state.value}
                      placeholder={"请输入"}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </FieldLayout>
                )}
              />
            </>
          )}
          {id && id !== TradeRecordConstants.Comment && (
            <>
              <form.Field
                name={"type"}
                validators={{
                  onChangeListenTo: ["id"],
                  onChange: ({ value, fieldApi }) => {
                    const id = fieldApi.form.getFieldValue("id");

                    // 👇 不满足直接退出
                    if (!id || id === TradeRecordConstants.Comment) return;

                    if (!value) {
                      return "必选项";
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
                      const id = fieldApi.form.getFieldValue("id");
                      const type = fieldApi.form.getFieldValue(
                        "type",
                      ) as ActionType;

                      // 👇 核心：先排除所有“不该校验”的情况
                      if (!id || id === TradeRecordConstants.Comment) return;
                      if (!type) return;
                      if (type === ActionType.More) return;

                      // 👇 再写真正规则
                      if (value === "") return "必填项";
                      if (Number.isNaN(+value)) return "请输入数字";
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
                      const id = fieldApi.form.getFieldValue("id");
                      const type = fieldApi.form.getFieldValue(
                        "type",
                      ) as ActionType;

                      if (!id || id === TradeRecordConstants.Comment) return;
                      if (
                        ![ActionType.More, ActionType.InBetween].includes(type)
                      )
                        return;

                      if (value === "") return "必填项";
                      if (Number.isNaN(+value)) return "请输入数字";
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
  let date: { dateMin: Date | null; dateMax: Date | null } = {
    dateMin: null,
    dateMax: null,
  };
  if (dateFilter) {
    const [dateMin, dateMax] = dateFilter.value as [Date | null, Date | null];
    date = { dateMin, dateMax };
  }

  // 处理别的
  const otherFilter = filters[1];
  const other = {
    id: "",
    type: "",
    num1: "",
    num2: "",
    comment: "",
  };
  if (otherFilter) {
    other.id = otherFilter.id;
    if (other.id === TradeRecordConstants.Comment) {
      other.comment = otherFilter.value as string;
    } else {
      const value = otherFilter.value as [number, number];
      const min = value[0] + "";
      const max = value[1] + "";
      if (min && max) {
        other.type = min === max ? ActionType.Equal : ActionType.InBetween;
        other.num1 = min;
        other.num2 = max;
      } else if (min) {
        other.type = ActionType.More;
        other.num1 = min;
      } else if (max) {
        other.type = ActionType.Less;
        other.num2 = max;
      }
    }
  }

  return {
    ...date,
    ...other,
  };
}
