import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server-client";
import { SinaTicker } from "@/lib/services/sina/ticker";

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const supabase = await createClient();
  // const user = await supabase.auth.getUser();
  // user.data.user?.id;
  const { code, type, label } = body as SinaTicker;
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
