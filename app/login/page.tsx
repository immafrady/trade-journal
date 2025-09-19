'use client'
import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "./login-form"
import { toast } from "sonner"
import { use, useEffect } from 'react'

export default function LoginPage(props: PageProps<'/login'>) {
  const searchParams = use(props.searchParams)
  useEffect(() => {
    if (searchParams.error) {
      toast.error(searchParams.error, {
        description: searchParams.error_description,
        position: 'top-center'
      })
    }
    return () => {};
  }, [])

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Trade Journal
        </a>
        <LoginForm />
      </div>
    </div>
  )
}
