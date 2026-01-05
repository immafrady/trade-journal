import React from "react";

export interface AppContainerProps {
  hideBackButton?: boolean;
}

export const AppContainerPropsContext = React.createContext<AppContainerProps>({
  hideBackButton: false,
});
