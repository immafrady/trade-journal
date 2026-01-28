import { GroupModel } from "@/lib/services/group/domain/group";

// 新增分组
export async function addOrEditGroup(group: GroupModel) {
  return await fetch("/api/actions/groups", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      id: group.id,
      label: group.label,
      budget: group.budget,
    }),
  });
}

// 编辑分组持仓
export async function editGroupHoldings(groupId: string, holdingIds: string[]) {
  return await fetch(`/api/actions/groups/${groupId}/holdings`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(holdingIds),
  });
}

// 删除分组
export async function deleteGroup(id: string) {
  return await fetch(`/api/actions/groups/${id}`, {
    method: "DELETE",
  });
}
