/* eslint-disable react/no-children-prop */

import React from "react";
import { GroupModel } from "@/lib/services/group";
import {
  ResponsiveDialog,
  ResponsiveDialogRef,
} from "@/components/ui/my/responsive-dialog";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { FieldLayout } from "@/components/ui/my/field-layout";
import { GroupConstants } from "@/lib/services/group/domain/constants";
import { Input } from "@/components/ui/input";
import { useHoldingList } from "@/lib/services/holdings/use-holding-list";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";

export const DialogEdit = ({
  trigger,
  model,
}: {
  trigger: React.ReactNode;
  model?: GroupModel;
}) => {
  const dialogRef = React.useRef<ResponsiveDialogRef>(null);
  const { data: holdingList = [] } = useHoldingList();
  const editType = model ? "编辑" : "新增";

  const form = useForm({
    defaultValues: {
      label: model?.label ?? "",
      budget: model?.budget ?? "",
      holdingIds: model?.holdingIds ?? [],
    },
    onSubmitInvalid: () => {
      toast.error(`校验失败，无法提交`);
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  return (
    <ResponsiveDialog
      ref={dialogRef}
      title={editType}
      trigger={trigger}
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
        <div className={"flex flex-col gap-4 mt-5"}>
          <form.Field
            name={"label"}
            validators={{
              onChange: ({ value }) => (!value ? "必填项！" : undefined),
            }}
            children={(field) => (
              <FieldLayout
                label={GroupConstants.Label}
                field={field}
                description={"标识该基金组合的主题或策略类型"}
              >
                <Input
                  value={field.state.value}
                  placeholder={"请输入"}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </FieldLayout>
            )}
          ></form.Field>
          <form.Field
            name={"budget"}
            children={(field) => (
              <FieldLayout
                label={GroupConstants.Budget}
                field={field}
                description={"计划投入的目标资金规模"}
              >
                <Input
                  value={field.state.value}
                  placeholder={"请输入"}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </FieldLayout>
            )}
          ></form.Field>
          <form.Field
            name={"holdingIds"}
            validators={{
              onChange: ({ value }) => (!value.length ? "必填项！" : undefined),
            }}
            children={(field) => (
              <FieldLayout
                label={GroupConstants.Holdings}
                field={field}
                description={"该分组包含的资产列表"}
                orientation={"vertical"}
              >
                <FieldGroup className={"gap-1"}>
                  {holdingList.map((holding) => (
                    <FieldLabel key={holding.id}>
                      <Field orientation={"horizontal"}>
                        <Checkbox
                          id={`holding-id-${holding.id}`}
                          name={holding.id}
                          checked={field.state.value.includes(holding.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              field.handleChange([
                                ...field.state.value,
                                holding.id,
                              ]);
                            } else {
                              field.handleChange(
                                field.state.value.filter(
                                  (v) => v !== holding.id,
                                ),
                              );
                            }
                          }}
                        ></Checkbox>
                        {holding.ticker.label}({holding.ticker.code})
                      </Field>
                    </FieldLabel>
                  ))}
                </FieldGroup>
              </FieldLayout>
            )}
          ></form.Field>
        </div>
      </form>
    </ResponsiveDialog>
  );
};
