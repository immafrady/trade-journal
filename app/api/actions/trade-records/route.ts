import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server-client";
import papa from "papaparse";

export const GET = async (request: NextRequest) => {
  const supabase = await createClient();
  const holdingId = +(request.nextUrl.searchParams.get("holdingId") ?? 0);
  if (holdingId && !Number.isNaN(holdingId)) {
    const resp = await supabase
      .from("trade_records")
      .select(
        "id,holding_id,type,factor,shares,price,amount,fee,comment,traded_at",
      )
      .eq("holding_id", holdingId)
      .order("traded_at", {
        ascending: false,
      })
      .order("id", { ascending: false });
    if (resp.error) {
      return NextResponse.json(resp);
    } else {
      try {
        const csv = papa.unparse(resp.data, {
          delimiter: "|", // 分隔符
          header: true, // 自动使用 keys 作为表头
        });

        return new NextResponse(csv, {
          status: 200,
          headers: {
            "Content-Type": "text/csv; charset=utf-8",
          },
        });
      } catch (e) {
        return NextResponse.json(
          {
            status: -1,
            statusText: "数据解析错误",
            error: e,
          },
          {
            status: 500,
          },
        );
      }
    }
  } else {
    // todo 处理异常流
    return NextResponse.json(
      {
        status: -1,
        statusText: "入参错误",
      },
      {
        status: 400,
      },
    );
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
