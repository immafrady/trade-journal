import { GroupCard } from "@/app/(home)/groups/_components/group-card";
import React from "react";
import { GroupModel } from "@/lib/services/group";
import { DialogEdit } from "@/app/(home)/groups/_components/dialog-edit";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const ListPage = ({ list }: { list: GroupModel[] }) => (
  <div className={"common-layout flex flex-col gap-2 pb-20"}>
    {list.map((model) => (
      <GroupCard key={model.id!} group={model}></GroupCard>
    ))}
    <DialogEdit
      trigger={
        <Button
          className={
            "rounded-full fixed bottom-safe-offset-5 right-safe-offset-5"
          }
        >
          <Plus />
        </Button>
      }
    ></DialogEdit>
  </div>
);
