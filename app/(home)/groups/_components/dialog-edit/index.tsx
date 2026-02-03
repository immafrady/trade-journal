/* eslint-disable react/no-children-prop */

import React from "react";
import {
  addOrEditGroup,
  editGroupHoldings,
  GroupConstants,
  GroupModel,
  useGroupList,
} from "@/lib/services/group";
import {
  ResponsiveDialog,
  ResponsiveDialogRef,
} from "@/components/ui/my/responsive-dialog";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { FieldLayout } from "@/components/ui/my/field-layout";
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
  const { mutate } = useGroupList();
  const { data: holdingList = [] } = useHoldingList();
  const editType = model ? "编辑" : "新增";

  const defaultModel = React.useMemo(() => {
    return model;
  }, [model]);
  const form = useForm({
    defaultValues: {
      label: defaultModel?.label ?? "",
      budget: defaultModel?.budget ?? "",
      holdingIds: defaultModel?.holdingIds ?? [],
    },
    onSubmitInvalid: () => {
      toast.error(`校验失败，无法提交`);
    },
    onSubmit: async ({ value }) => {
      const resp1 = await addOrEditGroup({
        id: defaultModel?.id,
        label: value.label,
        budget: +value.budget,
      });
      if (resp1.status === 200) {
        const { id } = await resp1.json();
        const resp2 = await editGroupHoldings(id, value.holdingIds);
        if (resp2.status === 200) {
          toast.success(`${defaultModel?.id ? "编辑" : "添加"}成功`);
        }
        await mutate();
        dialogRef.current?.setOpen(false);
      }
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
            validators={{
              onChange: ({ value }) => {
                if (value !== "") {
                  const v = +value;
                  if (Number.isNaN(v)) return "请输入数字";
                  if (v <= 0) {
                    return "请输入正数";
                  }
                }
              },
            }}
            children={(field) => (
              <FieldLayout
                label={GroupConstants.Budget}
                field={field}
                description={"计划投入的目标资金规模"}
              >
                <Input
                  value={field.state.value}
                  placeholder={"请输入"}
                  type={"number"}
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
                description={"该组合包含的资产列表"}
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
