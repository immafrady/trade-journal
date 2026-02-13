import React from "react";
import { BottomBarContainer } from "@/components/ui/my/bottom-bar-container";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DatePicker } from "@/components/ui/my/date-picker";
import { TabDailyContext } from "./_provider";

export const BottomBar = ({ dates }: { dates: number[] }) => {
  const { index, setIndex } = React.useContext(TabDailyContext);
  const currentDate = new Date(dates[index]);

  return (
    <BottomBarContainer>
      <Button
        variant={"ghost"}
        disabled={index >= dates.length - 1}
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
        disabled={index === 0}
        onClick={() => {
          setIndex((i) => i - 1);
        }}
      >
        <ChevronRight></ChevronRight>
      </Button>
    </BottomBarContainer>
  );
};
