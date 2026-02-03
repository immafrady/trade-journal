import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/my/data-table/column-header";

export function genSelectableColumn<T>(): ColumnDef<T> {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        disabled={!row.getCanSelect()}
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };
}

// “No.”的标准配置
export function genNoColumnDef<T>(): ColumnDef<T> {
  return {
    id: "no",
    header: "No.",
    accessorFn: (row, index) => index + 1,
    cell: (row) => (
      <div className={"text-center"}>{row.getValue() as number}</div>
    ),
    enableColumnFilter: false,
    enableGlobalFilter: false,
  };
}

export function genColumnDef<T>({
  id,
  isNumeric = false,
  cell,
  ...props
}: {
  id: string;
  isNumeric?: boolean;
} & ColumnDef<T>): ColumnDef<T> {
  const align = isNumeric ? "text-right" : "text-center";
  return {
    id,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={id!} className={align} />
    ),
    cell: (row) => (
      <div className={"text-center"}>
        {typeof cell === "function" ? cell(row) : cell}
      </div>
    ),
    ...props,
  };
}
