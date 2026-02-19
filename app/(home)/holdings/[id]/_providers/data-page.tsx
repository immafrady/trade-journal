import React from "react";
import { ColumnFiltersState } from "@tanstack/react-table";
import { TabKey } from "@/app/(home)/holdings/[id]/_components/tab-key";

interface DataPageProps {
  tabDailyIndex: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  tabKey: string;
  setTabKey: React.Dispatch<React.SetStateAction<string>>;
}

export const DataPageContext = React.createContext<DataPageProps>({
  tabDailyIndex: 0,
  setIndex: (i) => {},
  columnFilters: [],
  setColumnFilters: (value) => {},
  tabKey: "",
  setTabKey: (value) => {},
});

export const DataPageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [tabDailyIndex, setIndex] = React.useState(0);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [tabKey, setTabKey] = React.useState<string>(TabKey.Summary);
  return (
    <DataPageContext.Provider
      value={{
        tabDailyIndex,
        setIndex,
        columnFilters,
        setColumnFilters,
        tabKey,
        setTabKey,
      }}
    >
      {children}
    </DataPageContext.Provider>
  );
};
