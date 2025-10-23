import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server-client";

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const supabase = await createClient();
  const { error } = await supabase
    .from("trade_records")
    .delete()
    .eq("holding_id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    return NextResponse.json(
      { message: "成功清除所有记录！" },
      { status: 200 },
    );
  }
};
