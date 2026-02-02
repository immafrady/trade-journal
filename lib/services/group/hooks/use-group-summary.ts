import { GroupModel } from "@/lib/services/group";
import { useGroupHoldings } from "@/lib/services/group/hooks/use-group-holdings";
import { useHoldingsWithQuote } from "@/lib/services/composed/use-holdings-with-quote";
import { SinaTicker } from "@/lib/services/sina";
import { TradeRecord, TradeRecordType } from "@/lib/services/trade-records";

// 统计
export const useGroupSummary = (model: GroupModel) => {
  const { tickerMap, holdingRecordMap } = useGroupHoldings(model.holdingIds!);
  const holdingsWithQuotes = useHoldingsWithQuote();

  const summaries: GroupHoldingSummary[] = [];

  let totalMarketValue = 0;
  let totalAmount = 0;
  let allRealtime = true;
  for (const id of model.holdingIds!) {
    const ticker = tickerMap.get(id)!;
    const holdingRecords = holdingRecordMap[id];
    const latest = holdingRecords?.find(
      (record) => TradeRecordType.Draft !== record.props.type,
    );
    if (latest) {
      totalAmount += latest.cumulative.totalAmount;
      const quote = holdingsWithQuotes.find((hwq) => hwq.id === id)?.quote;
      const realtime = !!(quote && quote.current);
      if (!realtime) allRealtime = false;
      const marketValue = realtime
        ? quote!.current! * latest.cumulative.totalShares
        : latest.cumulative.marketValue;
      totalMarketValue += marketValue;

      summaries.push({
        id,
        ticker,
        latest,
        ratio: 0,
        marketValue,
        realtime,
      });
    } else {
      allRealtime = false;
      summaries.push({
        id,
        ticker,
        latest,
        ratio: 0,
        marketValue: 0,
        realtime: false,
      });
    }
  }

  for (const summary of summaries) {
    summary.ratio = (summary.marketValue / totalMarketValue) * 100;
  }
  summaries.sort((a, b) => {
    return b.marketValue - a.marketValue;
  });

  const valueDiff = totalMarketValue - totalAmount;

  return {
    budget: model.budget,
    budgetDiff: model.budget ? model.budget - totalAmount : 0,
    budgetPct: model.budget ? (totalAmount / model.budget) * 100 : 0,
    totalAmount,
    valueIndex: totalMarketValue / totalAmount,
    valueDiff,
    valuePct: (valueDiff / totalAmount) * 100,
    marketValue: totalMarketValue,
    realtime: allRealtime,
    summaries,
  };
};

export interface GroupHoldingSummary {
  id: string;
  ticker: SinaTicker;
  latest?: TradeRecord;
  ratio: number;
  marketValue: number;
  realtime: boolean;
}
