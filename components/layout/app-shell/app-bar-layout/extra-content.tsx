import React from "react";
import { motion } from "motion/react";

export const AppBarExtraContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      layout={"preserve-aspect"}
      className={className}
      layoutId={"app-bar-extra-content"}
    >
      {children}
    </motion.div>
  );
};
