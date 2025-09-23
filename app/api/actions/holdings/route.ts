import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server-client'

export const GET = async (request: NextRequest) => {
  const supabase = await createClient()
  return NextResponse.json(await supabase.from('user_holdings').select())
}
