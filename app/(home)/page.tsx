'use client'
import React from 'react'
import { createClient } from '@/lib/supabase/browser-client'
import { Button } from '@/components/ui/button'
import { getList } from '@/lib/services/user-holdings'

export default function Page() {
  const [list, setList] = React.useState<any[]>([]);
  React.useEffect(() => {
    getList().then((list) => {
      console.log(list)
      setList(list)
    })
    return () => {}
  }, [])
  return (
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
  )
}
