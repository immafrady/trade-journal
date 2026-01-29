import { ColumnDef } from "@tanstack/react-table";
import { TradeRecordExtend } from "@/lib/services/group/domain/trade-record-extend";
import {
  genColumnDef,
  genNoColumnDef,
  genSelectableColumn,
} from "@/components/ui/my/data-table/selectable-column";
import { Dayjs } from "dayjs";
import { TradeRecordExtendConstants } from "@/lib/services/group/domain/constants";
import { formatFund, formatMoney, formatShares } from "@/lib/market-utils";

function getColumns(): ColumnDef<TradeRecordExtend>[] {
  return [
    genSelectableColumn(),
    genNoColumnDef(),
    genColumnDef({
      id: TradeRecordExtendConstants.Label,
      accessorFn: (row) => row.ticker.label,
      cell: (row) => row.getValue() as string,
    }),
    genColumnDef({
      id: TradeRecordExtendConstants.TradedAt,
      accessorFn: (row) => row.record.props.tradedAt,
      cell: (row) => (row.getValue() as Dayjs).format("YYYY-MM-DD"),
      filterFn: (row, columnId, filterValue, addMeta) => {
        const target = row.getValue(columnId) as Dayjs;
        const [min, max]: [Date?, Date?] = filterValue ?? [];

        if (min && target.isBefore(min)) return false;
        return !(max && target.isAfter(max));
      },
    }),
    genColumnDef({
      id: TradeRecordExtendConstants.Type,
      accessorFn: (row) => row.record.display.type,
      cell: (row) => row.getValue() as string,
    }),
    genColumnDef({
      id: TradeRecordExtendConstants.ValueIndex,
      isNumeric: true,
      accessorFn: (row) => row.group.valueIndex,
      filterFn: "inNumberRange",
      cell: (row) => formatFund(row.getValue() as number),
    }),
    genColumnDef({
      id: TradeRecordExtendConstants.TotalMarketValue,
      isNumeric: true,
      accessorFn: (row) => row.group.totalMarketValue,
      filterFn: "inNumberRange",
      cell: (row) => formatMoney(row.getValue() as number),
    }),
    genColumnDef({
      id: TradeRecordExtendConstants.TotalAmount,
      isNumeric: true,
      accessorFn: (row) => row.group.totalAmount,
      filterFn: "inNumberRange",
      cell: (row) => formatMoney(row.getValue() as number),
    }),
    genColumnDef({
      id: TradeRecordExtendConstants.Price,
      isNumeric: true,
      accessorFn: (row) => row.record.derived.price,
      filterFn: "inNumberRange",
      cell: (context) =>
        context.row.original.ticker.formatter(context.getValue() as number),
    }),
    genColumnDef({
      id: TradeRecordExtendConstants.Shares,
      isNumeric: true,
      accessorFn: (row) => row.record.derived.shares,
      filterFn: "inNumberRange",
      cell: (row) => formatShares(row.getValue() as number),
    }),
    genColumnDef({
      id: TradeRecordExtendConstants.Amount,
      isNumeric: true,
      accessorFn: (row) => row.record.derived.amount,
      filterFn: "inNumberRange",
      cell: (row) => formatMoney(row.getValue() as number),
    }),
    genColumnDef({
      id: TradeRecordExtendConstants.Fee,
      isNumeric: true,
      accessorFn: (row) => row.record.derived.fee,
      cell: (row) => {
        const v = row.getValue() as number;
        return (
          <span className={!v ? "text-destructive" : undefined}>
            {formatMoney(v)}
          </span>
        );
      },
    }),
    genColumnDef({
      id: TradeRecordExtendConstants.Factor,
      isNumeric: true,
      accessorFn: (row) => row.record.props.factor,
      cell: (row) => row.getValue() as number,
    }),
    genColumnDef({
      id: TradeRecordExtendConstants.Comment,
      accessorFn: (row) => row.record.props.comment,
      cell: (row) => (
        <span className="max-w-20 truncate">{row.getValue() as string}</span>
      ),
    }),
  ];
}

export const columns = getColumns();
