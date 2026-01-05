import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { AppContainerProps, AppContainerPropsContext } from "./context";

export const AppContainer = ({
  appBar,
  children,
  className,
  hideBackButton,
}: {
  appBar?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
} & AppContainerProps) => {
  return (
    <AppContainerPropsContext.Provider value={{ hideBackButton }}>
      <div className={"flex flex-col overflow-hidden h-svh"}>
        {appBar}
        <motion.main
          layout={"preserve-aspect"}
          layoutId={"app-container-main"}
          className={cn(
            "relative flex-1 overflow-y-auto overflow-x-hidden",
            className,
          )}
        >
          {children}
        </motion.main>
      </div>
    </AppContainerPropsContext.Provider>
  );
};
