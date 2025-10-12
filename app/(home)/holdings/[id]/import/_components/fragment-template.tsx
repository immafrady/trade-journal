import React from "react";
import { Separator } from "@/components/ui/separator";
import { parseFromCsv } from "@/lib/services/trade-records/parse-from-csv";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";

export function FragmentTemplate({
  title,
  description = "",
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className={
        "flex flex-col items-center px-safe-offset-4 md:px-safe-offset-10"
      }
    >
      <div className={"w-full max-w-xl pb-safe-offset-20"}>
        <h1 className={"font-medium text-base py-2"}>{title}</h1>
        {description && (
          <h2 className={"text-sm text-muted-foreground"}>{description}</h2>
        )}
        <Separator className={"my-2"} />
        {children}
        <div
          className={
            "fixed left-0 right-0 bottom-0 flex justify-center bg-secondary py-safe-offset-2"
          }
        >
          {actions}
        </div>
      </div>
    </div>
  );
}
