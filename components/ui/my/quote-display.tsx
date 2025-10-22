import React from "react";

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
      <div className={"text-muted-foreground"}>{title}</div>
      <div className={colorClass}>
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
    <div className={"font-bold text-xl"}>{children}</div>
  </div>
);
