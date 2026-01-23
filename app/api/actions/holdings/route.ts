import { createClient } from "@/lib/supabase/server-client";
import { MyResponse } from "@/app/api/_my-response";

export const GET = async () => {
  const supabase = await createClient();
  return MyResponse.anyOk(await supabase.from("user_holdings").select());
};
