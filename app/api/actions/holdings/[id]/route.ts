import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server-client";
import { MyResponse } from "@/app/api/_my-response";

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const supabase = await createClient();
  const { error } = await supabase.from("user_holdings").delete().eq("id", id);
  if (error) {
    return MyResponse.serverFail(error.message);
  } else {
    return MyResponse.msgOk("成功删除！");
  }
};
