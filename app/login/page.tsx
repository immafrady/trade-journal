"use client";
import { LoginForm } from "./_components/login-form";
import { toast } from "sonner";
import React from "react";
import Logo from "@/components/ui/my/logo";
import { removeSWRStorage } from "@/lib/swr/clear-and-refresh";

export default function LoginPage(props: PageProps<"/login">) {
  const searchParams = React.use(props.searchParams);
  React.useEffect(() => {
    if (searchParams.error) {
      toast.error(searchParams.error, {
        description: searchParams.error_description,
      });
    }
    return () => {};
  }, [searchParams.error, searchParams.error_description]);

  React.useEffect(() => {
    removeSWRStorage();
  }, []);

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <Logo />
          Trade Journal
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
