"use client";
import React from "react";
import {
  parseSinaSuggestion,
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
  const options = React.useMemo(() => {
    if (value) {
      const options = searchKey
        ? data.filter((option) => option.raw !== value)
        : [];
      console.log([parseSinaSuggestion(value), ...options]);
      return [parseSinaSuggestion(value), ...options];
    } else if (searchKey) {
      return data;
    } else {
      return [];
    }
  }, [searchKey, value, data]);

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
      <div
        className={
          "flex-1 overflow-y-auto my-5 flex flex-col w-[100%] items-center overflow-x-hidden"
        }
      >
        {options.length === 0 ? (
          <div>查无数据</div>
        ) : isLoading ? (
          <Spinner
            variant={"bars"}
            className={"justify-center justify-self-center"}
          />
        ) : (
          <Choicebox value={value} onValueChange={setValue}>
            {options.map((option) => (
              <ChoiceboxItem key={option.raw} value={option.raw}>
                <ChoiceboxItemHeader>
                  <ChoiceboxItemTitle>
                    【{getSinaStockTypeLabel(option.type)}】{option.label}
                    <ChoiceboxItemSubtitle>
                      ({option.rawCode})
                    </ChoiceboxItemSubtitle>
                  </ChoiceboxItemTitle>
                </ChoiceboxItemHeader>
                <ChoiceboxItemContent>
                  <ChoiceboxItemIndicator />
                </ChoiceboxItemContent>
              </ChoiceboxItem>
            ))}
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
