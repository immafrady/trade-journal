import { NextRequest } from "next/server";
import { GroupModel } from "@/lib/services/group";
import { createClient } from "@/lib/supabase/server-client";
import { MyResponse } from "@/app/api/_my-response";

export const POST = async (request: NextRequest) => {
  const body: GroupModel = await request.json();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("groups")
    .insert({
      label: body.label,
      budget: body.budget,
    })
    .select()
    .limit(1)
    .single();
  if (error) {
    return MyResponse.serverFail(error.message);
  } else {
    if (
      data &&
      Array.isArray(body.group_holding) &&
      body.group_holding.length
    ) {
      const group_id = data.id;
      const { error } = await supabase.from("group_holdings").insert(
        body.group_holding.map((item) => ({
          group_id,
          holding_id: item.holding_id,
        })),
      );
    }
  }
  // return NextResponse.json();
};
