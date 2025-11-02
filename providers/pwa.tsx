"use client";

import React from "react";

interface Pwa {
  isSupported: boolean;
  isIOS: boolean;
  isStandalone: boolean;
}

export const PwaContext = React.createContext<Pwa>({
  isStandalone: false,
  isIOS: false,
  isSupported: false,
});

export const PwaProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSupported, setIsSupported] = React.useState(false);
  const [isIOS, setIsIOS] = React.useState(false);
  const [isStandalone, setIsStandalone] = React.useState(false);

  React.useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream,
    );
    setIsStandalone(
      window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any)?.standalone === true,
    );
    if ("serviceWorker" in navigator) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
  }

  return (
    <PwaContext.Provider
      value={{
        isSupported,
        isIOS,
        isStandalone,
      }}
    >
      {children}
    </PwaContext.Provider>
  );
};
