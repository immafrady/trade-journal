'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from 'next/image'
import React from 'react'
import { createClient } from '@/lib/supabase/browser-client'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">欢迎回来</CardTitle>
          <CardDescription>
            仅支持Github账号登录
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button variant="outline" className="w-full" onClick={async(e) => {
                  e.preventDefault()
                  const supabase = createClient()
                  await supabase.auth.signInWithOAuth({
                    provider: 'github',
                    options: {
                      redirectTo: new URL('/api/auth/callback?next=/demo', location.origin).toString()
                    },
                  })
                }}>
                  <Image
                    className="dark:invert"
                    src="/github.svg"
                    alt="Github logomark"
                    width={20}
                    height={20}
                  />
                  Login with Github
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you don't have to agree anything.
      </div>
    </div>
  )
}
