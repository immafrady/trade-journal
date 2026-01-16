import Link from "next/link";
import React from "react";
import { TriangleAlert } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTradeRecordStore } from "@/lib/services/trade-records";

export const AppBarAlert = () => {
  const draftList = useTradeRecordStore((s) => s.draftList) ?? [];

  if (draftList.length) {
    return (
      <Link href="/alert-messages">
        <Avatar>
          <AvatarFallback className={"bg-orange-300/20 animate-pulse"}>
            <TriangleAlert className="h-5 w-5 text-orange-600" />
          </AvatarFallback>
        </Avatar>
      </Link>
    );
  }
  return null;
};
