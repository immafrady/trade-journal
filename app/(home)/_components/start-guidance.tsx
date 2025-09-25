import { ChartCandlestick, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function StartGuidance() {
  return (
    <>
      <div>
        <div
          className={cn(
            "pt-50 flex flex-col items-center gap-2 -z-50",
            "bg-gradient-to-b from-muted to-muted-foreground/80",
          )}
        >
          <h1 className={"font-sans font-bold text-3xl "}>
            Add Your First Asset.
          </h1>
          <h2 className={"font-sans font-light text-xl "}>
            Start all by one click.
          </h2>
          <Link href={"/holdings/add"}>
            <Button className={"translate-y-4"} size={"lg"}>
              <ChartCandlestick />
              立刻开始
              <ChevronRightIcon />
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
