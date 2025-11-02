import React, { useContext } from "react";
import { UserMetaContext } from "@/providers/user-meta";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "@/components/ui/my/logo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import { PwaContext } from "@/providers/pwa";

interface AppContainerProps {
  hideBackButton?: boolean;
}

const AppContainerPropsContext = React.createContext<AppContainerProps>({
  hideBackButton: false,
});

export const AppContainer = ({
  appBar,
  children,
  className,
  hideBackButton,
}: {
  appBar?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
} & AppContainerProps) => {
  return (
    <AppContainerPropsContext.Provider value={{ hideBackButton }}>
      <div className={"flex flex-col overflow-hidden h-svh"}>
        {appBar}
        <motion.main
          layout={"preserve-aspect"}
          layoutId={"app-container-main"}
          className={cn(
            "relative flex-1 overflow-y-auto overflow-x-hidden",
            className,
          )}
        >
          {children}
        </motion.main>
      </div>
    </AppContainerPropsContext.Provider>
  );
};

export const AppBar = ({
  children,
  isLargeAvatar,
  className,
  bgGradient,
}: {
  children?: React.ReactNode;
  isLargeAvatar?: boolean;
  className?: string;
  bgGradient?: boolean;
}) => {
  return (
    <motion.header
      layout
      layoutId={"app-bar"}
      className={cn(
        "bg-secondary z-50",
        isLargeAvatar && "pb-0 mb-14 rounded-b-4xl",
        bgGradient &&
          "bg-gradient-to-b from-secondary to-secondary-foreground/80",
        className,
      )}
    >
      <nav
        className={cn(
          "p-2 flex items-center",
          isLargeAvatar ? "flex-col" : "justify-between",
        )}
      >
        <AppBarSlogan isLargeAvatar={isLargeAvatar} />
        <AppBarAvatar isLargeAvatar={isLargeAvatar} />
      </nav>
      {children}
    </motion.header>
  );
};

export const AppBarExtra = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div layout layoutId={"app-bar-extra"}>
      <AnimatePresence>{children}</AnimatePresence>
    </motion.div>
  );
};

export const AppBarExtraContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      layout={"preserve-aspect"}
      className={className}
      layoutId={"app-bar-extra-content"}
    >
      {children}
    </motion.div>
  );
};

export const AppBarSlogan = ({
  isLargeAvatar,
}: {
  isLargeAvatar?: boolean;
}) => {
  const { isStandalone } = React.useContext(PwaContext);
  const { hideBackButton } = useContext(AppContainerPropsContext);

  return (
    <motion.div layoutId={"app-bar-slogan"}>
      <div className={"flex items-center gap-2"}>
        {isStandalone && !isLargeAvatar && (
          <div>
            {!hideBackButton && (
              <Button
                variant={"ghost"}
                size={"sm"}
                onClick={() => window.history.back()}
              >
                <ArrowLeft />
              </Button>
            )}
            <Button
              variant={"ghost"}
              size={"sm"}
              onClick={() => window.location.reload()}
            >
              <RefreshCcw />
            </Button>
          </div>
        )}
        <Link className={"flex items-center"} href="/">
          <Logo />
          <span className={" pl-1 font-sans text-secondary-foreground"}>
            Trade Journal
          </span>
        </Link>
      </div>
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
    <AppBarExtraContent className={"p-2 pt-0 font-medium leading-none"}>
      {children}
    </AppBarExtraContent>
  );
};
