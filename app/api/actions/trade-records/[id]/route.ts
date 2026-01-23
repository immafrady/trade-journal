import { NextRequest } from "next/server";
import { TradeRecordModel } from "@/lib/services/trade-records/domain/trade-record";
import { createClient } from "@/lib/supabase/server-client";
import { MyResponse } from "@/app/api/_my-response";

// 更新
export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const body: TradeRecordModel = await request.json();
  const supabase = await createClient();
  return MyResponse.anyOk(
    await supabase.from("trade_records").update(body).eq("id", id).select(),
  );
};
