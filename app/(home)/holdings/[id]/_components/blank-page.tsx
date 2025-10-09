import { Button } from "@/components/ui/button";
import { TypographyH3, TypographyH4 } from "@/components/ui/typography";

export const BlankPage = () => {
  return (
    <div
      className={
        "h-full flex flex-col items-center justify-center gap-5 bg-muted"
      }
    >
      <div className={"flex flex-col gap-2 items-center justify-center"}>
        <TypographyH3>(｡•̀ᴗ-)✧ 没有任何持仓记录～</TypographyH3>
        <TypographyH4>快来录入第一笔交易吧！</TypographyH4>
      </div>
      <Button>新增一条</Button>
      <Button variant={"outline"}>导入CSV</Button>
    </div>
  );
};
