import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const TabSummary = () => {
  const pathname = usePathname(); // 例如 /holdings/10

  return (
    <div className={"relative"}>
      dkflsjdlfk
      <div
        className={
          "fixed bottom-safe-offset-4 left-0 right-0 flex justify-center gap-4"
        }
      >
        <Button asChild>
          <Link href={`${pathname}/add`}>新增一条</Link>
        </Button>
        <Button variant={"outline"} asChild>
          <Link href={`${pathname}/import`}>导入CSV</Link>
        </Button>
        <Button variant={"outline"} asChild>
          <Link href={`${pathname}/import`}>导出CSV</Link>
        </Button>
        <Button variant={"destructive"} asChild>
          <Link href={`${pathname}/import`}>清除数据</Link>
        </Button>
      </div>
    </div>
  );
};
