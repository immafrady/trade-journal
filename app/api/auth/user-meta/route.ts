import { createClient } from "@/lib/supabase/server-client";
import { NextResponse } from "next/server";

export const GET = async () => {
  const supabase = await createClient();
  return NextResponse.json(await supabase.auth.getUser());
};
