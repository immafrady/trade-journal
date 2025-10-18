import { useParams, useRouter } from "next/navigation";
import { useHoldingsWithQuote } from "@/lib/services/composed/use-holdings-with-quote";
import React from "react";
import { toast } from "sonner";

export const useHoldingInfo = () => {
  const { id } = useParams<{ id: string }>();
  const list = useHoldingsWithQuote();
  const data = React.useMemo(
    () => list?.find((item) => item.id === id),
    [list, id],
  );
  const router = useRouter();

  React.useEffect(() => {
    if (list.length && !data) {
      router.replace("/");
      toast.error("查无此数据");
    }
    return () => {};
  }, [list, data, router]);
  return {
    id,
    data,
  };
};
