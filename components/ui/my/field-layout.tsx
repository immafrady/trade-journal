import React from "react";
import { AnyFieldApi } from "@tanstack/react-form";
import { Info, Loader, TriangleAlert } from "lucide-react";

export const FieldLayout = ({
  label,
  description,
  field,
  children,
}: {
  label: React.ReactNode;
  description?: React.ReactNode;
  field: AnyFieldApi;
  children: React.ReactNode;
}) => {
  return (
    <div className={"flex flex-col gap-1"}>
      <div className={"flex items-center gap-2"}>
        <div className={"font-medium"}>{label}</div>
        <div className={"flex-1"}>{children}</div>
      </div>
      <div className={"text-sm"}>
        {field.state.meta.isValidating ? (
          <div className={"text-muted flex items-center gap-1"}>
            <Loader size={16} />
            校验中...
          </div>
        ) : field.state.meta.isTouched && !field.state.meta.isValid ? (
          <div className={"text-destructive flex items-center gap-1"}>
            <TriangleAlert size={16} />
            {field.state.meta.errors.join(", ")}
          </div>
        ) : description ? (
          <div className={"text-secondary-foreground flex items-center gap-1"}>
            <Info size={16} /> {description}
          </div>
        ) : null}
      </div>
    </div>
  );
};
