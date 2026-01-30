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
import { BlankPage } from "./_components/blank-page";
import { ListPage } from "./_components/list-page";

export default function Page() {
  const { data: list = [] } = useGroupList();
  return (
    <AppContainer
      appBar={
        <AppBar>
          <AppBarExtra
            className={"relative z-50 pointer-events-auto"}
            title={"组合视图"}
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
      {list.length ? <ListPage list={list}></ListPage> : <BlankPage />}
    </AppContainer>
  );
}
