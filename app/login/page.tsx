"use client";
import { LoginForm } from "./_components/login-form";
import { toast } from "sonner";
import { use, useEffect } from "react";
import Logo from "@/components/ui/my/logo";

export default function LoginPage(props: PageProps<"/login">) {
  const searchParams = use(props.searchParams);
  useEffect(() => {
    if (searchParams.error) {
      toast.error(searchParams.error, {
        description: searchParams.error_description,
      });
    }
    return () => {};
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
