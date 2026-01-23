import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { AppBarAvatar } from "../app-bar-element/avatar";
import { AppBarSlogan } from "../app-bar-element/slogan";
import { AppBarAlert } from "@/components/layout/app-shell/app-bar-element/alert";

export const AppBar = ({
  children,
  isLargeAvatar,
  className,
  bgGradient,
}: {
  children?: React.ReactNode;
  isLargeAvatar?: boolean;
  className?: string;
  bgGradient?: boolean;
}) => {
  return (
    <motion.header
      layout
      layoutId={"app-bar"}
      className={cn(
        "bg-secondary z-50",
        isLargeAvatar && "pb-0 mb-14 rounded-b-4xl",
        bgGradient &&
          "bg-gradient-to-b from-secondary to-secondary-foreground/80",
        className,
      )}
    >
      <nav
        className={cn(
          "p-2 flex items-center",
          isLargeAvatar ? "flex-col" : "justify-between",
        )}
      >
        <AppBarSlogan isLargeAvatar={isLargeAvatar} />
        {isLargeAvatar ? (
          <AppBarAvatar isLargeAvatar={isLargeAvatar} />
        ) : (
          <div className={"flex items-center justify-end-safe gap-1"}>
            <AppBarAlert />
            <AppBarAvatar isLargeAvatar={isLargeAvatar} />
          </div>
        )}
      </nav>
      <motion.div layout layoutId={"app-bar-extra-container"}>
        <AnimatePresence>{children}</AnimatePresence>
      </motion.div>
    </motion.header>
  );
};
