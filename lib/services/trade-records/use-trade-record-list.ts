import useSWR, { SWRResponse } from "swr";
import { TradeRecord } from "@/lib/services/trade-records/trade-record";
import React from "react";
import { TradeRecordType } from "@/lib/enums/trade-record-type";

export function useTradeRecordList(
  holdingId: string,
): SWRResponse<TradeRecord[]> {
  const key = holdingId
    ? `/api/actions/trade-records?holdingId=${holdingId}`
    : null;
  const { data: list = [], ...swr } = useSWR(
    key,
    async (api) => {
      const response = await fetch(api);
      const { data } = await response.json();
      return data;
    },
    {
      fallbackData: [],
    },
  );

  const data = React.useMemo(() => {
    try {
      let totalShares = 0;
      let totalAmount = 0;
      const result: TradeRecord[] = [];

      for (let i = list.length - 1; i >= 0; i--) {
        const record = TradeRecord.fromDatabase(list[i]);
        totalAmount += record.adjusted.amount;
        if (
          [TradeRecordType.Split, TradeRecordType.Merge].includes(
            record.props.type,
          )
        ) {
          const afterShares = totalShares + record.adjusted.shares;
          const ratio = afterShares / totalShares; // 计算出变化幅度
          for (const r of result) {
            // 重新将之前的再计算一遍
            r.cumulative.totalShares *= ratio;
            r.cumulative.costPrice =
              r.cumulative.totalShares > 0
                ? r.cumulative.totalAmount / r.cumulative.totalShares
                : 0;
          }
          totalShares = afterShares;
        } else {
          totalShares += record.adjusted.shares;
        }
        record.cumulative = {
          totalAmount,
          totalShares,
          costPrice: totalShares > 0 ? totalAmount / totalShares : 0,
        };
        result.unshift(record);
        if (
          [TradeRecordType.Split, TradeRecordType.Merge].includes(
            record.props.type,
          )
        ) {
        }
      }
      return result;
    } catch (e) {
      console.error(key, e);
      return [];
    }
  }, [key, list]);

  return { ...swr, data };
}
