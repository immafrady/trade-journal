'use client'
import Logo from '@/components/ui/logo'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserMetaContext } from '@/providers/user-meta'
import React from 'react'

export default function AppHeader() {
  const userMeta = React.useContext(UserMetaContext)

  return (
    <header className="bg-muted p-2">
      <nav className={'flex items-center justify-between'}>
        <Link className={'flex align-center'} href="/">
          <Logo />
          <span className={'pl-1 font-sans'}>Trade Journal</span>
        </Link>
        <Link href="/me">
          <Avatar>
            <AvatarImage src={userMeta?.avatar}/>
            <AvatarFallback>🤓</AvatarFallback>
          </Avatar>
        </Link>
      </nav>
    </header>
  );
}
