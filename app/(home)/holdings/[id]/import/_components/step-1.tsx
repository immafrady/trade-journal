import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { useForm } from "react-hook-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

export function Step1() {
  const { register, handleSubmit, formState } = useForm();
  const schema = [
    {
      label: "交易类型",
      name: "type",
      required: true,
    },
    {
      label: "交易日期",
      name: "tradedAt",
      required: true,
    },
    {
      label: "成交系数",
      name: "factor",
      required: true,
    },
    {
      label: "成交份额",
      name: "shares",
      required: true,
    },
    {
      label: "成交价格",
      name: "price",
      required: true,
    },
    {
      label: "成交金额",
      name: "amount",
      required: true,
    },
    {
      label: "交易费用",
      name: "fee",
      required: true,
    },
    {
      label: "备注",
      name: "comment",
      required: true,
    },
  ];
  return (
    <div className={"w-full max-w-4xl"}>
      <form
        onSubmit={handleSubmit((data) => {
          console.log(data);
        })}
      >
        <FieldSet className={"h-full flex flex-col"}>
          <FieldLegend>第一步：匹配表头</FieldLegend>
          <FieldDescription>
            系统将根据导入模板自动识别并匹配 CSV 文件的表头。
          </FieldDescription>
          <FieldSeparator />
          <FieldGroup>
            {schema.map((item) => (
              <Field key={item.name}>
                <FieldContent>
                  <FieldTitle>{item.label}</FieldTitle>
                  <FieldDescription>
                    系统将根据导入模板自动识别并匹配 CSV 文件的表头。
                  </FieldDescription>
                </FieldContent>
                <Input
                  {...register(item.name, {
                    required: item.required,
                    value: item.label,
                  })}
                />

                {/*<FieldError errors={formState.errors} />*/}
              </Field>
            ))}
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  );
}
