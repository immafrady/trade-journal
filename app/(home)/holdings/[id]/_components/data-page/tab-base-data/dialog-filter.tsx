import { ResponsiveDialog } from "@/components/ui/my/responsive-dialog";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import React from "react";

export const DialogFilter = () => {
  return (
    <ResponsiveDialog
      title={"筛选过滤"}
      trigger={
        <Button variant={"outline"} size={"sm"}>
          <Filter />
          筛选过滤
        </Button>
      }
    >
      <div>占位符</div>
    </ResponsiveDialog>
  );
};
