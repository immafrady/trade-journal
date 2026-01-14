import React from "react";
import { ClientOnly } from "@/components/client-only";
import { SWRStorageProvider } from "@/providers/swr-storage-provider";
import { ServiceLayout } from "./_service-layout";

export default function BaseLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <ClientOnly>
        <SWRStorageProvider>
          <ServiceLayout>{children}</ServiceLayout>
        </SWRStorageProvider>
      </ClientOnly>
    </>
  );
}
