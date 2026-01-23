import { NextRequest, NextResponse } from "next/server";
import iconv from "iconv-lite";
import { MyResponse } from "@/app/api/_my-response";

export const GET = (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const list = searchParams.get("list");
  if (list) {
    return fetch(`https://hq.sinajs.cn/etag.php?list=${list}`, {
      headers: {
        Referer: "https://finance.sina.com.cn/",
      },
    }).then(async (res) => {
      const buffer = Buffer.from(await res.arrayBuffer()); // 获取原始字节流
      // 解码成字符串
      return new NextResponse(iconv.decode(buffer, "gbk"));
    });
  } else {
    return MyResponse.validFail("No suggestions found");
  }
};
