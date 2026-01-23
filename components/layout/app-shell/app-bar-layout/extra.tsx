import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

export const AppBarExtra = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div layout layoutId={"app-bar-extra"}>
      <AnimatePresence>{children}</AnimatePresence>
    </motion.div>
  );
};

export const AppBarExtraContent = ({
  children,
  action,
  title,
  className,
}: {
  className?: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
  title?: string;
}) => {
  return (
    <motion.div
      layout={"preserve-aspect"}
      className={cn("p-2 pt-0 ", className)}
      layoutId={"app-bar-extra-content"}
    >
      {title ? (
        <div className={"flex justify-between items-center"}>
          <h1 className={"font-medium leading-none"}>{title}</h1>
          <div>{action}</div>
        </div>
      ) : null}
      {children}
    </motion.div>
  );
};
