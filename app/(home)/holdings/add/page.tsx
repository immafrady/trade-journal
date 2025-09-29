"use client";
import React, { useState } from "react";
import { useSuggestion } from "@/lib/services/sina/use-suggestion";
import {
  getSinaStockTypeColor,
  getSinaStockTypeLabel,
} from "@/lib/enums/sina-stock-type";
import { LoadingButton } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Choicebox,
  ChoiceboxItem,
  ChoiceboxItemContent,
  ChoiceboxItemHeader,
  ChoiceboxItemIndicator,
  ChoiceboxItemSubtitle,
  ChoiceboxItemTitle,
} from "@/components/ui/shadcn-io/choicebox";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { SinaTicker } from "@/lib/services/sina/ticker";
import { addHolding } from "@/lib/services/holdings/add-holding";
import { useHoldingList } from "@/lib/services/holdings/use-holding-list";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = React.useState<string>("");
  const { data, isLoading } = useSuggestion(searchKey);
  const [value, setValue] = React.useState("");
  const valueAsOption = React.useMemo(() => {
    return value ? SinaTicker.fromKey(value) : null;
  }, [value]);
  const options = React.useMemo(() => {
    return searchKey ? data.filter((option) => option.key !== value) : [];
  }, [searchKey, value, data]);
  const { mutate } = useHoldingList();

  const genChoiceboxItem = (option: SinaTicker, onClick?: () => void) => {
    return (
      <ChoiceboxItem key={option.key} value={option.key} onClick={onClick}>
        <ChoiceboxItemHeader>
          <ChoiceboxItemTitle className={"flex items-center gap-1"}>
            <Badge className={getSinaStockTypeColor(option.type)}>
              {getSinaStockTypeLabel(option.type)}
            </Badge>
            {option.label}
            <ChoiceboxItemSubtitle>({option.code})</ChoiceboxItemSubtitle>
          </ChoiceboxItemTitle>
        </ChoiceboxItemHeader>
        <ChoiceboxItemContent>
          <ChoiceboxItemIndicator />
        </ChoiceboxItemContent>
      </ChoiceboxItem>
    );
  };

  return (
    <div
      className={
        "p-layout flex flex-col items-center justify-center text-primary h-[100%]"
      }
    >
      <h1 className={"text-2xl font-bold p-10"}>选择要记录的标的</h1>
      <Input
        value={searchKey}
        onChange={(e) => setSearchKey(e.target.value)}
        placeholder={"请输入查询条件"}
        autoFocus
      />
      {value && (
        <Choicebox className={"mt-5"} value={value}>
          {genChoiceboxItem(valueAsOption!, () => setValue(""))}
        </Choicebox>
      )}
      <div
        className={
          "flex-1 overflow-y-auto my-5 flex flex-col w-[100%] items-center overflow-x-hidden"
        }
      >
        {isLoading ? (
          <Spinner
            variant={"bars"}
            className={"justify-center justify-self-center"}
          />
        ) : options.length === 0 && !value ? (
          <div>查无数据</div>
        ) : (
          <Choicebox value={value} onValueChange={setValue}>
            {options.map((option) => genChoiceboxItem(option))}
          </Choicebox>
        )}
      </div>
      <LoadingButton
        className={"bottom-safe-offset-2"}
        loading={loading}
        icon={<Check />}
        disabled={!value}
        onClick={async () => {
          setLoading(true);
          const resp = await addHolding(valueAsOption!);
          if (resp.status === 200) {
            await mutate();
            toast.success("添加成功", {
              position: "top-center",
            });
            router.replace("/");
          } else {
            const { error } = await resp.json();
            toast.error(error, {
              position: "top-center",
            });
          }
          setLoading(false);
        }}
      >
        确认选择
      </LoadingButton>
    </div>
  );
}
