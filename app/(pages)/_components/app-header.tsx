'use client'
import Logo from '@/components/ui/logo'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUserMeta } from '@/hooks/use-user-meta'
import { UserMetaContext } from '@/providers/user-meta'
import React from 'react'

export default function AppHeader() {
  const userMeta = React.useContext(UserMetaContext)

  // const supabase = createClient()
  // const user = use(supabase.auth.getUser())
  // useEffect(() => {
  //   console.log(user)
  //
  //   return () => {}
  // }, [user])
  return (
    <header className="bg-white">
      <nav className={'flex items-center justify-between'}>
        <Link href="/">
          <Logo />
        </Link>
        <Link href="/blog">
          <Avatar>
            <AvatarImage src={userMeta?.avatar}/>
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
        </Link>
      </nav>
    </header>
  );
}
