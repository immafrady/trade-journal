import React, { useContext } from "react";
import { PwaContext } from "@/providers/pwa";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/ui/my/logo";
import { AppContainerPropsContext } from "../app-container/context";

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
