import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import React from "react";

export const NavigateToHoldingsAdd = () => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        asChild
        className={
          "rounded-full fixed bottom-safe-offset-5 right-safe-offset-5"
        }
      >
        <Link href={"/holdings/add"}>
          <Plus />
        </Link>
      </Button>
    </TooltipTrigger>
    <TooltipContent>新增标的</TooltipContent>
  </Tooltip>
);
