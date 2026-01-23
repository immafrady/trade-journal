"use client";
import {
  AppBar,
  AppBarExtra,
  AppBarExtraContent,
  AppContainer,
} from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import React from "react";
import Link from "next/link";

export default function Page() {
  return (
    <AppContainer
      appBar={
        <AppBar>
          <AppBarExtra>
            <AppBarExtraContent
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
            ></AppBarExtraContent>
          </AppBarExtra>
        </AppBar>
      }
    >
      123
    </AppContainer>
  );
}
