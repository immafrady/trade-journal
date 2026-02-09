import React from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { SinaTicker } from "@/lib/services/sina";
import { useTickerById } from "@/lib/services/holdings/use-ticker-map";

interface HoldingInfo {
  id: string;
  ticker: SinaTicker;
}

export const HoldingInfoContext = React.createContext<HoldingInfo | null>(null);

export const HoldingInfoProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { id } = useParams<{ id: string }>();
  const ticker = useTickerById(id);

  const router = useRouter();
  React.useEffect(() => {
    if (!ticker) {
      router.replace("/");
      toast.error("查无此数据");
    }
    return () => {};
  }, [router, ticker]);

  return (
    <HoldingInfoContext.Provider value={{ id, ticker }}>
      {children}
    </HoldingInfoContext.Provider>
  );
};
