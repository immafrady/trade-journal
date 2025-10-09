import { TargetAndTransition } from "motion";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

export default function Loading({
  isLoading,
  fullScreen = true,
  text = "Data Loading",
  foregroundClassName = "text-secondary-foreground",
  backgroundClassName = "bg-secondary",
}: {
  isLoading: boolean;
  fullScreen?: boolean;
  text?: string;
  foregroundClassName?: string;
  backgroundClassName?: string;
}) {
  const config: TargetAndTransition = {
    height: isLoading ? (fullScreen ? "100svh" : "100%") : "0",
  };
  return (
    <motion.div
      className={cn(
        "inset-0 grid place-items-center overflow-hidden",
        fullScreen ? "fixed" : "absolute",
        backgroundClassName,
      )}
      initial={config}
      animate={config}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div
        className={
          "absolute min-w-svw min-h-svh top-0 left-0 overflow-hidden grid place-items-center"
        }
      >
        <div
          className={cn(
            "flex flex-col items-center justify-center",
            foregroundClassName,
          )}
        >
          <Spinner variant={"bars"} className={"text-9xl"} />
          <div className={"mt-2 text-xl font-mono"}>{text}</div>
        </div>
      </div>
    </motion.div>
  );
}
