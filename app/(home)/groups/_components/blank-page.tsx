import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { BookOpen } from "lucide-react";
import React from "react";
import { DialogEdit } from "@/app/(home)/groups/_components/dialog-edit";

export const BlankPage = () => {
  return (
    <Empty className={"mt-20"}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BookOpen />
        </EmptyMedia>
        <EmptyTitle>(｡•̀ᴗ-)✧ 没有组合记录～</EmptyTitle>
        <EmptyDescription>
          快来新建第一个组合吧！
          <br />
          <ul className={"flex flex-col items-start mt-10"}>
            <li>
              <b>📊合并统计：</b>将多个标的统一汇总，整体盈亏一目了然
            </li>
            <li>
              <b>📈设定指数：</b>用一个指数反映整组资产的真实表现
            </li>
            <li>
              <b>🔄联合做T：</b>组合内协同操作，提高资金使用效率
            </li>
            <li>
              <b>🧮统一管理成本：</b>不同价格基数，也能精确对比
            </li>
            <li>
              <b>🧠降低决策噪音：</b>从“单只视角”升级为“组合视角”
            </li>
          </ul>
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <DialogEdit trigger={<Button>新增组合</Button>} />
        </div>
      </EmptyContent>
    </Empty>
  );
};
