import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const { code, type } = body;

  // todo 乱来的，先写着
  // 校验
  if (!code || typeof code !== "string" || code.length > 10) {
    return NextResponse.json(
      { error: "Code 必填且最多 10 个字符" },
      { status: 400 },
    );
  }

  if (!["stock", "fund"].includes(type)) {
    return NextResponse.json(
      { error: "Type 必须是 stock 或 fund" },
      { status: 400 },
    );
  }

  // 校验通过，执行业务逻辑
  // await db.insert(...)

  return NextResponse.json({ message: "提交成功", data: body });
};
