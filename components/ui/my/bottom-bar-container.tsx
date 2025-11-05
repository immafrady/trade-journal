import { motion } from "motion/react";
import React from "react";

export const BottomBarContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      layoutId={"bottom-bar-container"}
      className={
        "fixed bottom-0 left-0 right-0 pb-safe-offset-4 py-safe-offset-2 flex justify-center gap-2 bg-muted"
      }
    >
      {children}
    </motion.div>
  );
};
