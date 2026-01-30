import { GroupInfoContext } from "../../_providers/group-info";
import React from "react";
import { useGroupTradeRecords } from "@/lib/services/group/hooks/use-group-trade-records";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/my/data-table";

export const TabTable = () => {
  const group = React.useContext(GroupInfoContext)!;
  const records = useGroupTradeRecords(group.holdingIds ?? []);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const table = useReactTable({
    data: records,
    state: {
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
      <DataTable
        table={table}
        className={"bg-card"}
        getRowClassName={(row) =>
          row.original.record.derived.shares < 0 ? "bg-red-50 text-red-700" : ""
        }
      />
    </>
  );
};
// todo 记得写一个导出
