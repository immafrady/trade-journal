import {
  HoldingWithQuote,
  useHoldingsWithQuote,
} from "@/lib/services/composed/use-holdings-with-quote";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

interface HoldingInfo {
  id: string;
  data?: HoldingWithQuote;
}

export const HoldingInfoContext = React.createContext<HoldingInfo>({ id: "" });

export const HoldingInfoProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
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

  return (
    <HoldingInfoContext.Provider value={{ id, data }}>
      {children}
    </HoldingInfoContext.Provider>
  );
};
