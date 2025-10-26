import { getColumns } from "@/app/(home)/holdings/[id]/_components/data-page/tab-base-data/columns";
import { useTradeRecordList } from "@/lib/services/trade-records/use-trade-record-list";
import React from "react";
import { HoldingInfoContext } from "@/app/(home)/holdings/[id]/_providers/holding-info";
import { DataTable } from "@/components/ui/my/data-table";
import { Button, LoadingButton } from "@/components/ui/button";
import { TradeRecord } from "@/lib/services/trade-records/trade-record";
import { Layers, Trash } from "lucide-react";
import { toast } from "sonner";
import { deleteSelectedTradeRecord } from "@/lib/services/trade-records/trade-record-apis";
import { Table } from "@tanstack/react-table";

export const TabBaseData = () => {
  const tableRef = React.useRef<Table<TradeRecord>>(null);
  const { id, data } = React.useContext(HoldingInfoContext);
  const { data: list = [], mutate } = useTradeRecordList(id);
  const [rows, setRows] = React.useState<TradeRecord[]>([]);
  const [loading, setLoading] = React.useState(false);

  return (
    <>
      <div className={"flex justify-between my-2"}>
        <Button disabled={!rows.length} variant={"outline"}>
          <Layers />
          汇总展示
        </Button>
        <LoadingButton
          loading={loading}
          disabled={!rows.length}
          variant={"destructive"}
          size={"sm"}
          icon={<Trash />}
          onClick={async () => {
            setLoading(true);
            await deleteSelectedTradeRecord(
              rows.map((row) => String(row.props.id!)),
            );
            tableRef.current?.resetRowSelection();
            await mutate();
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
        ref={tableRef}
        data={list}
        columns={getColumns(data?.quote?.formatter)}
        className={"bg-card"}
        getRowClassName={(row) =>
          row.original.props.shares < 0 ? "bg-red-50 text-red-700" : ""
        }
        onSelect={setRows}
      />
    </>
  );
};
