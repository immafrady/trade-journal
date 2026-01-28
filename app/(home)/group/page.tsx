"use client";
import {
  AppBar,
  AppBarExtra,
  AppContainer,
} from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import React from "react";
import Link from "next/link";
import { useGroupList } from "@/lib/services/group/hooks/use-group-list";
import { BlankPage } from "@/app/(home)/group/_components/blank-page";
import { GroupCard } from "@/app/(home)/group/_components/group-card";

export default function Page() {
  const { data: list = [] } = useGroupList();
  return (
    <AppContainer
      appBar={
        <AppBar>
          <AppBarExtra
            className={"relative z-50 pointer-events-auto"}
            title={"分组视图"}
            action={
              <Button variant={"link"} size={"sm"} asChild>
                <Link href={"/"}>
                  账户总览
                  <ArrowRight />
                </Link>
              </Button>
            }
          ></AppBarExtra>
        </AppBar>
      }
    >
      {list.length ? (
        <div className={"common-layout flex flex-col gap-2 pt-10 pb-20"}>
          {list.map((model) => (
            <GroupCard key={model.id!} model={model}></GroupCard>
          ))}
        </div>
      ) : (
        <BlankPage />
      )}
    </AppContainer>
  );
}
