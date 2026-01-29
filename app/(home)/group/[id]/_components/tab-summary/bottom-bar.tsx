import { BottomBarContainer } from "@/components/ui/my/bottom-bar-container";
import { DialogEdit } from "@/app/(home)/group/_components/dialog-edit";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import React from "react";
import { GroupInfoContext } from "@/app/(home)/group/[id]/_providers/group-info";

export const BottomBar = () => {
  const model = React.useContext(GroupInfoContext)!;
  return (
    <BottomBarContainer>
      <DialogEdit
        model={model}
        trigger={
          <Button size={"sm"}>
            <Pencil />
            编辑组合
          </Button>
        }
      ></DialogEdit>
    </BottomBarContainer>
  );
};
