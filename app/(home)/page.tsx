"use client";
import React from "react";
import { createClient } from "@/lib/supabase/browser-client";
import { Button } from "@/components/ui/button";
import { useHoldingList } from "@/lib/services/user-holdings";
import Loading from "./loading";
import StartGuidance from "@/app/(home)/_components/start-guidance";

export default function Page() {
  const { data, isLoading, mutate } = useHoldingList();
  return (
    <>
      <div>
        {data?.length ? (
          <>
            <pre>{JSON.stringify(data, null, 2)}</pre>
            <div>add one</div>
            <Button
              onClick={async () => {
                const supabase = createClient();
                await supabase
                  .from("user_holdings")
                  .insert([
                    {
                      code: "1",
                      type: "1",
                    },
                  ])
                  .select();
                await mutate();
              }}
            >
              +1
            </Button>
          </>
        ) : (
          <StartGuidance />
        )}
      </div>
      <Loading isLoading={isLoading} />
    </>
  );
}
