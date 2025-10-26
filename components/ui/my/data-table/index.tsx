"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  Table,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table as TableWrapper,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DataTablePagination } from "@/components/ui/my/data-table/pagination";
import React from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  className?: string;
  getRowClassName?: (row: Row<TData>) => string;
  onSelect?: (rows: TData[]) => void;
}

function DataTableInner<TData, TValue>(
  {
    columns,
    data,
    className,
    getRowClassName,
    onSelect,
  }: DataTableProps<TData, TValue>,
  ref: React.Ref<Table<TData>>,
) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  React.useImperativeHandle(ref, () => table);

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  React.useEffect(() => {
    onSelect?.(selectedRows.map((row) => row.original));
  }, [selectedRows, onSelect]);

  return (
    <div>
      <div className={cn("overflow-hidden rounded-md border my-2", className)}>
        <TableWrapper>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(getRowClassName?.(row))}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableWrapper>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}

DataTableInner.displayName = "DataTable";

export const DataTable = React.forwardRef(DataTableInner) as <TData, TValue>(
  props: DataTableProps<TData, TValue> & {
    ref?: React.Ref<Table<TData>>;
  },
) => React.ReactElement | null;
