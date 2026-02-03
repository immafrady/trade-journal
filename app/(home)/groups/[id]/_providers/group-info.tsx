import React from "react";
import { GroupModel, useGroupList } from "@/lib/services/group";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export const GroupInfoContext = React.createContext<GroupModel | undefined>(
  undefined,
);

export const GroupInfoProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { id } = useParams<{ id: string }>();
  const { data: groups } = useGroupList();
  const group = React.useMemo(
    () => groups?.find((item) => item.id === id),
    [groups, id],
  );

  const router = useRouter();
  React.useEffect(() => {
    if (groups?.length && !group) {
      router.replace("/groups");
      toast.error("查无此数据");
    }
    return () => {};
  }, [groups, group, router]);

  return (
    <GroupInfoContext.Provider value={group}>
      {children}
    </GroupInfoContext.Provider>
  );
};
