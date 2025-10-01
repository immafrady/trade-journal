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
      <div className={"p-layout"}>
        {data && (
          <AppHeaderPortal>
            <BaseInfo data={data} />
          </AppHeaderPortal>
        )}
      </div>
    </>
  );
}
