"use client";
import React from "react";
import {
  parseSinaSuggestion,
  SinaSuggestion,
  useSuggestion,
} from "@/lib/services/sina/use-suggestion";
import { getSinaStockTypeLabel } from "@/lib/enums/sina-stock-type";
import { Button } from "@/components/ui/button";
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

export default function Page() {
  const [searchKey, setSearchKey] = React.useState<string>("");
  const { data, isLoading } = useSuggestion(searchKey);
  const [value, setValue] = React.useState("");
  const valueAsOption = React.useMemo(() => {
    return parseSinaSuggestion(value);
  }, [value]);
  const options = React.useMemo(() => {
    return searchKey ? data.filter((option) => option.raw !== value) : [];
  }, [searchKey, value, data]);

  const genChoiceboxItem = (option: SinaSuggestion, onClick?: () => void) => {
    return (
      <ChoiceboxItem key={option.raw} value={option.raw} onClick={onClick}>
        <ChoiceboxItemHeader>
          <ChoiceboxItemTitle>
            【{getSinaStockTypeLabel(option.type)}】{option.label}
            <ChoiceboxItemSubtitle>({option.rawCode})</ChoiceboxItemSubtitle>
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
          {genChoiceboxItem(valueAsOption, () => setValue(""))}
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
      <Button className={"bottom-safe-offset-2"}>
        <Check />
        确认选择
      </Button>
    </div>
  );
}
