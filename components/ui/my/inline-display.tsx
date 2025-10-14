import React from "react";
import { cn } from "@/lib/utils";

export const InlineDisplay = ({
  list,
  className,
}: {
  list: { title: React.ReactNode; content: React.ReactNode }[];
  className?: string;
}) => {
  return (
    <div className={cn("w-full grid gap-2 grid-cols-[auto_1fr]", className)}>
      {list.map((item, i) => (
        <React.Fragment key={i}>
          <div className={"font-medium whitespace-nowrap"}>{item.title}</div>
          <div className={"text-end whitespace-normal break-all"}>
            {item.content}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};
