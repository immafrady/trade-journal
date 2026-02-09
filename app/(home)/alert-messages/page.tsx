"use client";
import {
  AppBar,
  AppBarExtra,
  AppContainer,
} from "@/components/layout/app-shell";
import { AlertMessageItem } from "@/app/(home)/alert-messages/_components/alert-message-item";
import { cn } from "@/lib/utils";
import { useHoldingDetailStore } from "@/lib/services/composed/holding-detail-provider";
import { useRouter } from "next/navigation";
import React from "react";

export default function Page() {
  const draftList = useHoldingDetailStore((s) => s.draftList);

  const router = useRouter();
  React.useEffect(() => {
    if (!draftList.length) {
      router.replace("/");
    }
    return () => {};
  }, [draftList.length, router]);
  return (
    <AppContainer
      appBar={
        <AppBar>
          <AppBarExtra title={"警告消息 · 以下记录未录入完全"}></AppBarExtra>
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
