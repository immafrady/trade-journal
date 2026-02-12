"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarCheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { DayPicker } from "react-day-picker";

export function DatePicker({
  date,
  onChange,
  className,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  date: Date | undefined;
  onChange: (d?: Date) => void;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("min-w-32 justify-between font-normal", className)}
        >
          {date?.toLocaleDateString() ?? "选择日期"}
          <CalendarCheckIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          {...props}
          mode="single"
          selected={date}
          captionLayout="dropdown"
          onSelect={(date) => {
            onChange(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
