import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";

export const HEADER_EXTRA_ID = "app-header-extra";

export const AppHeaderPortal = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [container, setContainer] = React.useState<HTMLElement | null>(null);
  const [skipAnimation, setSkipAnimation] = React.useState(true);

  React.useEffect(() => {
    setSkipAnimation(false);
  }, []);

  React.useEffect(() => {
    setContainer(document.getElementById(HEADER_EXTRA_ID));
  }, []);

  if (!container) return children; // SSR 阶段 直接插入原始位置
  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={skipAnimation ? false : { opacity: 0 }}
        animate={skipAnimation ? undefined : { opacity: 1 }}
        transition={skipAnimation ? undefined : { delay: 0.35 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>,
    container,
  );
};
