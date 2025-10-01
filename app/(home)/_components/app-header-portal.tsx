import React from "react";
import { createPortal } from "react-dom";

export const HEADER_EXTRA_ID = "app-header-extra";

export const AppHeaderPortal = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [container, setContainer] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    setContainer(document.getElementById(HEADER_EXTRA_ID));
  }, []);

  if (!container) return children; // SSR 阶段 直接插入原始位置
  return createPortal(children, container);
};
