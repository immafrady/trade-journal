import React from "react";

interface TabDailyProps {
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const TabDailyContext = React.createContext<TabDailyProps>({
  index: 0,
  setIndex: (i) => 0,
});

export const DailyProvider = ({ children }: { children: React.ReactNode }) => {
  const [index, setIndex] = React.useState(0);
  return (
    <TabDailyContext.Provider
      value={{
        index,
        setIndex,
      }}
    >
      {children}
    </TabDailyContext.Provider>
  );
};
