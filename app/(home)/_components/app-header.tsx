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
  console.log(userMeta)
  const pathname = usePathname()
  const isMe = pathname.includes('/me')

  return (
    <motion.header layoutId={'header-container'} className={clsx('sticky top-0 bg-muted p-2', isMe && 'pb-0 mb-14 rounded-b-4xl')}>
      <nav className={clsx('flex items-center', isMe ? 'flex-col' : ' justify-between')}>
        <motion.div layoutId={'header-title'}>
          <Link className={'flex align-center'} href="/">
            <Logo />
            <span className={'pl-1 font-sans'}>Trade Journal</span>
          </Link>
        </motion.div>
        <motion.div layoutId={'user-avatar'} className={clsx(isMe && 'translate-y-1/2')}>
          <Link href="/me">
            <Avatar className={clsx(isMe && 'size-28')}>
              <AvatarImage src={userMeta?.avatar}/>
              <AvatarFallback>🤓</AvatarFallback>
            </Avatar>
          </Link>
        </motion.div>
      </nav>
    </motion.header>
  );
}
