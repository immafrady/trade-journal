import { NextResponse, type NextRequest } from "next/server";
import iconv from "iconv-lite";
import { SINA_SEARCH_VALUES } from "@/lib/enums/sina-stock-type";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const key = searchParams.get("key");
  if (key) {
    return fetch(
      `https://suggest3.sinajs.cn/suggest/type=${SINA_SEARCH_VALUES}&key=${key}`,
    ).then(async (res) => {
      const buffer = Buffer.from(await res.arrayBuffer()); // 获取原始字节流
      // 解码成字符串
      return new NextResponse(iconv.decode(buffer, "gbk"));
    });
  } else {
    return NextResponse.json(
      {
        error: "No suggestions found",
      },
      {
        status: 400,
      },
    );
  }
}
