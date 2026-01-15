"use client";
import { useTradeRecordStore } from "@/lib/services/trade-records";
import {
  AppBar,
  AppBarExtra,
  AppBarTitle,
  AppContainer,
} from "@/components/layout/app-shell";
import { AlertMessageItem } from "@/app/(home)/alert-messages/_components/alert-message-item";
import { cn } from "@/lib/utils";

export default function Page() {
  const draftList = useTradeRecordStore((s) => s.draftList) ?? [];
  return (
    <AppContainer
      appBar={
        <AppBar>
          <AppBarExtra>
            <AppBarTitle>警告消息</AppBarTitle>
          </AppBarExtra>
        </AppBar>
      }
    >
      <div className={cn("h-full common-layout", "flex flex-col gap-2")}>
        {draftList.map((draft) => (
          <AlertMessageItem key={draft.holdingId} draft={draft} />
        ))}
      </div>
    </AppContainer>
  );
}
