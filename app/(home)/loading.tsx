"use client";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { motion } from "motion/react";
import { TargetAndTransition } from "motion";
import { cn } from "@/lib/utils";

export default function Loading(props: { isLoading: boolean }) {
  const config: TargetAndTransition = {
    height: props.isLoading ? "100svh" : "0",
  };
  return (
    <motion.div
      className={cn(
        "fixed inset-0 grid place-items-center overflow-hidden bg-primary",
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
        <div className="flex flex-col items-center justify-center text-primary">
          <Spinner
            variant={"bars"}
            className={"text-9xl text-primary-foreground"}
          />
          <div className={"text-primary-foreground mt-2 text-xl font-mono"}>
            Data Loading
          </div>
        </div>
      </div>
    </motion.div>
  );
}
