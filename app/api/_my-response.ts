import { NextResponse } from "next/server";

export const MyResponse = {
  // 主要是放supabase的响应
  anyOk: (body: any) => NextResponse.json(body),
  // 只返回一个消息
  msgOk: (message: string) =>
    NextResponse.json({
      message,
    }),
  // 校验错误
  validFail: (error: string) =>
    NextResponse.json(
      {
        error,
      },
      {
        status: 400,
      },
    ),
  // 服务端错误
  serverFail: (error: string) =>
    NextResponse.json(
      {
        error,
      },
      {
        status: 500,
      },
    ),
};
