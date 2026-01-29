import { GroupModel } from "@/lib/services/group";
import { useGroupHoldings } from "@/lib/services/group/hooks/use-group-holdings";

export const useGroupSummary = (model: GroupModel) => {
  const { tickerMap, holdingRecordMap } = useGroupHoldings(model.holdingIds!);

  const totalAmount = 0;
  const marketValue = 0;
  return {
    budget: model.budget,
    budgetDiff: 0,
    budgetPct: 0,
    marketValue: 0,
    totalAmount: 0,
    valueIndex: 0,
    valueDiff: 0,
    valuePct: 0,
  };
};
