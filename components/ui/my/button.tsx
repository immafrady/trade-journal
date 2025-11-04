import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

function LoadingButton({
  loading,
  icon,
  children,
  disabled,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    icon?: React.ReactNode;
    loading?: boolean;
  }) {
  return (
    <Button disabled={loading || disabled} {...props}>
      {loading ? <Loader2Icon className="animate-spin" /> : icon}
      {children}
    </Button>
  );
}

function ToggleButton({
  stateList,
  onStateChange,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    stateList: { children: React.ReactNode; className?: string }[];
    onStateChange: (state: number) => void;
  }) {
  const [count, setCount] = React.useState(0);

  const currentState = React.useMemo(
    () => stateList[count % stateList.length],
    [count, stateList],
  );
  return (
    <Button
      {...props}
      className={cn(props.className, currentState.className)}
      onClick={() => {
        const c = count + 1;
        setCount(c);
        onStateChange(c % stateList.length);
      }}
    >
      {currentState.children}
    </Button>
  );
}

export { LoadingButton, ToggleButton };
