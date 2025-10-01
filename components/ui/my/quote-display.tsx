import React from "react";

export const SimpleDisplay = ({
  title,
  value,
  change,
  colorClass,
}: {
  title: string;
  value: string;
  change: string;
  colorClass: string;
}) => {
  return (
    <div className={"flex items-center justify-between"}>
      <div className={"text-muted-foreground"}>{title}</div>
      <div className={colorClass}>
        {value}({change})
      </div>
    </div>
  );
};
