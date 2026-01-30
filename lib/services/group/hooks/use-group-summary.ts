import { GroupModel } from "@/lib/services/group";
import { useGroupTradeRecords } from "@/lib/services/group/hooks/use-group-trade-records";

export const useGroupSummary = (model: GroupModel) => {
  const records = useGroupTradeRecords(model.holdingIds!);
  const latest = records[0];

  const totalAmount = latest?.group.totalAmount ?? 0;
  const marketValue = latest?.group.marketValue ?? 0;
  const valueDiff = marketValue - totalAmount;
  return {
    budget: model.budget,
    budgetDiff: model.budget ? model.budget - totalAmount : 0,
    budgetPct: model.budget ? totalAmount / model.budget : 0,
    marketValue,
    totalAmount,
    valueIndex: marketValue / totalAmount,
    valueDiff,
    valuePct: (valueDiff / totalAmount) * 100,
  };
};
