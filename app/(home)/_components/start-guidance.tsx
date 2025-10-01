"use client";
import { ChartCandlestick, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { useAppHeader } from "@/app/(home)/_components/app-header";
import { AppHeaderPortal } from "@/app/(home)/_components/app-header-portal";

export default function StartGuidance() {
  const { setHeaderClassName, restore } = useAppHeader();
  React.useEffect(() => {
    setHeaderClassName(
      "bg-gradient-to-b from-secondary to-secondary-foreground/80",
    );
    return () => restore();
  }, []);
  return (
    <>
      <AppHeaderPortal>
        <div
          className={cn(
            "pt-30 flex flex-col items-center gap-2",
            "text-secondary",
          )}
        >
          <h1 className={"font-sans font-bold text-3xl"}>
            Add Your First Asset.
          </h1>
          <h2 className={"font-sans font-light text-xl"}>
            Start all by one click.
          </h2>
          <Link href={"/holdings/add"}>
            <Button className={"translate-y-6"} size={"lg"}>
              <ChartCandlestick />
              立刻开始
              <ChevronRightIcon />
            </Button>
          </Link>
        </div>
      </AppHeaderPortal>
      <div className={"pt-20"}>todo: 放点主板的信息</div>
    </>
  );
}
