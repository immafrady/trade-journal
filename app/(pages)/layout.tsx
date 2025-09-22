import React from 'react'
import AppHeader from '@/app/(pages)/_components/app-header'
import { UserMetaProvider } from '@/providers/user-meta'

export default function BaseLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <UserMetaProvider>
      <div className="bg-white mx-1 my-1 h-1.5">
        <AppHeader />
        {children}
      </div>
    </UserMetaProvider>
  )
}
