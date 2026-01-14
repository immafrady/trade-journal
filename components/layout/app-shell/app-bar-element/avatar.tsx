import React from "react";
import { UserMetaContext } from "@/providers/user-meta";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const AppBarAvatar = ({
  isLargeAvatar,
}: {
  isLargeAvatar?: boolean;
}) => {
  const userMeta = React.useContext(UserMetaContext);

  return (
    <motion.div
      layoutId={"app-bar-avatar"}
      className={cn(isLargeAvatar && "translate-y-1/2")}
    >
      <Link href="/me">
        <Avatar className={cn(isLargeAvatar && "size-28")}>
          <AvatarImage src={userMeta?.avatar} />
          <AvatarFallback>🤓</AvatarFallback>
        </Avatar>
      </Link>
    </motion.div>
  );
};
