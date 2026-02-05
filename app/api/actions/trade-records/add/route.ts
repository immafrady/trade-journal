import { NextRequest } from "next/server";
import { TradeRecordModel } from "@/lib/services/trade-records/domain/trade-record";
import { createClient } from "@/lib/supabase/server-client";
import { MyResponse } from "@/app/api/_my-response";

// 新增
export const POST = async (request: NextRequest) => {
  const body: TradeRecordModel[] = await request.json();
  const supabase = await createClient();
  const { error } = await supabase.from("trade_records").insert(body).select();
  if (error) {
    return MyResponse.serverFail(error.message);
  } else {
    return MyResponse.msgOk("成功插入！");
  }
};
