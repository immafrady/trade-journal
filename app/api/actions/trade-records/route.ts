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

export const DELETE = async (request: NextRequest) => {
  const { ids } = await request.json();
  if (Array.isArray(ids)) {
    if (ids.length) {
      const supabase = await createClient();
      return NextResponse.json(
        await supabase.from("trade_records").delete().in("id", ids),
      );
    } else {
      return NextResponse.json(
        {
          error: "没有勾选待删除的ID",
        },
        { status: 400 },
      );
    }
  } else {
    return NextResponse.json(
      {
        error: "参数类型有误",
      },
      { status: 400 },
    );
  }
};
