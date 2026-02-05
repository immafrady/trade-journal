import React from "react";
import {
  HoldingDetailContext,
  HoldingDetailState,
} from "@/lib/services/composed/holding-detail-provider";

// 基础的
export const useHoldingDetailStore = <T>(
  selector: (state: HoldingDetailState) => T,
) => {
  const store = React.useContext(HoldingDetailContext)!;
  return store(selector);
};
