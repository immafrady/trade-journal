import { NextRequest, NextResponse } from "next/server";
import { TradeRecordModel } from "@/lib/services/trade-records/domain/trade-record";
import { createClient } from "@/lib/supabase/server-client";

// 更新
export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const body: TradeRecordModel = await request.json();
  const supabase = await createClient();
  return NextResponse.json(
    await supabase.from("trade_records").update(body).eq("id", id).select(),
  );
};
