import useSWR, { SWRResponse } from "swr";
import { TradeRecord } from "@/lib/services/trade-records/domain/trade-record";
import React from "react";
import { TradeRecordType } from "@/lib/services/trade-records/domain/trade-record-type";
import papa from "papaparse";

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
      const csv = await response.text();
      const result = papa.parse(csv, {
        delimiter: ",", // 分隔符
        header: true,
      });
      return result.data as any[];
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
        const record = TradeRecord.fromCSV(list[i]);
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
        const costPrice = totalShares > 0 ? totalAmount / totalShares : 0;
        record.cumulative = {
          totalAmount,
          totalShares,
          costPrice,
          positionCostEfficiency: costPrice ? totalShares / costPrice : 0,
        };

        // 标记手续费未填写完
        if (
          [
            TradeRecordType.Buy,
            TradeRecordType.Sell,
            TradeRecordType.Redeem,
            TradeRecordType.Subscribe,
          ].includes(record.props.type)
        ) {
          record.meta.isDraft = !record.derived.fee;
        }

        result.unshift(record);
      }
      return result;
    } catch (e) {
      console.error(key, e);
      return [];
    }
  }, [key, list]);

  return { ...swr, data };
}
