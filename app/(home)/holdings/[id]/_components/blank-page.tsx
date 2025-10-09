import { Button } from "@/components/ui/button";
import { TypographyH3, TypographyH4 } from "@/components/ui/typography";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const BlankPage = () => {
  const pathname = usePathname(); // 例如 /holdings/10
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
      <Button asChild>
        <Link href={`${pathname}/add`}>新增一条</Link>
      </Button>
      <Button variant={"outline"} asChild>
        <Link href={`${pathname}/import`}>导入CSV</Link>
      </Button>
    </div>
  );
};
