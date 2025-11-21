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
import { TradeRecordConstants } from "@/lib/services/trade-records/constants";
import { Input } from "@/components/ui/input";

export const DialogFilter = ({
  columnFilters,
  onColumnFiltersChange,
}: {
  columnFilters: ColumnFiltersState;
  onColumnFiltersChange: (state: ColumnFiltersState) => void;
}) => {
  const dialogRef = React.useRef<ResponsiveDialogRef>(null);

  const form = useForm({
    defaultValues: getDefaultValue(columnFilters),
    onSubmitInvalid: () => {
      toast.error(`校验失败，无法提交`);
    },
    onSubmit: ({ value: form }) => {
      if (form.id) {
        const type = form.type as ActionType;
        const num1 = +form.num1;
        const num2 = +form.num2;
        onColumnFiltersChange([
          {
            id: form.id,
            value:
              type === ActionType.Equal
                ? [num1, num1]
                : type === ActionType.InBetween
                  ? [num1, num2]
                  : type === ActionType.Less
                    ? [null, num1]
                    : [num1, null],
          },
        ]);
      } else {
        onColumnFiltersChange([]);
      }
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
              过滤中
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
      onClosed={() => {
        form.reset();
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
  if (filters.length > 0) {
    const filter = filters[0];
    const id = filter.id;
    const value = filter.value as [number, number];
    const min = value[0];
    const max = value[1];
    let type: ActionType;
    if (min && max) {
      return {
        id,
        type: min === max ? ActionType.Equal : ActionType.InBetween,
        num1: min,
        num2: max,
      };
    } else if (min) {
      return {
        id,
        type: ActionType.More,
        num1: min,
        num2: "",
      };
    } else if (max) {
      return {
        id,
        type: ActionType.Less,
        num1: max,
        num2: "",
      };
    }
  }

  return {
    id: "",
    type: "",
    num1: "",
    num2: "",
  };
}
