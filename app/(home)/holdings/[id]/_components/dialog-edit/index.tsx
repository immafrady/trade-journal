/* eslint-disable react/no-children-prop */

import {
  ResponsiveDialog,
  ResponsiveDialogRef,
} from "@/components/ui/my/responsive-dialog";
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
  calcFee,
  calcPrice,
  calcShares,
  inputPositive,
  requireAmount,
  requireFee,
  requirePrice,
  requireShares,
} from "./utils";
import { formatMoney, formatShares } from "@/lib/market-utils";
import { Textarea } from "@/components/ui/textarea";
import {
  addTradeRecords,
  updateTradeRecord,
} from "@/lib/services/trade-records/trade-record-apis";
import { useTradeRecordList } from "@/lib/services/trade-records/use-trade-record-list";
import { toast } from "sonner";

export const DialogEdit = ({
  trigger,
  record,
}: {
  trigger: React.ReactNode;
  record?: TradeRecord;
}) => {
  const dialogRef = React.useRef<ResponsiveDialogRef>(null);
  const { id: holdingId, data } = React.useContext(HoldingInfoContext);
  const { mutate } = useTradeRecordList(holdingId);
  const editType = record ? "编辑" : "新增";

  const form = useForm({
    defaultValues: {
      tradedAt: record?.props.tradedAt.toDate() ?? new Date(),
      type: record?.props.type.label,
      factor: record?.props.factor ?? "1",
      shares: record?.props.shares ?? "",
      price: record?.props.price ?? "",
      amount: record?.props.amount ?? "",
      fee: record?.props.fee ?? "",
      comment: record?.props.comment ?? "",
    },
    onSubmitInvalid: () => {
      toast.error(`校验失败，无法提交`);
    },
    onSubmit: async ({ value }) => {
      const type = TradeRecordType.parseFromLabel(value.type)!;
      const newRecord = new TradeRecord({
        holdingId: +holdingId,
        tradedAt: dayjs(value.tradedAt),
        type,
        amount: requireAmount(type) && value.amount ? +value.amount : undefined,
        comment: value.comment,
        factor: +value.factor,
        fee: requireFee(type) && value.fee ? +value.fee : undefined,
        price: requirePrice(type) && value.price ? +value.price : undefined,
        shares: requireShares(type) && value.shares ? +value.shares : 0,
      });
      if (record?.props.id) {
        await updateTradeRecord(String(record.props.id), newRecord);
      } else {
        await addTradeRecords([newRecord]);
      }
      toast.success(`${editType}成功`);
      dialogRef.current?.setOpen(false);
      await mutate();
    },
  });

  const t = useStore(form.store, (state: any) => state.values.type);
  const type = TradeRecordType.parseFromLabel(t);

  return (
    <ResponsiveDialog
      ref={dialogRef}
      trigger={trigger}
      title={editType}
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
                onChangeListenTo: ["type", "amount", "price"],
                onChange: ({ value, fieldApi }) => {
                  const type = TradeRecordType.parseFromLabel(
                    fieldApi.form.getFieldValue("type"),
                  );
                  if (!requireShares(type)) return; // 不用校验

                  const amount = fieldApi.form.getFieldValue("amount");
                  const price = fieldApi.form.getFieldValue("price");
                  if (value === "") {
                    if (amount === "" && price === "") {
                      return "必填项";
                    }
                  } else if (type) {
                    const v = +value;
                    if (Number.isNaN(v)) return "请输入数字";
                    if (inputPositive(type)) {
                      if (v <= 0) {
                        return "请输入正数";
                      }
                    } else {
                      if (v >= 0) {
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
                onChangeListenTo: ["amount", "shares"],
                onChange: ({ value, fieldApi }) => {
                  const type = TradeRecordType.parseFromLabel(
                    fieldApi.form.getFieldValue("type"),
                  );
                  if (!requirePrice(type)) return; // 不用校验
                  if (
                    value === "" &&
                    fieldApi.form.getFieldValue("amount") === "" &&
                    fieldApi.form.getFieldValue("shares") === ""
                  ) {
                    return "必填项";
                  }
                  if (value !== "") {
                    const v = +value;
                    if (Number.isNaN(v)) return "请输入数字";
                    if (v <= 0) {
                      return "请输入正数";
                    }
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
                onChangeListenTo: ["type", "price", "shares"],
                onChange: ({ value, fieldApi }) => {
                  const type = TradeRecordType.parseFromLabel(
                    fieldApi.form.getFieldValue("type"),
                  );
                  if (!requireAmount(type)) return; // 不用校验
                  const shares = fieldApi.form.getFieldValue("shares");
                  const price = fieldApi.form.getFieldValue("price");
                  if (value === "") {
                    if (shares === "" && price === "") {
                      return "必填项";
                    }
                  } else if (type) {
                    const v = +value;
                    if (Number.isNaN(v)) return "请输入数字";
                    if (inputPositive(type)) {
                      if (v <= 0) {
                        return "请输入正数";
                      }
                    } else {
                      if (v >= 0) {
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
          {requireFee(type) && (
            <form.Field
              name={"fee"}
              validators={{
                onChange: ({ value, fieldApi }) => {
                  const type = TradeRecordType.parseFromLabel(
                    fieldApi.form.getFieldValue("type"),
                  );
                  if (!requireFee(type)) return; // 不用校验

                  if (Number.isNaN(+value)) return "请输入数字";
                },
              }}
              children={(field) => {
                const shares = +field.form.getFieldValue("shares");
                const price = +field.form.getFieldValue("price");
                const amount = +field.form.getFieldValue("amount");
                return (
                  <FieldLayout
                    label={TradeRecordConstants.Fee}
                    description={"实际交易发生的费用，请填写正数"}
                    field={field}
                  >
                    <Input
                      value={field.state.value}
                      type={"number"}
                      placeholder={
                        shares && price && amount
                          ? formatMoney(calcFee(shares, price, amount))
                          : "请输入，可留空"
                      }
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </FieldLayout>
                );
              }}
            />
          )}
          <form.Field
            name={"factor"}
            validators={{
              onChange: ({ value }) => {
                const v = +value;
                if (!Number.isInteger(v)) {
                  return "请填写整数";
                }
                if (v <= 0) {
                  return "请填写正数";
                }
              },
            }}
            children={(field) => {
              return (
                <FieldLayout
                  label={TradeRecordConstants.Factor}
                  description={"用于合并多个相同交易，请填写正整数"}
                  field={field}
                >
                  <Input
                    value={field.state.value}
                    type={"number"}
                    placeholder={"请输入，默认填1"}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </FieldLayout>
              );
            }}
          />
          <form.Field
            name={"comment"}
            children={(field) => {
              return (
                <FieldLayout label={TradeRecordConstants.Comment} field={field}>
                  <Textarea
                    value={field.state.value}
                    placeholder={"随便写点什么都行"}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </FieldLayout>
              );
            }}
          />
        </div>
      </form>
    </ResponsiveDialog>
  );
};
