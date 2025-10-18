"use client";
import Logo from "@/components/ui/my/logo";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserMetaContext } from "@/providers/user-meta";
import React from "react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { HEADER_EXTRA_ID } from "@/app/(home)/_components/app-header-portal";

const AppHeaderContext = React.createContext<{
  setHeaderClassName: (className: string) => void;
  restore: () => void;
}>({
  setHeaderClassName: () => {},
  restore: () => {},
});

export const useAppHeader = () => React.useContext(AppHeaderContext);

export const AppHeaderProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [headerClassName, setHeaderClassName] = React.useState<string>("");
  const userMeta = React.useContext(UserMetaContext);
  const pathname = usePathname();
  const isMe = pathname.includes("/me");

  return (
    <AppHeaderContext.Provider
      value={{
        setHeaderClassName,
        restore: () => {
          setHeaderClassName("");
        },
      }}
    >
      <motion.header
        layout
        layoutId={"header-container"}
        className={cn(
          "bg-secondary z-50",
          isMe && "pb-0 mb-14 rounded-b-4xl",
          headerClassName,
        )}
        transition={{
          duration: 0.5,
        }}
      >
        <nav
          className={cn(
            "p-2 flex items-center",
            isMe ? "flex-col" : " justify-between",
          )}
        >
          <motion.div layoutId={"header-title"}>
            <Link className={"flex align-center"} href="/">
              <Logo />
              <span className={" pl-1 font-sans text-secondary-foreground"}>
                Trade Journal
              </span>
            </Link>
          </motion.div>
          <motion.div
            layoutId={"user-avatar"}
            className={cn(isMe && "translate-y-1/2")}
          >
            <Link href="/me">
              <Avatar className={cn(isMe && "size-28")}>
                <AvatarImage src={userMeta?.avatar} />
                <AvatarFallback>🤓</AvatarFallback>
              </Avatar>
            </Link>
          </motion.div>
        </nav>
        <motion.div id={HEADER_EXTRA_ID}></motion.div>
      </motion.header>
      {children}
    </AppHeaderContext.Provider>
  );
};
