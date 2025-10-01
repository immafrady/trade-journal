"use client";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useHoldingsWithQuote } from "@/lib/services/composed/use-holdings-with-quote";
import { toast } from "sonner";
import { BaseInfo } from "@/app/(home)/holdings/[id]/_components/base-info";
import { AppHeaderPortal } from "@/app/(home)/_components/app-header-portal";

export default function Page() {
  const { id } = useParams();
  const [expanded, setExpanded] = React.useState<boolean>(true);
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
      <div
        className={"p-layout h-full"}
        onClick={() => {
          setExpanded(false);
        }}
      >
        {data && (
          <AppHeaderPortal>
            <div className={"px-2 -mt-5 translate-y-10"}>
              <BaseInfo data={data} expanded={expanded} />
            </div>
          </AppHeaderPortal>
        )}
        <div className={"pt-10"}>点我???</div>
        <div></div>
      </div>
    </>
  );
}
