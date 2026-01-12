import { motion } from "motion/react";
import Link from "next/link";
import React from "react";
import { TriangleAlert } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const AppBarAlert = () => {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(timer);
  });
  return count % 2 === 1 ? (
    <motion.div layoutId={"app-bar-message"}>
      <Link href="/me">
        <Avatar>
          <AvatarFallback className={"bg-orange-300/20 animate-pulse"}>
            <TriangleAlert className="h-5 w-5 text-orange-600" />
          </AvatarFallback>
        </Avatar>
      </Link>
    </motion.div>
  ) : null;
};
