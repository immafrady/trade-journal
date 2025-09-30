"use client";
import { useParams } from "next/navigation";
import { useHoldingList } from "@/lib/services/holdings/use-holding-list";
import React, { useEffect } from "react";
import { SinaTicker } from "@/lib/services/sina/ticker";
import { useRealtimeQuotes } from "@/lib/services/sina/use-realtime-quotes";

export default function Page() {
  const { id } = useParams();

  return <div className={"p-layout"}>{id}</div>;
}
