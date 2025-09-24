"use client";

import React from "react";
import { UserMetaContext } from "@/providers/user-meta";
import ListItem from "@/app/(home)/me/_components/list-item";
import { MailIcon, User2Icon } from "lucide-react";

export default function Page() {
  const userMeta = React.useContext(UserMetaContext);

  return (
    <div className={"p-layout flex flex-col items-center"}>
      <div className={"font-bold font-serif"}>{userMeta?.name}</div>
      <ul className={"self-stretch"}>
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
    </div>
  );
}
