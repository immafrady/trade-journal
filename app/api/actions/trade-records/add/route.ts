import { NextRequest, NextResponse } from "next/server";
import { TradeRecordModel } from "@/lib/services/trade-records/trade-record";
import { createClient } from "@/lib/supabase/server-client";

// 新增
export const POST = async (request: NextRequest) => {
  const body: TradeRecordModel[] = await request.json();
  const supabase = await createClient();
  return NextResponse.json(
    await supabase.from("trade_records").insert(body).select(),
  );
};
