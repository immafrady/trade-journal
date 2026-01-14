import React from "react";
import { AppBarExtraContent } from "@/components/layout/app-shell";

export const AppBarTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppBarExtraContent className={"p-2 pt-0 font-medium leading-none"}>
      {children}
    </AppBarExtraContent>
  );
};
