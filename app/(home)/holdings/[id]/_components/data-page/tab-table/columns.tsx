import { ColumnDef } from "@tanstack/react-table";
import {
  TradeRecord,
  TradeRecordConstants,
} from "@/lib/services/trade-records";
import {
  formatFund,
  formatMoney,
  formatShares,
  StockValueFormatter,
} from "@/lib/market-utils";
import { Dayjs } from "dayjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal } from "lucide-react";
import { DialogDetail } from "./dialog-detail";
import {
  genColumnDef,
  genNoColumnDef,
  genSelectableColumn,
} from "@/components/ui/my/data-table/selectable-column";
import { DialogEdit } from "@/app/(home)/holdings/[id]/_components/dialog-edit";

export function getColumns(
  formatter?: StockValueFormatter,
): ColumnDef<TradeRecord>[] {
  formatter ??= (num) => num + "";
  return [
    genSelectableColumn(),
    genNoColumnDef(),
    genColumnDef({
      id: TradeRecordConstants.TradedAt,
      accessorFn: (row) => row.props.tradedAt,
      cell: (row) => (row.getValue() as Dayjs).format("YYYY-MM-DD"),
      filterFn: (row, columnId, filterValue, addMeta) => {
        const target = row.getValue(columnId) as Dayjs;
        const [min, max]: [Date?, Date?] = filterValue ?? [];

        if (min && target.isBefore(min)) return false;
        return !(max && target.isAfter(max));
      },
    }),
    genColumnDef({
      id: TradeRecordConstants.Type,
      accessorFn: (row) => row.display.type,
      cell: (row) => row.getValue() as string,
    }),
    genColumnDef({
      id: TradeRecordConstants.Price,
      isNumeric: true,
      accessorFn: (row) => row.derived.price,
      filterFn: "inNumberRange",
      cell: (row) => formatter(row.getValue() as number),
    }),
    genColumnDef({
      id: TradeRecordConstants.CumulativeCostPrice,
      isNumeric: true,
      accessorFn: (row) => row.cumulative.costPrice,
      filterFn: "inNumberRange",
      cell: (row) => formatter(row.getValue() as number),
    }),
    genColumnDef({
      id: TradeRecordConstants.CumulativeValueIndex,
      isNumeric: true,
      accessorFn: (row) => row.cumulative.valueIndex,
      filterFn: "inNumberRange",
      cell: (row) => formatFund(row.getValue() as number),
    }),
    genColumnDef({
      id: TradeRecordConstants.Shares,
      isNumeric: true,
      accessorFn: (row) => row.derived.shares,
      filterFn: "inNumberRange",
      cell: (row) => formatShares(row.getValue() as number),
    }),
    genColumnDef({
      id: TradeRecordConstants.CumulativeTotalShares,
      isNumeric: true,
      accessorFn: (row) => row.cumulative.totalShares,
      filterFn: "inNumberRange",
      cell: (row) => formatShares(row.getValue() as number),
    }),
    genColumnDef({
      id: TradeRecordConstants.Amount,
      isNumeric: true,
      accessorFn: (row) => row.derived.amount,
      filterFn: "inNumberRange",
      cell: (row) => formatMoney(row.getValue() as number),
    }),
    genColumnDef({
      id: TradeRecordConstants.CumulativeTotalAmount,
      isNumeric: true,
      accessorFn: (row) => row.cumulative.totalAmount,
      filterFn: "inNumberRange",
      cell: (row) => formatMoney(row.getValue() as number),
    }),
    genColumnDef({
      id: TradeRecordConstants.CumulativeMarketValue,
      isNumeric: true,
      accessorFn: (row) => row.cumulative.marketValue,
      filterFn: "inNumberRange",
      cell: (row) => formatMoney(row.getValue() as number),
    }),
    genColumnDef({
      id: TradeRecordConstants.Fee,
      isNumeric: true,
      accessorFn: (row) => row.derived.fee,
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
      id: TradeRecordConstants.FeeRate,
      isNumeric: true,
      accessorFn: (row) => row.display.feeRate,
      cell: (row) => {
        const v = row.getValue() as number;
        return <span className={!v ? "text-destructive" : undefined}>{v}</span>;
      },
    }),
    genColumnDef({
      id: TradeRecordConstants.Factor,
      isNumeric: true,
      accessorFn: (row) => row.props.factor,
      cell: (row) => row.getValue() as number,
    }),
    genColumnDef({
      id: TradeRecordConstants.Comment,
      accessorFn: (row) => row.props.comment,
      cell: (row) => (
        <span className="max-w-20 truncate">{row.getValue() as string}</span>
      ),
    }),
    {
      id: "action",
      header: "操作",
      enableGlobalFilter: false,
      enableColumnFilter: false,
      enableSorting: false,
      cell: ({ row }) => {
        const record = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">打开菜单</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DialogDetail record={record} formatter={formatter} />
              <DropdownMenuSeparator />
              <DialogEdit
                record={record}
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Edit />
                    编辑
                  </DropdownMenuItem>
                }
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}

export const baseVisibility = {
  [TradeRecordConstants.FeeRate]: false,
  [TradeRecordConstants.CumulativeTotalAmount]: false,
  [TradeRecordConstants.CumulativeTotalShares]: false,
  [TradeRecordConstants.CumulativeCostPrice]: false,
  [TradeRecordConstants.CumulativeMarketValue]: false,
  [TradeRecordConstants.CumulativeValueIndex]: false,
} as const;

export const cumulativeVisibility = {
  [TradeRecordConstants.Amount]: false,
  [TradeRecordConstants.Fee]: false,
  [TradeRecordConstants.FeeRate]: false,
  [TradeRecordConstants.Shares]: false,
} as const;
