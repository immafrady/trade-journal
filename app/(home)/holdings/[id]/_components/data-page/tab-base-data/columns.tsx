import { ColumnDef } from "@tanstack/react-table";
import { TradeRecord } from "@/lib/services/trade-records/trade-record";
import { TradeRecordConstants } from "@/lib/services/trade-records/constants";
import {
  formatMoney,
  formatShares,
  StockValueFormatter,
} from "@/lib/market-utils";

export function getColumns(
  formatter?: StockValueFormatter,
): ColumnDef<TradeRecord>[] {
  formatter ??= (num) => num + "";
  return [
    {
      header: "No.",
      accessorFn: (row, index) => index + 1,
      cell: (row) => (
        <div className={"text-center"}>{row.getValue() as number}</div>
      ),
    },
    {
      header: TradeRecordConstants.Type,
      accessorFn: (row) => row.display.type,
      cell: (row) => (
        <div className={"text-center"}>{row.getValue() as string}</div>
      ),
    },
    {
      id: "price",
      header: () => (
        <div className={"text-right"}>{TradeRecordConstants.Price}</div>
      ),
      accessorFn: (row) => row.derived.price,
      cell: (row) => (
        <div className={"text-right"}>
          {formatter(row.getValue() as number)}
        </div>
      ),
    },
    {
      id: "shares",
      header: () => (
        <div className={"text-right"}>{TradeRecordConstants.Shares}</div>
      ),
      accessorFn: (row) => row.props.shares,
      cell: (row) => (
        <div className={"text-right"}>
          {formatShares(row.getValue() as number)}
        </div>
      ),
    },
    {
      id: "amount",
      header: () => (
        <div className={"text-right"}>{TradeRecordConstants.Amount}</div>
      ),
      accessorFn: (row) => row.derived.amount,
      cell: (row) => (
        <div className={"text-right"}>
          {formatMoney(row.getValue() as number)}
        </div>
      ),
    },
    {
      id: "fee",
      header: () => (
        <div className={"text-right"}>{TradeRecordConstants.Fee}</div>
      ),
      accessorFn: (row) => row.derived.fee,
      cell: (row) => (
        <div className={"text-right"}>
          {formatMoney(row.getValue() as number)}
        </div>
      ),
    },
    {
      id: "factor",
      header: () => (
        <div className={"text-center"}>{TradeRecordConstants.Factor}</div>
      ),
      accessorFn: (row) => row.props.factor,
      cell: (row) => (
        <div className={"text-center"}>{row.getValue() as number}</div>
      ),
    },
    {
      id: "comment",
      header: TradeRecordConstants.Comment,
      accessorFn: (row) => row.props.comment,
      cell: (row) => <div className={"w-60"}>{row.getValue() as string}</div>,
    },
  ];
}
