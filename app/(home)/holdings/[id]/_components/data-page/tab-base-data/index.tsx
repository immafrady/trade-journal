import { getColumns } from "@/app/(home)/holdings/[id]/_components/data-page/tab-base-data/columns";
import { useTradeRecordList } from "@/lib/services/trade-records/use-trade-record-list";
import React from "react";
import { HoldingInfoContext } from "@/app/(home)/holdings/[id]/_providers/holding-info";
import { DataTable } from "@/components/ui/my/data-table";

export const TabBaseData = () => {
  const { id, data } = React.useContext(HoldingInfoContext);
  const { data: list = [] } = useTradeRecordList(id);
  return (
    <DataTable
      data={list}
      columns={getColumns(data?.quote?.formatter)}
      className={"bg-card"}
    />
  );
};
