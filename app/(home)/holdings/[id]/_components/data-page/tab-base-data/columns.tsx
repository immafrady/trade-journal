import { ColumnDef } from "@tanstack/react-table";
import { TradeRecord } from "@/lib/services/trade-records/trade-record";
import { TradeRecordConstants } from "@/lib/services/trade-records/constants";
import {
  formatMoney,
  formatShares,
  StockValueFormatter,
} from "@/lib/market-utils";
import { DataTableColumnHeader } from "@/components/ui/my/data-table/column-header";
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
import { DialogDetail } from "@/app/(home)/holdings/[id]/_components/data-page/tab-base-data/dialog-detail";
import { cn } from "@/lib/utils";
import { getSelectableColumn } from "@/components/ui/my/data-table/selectable-column";
import { DialogEdit } from "@/app/(home)/holdings/[id]/_components/dialog-edit";

export function getColumns(
  formatter?: StockValueFormatter,
): ColumnDef<TradeRecord>[] {
  formatter ??= (num) => num + "";
  return [
    getSelectableColumn(),
    {
      id: "no",
      header: "No.",
      accessorFn: (row, index) => index + 1,
      cell: (row) => (
        <div className={"text-center"}>{row.getValue() as number}</div>
      ),
      enableColumnFilter: false,
      enableGlobalFilter: false,
    },
    {
      id: TradeRecordConstants.TradedAt,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={TradeRecordConstants.TradedAt}
          className={"text-center"}
        />
      ),
      accessorFn: (row) => row.props.tradedAt,
      cell: (row) => (
        <div className={"text-center"}>
          {(row.getValue() as Dayjs).format("YYYY-MM-DD")}
        </div>
      ),
    },
    {
      id: TradeRecordConstants.Type,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={TradeRecordConstants.Type}
          className={"text-center"}
        />
      ),
      accessorFn: (row) => row.display.type,
      cell: (row) => (
        <div className={"text-center"}>{row.getValue() as string}</div>
      ),
    },
    {
      id: TradeRecordConstants.Price,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={TradeRecordConstants.Price}
          className={"text-right"}
        />
      ),
      accessorFn: (row) => row.derived.price,
      filterFn: "inNumberRange",
      cell: (row) => (
        <div className={"text-right"}>
          {formatter(row.getValue() as number)}
        </div>
      ),
    },
    {
      id: TradeRecordConstants.CumulativeCostPrice,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={TradeRecordConstants.CumulativeCostPrice}
          className={"text-right"}
        />
      ),
      accessorFn: (row) => row.cumulative.costPrice,
      filterFn: "inNumberRange",
      cell: (row) => (
        <div className={"text-right"}>
          {formatter(row.getValue() as number)}
        </div>
      ),
    },
    {
      id: TradeRecordConstants.Shares,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={TradeRecordConstants.Shares}
          className={"text-right"}
        />
      ),
      accessorFn: (row) => row.derived.shares,
      filterFn: "inNumberRange",
      cell: (row) => (
        <div className={"text-right"}>
          {formatShares(row.getValue() as number)}
        </div>
      ),
    },
    {
      id: TradeRecordConstants.AdjustedShares,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={TradeRecordConstants.AdjustedShares}
          className={"text-right"}
        />
      ),
      accessorFn: (row) => row.adjusted.shares,
      filterFn: "inNumberRange",
      cell: (row) => (
        <div className={"text-right"}>
          {formatShares(row.getValue() as number)}
        </div>
      ),
    },
    {
      id: TradeRecordConstants.CumulativeTotalShares,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={TradeRecordConstants.CumulativeTotalShares}
          className={"text-right"}
        />
      ),
      accessorFn: (row) => row.cumulative.totalShares,
      filterFn: "inNumberRange",
      cell: (row) => (
        <div className={"text-right"}>
          {formatShares(row.getValue() as number)}
        </div>
      ),
    },
    {
      id: TradeRecordConstants.Amount,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={TradeRecordConstants.Amount}
          className={"text-right"}
        />
      ),
      accessorFn: (row) => row.derived.amount,
      filterFn: "inNumberRange",
      cell: (row) => (
        <div className={"text-right"}>
          {formatMoney(row.getValue() as number)}
        </div>
      ),
    },
    {
      id: TradeRecordConstants.AdjustedAmount,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={TradeRecordConstants.AdjustedAmount}
          className={"text-right"}
        />
      ),
      accessorFn: (row) => row.adjusted.amount,
      filterFn: "inNumberRange",
      cell: (row) => (
        <div className={"text-right"}>
          {formatMoney(row.getValue() as number)}
        </div>
      ),
    },
    {
      id: TradeRecordConstants.CumulativeTotalAmount,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={TradeRecordConstants.CumulativeTotalAmount}
          className={"text-right"}
        />
      ),
      accessorFn: (row) => row.cumulative.totalAmount,
      filterFn: "inNumberRange",
      cell: (row) => (
        <div className={"text-right"}>
          {formatMoney(row.getValue() as number)}
        </div>
      ),
    },
    {
      id: TradeRecordConstants.Fee,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={TradeRecordConstants.Fee}
          className={"text-right"}
        />
      ),
      accessorFn: (row) => row.derived.fee,
      cell: (row) => {
        const v = row.getValue() as number;
        return (
          <div className={cn("text-right", !v && "text-destructive")}>
            {formatMoney(v)}
          </div>
        );
      },
    },
    {
      id: TradeRecordConstants.AdjustedFee,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={TradeRecordConstants.AdjustedFee}
          className={"text-right"}
        />
      ),
      accessorFn: (row) => row.adjusted.fee,
      cell: (row) => {
        const v = row.getValue() as number;
        return (
          <div className={cn("text-right", !v && "text-destructive")}>
            {formatMoney(v)}
          </div>
        );
      },
    },
    {
      id: TradeRecordConstants.Factor,
      header: () => (
        <div className={"text-center"}>{TradeRecordConstants.Factor}</div>
      ),
      accessorFn: (row) => row.props.factor,
      cell: (row) => (
        <div className={"text-center"}>{row.getValue() as number}</div>
      ),
    },
    {
      id: TradeRecordConstants.Comment,
      header: TradeRecordConstants.Comment,
      accessorFn: (row) => row.props.comment,
      cell: (row) => (
        <div className={"max-w-20 truncate"}>{row.getValue() as string}</div>
      ),
    },
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
  [TradeRecordConstants.AdjustedAmount]: false,
  [TradeRecordConstants.AdjustedFee]: false,
  [TradeRecordConstants.AdjustedShares]: false,
  [TradeRecordConstants.CumulativeTotalAmount]: false,
  [TradeRecordConstants.CumulativeTotalShares]: false,
  [TradeRecordConstants.CumulativeCostPrice]: false,
} as const;

export const adjustVisibility = {
  [TradeRecordConstants.Amount]: false,
  [TradeRecordConstants.Fee]: false,
  [TradeRecordConstants.Shares]: false,
  [TradeRecordConstants.CumulativeTotalAmount]: false,
  [TradeRecordConstants.CumulativeTotalShares]: false,
  [TradeRecordConstants.CumulativeCostPrice]: false,
} as const;

export const cumulativeVisibility = {
  [TradeRecordConstants.Amount]: false,
  [TradeRecordConstants.Fee]: false,
  [TradeRecordConstants.Shares]: false,
  [TradeRecordConstants.AdjustedAmount]: false,
  [TradeRecordConstants.AdjustedFee]: false,
  [TradeRecordConstants.AdjustedShares]: false,
} as const;
