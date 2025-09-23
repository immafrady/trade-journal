import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server-client'

export const GET = async (request: NextRequest) => {
  const supabase = await createClient()
  return Response.json(await supabase.from('user_holdings').select())
}
