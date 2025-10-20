import React from "react";
import { UserMetaContext } from "@/providers/user-meta";
import { motion } from "motion/react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "@/components/ui/my/logo";
import { cn } from "@/lib/utils";

export const AppContainer = ({
  appBar,
  children,
  className,
}: {
  appBar?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={"flex flex-col overflow-hidden h-svh"}>
      {appBar}
      <main
        className={cn(
          "relative flex-1 overflow-y-auto overflow-x-hidden",
          className,
        )}
      >
        {children}
      </main>
    </div>
  );
};

export const AppBar = ({
  children,
  isLargeAvatar,
  className,
}: {
  children?: React.ReactNode;
  isLargeAvatar?: boolean;
  className?: string;
}) => {
  return (
    <motion.header
      layout
      layoutId={"app-bar"}
      className={cn(
        "bg-secondary z-50",
        isLargeAvatar && "pb-0 mb-14 rounded-b-4xl",
        className,
      )}
      transition={{
        duration: 0.5,
      }}
    >
      <nav
        className={cn(
          "p-2 flex items-center",
          isLargeAvatar ? "flex-col" : "justify-between",
        )}
      >
        <AppBarSlogan />
        <AppBarAvatar isLargeAvatar={isLargeAvatar} />
      </nav>
      {children}
    </motion.header>
  );
};

export const AppBarExtra = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div layout layoutId={"app-bar-extra"}>
      <motion.div layout={"position"}>{children}</motion.div>
    </motion.div>
  );
};
export const AppBarSlogan = () => {
  return (
    <motion.div layoutId={"app-bar-slogan"}>
      <Link className={"flex align-center"} href="/">
        <Logo />
        <span className={" pl-1 font-sans text-secondary-foreground"}>
          Trade Journal
        </span>
      </Link>
    </motion.div>
  );
};

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

export const AppBarTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.h1
      layoutId={"app-bar-title"}
      className={"p-2 pt-0 font-medium leading-none"}
    >
      {children}
    </motion.h1>
  );
};
