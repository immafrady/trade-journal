import { GroupModel } from "@/lib/services/group/domain/group";

// 新增分组
export async function addGroup(group: GroupModel) {
  return await fetch("/api/groups", {
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
export async function editGroupHoldings(group: GroupModel) {
  return await fetch(`/api/groups/${group.id}/holdings`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(group.holdingIds),
  });
}

// 删除分组
export async function deleteGroup(id: string) {
  return await fetch(`/api/groups/${id}`, {
    method: "DELETE",
  });
}
