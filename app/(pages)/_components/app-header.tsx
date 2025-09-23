'use client'
import Logo from '@/components/ui/logo'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserMetaContext } from '@/providers/user-meta'
import React from 'react'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { motion } from "motion/react"

export default function AppHeader() {
  const userMeta = React.useContext(UserMetaContext)
  const pathname = usePathname()
  const isMe = pathname.includes('/me')

  return (
    <header className="bg-muted p-2">
      <nav className={clsx('flex items-center', isMe ? 'justify-center' : ' justify-between')}>
        <Link className={'flex align-center'} href="/demo">
          <Logo />
          <span className={'pl-1 font-sans'}>Trade Journal</span>
        </Link>
        {!isMe && (<Link href="/me">
          <Avatar>
            <AvatarImage src={userMeta?.avatar}/>
            <AvatarFallback>🤓</AvatarFallback>
          </Avatar>
        </Link>)}

      </nav>
    </header>
  );
}
