/* eslint-disable react/no-children-prop */

import { ResponsiveDialog } from "@/components/ui/my/responsive-dialog";
import React from "react";
import { TradeRecord } from "@/lib/services/trade-records/trade-record";
import { useForm } from "@tanstack/react-form";
import { HoldingInfoContext } from "@/app/(home)/holdings/[id]/_providers/holding-info";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldTitle,
} from "@/components/ui/field";
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

export const DialogEdit = ({
  trigger,
  record,
}: {
  trigger: React.ReactNode;
  record?: TradeRecord;
}) => {
  const { id: holdingId } = React.useContext(HoldingInfoContext);
  const form = useForm({
    defaultValues: {
      tradedAt: record?.props.tradedAt.toDate() ?? new Date(),
      type: record ? String(record.props.type.value) : undefined,
      factor: record?.props.factor ?? 1,
      shares: record?.props.shares ?? "",
      price: record?.props.price ?? "",
      amount: record?.props.amount ?? "",
      fee: record?.props.fee ?? "",
      comment: record?.props.comment ?? "",
    },
    onSubmit: ({ value }) => {
      const type = TradeRecordType.parseFromStringValue(value.type)!;

      const newRecord = new TradeRecord({
        id: record?.props.id,
        holdingId: +holdingId,
        tradedAt: dayjs(value.tradedAt),
        type,
        amount: [TradeRecordType.Merge, TradeRecordType.Split].includes(type)
          ? 0
          : +value.amount,
        comment: value.comment,
        factor: value.factor,
        fee: [
          TradeRecordType.Buy,
          TradeRecordType.Sell,
          TradeRecordType.Subscribe,
          TradeRecordType.Redeem,
        ].includes(type)
          ? +value.fee
          : undefined,
        price: [
          TradeRecordType.Buy,
          TradeRecordType.Sell,
          TradeRecordType.Subscribe,
          TradeRecordType.Redeem,
        ].includes(type)
          ? +value.price
          : undefined,
        shares: TradeRecordType.Dividend === type ? 0 : +value.shares,
      });

      console.log(newRecord.toJSON());
    },
  });

  return (
    <ResponsiveDialog
      trigger={trigger}
      title={record ? "编辑" : "新增"}
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
        <FieldGroup>
          <form.Field
            name={"tradedAt"}
            children={(field) => (
              <Field>
                <FieldTitle>{TradeRecordConstants.TradedAt}</FieldTitle>
                <DatePicker
                  date={field.state.value}
                  onChange={(d) => field.handleChange(d!)}
                />
                <FieldDescription>交易发生的日期</FieldDescription>
              </Field>
            )}
          ></form.Field>
          <form.Field
            name={"type"}
            children={(field) => (
              <Field>
                <FieldTitle>{TradeRecordConstants.Type}</FieldTitle>
                <Select
                  value={field.state.value}
                  onValueChange={(v) => field.handleChange(v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="请选择交易类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {TradeRecordType.values.map((type, idx) => (
                      <SelectItem key={idx} value={String(type.value)}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>根据交易类型显示不同的表单</FieldDescription>
              </Field>
            )}
          ></form.Field>
        </FieldGroup>
      </form>
    </ResponsiveDialog>
  );
};
