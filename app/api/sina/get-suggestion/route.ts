import { NextResponse, type NextRequest } from "next/server";
import iconv from "iconv-lite";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const key = searchParams.get("key");
  if (key) {
    return fetch(
      `https://suggest3.sinajs.cn/suggest/type=86,87&key=${key}`,
    ).then(async (res) => {
      const buffer = Buffer.from(await res.arrayBuffer()); // 获取原始字节流
      // 解码成字符串
      return new NextResponse(iconv.decode(buffer, "gbk"));
    });
  } else {
    return new NextResponse("No suggestions found");
  }
}
