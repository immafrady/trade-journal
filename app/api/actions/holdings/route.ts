import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server-client";

export const GET = async () => {
  const supabase = await createClient();
  return NextResponse.json(await supabase.from("user_holdings").select());
};
