import { BottomBarContainer } from "@/components/ui/my/bottom-bar-container";
import { DialogEdit } from "@/app/(home)/groups/_components/dialog-edit";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import React from "react";
import { GroupInfoContext } from "@/app/(home)/groups/[id]/_providers";
import { MyAlertDialog } from "@/components/ui/my/alert-dialog";
import { deleteGroup, useGroupList } from "@/lib/services/group";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const BottomBar = () => {
  const model = React.useContext(GroupInfoContext)!;
  const { mutate } = useGroupList();
  const route = useRouter();

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
      <MyAlertDialog
        trigger={
          <Button variant={"destructive"} size="sm">
            <Trash />
            删除组合
          </Button>
        }
        title={"确定删除?"}
        description={"删除组合不影响关联标的"}
        showCancel={true}
        onConfirm={async () => {
          const response = await deleteGroup(model.id!);
          const { message, error } = await response.json();
          if (error) {
            toast.error(error);
          } else {
            route.replace("/groups");
            await mutate();
            toast.success(message);
          }
        }}
      />
    </BottomBarContainer>
  );
};
