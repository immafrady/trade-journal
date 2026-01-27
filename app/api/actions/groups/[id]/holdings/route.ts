import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server-client";
import { MyResponse } from "@/app/api/_my-response";

// 一次性更新（做Diff 先删除再添加）
export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id: groupId } = await params;
  const holdingIds: number[] = await request.json();

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("group_holdings")
    .select("holding_id")
    .eq("group_id", groupId);
  const existingIds = new Set((existing ?? []).map((item) => item.holding_id));
  const nextIds = new Set(holdingIds);

  /** 2️⃣ 计算 diff */
  const toAdd = holdingIds.filter((id) => !existingIds.has(id));
  const toRemove = [...existingIds].filter((id) => !nextIds.has(id));

  /** 3️⃣ 删除多余的 */
  if (toRemove.length > 0) {
    const { error } = await supabase
      .from("group_holdings")
      .delete()
      .eq("group_id", groupId)
      .in("holding_id", toRemove);

    if (error) {
      return MyResponse.serverFail(error.message);
    }
  }

  /** 4️⃣ 新增缺失的（upsert 防并发重复） */
  if (toAdd.length > 0) {
    const { error } = await supabase.from("group_holdings").upsert(
      toAdd.map((holdingId) => ({
        group_id: groupId,
        holding_id: holdingId,
      })),
      {
        onConflict: "group_id,holding_id",
      },
    );

    if (error) {
      return MyResponse.serverFail(error.message);
    }
  }

  return MyResponse.anyOk({
    added: toAdd.length,
    removed: toRemove.length,
  });
};
