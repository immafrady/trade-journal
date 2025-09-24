'use client'
import React from 'react'
import { createClient } from '@/lib/supabase/browser-client'
import { Button } from '@/components/ui/button'
import {getList, UserHolding} from '@/lib/services/user-holdings'
import Loading from './loading'

export default function Page() {
  const [list, setList] = React.useState<UserHolding[]|null>(null);
  React.useEffect(() => {
    getList().then((list) => {
      console.log(list)
      setList(list)
    })
    return () => {}
  }, [])
  return (
    <>
      <div>
        <pre>{JSON.stringify(list, null, 2)}</pre>
        <div>add one</div>
        <Button onClick={async () => {
          const supabase = createClient()
          await supabase.from('user_holdings').insert([{
            code: '1', type: '1'
          }]).select()
          getList().then((list) => setList(list))

        }}>+1</Button>
      </div>
      <Loading isLoading={list === null} />
    </>
  )
}
