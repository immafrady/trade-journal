"use client";
import { cn } from "@/lib/utils";
import { LoadingButton } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import React from "react";
import { createClient } from "@/lib/supabase/browser-client";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, setLoading] = React.useState(false);
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">欢迎回来</CardTitle>
          <CardDescription>仅支持Github账号登录</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <LoadingButton
                  loading={loading}
                  icon={
                    <Image
                      className="dark:invert"
                      src="/github.svg"
                      alt="Github logomark"
                      width={20}
                      height={20}
                    />
                  }
                  variant="outline"
                  className="w-full"
                  onClick={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    let url =
                      process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
                      process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
                      `${location.origin}/`;
                    // Make sure to include `https://` when not localhost.
                    url = url.startsWith("http") ? url : `https://${url}`;
                    // Make sure to include a trailing `/`.
                    url = url.endsWith("/") ? url : `${url}/`;

                    const supabase = createClient();

                    await supabase.auth.signInWithOAuth({
                      provider: "github",
                      options: {
                        redirectTo: url + "api/auth/callback",
                      },
                    });
                    // setLoading(false);
                  }}
                >
                  Login with Github
                </LoadingButton>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you do not have to agree anything.
      </div>
    </div>
  );
}
