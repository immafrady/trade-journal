import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server-client";
import { SinaTicker } from "@/lib/services/sina/ticker";

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
    return NextResponse.json(
      {
        error: "重复的插入",
      },
      {
        status: 400,
      },
    );
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
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      },
    );
  } else {
    return NextResponse.json({
      data,
    });
  }
};
