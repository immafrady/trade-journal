/* eslint-disable react/no-children-prop */

import { ResponsiveDialog } from "@/components/ui/my/responsive-dialog";
import React from "react";
import { TradeRecord } from "@/lib/services/trade-records/trade-record";
import { useForm, useStore } from "@tanstack/react-form";
import { HoldingInfoContext } from "@/app/(home)/holdings/[id]/_providers/holding-info";
import { TradeRecordConstants } from "@/lib/services/trade-records/constants";
import { DatePicker } from "@/components/ui/my/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TradeRecordType } from "@/lib/enums/trade-record-type";
import dayjs from "dayjs";
import { FieldLayout } from "@/components/ui/my/field-layout";
import { Input } from "@/components/ui/input";
import {
  calcAmount,
  calcPrice,
  calcShares,
  inputPositive,
  requireAmount,
  requireFee,
  requirePrice,
  requireShares,
} from "./utils";
import { formatMoney, formatShares } from "@/lib/market-utils";

export const DialogEdit = ({
  trigger,
  record,
}: {
  trigger: React.ReactNode;
  record?: TradeRecord;
}) => {
  const { id: holdingId, data } = React.useContext(HoldingInfoContext);
  const form = useForm({
    defaultValues: {
      tradedAt: record?.props.tradedAt.toDate() ?? new Date(),
      type: record?.props.type.label,
      factor: record?.props.factor ?? 1,
      shares: record?.props.shares ?? "",
      price: record?.props.price ?? "",
      amount: record?.props.amount ?? "",
      fee: record?.props.fee ?? "",
      comment: record?.props.comment ?? "",
    },
    onSubmit: ({ value }) => {
      const type = TradeRecordType.parseFromLabel(value.type)!;
      console.log(type);
      console.log(value);

      const newRecord = new TradeRecord({
        id: record?.props.id,
        holdingId: +holdingId,
        tradedAt: dayjs(value.tradedAt),
        type,
        amount: requireAmount(type) ? 0 : +value.amount,
        comment: value.comment,
        factor: value.factor,
        fee: requireFee(type) ? +value.fee : undefined,
        price: requirePrice(type) ? +value.price : undefined,
        shares: requireShares(type) ? +value.shares : 0,
      });

      console.log(newRecord.toJSON());
    },
  });

  const t = useStore(form.store, (state: any) => state.values.type);
  const type = TradeRecordType.parseFromLabel(t);

  return (
    <ResponsiveDialog
      trigger={trigger}
      title={record ? "编辑" : "新增"}
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
            name={"tradedAt"}
            children={(field) => (
              <FieldLayout
                label={TradeRecordConstants.TradedAt}
                description={"交易的发生日期"}
                field={field}
              >
                <DatePicker
                  date={field.state.value}
                  onChange={(d) => field.handleChange(d!)}
                />
              </FieldLayout>
            )}
          />
          <form.Field
            name={"type"}
            validators={{
              onChange: ({ value }) => (!value ? "必填项！" : undefined),
            }}
            children={(field) => (
              <FieldLayout
                label={TradeRecordConstants.Type}
                description={"根据交易类型显示不同的表单"}
                field={field}
              >
                <Select
                  value={field.state.value}
                  onValueChange={(v) => field.handleChange(v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="请选择交易类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {TradeRecordType.values.map((type, idx) => (
                      <SelectItem key={idx} value={type.label}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldLayout>
            )}
          />
          {requireShares(type) && (
            <form.Field
              name={"shares"}
              validators={{
                onChangeListenTo: ["type"],
                onChange: ({ value, fieldApi }) => {
                  const type = TradeRecordType.parseFromLabel(
                    fieldApi.form.getFieldValue("type"),
                  );
                  if (type) {
                    if (inputPositive(type)) {
                      if (+value <= 0) {
                        return "请输入正数";
                      }
                    } else {
                      if (+value >= 0) {
                        return "请输入负数";
                      }
                    }
                  }
                },
              }}
              children={(field) => {
                const price = +field.form.getFieldValue("price");
                const amount = +field.form.getFieldValue("amount");
                const fee = +field.form.getFieldValue("fee");
                return (
                  <FieldLayout
                    label={TradeRecordConstants.Shares}
                    description={
                      type &&
                      `交易的份额变化, 请填写 ${inputPositive(type) ? "正" : "负"}数`
                    }
                    field={field}
                  >
                    <Input
                      value={field.state.value}
                      type={"number"}
                      placeholder={
                        amount && price
                          ? formatShares(calcShares(price, amount, fee))
                          : "请输入"
                      }
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </FieldLayout>
                );
              }}
            />
          )}
          {requirePrice(type) && (
            <form.Field
              name={"price"}
              validators={{
                onChange: ({ value, fieldApi }) => {
                  const v = +value;
                  if (v <= 0 && value !== "") {
                    return "请输入正数";
                  }
                  if (
                    value === "" &&
                    fieldApi.form.getFieldValue("amount") === "" &&
                    fieldApi.form.getFieldValue("shares") === ""
                  ) {
                    return "必填项";
                  }
                },
              }}
              children={(field) => {
                const shares = +field.form.getFieldValue("shares");
                const amount = +field.form.getFieldValue("amount");
                const fee = +field.form.getFieldValue("fee");
                return (
                  <FieldLayout
                    label={TradeRecordConstants.Price}
                    description={"实际成交的价格"}
                    field={field}
                  >
                    <Input
                      value={field.state.value}
                      type={"number"}
                      placeholder={
                        shares && amount && data
                          ? data?.quote?.formatter(
                              calcPrice(amount, shares, fee),
                            )
                          : "请输入"
                      }
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </FieldLayout>
                );
              }}
            />
          )}
          {requireAmount(type) && (
            <form.Field
              name={"amount"}
              validators={{
                onChangeListenTo: ["type"],
                onChange: ({ value, fieldApi }) => {
                  const type = TradeRecordType.parseFromLabel(
                    fieldApi.form.getFieldValue("type"),
                  );
                  if (type) {
                    if (inputPositive(type)) {
                      if (+value <= 0) {
                        return "请输入正数";
                      }
                    } else {
                      if (+value >= 0) {
                        return "请输入负数";
                      }
                    }
                  }
                },
              }}
              children={(field) => {
                const shares = +field.form.getFieldValue("shares");
                const price = +field.form.getFieldValue("price");
                const fee = +field.form.getFieldValue("fee");
                return (
                  <FieldLayout
                    label={TradeRecordConstants.Amount}
                    description={`实际成交的金额（含手续费），请填写 ${inputPositive(type) ? "正" : "负"}数`}
                    field={field}
                  >
                    <Input
                      value={field.state.value}
                      type={"number"}
                      placeholder={
                        shares && price
                          ? formatMoney(calcAmount(price, shares, fee))
                          : "请输入"
                      }
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </FieldLayout>
                );
              }}
            />
          )}
        </div>
      </form>
    </ResponsiveDialog>
  );
};
