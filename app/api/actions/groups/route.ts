import { createClient } from "@/lib/supabase/server-client";
import { MyResponse } from "@/app/api/_my-response";
import { NextRequest } from "next/server";
import { GroupModel } from "@/lib/services/group";

// 查询组合视图
export const GET = async () => {
  const supabase = await createClient();
  return MyResponse.anyOk(
    await supabase.from("groups").select(`
    id,
    label,
    budget,
    group_holdings (
      holding_id
    )
  `),
  );
};

// 新增/编辑 组合
export const POST = async (request: NextRequest) => {
  const body: GroupModel = await request.json();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("groups")
    .upsert({
      id: body.id,
      label: body.label,
      budget: body.budget,
    })
    .select()
    .limit(1)
    .single();
  if (error) {
    return MyResponse.serverFail(error.message);
  } else {
    return MyResponse.anyOk(data);
  }
};
