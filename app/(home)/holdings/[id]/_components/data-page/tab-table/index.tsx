import { baseVisibility, getColumns } from "./columns";
import {
  deleteSelectedTradeRecord,
  TradeRecordType,
} from "@/lib/services/trade-records";
import React from "react";
import {
  DataPageContext,
  HoldingInfoContext,
} from "@/app/(home)/holdings/[id]/_providers";
import { DataTable } from "@/components/ui/my/data-table";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DialogSummary } from "./dialog-summary";
import { BottomBar } from "./bottom-bar";
import { toast } from "sonner";
import { DialogFilter } from "./dialog-filter";
import { TableColumnToggler, VisibilityState } from "./table-column-toggler";
import {
  HoldingDetailUpdaterContext,
  useTradeRecordsById,
} from "@/lib/services/composed/holding-detail-provider";

export const TabTable = () => {
  const { id, ticker } = React.useContext(HoldingInfoContext)!;
  const { columnFilters, setColumnFilters } = React.useContext(DataPageContext);
  const records = useTradeRecordsById(id);
  const updater = React.useContext(HoldingDetailUpdaterContext);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(baseVisibility);

  const columns = React.useMemo(() => {
    return getColumns(ticker.formatter);
  }, [ticker.formatter]);
  const table = useReactTable({
    data: records,
    state: {
      columnVisibility,
      columnFilters,
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
  });

  const selectedRows = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original);
  const filteredRows = table
    .getFilteredRowModel()
    .rows.map((row) => row.original);

  return (
    <>
      <div className={"flex justify-between my-2"}>
        <DialogSummary
          disabled={!selectedRows.length && !filteredRows.length}
          records={selectedRows.length ? selectedRows : filteredRows}
        />
        <TableColumnToggler onVisibilityChange={setColumnVisibility} />
        <DialogFilter
          filterCount={filteredRows.length}
          columnFilters={columnFilters}
          onColumnFiltersChange={setColumnFilters}
        />
      </div>
      <DataTable
        table={table}
        className={"bg-card"}
        getRowClassName={(row) => {
          if (TradeRecordType.Draft === row.original.props.type)
            return "text-gray-400";
          if (row.original.derived.shares < 0) return "bg-red-50 text-red-700";
          return "";
        }}
      />
      <BottomBar
        selectedRowCount={selectedRows.length}
        onDeleteConfirm={async () => {
          const count = selectedRows.length;
          await deleteSelectedTradeRecord(
            selectedRows.map((row) => String(row.props.id!)),
          );
          await updater(id);
          table.resetRowSelection();
          toast.success(`成功删除${count}条数据`);
        }}
      />
    </>
  );
};
