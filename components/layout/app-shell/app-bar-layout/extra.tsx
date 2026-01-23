import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const AppBarExtra = ({
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
      layoutId={"app-bar-extra"}
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
