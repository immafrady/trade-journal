import React from "react";
import { baseVisibility, cumulativeVisibility } from "./columns";
import { Archive, Database } from "lucide-react";
import { ToggleButton } from "@/components/ui/my/button";

export type VisibilityState =
  | typeof baseVisibility
  | typeof cumulativeVisibility;

export const TableColumnToggler = ({
  onVisibilityChange,
}: {
  onVisibilityChange: (state: VisibilityState) => void;
}) => {
  return (
    <ToggleButton<VisibilityState>
      variant={"secondary"}
      size={"sm"}
      stateList={[
        {
          children: (
            <div className={"flex items-center gap-0.5"}>
              <Database />
              基础数据
            </div>
          ),
          value: baseVisibility,
        },
        {
          children: (
            <div className={"flex items-center gap-0.5"}>
              <Archive />
              累计数据
            </div>
          ),
          value: cumulativeVisibility,
        },
      ]}
      onStateChange={onVisibilityChange}
    />
  );
};
