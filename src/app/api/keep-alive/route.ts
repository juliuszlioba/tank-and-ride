import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import type { Database } from '@/lib/database.types'

export async function GET(request: Request) {
	const supabase = createServerComponentClient<Database>({ cookies })
	const { data, count } = await supabase
		.from('records')
		.select(`*`, { count: 'exact' })

	return NextResponse.json({ 'records-count': count })
}
