import React from "react";
import { BottomBarContainer } from "@/components/ui/my/bottom-bar-container";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DatePicker } from "@/components/ui/my/date-picker";
import { DataPageContext } from "@/app/(home)/holdings/[id]/_components/data-page/_provider";

export const BottomBar = ({ dates }: { dates: number[] }) => {
  const { tabDailyIndex, setIndex } = React.useContext(DataPageContext);
  const currentDate = new Date(dates[tabDailyIndex]);

  return (
    <BottomBarContainer>
      <Button
        variant={"ghost"}
        disabled={tabDailyIndex >= dates.length - 1}
        onClick={() => {
          setIndex((i) => i + 1);
        }}
      >
        <ChevronLeft></ChevronLeft>
      </Button>
      <DatePicker
        date={currentDate}
        disabled={(d) => !dates.includes(d.valueOf())}
        defaultMonth={currentDate}
        onChange={(d) => {
          setIndex(d ? dates.findIndex((t) => d.valueOf() === t.valueOf()) : 0);
        }}
      ></DatePicker>
      <Button
        variant={"ghost"}
        disabled={tabDailyIndex === 0}
        onClick={() => {
          setIndex((i) => i - 1);
        }}
      >
        <ChevronRight></ChevronRight>
      </Button>
    </BottomBarContainer>
  );
};
