import React from "react";
import { DailySummary } from "@/lib/services/composed/use-daily-summary";
import { Card } from "@/components/ui/card";

export const DailyCard = ({ daily }: { daily: DailySummary }) => {
  return (
    <div className="relative common-layout flex flex-col items-center">
      <div className="w-full max-w-md">
        <Card></Card>
      </div>
    </div>
  );
};
