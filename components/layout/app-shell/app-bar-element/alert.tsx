import Link from "next/link";
import React from "react";
import { TriangleAlert } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "motion/react";
import { useHoldingDetailStore } from "@/lib/services/composed/holding-detail-provider";

export const AppBarAlert = () => {
  const draftList = useHoldingDetailStore((s) => s.draftList);

  if (draftList.length) {
    return (
      <motion.div layoutId={"app-bar-alert"}>
        <Link href="/alert-messages">
          <Avatar>
            <AvatarFallback className={"bg-orange-300/20 animate-pulse"}>
              <TriangleAlert className="h-5 w-5 text-orange-600" />
            </AvatarFallback>
          </Avatar>
        </Link>
      </motion.div>
    );
  }
  return null;
};
