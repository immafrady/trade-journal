import React from "react";
import { cn } from "@/lib/utils";

export const SimpleDisplay = ({
  title,
  value,
  change,
  colorClass,
}: {
  title: string;
  value: string;
  change?: string;
  colorClass: string;
}) => {
  return (
    <div className={"flex items-center justify-between"}>
      <div>{title}</div>
      <div className={cn("font-mono", colorClass)}>
        {value}
        {change && `(${change})`}
      </div>
    </div>
  );
};

export const SimpleDisplayVertical = ({
  title,
  children,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className={"flex flex-col items-center"}>
    <div className={"font-light text-sm text-secondary-foreground"}>
      {title}
    </div>
    <div className={"font-bold text-lg md:text-base font-mono"}>{children}</div>
  </div>
);
