import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server-client";

export const GET = async (request: NextRequest) => {
  const supabase = await createClient();
  const holdingId = +(request.nextUrl.searchParams.get("holdingId") ?? 0);
  if (holdingId && !Number.isNaN(holdingId)) {
    return NextResponse.json(
      await supabase
        .from("trade_records")
        .select("*")
        .eq("holding_id", holdingId)
        .order("traded_at", {
          ascending: false,
        })
        .order("id", { ascending: false }),
    );
  } else {
    // todo 处理异常流
  }
};
