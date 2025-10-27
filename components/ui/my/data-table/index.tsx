"use client";

import { flexRender, Row, Table } from "@tanstack/react-table";

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

interface DataTableProps<TData> {
  table: Table<TData>;
  className?: string;
  getRowClassName?: (row: Row<TData>) => string;
}

export function DataTable<TData>({
  table,
  className,
  getRowClassName,
}: DataTableProps<TData>) {
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
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  没有结果
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
