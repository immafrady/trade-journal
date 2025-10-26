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
import { Button } from "@/components/ui/button";

export const ResponsiveDialog = ({
  trigger,
  children,
  title,
  description,
  onSubmit,
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
  title: string;
  description?: string;
  onSubmit?: () => void;
}) => {
  console.log("ResponsiveDialog"!);
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        {onSubmit && (
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">取消</Button>
            </DialogClose>
            <Button onClick={onSubmit}>提交</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
