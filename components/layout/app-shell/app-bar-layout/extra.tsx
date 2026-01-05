import React from "react";
import { AnimatePresence, motion } from "motion/react";

export const AppBarExtra = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div layout layoutId={"app-bar-extra"}>
      <AnimatePresence>{children}</AnimatePresence>
    </motion.div>
  );
};
