import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server-client";
import { SinaTicker } from "@/lib/services/sina";
import { MyResponse } from "@/app/api/_my-response";

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const supabase = await createClient();
  // const user = await supabase.auth.getUser();
  // user.data.user?.id;
  const { code, type, label } = body as SinaTicker;
  const { count } = await supabase
    .from("user_holdings")
    .select("*", { count: "exact", head: true })
    .eq("code", code);
  if (count && count > 0) {
    return MyResponse.validFail("重复的插入");
  }
  const { data, error } = await supabase
    .from("user_holdings")
    .upsert({
      label,
      type,
      code,
    })
    .select()
    .single();

  if (error) {
    return MyResponse.serverFail(error.message);
  } else {
    return MyResponse.anyOk({
      data,
    });
  }
};
