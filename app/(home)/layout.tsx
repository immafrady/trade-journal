import React from 'react'
import AppHeader from '@/app/(home)/_components/app-header'
import { UserMetaProvider } from '@/providers/user-meta'

export default function BaseLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <UserMetaProvider>
      <div className={'flex flex-col overflow-hidden max-h-screen'}>
        <AppHeader />
        <main className={'relative flex-1 p-4 overflow-x-hidden overflow-y-auto'}>
          {children}
        </main>
      </div>
    </UserMetaProvider>
  )
}
