import { GroupInfoContext } from "../../_providers/group-info";
import React from "react";
import { useGroupTradeRecords } from "@/lib/services/group";
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
import { BottomBar } from "./bottom-bar";
import { TradeRecordType } from "@/lib/services/trade-records";

export const TabTable = () => {
  const group = React.useContext(GroupInfoContext)!;
  const records = useGroupTradeRecords(group.holdingIds ?? []);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [pagination, setPagination] = React.useState({
    pageIndex: 0, //initial page index
    pageSize: 15, //default page size
  });

  const table = useReactTable({
    data: records,
    state: {
      columnFilters,
      pagination,
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
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
        getRowClassName={(row) => {
          if (TradeRecordType.Draft === row.original.record.props.type)
            return "text-gray-400";
          if (row.original.record.derived.shares < 0)
            return "bg-red-50 text-red-700";
          return "";
        }}
      />
      <BottomBar records={records}></BottomBar>
    </>
  );
};
// todo 记得写一个导出
