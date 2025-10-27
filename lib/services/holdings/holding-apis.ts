import { SinaTicker } from "@/lib/services/sina/ticker";

// 新增
export async function addHolding(ticker: SinaTicker) {
  return await fetch("/api/actions/holdings/add", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(ticker),
  });
}

// 删除
export async function deleteHolding(id: string) {
  return await fetch(`/api/actions/holdings/${id}`, {
    method: "DELETE",
  });
}
