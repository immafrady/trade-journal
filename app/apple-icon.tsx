import { ImageResponse } from "next/og";
import Logo from "@/components/ui/my/logo";

// 图像元数据
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// 图像生成
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX 元素
      <Logo />
    ),
    // ImageResponse 选项
    {
      // 为了方便，我们可以重用导出的图标大小元数据
      // 配置来同时设置 ImageResponse 的宽度和高度。
      ...size,
    },
  );
}
