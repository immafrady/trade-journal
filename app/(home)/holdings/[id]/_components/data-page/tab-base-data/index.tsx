import {
  adjustVisibility,
  baseVisibility,
  cumulativeVisibility,
  getColumns,
} from "@/app/(home)/holdings/[id]/_components/data-page/tab-base-data/columns";
import { useTradeRecordList } from "@/lib/services/trade-records/use-trade-record-list";
import React from "react";
import { HoldingInfoContext } from "@/app/(home)/holdings/[id]/_providers/holding-info";
import { DataTable } from "@/components/ui/my/data-table";
import { Button } from "@/components/ui/button";
import { Archive, Database, Gauge, Layers } from "lucide-react";
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
import { ToggleButton } from "@/components/ui/my/button";
import { BottomBar } from "@/app/(home)/holdings/[id]/_components/data-page/tab-base-data/bottom-bar";
import { toast } from "sonner";
import { DialogFilter } from "@/app/(home)/holdings/[id]/_components/data-page/tab-base-data/dialog-filter";

export const TabBaseData = () => {
  const dialogSummaryRef = React.useRef<DialogSummaryRef>(null);
  const { id, data } = React.useContext(HoldingInfoContext);
  const { data: list = [], mutate } = useTradeRecordList(id);
  const [columnVisibility, setColumnVisibility] = React.useState<
    | typeof baseVisibility
    | typeof adjustVisibility
    | typeof cumulativeVisibility
  >(baseVisibility);

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

        <ToggleButton
          variant={"secondary"}
          size={"sm"}
          stateList={[
            {
              children: (
                <div className={"flex items-center gap-0.5"}>
                  <Database />
                  基础数据
                </div>
              ),
            },
            {
              children: (
                <div className={"flex items-center gap-0.5"}>
                  <Gauge />
                  高阶数据
                </div>
              ),
            },
            {
              children: (
                <div className={"flex items-center gap-0.5"}>
                  <Archive />
                  累计数据
                </div>
              ),
            },
          ]}
          onStateChange={(s) => {
            setColumnVisibility(
              s === 0
                ? baseVisibility
                : s === 1
                  ? adjustVisibility
                  : cumulativeVisibility,
            );
          }}
        />

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
