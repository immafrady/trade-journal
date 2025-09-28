// 新增
import { SinaTicker } from "@/lib/services/sina/ticker";

export async function addHolding(ticker: SinaTicker) {
  return await fetch("/api/actions/holdings/add", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(ticker),
  });
}
