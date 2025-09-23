'use client'

import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserMetaContext } from '@/providers/user-meta'
import ListItem from '@/app/(pages)/me/_components/list-item'
import { MailIcon, User2Icon} from 'lucide-react'
import { motion } from 'motion/react'

export default function Page() {
  const userMeta = React.useContext(UserMetaContext)

  return (
    <div className={'flex flex-col items-center'}>
      <div className={'flex flex-col items-center p-5'}>
        <div className={'fixed bg-muted top-0  w-full h-40 -z-50 rounded-b-4xl'}></div>
        <motion.div layoutId={'user-avatar'} className={'z-50'}>
          <Avatar className={'size-28'}>
            <AvatarImage src={userMeta?.avatar}/>
            <AvatarFallback>{userMeta?.name}</AvatarFallback>
          </Avatar>
        </motion.div>
        <span className={'font-bold font-serif'}>{userMeta?.name}</span>
      </div>
      <ul className={'self-stretch'}>
        <ListItem icon={<User2Icon />} label={'用户名'} value={userMeta?.username ?? ''} />
        <ListItem icon={<MailIcon />} label={'E-Mail'} value={userMeta?.email ?? ''} />
      </ul>
    </div>
  );
}
