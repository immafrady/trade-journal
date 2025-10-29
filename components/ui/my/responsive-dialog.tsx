import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import { Button, LoadingButton } from "@/components/ui/button";

export interface ResponsiveDialogRef {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleOpen: () => void;
}

const ResponsiveDialogInner = (
  {
    trigger,
    children,
    title,
    description,
    onSubmit,
    onClosed,
  }: {
    trigger?: React.ReactNode;
    children: React.ReactNode;
    title: string;
    description?: string;
    onSubmit?: () => Promise<void>;
    onClosed?: () => void;
  },
  ref: React.ForwardedRef<ResponsiveDialogRef>,
) => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    if (!open) {
      onClosed?.();
    }
    return () => {};
  }, [onClosed, open]);

  React.useImperativeHandle(ref, () => ({
    open,
    setOpen,
    toggleOpen: () => setOpen((o) => !o),
  }));
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px] max-h-[calc(100svh-4rem)] flex flex-col">
        <DialogHeader className={"shrink-0"}>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className={"overflow-y-auto px-2 flex-1"}>{children}</div>
        {onSubmit && (
          <DialogFooter className={"shrink-0"}>
            <DialogClose asChild>
              <Button variant="outline">取消</Button>
            </DialogClose>
            <LoadingButton
              loading={loading}
              onClick={async () => {
                setLoading(true);
                try {
                  await onSubmit();
                } finally {
                  setLoading(false);
                }
              }}
            >
              提交
            </LoadingButton>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export const ResponsiveDialog = React.forwardRef(ResponsiveDialogInner);
