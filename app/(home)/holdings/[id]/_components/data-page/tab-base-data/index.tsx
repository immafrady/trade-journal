import {
  baseVisibility,
  getColumns,
} from "@/app/(home)/holdings/[id]/_components/data-page/tab-base-data/columns";
import { useTradeRecordList } from "@/lib/services/trade-records/use-trade-record-list";
import React from "react";
import { HoldingInfoContext } from "@/app/(home)/holdings/[id]/_providers/holding-info";
import { DataTable } from "@/components/ui/my/data-table";
import { Button } from "@/components/ui/button";
import { Layers } from "lucide-react";
import { deleteSelectedTradeRecord } from "@/lib/services/trade-records/trade-record-apis";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  DialogSummary,
  DialogSummaryRef,
} from "@/app/(home)/holdings/[id]/_components/data-page/tab-base-data/dialog-summary";
import { BottomBar } from "@/app/(home)/holdings/[id]/_components/data-page/tab-base-data/bottom-bar";
import { toast } from "sonner";
import { DialogFilter } from "@/app/(home)/holdings/[id]/_components/data-page/tab-base-data/dialog-filter";
import {
  TableColumnToggler,
  VisibilityState,
} from "@/app/(home)/holdings/[id]/_components/data-page/tab-base-data/table-column-toggler";

export const TabBaseData = () => {
  const dialogSummaryRef = React.useRef<DialogSummaryRef>(null);
  const { id, data } = React.useContext(HoldingInfoContext);
  const { data: list = [], mutate } = useTradeRecordList(id);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(baseVisibility);

  const columns = React.useMemo(() => {
    return getColumns(data?.quote?.formatter);
  }, [data?.quote?.formatter]);
  const table = useReactTable({
    data: list,
    state: {
      columnVisibility,
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const selectedRows = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original);

  return (
    <>
      <div className={"flex justify-between my-2"}>
        <Button
          disabled={!selectedRows.length}
          variant={"outline"}
          size={"sm"}
          onClick={() => dialogSummaryRef.current?.openDialog(selectedRows)}
        >
          <Layers />
          汇总展示
        </Button>

        <TableColumnToggler onVisibilityChange={setColumnVisibility} />
        <DialogFilter />
      </div>
      <DataTable
        table={table}
        className={"bg-card"}
        getRowClassName={(row) =>
          row.original.derived.shares < 0 ? "bg-red-50 text-red-700" : ""
        }
      />
      <BottomBar
        selectedRowCount={selectedRows.length}
        onDeleteConfirm={async () => {
          const count = selectedRows.length;
          await deleteSelectedTradeRecord(
            selectedRows.map((row) => String(row.props.id!)),
          );
          await mutate();
          table.resetRowSelection();
          toast.success(`成功删除${count}条数据`);
        }}
      />
      <DialogSummary ref={dialogSummaryRef} />
    </>
  );
};
