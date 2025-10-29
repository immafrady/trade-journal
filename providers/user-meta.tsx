"use client";
import { createClient } from "@/lib/supabase/browser-client";
import React from "react";

interface UserMetadata {
  avatar: string;
  name: string;
  email: string;
  username: string;
}

export const UserMetaContext = React.createContext<UserMetadata | null>(null);

export const UserMetaProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userMeta, setUserMeta] = React.useState<UserMetadata | null>(null);

  React.useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user?.user_metadata) {
        const metadata = data.user?.user_metadata;
        const response = await fetch(metadata.avatar_url, {
          cache: "no-store",
        });
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        setUserMeta({
          avatar: blobUrl,
          email: metadata.email,
          name: metadata.name,
          username: metadata.user_name,
        });
      }
    });
    return () => {};
  }, []);

  return (
    <UserMetaContext.Provider value={userMeta}>
      {children}
    </UserMetaContext.Provider>
  );
};
