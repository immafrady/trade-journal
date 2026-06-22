import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server-client";
import { MyResponse } from "@/app/api/_my-response";
import Papa from "papaparse";

export const GET = async (request: NextRequest) => {
  const supabase = await createClient();
  const holdingId = +(request.nextUrl.searchParams.get("holdingId") ?? 0);

  const pageSize = 1000;
  let allData: any[] = [];
  let from = 0;
  let to = pageSize - 1;

  while (true) {
    const resp = await supabase
      .from("trade_records")
      .select(
        "id,holding_id,type,factor,shares,price,amount,fee,comment,traded_at",
      )
      .eq("holding_id", holdingId)
      .order("traded_at", { ascending: false })
      .order("id", { ascending: false })
      .range(from, to);

    if (resp.error) {
      return MyResponse.validFail("查询失败");
    }

    allData = allData.concat(resp.data ?? []);
    if (!resp.data || resp.data.length < pageSize) {
      break;
    }
    from += pageSize;
    to += pageSize;
  }

  const fields = ["id","holding_id","type","factor","shares","price","amount","fee","comment","traded_at"];
  const csv = Papa.unparse(allData, { columns: fields });

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
    },
  });
};

export const DELETE = async (request: NextRequest) => {
  const { ids } = await request.json();
  if (Array.isArray(ids)) {
    if (ids.length) {
      const supabase = await createClient();
      return MyResponse.anyOk(
        await supabase.from("trade_records").delete().in("id", ids),
      );
    } else {
      return MyResponse.validFail("没有勾选待删除的ID");
    }
  } else {
    return MyResponse.validFail("参数类型有误");
  }
};
