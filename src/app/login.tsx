import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

import type { Database } from '@/lib/database.types'
import LoginButtons from '@/components/login'

export default async function Login() {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return <LoginButtons session={session} />
}