'use client'
import React from 'react'
import { createClient } from '@/lib/supabase/browser-client'
import { Button } from '@/components/ui/button'
import { useHoldingList } from '@/lib/services/user-holdings'
import Loading from './loading'

export default function Page() {
  const { data, isLoading, mutate } = useHoldingList()
  return (
    <>
      <div>
        <pre>{JSON.stringify(data, null, 2)}</pre>
        <div>add one</div>
        <Button onClick={async () => {
          const supabase = createClient()
          await supabase.from('user_holdings').insert([{
            code: '1', type: '1'
          }]).select()
          await mutate()
        }}>+1</Button>
      </div>
      <Loading isLoading={isLoading} />
    </>
  )
}
