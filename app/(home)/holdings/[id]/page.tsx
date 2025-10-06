"use client";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useHoldingsWithQuote } from "@/lib/services/composed/use-holdings-with-quote";
import { toast } from "sonner";
import { BaseInfo } from "@/app/(home)/holdings/[id]/_components/base-info";
import { AppHeaderPortal } from "@/app/(home)/_components/app-header-portal";

export default function Page() {
  const { id } = useParams();
  const list = useHoldingsWithQuote();
  const data = React.useMemo(
    () => list?.find((item) => item.id === id),
    [list, id],
  );
  const router = useRouter();

  React.useEffect(() => {
    if (list.length && !data) {
      router.replace("/");
      toast.error("查无此数据", { position: "top-center" });
    }
    return () => {};
  }, [list, data, router]);

  return (
    <>
      <div className={"p-layout h-full"}>
        {data && (
          <AppHeaderPortal>
            <div
              className={
                "px-2 -mt-5 translate-y-10 relative z-50 pointer-events-auto"
              }
            >
              <BaseInfo data={data} />
            </div>
          </AppHeaderPortal>
        )}
        <div className={"pt-10"}>点我???</div>
        <div></div>
      </div>
    </>
  );
}
