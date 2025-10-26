import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { BookOpen } from "lucide-react";
import { DialogEdit } from "@/app/(home)/holdings/[id]/_components/dialog-edit";
import React from "react";

export const BlankPage = () => {
  const pathname = usePathname(); // 例如 /holdings/10
  return (
    <Empty className={"mt-20"}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BookOpen />
        </EmptyMedia>
        <EmptyTitle>(｡•̀ᴗ-)✧ 没有任何持仓记录～</EmptyTitle>
        <EmptyDescription>快来录入第一笔交易吧！</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <DialogEdit trigger={<Button>新增一条</Button>} />
          <Button variant={"outline"} asChild>
            <Link href={`${pathname}/import`}>导入CSV</Link>
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
};
