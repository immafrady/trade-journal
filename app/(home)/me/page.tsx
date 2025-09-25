"use client";

import React from "react";
import { UserMetaContext } from "@/providers/user-meta";
import ListItem from "@/app/(home)/me/_components/list-item";
import { LogOut, MailIcon, User2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/browser-client";

export default function Page() {
  const userMeta = React.useContext(UserMetaContext);

  return (
    <div className={"p-layout flex flex-col items-center h-[100%]"}>
      <div className={"font-bold font-serif"}>{userMeta?.name}</div>
      <ul className={"flex-1 self-stretch"}>
        <ListItem
          icon={<User2Icon />}
          label={"用户名"}
          value={userMeta?.username ?? ""}
        />
        <ListItem
          icon={<MailIcon />}
          label={"E-Mail"}
          value={userMeta?.email ?? ""}
        />
      </ul>
      <Button
        variant={"destructive"}
        onClick={async () => {
          const supabase = createClient();
          await supabase.auth.signOut();
          window.location.reload();
        }}
      >
        <LogOut />
        退出登录
      </Button>
    </div>
  );
}
