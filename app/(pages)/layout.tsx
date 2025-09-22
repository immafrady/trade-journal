import React from 'react'
import AppHeader from '@/app/(pages)/_components/app-header'
import { UserMetaProvider } from '@/providers/user-meta'

export default function BaseLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <UserMetaProvider>
      <div>
        <AppHeader />
        <main className={'p-4 overflow-x-hidden'}>
          {children}
        </main>
      </div>
    </UserMetaProvider>
  )
}
