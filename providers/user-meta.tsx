"use client";
import { createClient } from "@/lib/supabase/browser-client";
import React from "react";

interface UserMetadata {
  avatar: string;
  name: string;
  email: string;
  username: string;
}

// 持久化
const USER_META_STORE_KEY = "user-metadata";
function getUserMetadata() {
  try {
    const item = localStorage.getItem(USER_META_STORE_KEY);
    if (item) {
      return JSON.parse(item) as UserMetadata;
    }
  } catch (e) {
    removeUserMetadata();
    console.error(e);
  }
  return null;
}
export function removeUserMetadata() {
  localStorage.removeItem(USER_META_STORE_KEY);
}

export const UserMetaContext = React.createContext<UserMetadata | null>(
  getUserMetadata(),
);

export const UserMetaProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userMeta, setUserMeta] = React.useState<UserMetadata | null>(
    getUserMetadata(),
  );

  React.useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user?.user_metadata) {
        const metadata = data.user?.user_metadata;
        const response = await fetch(metadata.avatar_url, {
          cache: "no-store",
        });
        const blob = await response.blob();
        const reader = new FileReader();
        const avatar = await new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        const md = {
          avatar: avatar as string,
          email: metadata.email,
          name: metadata.name,
          username: metadata.user_name,
        };
        localStorage.setItem(USER_META_STORE_KEY, JSON.stringify(md));
        setUserMeta(md);
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
