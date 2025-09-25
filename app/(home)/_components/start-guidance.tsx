import { ChartCandlestick } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StartGuidance() {
  return (
    <>
      <div>
        <div className={"pt-50 bg-muted flex flex-col items-center gap-2"}>
          <h1 className={"font-sans font-bold text-3xl "}>
            Add Your First Asset.
          </h1>
          <h2 className={"font-sans font-light text-xl "}>
            Start all by one click.
          </h2>
          <Button className={"translate-y-4"}>
            <ChartCandlestick />
            立刻开始
          </Button>
        </div>
      </div>
    </>
  );
}
