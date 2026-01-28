import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";

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
