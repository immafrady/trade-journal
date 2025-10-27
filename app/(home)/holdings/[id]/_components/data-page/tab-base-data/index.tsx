import { getColumns } from "@/app/(home)/holdings/[id]/_components/data-page/tab-base-data/columns";
import { useTradeRecordList } from "@/lib/services/trade-records/use-trade-record-list";
import React from "react";
import { HoldingInfoContext } from "@/app/(home)/holdings/[id]/_providers/holding-info";
import { DataTable } from "@/components/ui/my/data-table";
import { Button, LoadingButton } from "@/components/ui/button";
import { Layers, Trash } from "lucide-react";
import { toast } from "sonner";
import { deleteSelectedTradeRecord } from "@/lib/services/trade-records/trade-record-apis";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

export const TabBaseData = () => {
  const { id, data } = React.useContext(HoldingInfoContext);
  const { data: list = [], mutate } = useTradeRecordList(id);
  const [loading, setLoading] = React.useState(false);

  const table = useReactTable({
    data: list,
    columns: getColumns(data?.quote?.formatter),
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
        <Button disabled={!selectedRows.length} variant={"outline"}>
          <Layers />
          汇总展示
        </Button>
        <LoadingButton
          loading={loading}
          disabled={!selectedRows.length}
          variant={"destructive"}
          size={"sm"}
          icon={<Trash />}
          onClick={async () => {
            setLoading(true);
            await deleteSelectedTradeRecord(
              selectedRows.map((row) => String(row.props.id!)),
            );
            await mutate();
            table.resetRowSelection();
            try {
            } catch (e: any) {
              toast.error(e.toString());
            } finally {
              setLoading(false);
            }
          }}
        >
          批量删除
        </LoadingButton>
      </div>
      <DataTable
        table={table}
        className={"bg-card"}
        getRowClassName={(row) =>
          row.original.props.shares < 0 ? "bg-red-50 text-red-700" : ""
        }
      />
    </>
  );
};
